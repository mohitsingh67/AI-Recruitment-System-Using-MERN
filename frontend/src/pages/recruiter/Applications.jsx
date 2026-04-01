import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI, interviewAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Users, TrendingUp, ExternalLink, Calendar, Video, CheckCircle, XCircle, Clock } from 'lucide-react';

const Applications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledAt: '',
    zoomLink: ''
  });

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        jobAPI.getJobById(jobId),
        jobAPI.getJobApplications(jobId)
      ]);
      setJob(jobRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, status, notes = '') => {
    try {
      await applicationAPI.updateApplicationStatus(appId, status, notes);
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await interviewAPI.scheduleInterview({
        applicationId: selectedApp._id,
        scheduledAt: scheduleData.scheduledAt,
        zoomLink: scheduleData.zoomLink
      });

      setShowScheduleModal(false);
      setScheduleData({ scheduledAt: '', zoomLink: '' });
      await fetchData();
      alert('Interview scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-green-100 text-green-700',
      interviewed: 'bg-purple-100 text-purple-700',
      selected: 'bg-green-600 text-white',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Applications for {job?.title}
          </h1>
          <p className="text-gray-600">{applications.length} total applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {app.candidate?.fullName}
                        </h3>
                        <a
                          href={`mailto:${app.candidate?.email}`}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {app.candidate?.email}
                        </a>
                        {app.candidate?.phone && (
                          <p className="text-gray-600 text-sm">{app.candidate.phone}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-2xl font-bold text-gray-900">
                              {app.aiScore || 0}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">AI Score</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {app.candidate?.skills && app.candidate.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {app.candidate.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.scoreBreakdown && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Score Breakdown:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <p className="text-xs text-blue-600">Skills</p>
                            <p className="text-lg font-bold text-blue-700">{app.scoreBreakdown.skillsMatch || 0}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-xs text-green-600">Experience</p>
                            <p className="text-lg font-bold text-green-700">{app.scoreBreakdown.experienceMatch || 0}</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <p className="text-xs text-purple-600">Education</p>
                            <p className="text-lg font-bold text-purple-700">{app.scoreBreakdown.educationMatch || 0}</p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-2">
                            <p className="text-xs text-gray-300">Overall</p>
                            <p className="text-lg font-bold text-white">{app.scoreBreakdown.overallFit || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View Resume</span>
                        </a>
                      )}

                      {app.status === 'applied' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app._id, 'shortlisted')}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Shortlist</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(app._id, 'rejected')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {app.status === 'shortlisted' && (
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowScheduleModal(true);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                        >
                          <Video className="h-4 w-4" />
                          <span>Schedule Interview</span>
                        </button>
                      )}

                      {app.status === 'interviewed' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app._id, 'selected')}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Select</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(app._id, 'rejected')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>

                    {app.coverLetter && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
                        <p className="text-sm text-gray-600">{app.coverLetter}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Schedule Interview</h3>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={scheduleData.scheduledAt}
                    onChange={(e) => setScheduleData({ ...scheduleData, scheduledAt: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom Meeting Link
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={scheduleData.zoomLink}
                    onChange={(e) => setScheduleData({ ...scheduleData, zoomLink: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/..."
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
