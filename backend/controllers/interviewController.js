import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { generateInterviewQuestions } from '../utils/gemini.js';
import { sendInterviewScheduledEmail } from '../utils/email.js';

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledAt, zoomLink } = req.body;

    const application = await Application.findById(applicationId)
      .populate('candidate', 'fullName email')
      .populate('job', 'title description skills');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job._id);
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const questions = await generateInterviewQuestions(
      application.parsedResume,
      application.job.description
    );

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate._id,
      recruiter: req.user._id,
      job: application.job._id,
      scheduledAt,
      zoomLink,
      questions
    });

    application.status = 'interviewed';
    await application.save();

    await sendInterviewScheduledEmail(
      application.candidate.email,
      application.candidate.fullName,
      application.job.title,
      scheduledAt,
      zoomLink
    );

    const populatedInterview = await Interview.findById(interview._id)
      .populate('candidate', 'fullName email phone')
      .populate('job', 'title company')
      .populate('application');

    res.status(201).json(populatedInterview);
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'fullName email phone skills')
      .populate('recruiter', 'fullName email company')
      .populate('job', 'title company description')
      .populate('application');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (
      req.user.role === 'recruiter' &&
      interview.recruiter._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (
      req.user.role === 'candidate' &&
      interview.candidate._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiter: req.user._id })
      .populate('candidate', 'fullName email phone')
      .populate('job', 'title company')
      .sort({ scheduledAt: -1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCandidateInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidate: req.user._id })
      .populate('recruiter', 'fullName email company')
      .populate('job', 'title company')
      .sort({ scheduledAt: -1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInterviewStatus = async (req, res) => {
  try {
    const { status, feedback, finalDecision, notes } = req.body;

    const interview = await Interview.findById(req.params.id)
      .populate('application');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) interview.status = status;
    if (feedback) interview.feedback = feedback;
    if (finalDecision) interview.finalDecision = finalDecision;
    if (notes) interview.notes = notes;

    await interview.save();

    if (finalDecision === 'selected') {
      const application = await Application.findById(interview.application._id);
      application.status = 'selected';
      await application.save();
    } else if (finalDecision === 'rejected') {
      const application = await Application.findById(interview.application._id);
      application.status = 'rejected';
      await application.save();
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const regenerateQuestions = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('application')
      .populate('job', 'description');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const application = await Application.findById(interview.application._id);

    const questions = await generateInterviewQuestions(
      application.parsedResume,
      interview.job.description
    );

    interview.questions = questions;
    await interview.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
