import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { MessageSquare, RefreshCw, Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const [finalDecision, setFinalDecision] = useState('pending');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const { data } = await interviewAPI.getInterviewById(id);
      setInterview(data);
      setFeedback(data.feedback || '');
      setNotes(data.notes || '');
      setFinalDecision(data.finalDecision || 'pending');
    } catch (error) {
      console.error('Error fetching interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQuestions = async () => {
    if (!window.confirm('Are you sure you want to regenerate questions?')) return;

    setRegenerating(true);
    try {
      const { data } = await interviewAPI.regenerateQuestions(id);
      setInterview(data);
    } catch (error) {
      console.error('Error regenerating questions:', error);
      alert('Failed to regenerate questions');
    } finally {
      setRegenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await interviewAPI.updateInterviewStatus(id, {
        status: 'completed',
        feedback,
        notes,
        finalDecision
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/recruiter/interviews');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-700',
      behavioral: 'bg-green-100 text-green-700',
      situational: 'bg-purple-100 text-purple-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
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

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Interview not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/recruiter/interviews')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Interviews
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Interview: {interview.candidate?.fullName}
                </h1>
                <p className="text-lg text-gray-600">{interview.job?.title}</p>
                <p className="text-gray-500">
                  Scheduled: {new Date(interview.scheduledAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                interview.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </span>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <p className="text-green-700 text-sm">Feedback submitted successfully! Redirecting...</p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Interview Questions</h2>
                <button
                  onClick={handleRegenerateQuestions}
                  disabled={regenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
                >
                  <RefreshCw className={`h-5 w-5 ${regenerating ? 'animate-spin' : ''}`} />
                  <span>{regenerating ? 'Generating...' : 'Regenerate Questions'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {interview.questions?.map((q, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-900 mb-2">{q.question}</p>
                          {q.answer && (
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <p className="text-xs font-medium text-gray-500 mb-1">Suggested Answer / Evaluation Criteria:</p>
                              <p className="text-sm text-gray-700">{q.answer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {q.category && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(q.category)}`}>
                          {q.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Feedback *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Provide detailed feedback about the candidate's performance..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any additional notes or observations..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Final Decision *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFinalDecision('selected')}
                    className={`p-4 border-2 rounded-lg font-medium transition flex flex-col items-center space-y-2 ${
                      finalDecision === 'selected'
                        ? 'border-green-600 bg-green-50 text-green-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <CheckCircle className="h-8 w-8" />
                    <span>Select</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinalDecision('rejected')}
                    className={`p-4 border-2 rounded-lg font-medium transition flex flex-col items-center space-y-2 ${
                      finalDecision === 'rejected'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <XCircle className="h-8 w-8" />
                    <span>Reject</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinalDecision('pending')}
                    className={`p-4 border-2 rounded-lg font-medium transition flex flex-col items-center space-y-2 ${
                      finalDecision === 'pending'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <AlertCircle className="h-8 w-8" />
                    <span>Pending</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Saving...' : 'Submit Feedback'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/recruiter/interviews')}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
