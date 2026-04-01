import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { parseResumeWithAI } from '../utils/gemini.js';
import { sendApplicationConfirmation, sendApplicationStatusUpdate } from '../utils/email.js';

export const createApplication = async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'Please upload a resume' });
    }

    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId).populate('recruiter');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const resumeFile = req.files.resume;
    const uploadResult = await uploadToCloudinary(resumeFile, 'resumes');

    const resumeText = await extractTextFromPDF(resumeFile.tempFilePath);

    const jobDescription = `${job.title} - ${job.description} - Required Skills: ${job.skills.join(', ')}`;
    const aiAnalysis = await parseResumeWithAI(resumeText, jobDescription);

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl: uploadResult.url,
      coverLetter,
      aiScore: aiAnalysis.totalScore || 0,
      scoreBreakdown: aiAnalysis.scoreBreakdown,
      parsedResume: aiAnalysis
    });

    await User.findByIdAndUpdate(req.user._id, {
      resumeUrl: uploadResult.url,
      resumeScore: aiAnalysis.totalScore || 0,
      parsedResumeData: aiAnalysis
    });

    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    await sendApplicationConfirmation(req.user.email, job.title, job.company);

    const populatedApplication = await Application.findById(application._id)
      .populate('job')
      .populate('candidate', 'fullName email phone skills');

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'fullName email phone skills resumeUrl');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job._id);

    if (
      req.user.role === 'recruiter' &&
      job.recruiter.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (
      req.user.role === 'candidate' &&
      application.candidate._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'fullName email')
      .populate('job', 'title recruiter');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (notes) {
      application.notes = notes;
    }

    await application.save();

    if (['shortlisted', 'rejected', 'selected'].includes(status)) {
      await sendApplicationStatusUpdate(
        application.candidate.email,
        application.candidate.fullName,
        application.job.title,
        status
      );
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedJobs = async (req, res) => {
  try {
    const candidate = await User.findById(req.user._id);

    if (!candidate.skills || candidate.skills.length === 0) {
      return res.status(400).json({
        message: 'Please add skills to your profile to get recommendations'
      });
    }

    const jobs = await Job.find({ status: 'active' });

    const recommendedJobs = jobs
      .map(job => {
        const skillMatches = job.skills.filter(skill =>
          candidate.skills.some(candidateSkill =>
            candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(candidateSkill.toLowerCase())
          )
        ).length;

        const matchScore = (skillMatches / job.skills.length) * 100;

        return {
          ...job.toObject(),
          matchScore: Math.round(matchScore),
          matchingSkills: skillMatches
        };
      })
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json(recommendedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
