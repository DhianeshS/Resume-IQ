import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ResumeAnalysis } from '../../types';
import {
  createJobSearchTrackerSpreadsheet,
  appendAnalysisToGoogleSheet,
  fetchGoogleSheetRows,
  GoogleSheetInfo,
} from '../../services/googleSheets';
import {
  FileSpreadsheet,
  Plus,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Table,
  Lock,
  Sparkles,
  ArrowRight,
  Database,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface GoogleSheetsViewProps {
  recentAnalyses: ResumeAnalysis[];
}

export const GoogleSheetsView: React.FC<GoogleSheetsViewProps> = ({ recentAnalyses }) => {
  const { user, googleAccessToken, signInWithGoogle, getOrRequestGoogleAccessToken } = useAuth();

  const [sheetInfo, setSheetInfo] = useState<GoogleSheetInfo | null>(() => {
    const saved = localStorage.getItem(`resumeiq_gsheet_${user?.uid}`);
    return saved ? JSON.parse(saved) : null;
  });

  const [rows, setRows] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation dialog state before mutating Google Workspace data
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState<'create' | 'append'>('create');
  const [selectedAnalysisToAppend, setSelectedAnalysisToAppend] = useState<ResumeAnalysis | null>(null);

  useEffect(() => {
    if (sheetInfo && user) {
      localStorage.setItem(`resumeiq_gsheet_${user.uid}`, JSON.stringify(sheetInfo));
    }
  }, [sheetInfo, user]);

  const loadRowsFromSheet = async (tokenToUse?: string) => {
    const token = tokenToUse || googleAccessToken;
    if (!sheetInfo?.spreadsheetId || !token) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const fetchedRows = await fetchGoogleSheetRows(token, sheetInfo.spreadsheetId);
      setRows(fetchedRows);
      setStatusMessage('Sheet data refreshed successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Error fetching Google Sheet rows:', err);
      setErrorMessage('Could not load Google Sheet rows. Please re-authenticate Google access.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sheetInfo?.spreadsheetId && googleAccessToken) {
      loadRowsFromSheet(googleAccessToken);
    }
  }, [sheetInfo?.spreadsheetId, googleAccessToken]);

  const handleRequestCreateSheet = async () => {
    setConfirmActionType('create');
    setShowConfirmModal(true);
  };

  const handleRequestAppendRow = (analysis: ResumeAnalysis) => {
    setSelectedAnalysisToAppend(analysis);
    setConfirmActionType('append');
    setShowConfirmModal(true);
  };

  const handleExecuteConfirmedAction = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      let token = googleAccessToken;
      if (!token) {
        token = await getOrRequestGoogleAccessToken();
      }

      if (!token) {
        throw new Error('Google OAuth token is required to connect to Google Sheets.');
      }

      if (confirmActionType === 'create') {
        const info = await createJobSearchTrackerSpreadsheet(
          token,
          user?.displayName || user?.email || 'Candidate',
          recentAnalyses
        );
        setSheetInfo(info);
        setStatusMessage(`Successfully created Google Sheet "${info.title}"!`);
        await loadRowsFromSheet(token);
      } else if (confirmActionType === 'append' && selectedAnalysisToAppend && sheetInfo) {
        await appendAnalysisToGoogleSheet(token, sheetInfo.spreadsheetId, selectedAnalysisToAppend);
        setStatusMessage(`Exported "${selectedAnalysisToAppend.resumeTitle}" to your Google Sheet!`);
        await loadRowsFromSheet(token);
      }
    } catch (err: any) {
      console.error('Google Sheets operation error:', err);
      setErrorMessage(err.message || 'An error occurred while communicating with Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Google Workspace Integration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sync Resumes & ATS Scores with Google Sheets
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Automatically export your resume evaluation reports, ATS match scores, missing keywords, and job readiness indicators directly to Google Sheets to organize your job hunt.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
          {!googleAccessToken ? (
            <button
              id="gsheet-auth-btn"
              onClick={() => signInWithGoogle()}
              className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Connect Google Sheets</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-100 border border-emerald-400/30 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Status & Error Messages */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Google Sheet Management Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {sheetInfo ? sheetInfo.title : 'Live Google Sheet Sync'}
              </h3>
              <p className="text-xs text-gray-500">
                {sheetInfo
                  ? 'Your ATS evaluation history is actively linked to this spreadsheet.'
                  : 'Create a spreadsheet in your Google Drive to track your job search progress.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {sheetInfo ? (
              <>
                <button
                  id="gsheet-refresh-btn"
                  onClick={() => loadRowsFromSheet()}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
                  <span>Refresh Data</span>
                </button>

                <a
                  href={sheetInfo.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Open Google Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            ) : (
              <button
                id="gsheet-create-btn"
                onClick={handleRequestCreateSheet}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Job Search Spreadsheet</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Table */}
        {sheetInfo && rows.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Spreadsheet Preview ({rows.length - 1} evaluation records synced)</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Synced with Google Drive
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-gray-50/50">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-blue-600 text-white font-bold uppercase tracking-wider text-[11px]">
                    {rows[0]?.map((col, idx) => (
                      <th key={idx} className="px-4 py-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {rows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-blue-50/30 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : sheetInfo ? (
          <div className="py-12 text-center space-y-3">
            <Table className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-600">No rows found in spreadsheet</p>
            <p className="text-xs text-gray-400">Export an evaluation below to populate your spreadsheet.</p>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto font-bold">
              <Database className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-bold text-gray-900">No Google Sheet Connected Yet</h4>
              <p className="text-xs text-gray-500">
                Click "Create Job Search Spreadsheet" above to automatically generate a pre-formatted tracker with columns for ATS Score, Keywords, Formatting, and Job Status.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Exportable Resume Analyses List */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Export Recent Resume Analyses</h3>
          <p className="text-xs text-gray-500">
            Select any stored resume evaluation report to push as a row directly to your Google Sheet.
          </p>
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs font-medium">
            No resume analyses saved yet. Analyze a resume to export it to Google Sheets.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {analysis.resumeTitle || 'Resume Evaluation'}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    Role: {analysis.targetJobTitle || 'General'} | ATS: {analysis.atsScore || analysis.overallScore}%
                  </p>
                </div>

                <button
                  id={`export-gsheet-btn-${analysis.id}`}
                  onClick={() => handleRequestAppendRow(analysis)}
                  disabled={!sheetInfo || isLoading}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    sheetInfo
                      ? 'bg-blue-50 text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Export Row</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MANDATORY USER CONFIRMATION MODAL BEFORE MUTATING GOOGLE WORKSPACE DATA */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Confirm Google Workspace Action
              </h3>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              {confirmActionType === 'create' ? (
                <p>
                  This will create a new Google Sheet named <strong className="text-gray-900">"ResumeIQ Tracker - {user?.displayName || 'Candidate'}"</strong> in your Google Drive and populate it with your resume evaluation metrics.
                </p>
              ) : (
                <p>
                  This will add a new row to your Google Sheet for <strong className="text-gray-900">"{selectedAnalysisToAppend?.resumeTitle}"</strong> (ATS Score: {selectedAnalysisToAppend?.atsScore}%).
                </p>
              )}
              <p className="text-xs text-gray-400">
                This action writes data to your connected Google Account with your explicit permission.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="confirm-gsheet-modal-btn"
                onClick={handleExecuteConfirmedAction}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
