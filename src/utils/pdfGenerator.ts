import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeAnalysis } from '../types';

export async function generatePDF(analysis: ResumeAnalysis): Promise<void> {
  const container = document.createElement('div');
  container.id = 'pdf-export-temp-container';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.color = '#111827';
  container.style.padding = '32px';

  const atsScore = analysis.atsScore ?? analysis.overallScore ?? 75;
  const formattingScore = analysis.formattingScore ?? 80;
  const grammarScore = analysis.grammarScore ?? 85;
  const skillsScore = analysis.skillsScore ?? 80;
  const projectQualityScore = analysis.projectQualityScore ?? 82;
  const internshipScore = analysis.internshipScore ?? 75;
  const certificationScore = analysis.certificationScore ?? 70;
  const readabilityScore = analysis.readabilityScore ?? 82;
  const keywordMatchScore = analysis.keywordMatchScore ?? analysis.keywordScore ?? 78;
  const professionalismScore = analysis.professionalismScore ?? 80;

  const candidateLevel = analysis.candidateLevel || 'Student';

  const detectedSkills = analysis.detectedSkills || analysis.keySkillsFound || [];
  const missingSkills = analysis.missingSkills || [];
  const detectedKeywords = analysis.detectedKeywords || [];
  const missingKeywords = analysis.missingKeywords || [];

  const topStrengths = analysis.topStrengths || analysis.strengths || [];
  const weaknesses = analysis.weaknesses || [];
  const resumeSummary = analysis.resumeSummary || analysis.summary || 'AI ATS Resume Analysis';
  const tips = analysis.improvedResumeTips || [];
  const suggestedRoles = analysis.suggestedRoles || [];
  const companyAtsEstimates = analysis.companyAtsEstimates || [];

  const reportDate = new Date(analysis.createdAt || Date.now()).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return '#ecfdf5';
    if (score >= 60) return '#fffbeb';
    return '#fef2f2';
  };

  container.innerHTML = `
    <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="display: flex; gap: 8px; margin-bottom: 6px;">
          <span style="background-color: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; border: 1px solid #dbeafe;">
            ResumeIQ • Professional ATS Audit Report
          </span>
          <span style="background-color: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; border: 1px solid #e5e7eb;">
            Level: ${escapeHtml(candidateLevel)}
          </span>
        </div>
        <h1 style="font-size: 24px; font-weight: 800; color: #111827; margin: 0; line-height: 1.2;">
          ${escapeHtml(analysis.resumeTitle || 'Resume Evaluation')}
        </h1>
        <p style="font-size: 12px; color: #6b7280; margin-top: 4px; margin-bottom: 0;">
          Target Position: <strong style="color: #374151;">${escapeHtml(analysis.targetJobTitle || 'General Profile')}</strong> | Date: ${reportDate}
        </p>
      </div>
      <div style="text-align: right;">
        <div style="background-color: ${getScoreBg(atsScore)}; border: 1px solid ${getScoreColor(atsScore)}30; padding: 8px 16px; border-radius: 16px; text-align: center;">
          <span style="font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; display: block;">ATS Match</span>
          <span style="font-size: 28px; font-weight: 900; color: ${getScoreColor(atsScore)};">${atsScore}<span style="font-size: 14px; font-weight: 600; color: #9ca3af;">/100</span></span>
        </div>
      </div>
    </div>

    <!-- METRICS CHARTS BAR GRID (10 SCORES) -->
    <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 16px;">
        10-Point Score Breakdown
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${renderMetricBar('Overall ATS Score', atsScore)}
        ${renderMetricBar('Formatting Score', formattingScore)}
        ${renderMetricBar('Grammar Score', grammarScore)}
        ${renderMetricBar('Skills Match Score', skillsScore)}
        ${renderMetricBar('Project Quality Score', projectQualityScore)}
        ${renderMetricBar('Internship Score', internshipScore)}
        ${renderMetricBar('Certification Score', certificationScore)}
        ${renderMetricBar('Readability Score', readabilityScore)}
        ${renderMetricBar('Keyword Match Score', keywordMatchScore)}
        ${renderMetricBar('Professionalism Score', professionalismScore)}
      </div>
    </div>

    <!-- EXECUTIVE SUMMARY -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 8px;">
        Executive AI Summary
      </h3>
      <p style="font-size: 12px; color: #374151; line-height: 1.6; background-color: #ffffff; border: 1px solid #e5e7eb; padding: 14px; border-radius: 12px; margin: 0;">
        ${escapeHtml(resumeSummary)}
      </p>
    </div>

    <!-- SUGGESTED ROLES -->
    ${suggestedRoles.length > 0 ? `
    <div style="margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background-color: #ffffff;">
      <h3 style="font-size: 13px; font-weight: 700; color: #2563eb; margin-top: 0; margin-bottom: 10px;">
        Suitable Job Roles Identified
      </h3>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${suggestedRoles.map((r) => `<span style="background-color: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700;">${escapeHtml(r)}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <!-- STRENGTHS & WEAKNESSES -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
      <!-- STRENGTHS -->
      <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background-color: #ffffff;">
        <h4 style="font-size: 13px; font-weight: 700; color: #059669; margin-top: 0; margin-bottom: 12px;">
          ✓ Top Strengths
        </h4>
        <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #374151; line-height: 1.6;">
          ${topStrengths.map((s) => `<li style="margin-bottom: 6px;">${escapeHtml(s)}</li>`).join('') || '<li>No specific strengths listed.</li>'}
        </ul>
      </div>

      <!-- WEAKNESSES -->
      <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background-color: #ffffff;">
        <h4 style="font-size: 13px; font-weight: 700; color: #d97706; margin-top: 0; margin-bottom: 12px;">
          ⚠ Areas for Improvement
        </h4>
        <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #374151; line-height: 1.6;">
          ${weaknesses.map((w) => `<li style="margin-bottom: 6px;">${escapeHtml(w)}</li>`).join('') || '<li>No major weaknesses noted.</li>'}
        </ul>
      </div>
    </div>

    <!-- COMPANY ATS ESTIMATES PREVIEW -->
    ${companyAtsEstimates.length > 0 ? `
    <div style="margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; background-color: #f9fafb;">
      <h3 style="font-size: 13px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 12px;">
        Top Company ATS Compatibility Scores
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
        ${companyAtsEstimates.slice(0, 6).map((c) => `
          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 8px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <strong>${escapeHtml(c.company)}</strong>
            <span style="font-weight: 800; color: ${getScoreColor(c.estimatedScore)};">${c.estimatedScore}%</span>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- REPORT FOOTER -->
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px dashed #d1d5db; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af;">
      <span>Generated by ResumeIQ Platform</span>
      <span>Confidential Candidate Audit Report</span>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    const cleanName = (analysis.resumeTitle || 'Resume_Evaluation').replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`${cleanName}_ATS_Report.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Failed to generate PDF report. Please try again.');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

function renderMetricBar(label: string, score: number): string {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return `
    <div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: #374151; margin-bottom: 2px;">
        <span>${label}</span>
        <span style="font-weight: 700; color: #111827;">${score}%</span>
      </div>
      <div style="width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 6px; overflow: hidden;">
        <div style="width: ${score}%; background-color: ${color}; height: 100%; border-radius: 9999px;"></div>
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
