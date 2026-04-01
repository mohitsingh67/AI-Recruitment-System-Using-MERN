import express from 'express';
import {
  createApplication,
  getCandidateApplications,
  getApplicationById,
  updateApplicationStatus,
  getRecommendedJobs
} from '../controllers/applicationController.js';
import { protect, candidateOnly, recruiterOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, candidateOnly, createApplication);
router.get('/my-applications', protect, candidateOnly, getCandidateApplications);
router.get('/recommendations', protect, candidateOnly, getRecommendedJobs);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, recruiterOnly, updateApplicationStatus);

export default router;
