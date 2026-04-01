import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { FileText, Calendar, TrendingUp, Briefcase, Building, MapPin } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await applicationAPI.getCandidateApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
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

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
            <Link
              to="/candidate/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {application.job?.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            {application.job?.company}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {application.job?.location}
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Applied On</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">AI Match Score</p>
                          <p className="text-sm font-medium text-gray-900">
                            {application.aiScore || 0}/100
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Job Type</p>
                          <p className="text-sm font-medium text-gray-900">
                            {application.job?.type}
                          </p>
                        </div>
                      </div>
                    </div>

                    {application.scoreBreakdown && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Score Breakdown:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <p className="text-xs text-blue-600">Skills</p>
                            <p className="text-lg font-bold text-blue-700">
                              {application.scoreBreakdown.skillsMatch || 0}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-xs text-green-600">Experience</p>
                            <p className="text-lg font-bold text-green-700">
                              {application.scoreBreakdown.experienceMatch || 0}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <p className="text-xs text-purple-600">Education</p>
                            <p className="text-lg font-bold text-purple-700">
                              {application.scoreBreakdown.educationMatch || 0}
                            </p>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-2">
                            <p className="text-xs text-gray-300">Overall Fit</p>
                            <p className="text-lg font-bold text-white">
                              {application.scoreBreakdown.overallFit || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {application.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Recruiter Note:</p>
                        <p className="text-sm text-yellow-700">{application.notes}</p>
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

export default Applications;
