import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseResumeWithAI = async (resumeText, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `
      Analyze this resume and job description, then provide a detailed scoring and analysis.

      Resume:
      ${resumeText}

      Job Description:
      ${jobDescription}

      Please provide a JSON response with the following structure:
      {
        "skills": ["skill1", "skill2", ...],
        "experience": "years of experience",
        "education": "highest education level",
        "scoreBreakdown": {
          "skillsMatch": 0-100,
          "experienceMatch": 0-100,
          "educationMatch": 0-100,
          "overallFit": 0-100
        },
        "totalScore": 0-100,
        "strengths": ["strength1", "strength2", ...],
        "weaknesses": ["weakness1", "weakness2", ...],
        "recommendation": "hire/consider/reject with explanation"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    throw new Error('Failed to parse resume with AI');
  }
};

export const generateInterviewQuestions = async (resumeData, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `
      Based on this candidate's resume and the job description, generate 10 relevant interview questions with suggested answers.

      Resume Data:
      Skills: ${resumeData.skills?.join(', ') || 'N/A'}
      Experience: ${resumeData.experience || 'N/A'}

      Job Description:
      ${jobDescription}

      Please provide a JSON array with this structure:
      [
        {
          "question": "question text",
          "answer": "suggested answer or evaluation criteria",
          "category": "technical/behavioral/situational"
        }
      ]

      Focus on relevant technical skills, experience, and behavioral aspects.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw new Error('Failed to generate interview questions');
  }
};

export const getJobRecommendations = async (candidateProfile, allJobs) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `
      Based on this candidate's profile, rank and recommend the following jobs.

      Candidate Profile:
      Skills: ${candidateProfile.skills?.join(', ') || 'N/A'}
      Experience: ${candidateProfile.experience || 'N/A'}
      Resume Score: ${candidateProfile.resumeScore || 0}

      Available Jobs:
      ${JSON.stringify(allJobs.map(job => ({
        id: job._id,
        title: job.title,
        skills: job.skills,
        experience: job.experience
      })))}

      Please provide a JSON array of job IDs ranked by best fit, with match scores:
      [
        {
          "jobId": "id",
          "matchScore": 0-100,
          "reason": "brief explanation"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    return [];
  }
};
