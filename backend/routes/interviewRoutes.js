import express from 'express';
import {
  scheduleInterview,
  getInterviewById,
  getRecruiterInterviews,
  getCandidateInterviews,
  updateInterviewStatus,
  regenerateQuestions
} from '../controllers/interviewController.js';
import { protect, recruiterOnly, candidateOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/schedule', protect, recruiterOnly, scheduleInterview);
router.get('/recruiter-interviews', protect, recruiterOnly, getRecruiterInterviews);
router.get('/candidate-interviews', protect, candidateOnly, getCandidateInterviews);
router.get('/:id', protect, getInterviewById);
router.put('/:id/status', protect, recruiterOnly, updateInterviewStatus);
router.post('/:id/regenerate-questions', protect, recruiterOnly, regenerateQuestions);

export default router;
