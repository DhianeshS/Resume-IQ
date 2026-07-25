import { ResumeAnalysis } from '../types';

export interface GoogleSheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

/**
 * Creates a brand new Google Sheet specifically for tracking ATS Resume Audits & Job Applications
 */
export async function createJobSearchTrackerSpreadsheet(
  accessToken: string,
  candidateName: string,
  initialAnalyses: ResumeAnalysis[] = []
): Promise<GoogleSheetInfo> {
  const sheetTitle = `ResumeIQ Tracker - ${candidateName || 'Candidate'}`;

  // 1. Create spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-[#1E3A8A]Type': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle,
      },
      sheets: [
        {
          properties: {
            title: 'ATS & Job Applications',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Sheet: ${errText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Prepare Header and Data rows
  const headers = [
    'Date Analyzed',
    'Resume Title',
    'Target Job Role',
    'ATS Score (%)',
    'Formatting Score',
    'Grammar Score',
    'Top Missing Keywords',
    'Top Strengths',
  ];

  const rows = initialAnalyses.map((item) => [
    item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
    item.resumeTitle || 'Resume Evaluation',
    item.targetJobTitle || 'General Software Engineering',
    `${item.atsScore || item.overallScore || 75}%`,
    `${item.formattingScore || 80}/100`,
    `${item.grammarScore || 85}/100`,
    (item.missingKeywords || item.missingSkills || []).slice(0, 5).join(', '),
    (item.topStrengths || item.strengths || []).slice(0, 3).join('; '),
  ]);

  const valueData = [headers, ...rows];

  // 3. Write data rows to sheet
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'ATS & Job Applications'!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: "'ATS & Job Applications'!A1",
        majorDimension: 'ROWS',
        values: valueData,
      }),
    }
  );

  // 4. Apply styling (bold headers, blue background, auto column widths)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.145, green: 0.388, blue: 0.921 }, // #2563EB
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                    fontSize: 11,
                  },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
        ],
      }),
    });
  } catch (e) {
    console.warn('Batch update formatting warning:', e);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: sheetTitle,
  };
}

/**
 * Appends a new Resume Analysis row to an existing Google Sheet
 */
export async function appendAnalysisToGoogleSheet(
  accessToken: string,
  spreadsheetId: string,
  item: ResumeAnalysis
): Promise<void> {
  const row = [
    item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
    item.resumeTitle || 'Resume Evaluation',
    item.targetJobTitle || 'General Role',
    `${item.atsScore || item.overallScore || 75}%`,
    `${item.formattingScore || 80}/100`,
    `${item.grammarScore || 85}/100`,
    (item.missingKeywords || item.missingSkills || []).slice(0, 5).join(', '),
    (item.topStrengths || item.strengths || []).slice(0, 3).join('; '),
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'ATS & Job Applications'!A:H:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: "'ATS & Job Applications'!A:H",
        majorDimension: 'ROWS',
        values: [row],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to append to Google Sheet: ${err}`);
  }
}

/**
 * Fetches spreadsheet rows to preview inside ResumeIQ
 */
export async function fetchGoogleSheetRows(
  accessToken: string,
  spreadsheetId: string
): Promise<string[][]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'ATS & Job Applications'!A1:H100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Could not fetch sheet data: ${await res.text()}`);
  }

  const data = await res.json();
  return data.values || [];
}
