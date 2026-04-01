import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateApplications from './pages/candidate/Applications';
import CandidateInterviews from './pages/candidate/Interviews';
import JobDetailsPage from './pages/candidate/JobDetails';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterJobs from './pages/recruiter/Jobs';
import RecruiterApplications from './pages/recruiter/Applications';
import RecruiterInterviews from './pages/recruiter/Interviews';
import InterviewRoom from './pages/recruiter/InterviewRoom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/candidate" element={<ProtectedRoute role="candidate" />}>
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route path="applications" element={<CandidateApplications />} />
            <Route path="interviews" element={<CandidateInterviews />} />
            <Route path="jobs/:id" element={<JobDetailsPage />} />
          </Route>

          <Route path="/recruiter" element={<ProtectedRoute role="recruiter" />}>
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="jobs" element={<RecruiterJobs />} />
            <Route path="applications/:jobId" element={<RecruiterApplications />} />
            <Route path="interviews" element={<RecruiterInterviews />} />
            <Route path="interview/:id" element={<InterviewRoom />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
