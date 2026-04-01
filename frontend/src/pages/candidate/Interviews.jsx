import { useState, useEffect } from 'react';
import { interviewAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Video, Calendar, Clock, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data } = await interviewAPI.getCandidateInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getDecisionBadge = (decision) => {
    if (decision === 'selected') {
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Selected</span>
        </div>
      );
    } else if (decision === 'rejected') {
      return (
        <div className="flex items-center space-x-2 text-red-600">
          <XCircle className="h-5 w-5" />
          <span className="font-medium">Not Selected</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 text-gray-600">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Pending Decision</span>
        </div>
      );
    }
  };

  const isUpcoming = (scheduledAt) => {
    return new Date(scheduledAt) > new Date();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Interviews</h1>
          <p className="text-gray-600">Manage your scheduled interviews</p>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Interviews Scheduled</h3>
            <p className="text-gray-600">Your scheduled interviews will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                  isUpcoming(interview.scheduledAt) ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {interview.job?.title}
                        </h3>
                        <p className="text-lg text-gray-600">{interview.job?.company}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(interview.status)}`}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Interview Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(interview.scheduledAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Interview Time</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(interview.scheduledAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {interview.zoomLink && (
                      <a
                        href={interview.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        <Video className="h-5 w-5" />
                        <span>Join Interview</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    {interview.status === 'completed' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {getDecisionBadge(interview.finalDecision)}
                        {interview.feedback && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                            <p className="text-sm text-gray-600">{interview.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {isUpcoming(interview.scheduledAt) && interview.status === 'scheduled' && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">Preparation Tips:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Test your audio and video before the interview</li>
                          <li>• Review the job description and your application</li>
                          <li>• Prepare questions about the role and company</li>
                          <li>• Join the meeting 5 minutes early</li>
                        </ul>
                      </div>
                    )}
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

export default Interviews;
