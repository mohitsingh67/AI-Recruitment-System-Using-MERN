import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { jobAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Briefcase, Users, TrendingUp, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, activeJobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await jobAPI.getRecruiterJobs();
      setJobs(data);

      const totalJobs = data.length;
      const activeJobs = data.filter(job => job.status === 'active').length;
      const totalApplications = data.reduce((sum, job) => sum + job.applicationsCount, 0);

      setStats({ totalJobs, activeJobs, totalApplications });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600">Manage your job postings and applications</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-10 w-10" />
              <div className="text-right">
                <p className="text-blue-100 text-sm">Total Jobs</p>
                <p className="text-4xl font-bold">{stats.totalJobs}</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm">{stats.activeJobs} active postings</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-10 w-10" />
              <div className="text-right">
                <p className="text-green-100 text-sm">Applications</p>
                <p className="text-4xl font-bold">{stats.totalApplications}</p>
              </div>
            </div>
            <p className="text-green-100 text-sm">Total candidates</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-10 w-10" />
              <div className="text-right">
                <p className="text-purple-100 text-sm">Avg. Applications</p>
                <p className="text-4xl font-bold">
                  {stats.totalJobs > 0 ? Math.round(stats.totalApplications / stats.totalJobs) : 0}
                </p>
              </div>
            </div>
            <p className="text-purple-100 text-sm">Per job posting</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
          <Link
            to="/recruiter/jobs"
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Post New Job</span>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Job Postings Yet</h3>
            <p className="text-gray-600 mb-6">Create your first job posting to start hiring</p>
            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Create Job Posting</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applicationsCount} applications
                    </div>
                    <div>{job.type}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/recruiter/applications/${job._id}`}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Applications</span>
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      to={`/recruiter/jobs?edit=${job._id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
