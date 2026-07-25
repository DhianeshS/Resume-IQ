import { ResumeAnalysis } from '../types';

export async function analyzeResume(
  resumeText: string,
  targetJobTitle?: string,
  jobDescription?: string
): Promise<ResumeAnalysis> {
  const response = await fetch('/api/analyze-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, targetJobTitle, jobDescription }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze resume');
  }

  return response.json();
}
