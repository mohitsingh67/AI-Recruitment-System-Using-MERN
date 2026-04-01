import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getJobApplications
} from '../controllers/jobController.js';
import { protect, recruiterOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllJobs)
  .post(protect, recruiterOnly, createJob);

router.get('/my-jobs', protect, recruiterOnly, getRecruiterJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, recruiterOnly, updateJob)
  .delete(protect, recruiterOnly, deleteJob);

router.get('/:id/applications', protect, recruiterOnly, getJobApplications);

export default router;
