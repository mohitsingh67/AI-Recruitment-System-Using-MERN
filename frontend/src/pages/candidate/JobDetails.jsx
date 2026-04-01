import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { MapPin, Briefcase, DollarSign, Calendar, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [aiScore, setAiScore] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await jobAPI.getJobById(id);
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError('');
    } else {
      setError('Please upload a PDF file');
      setResume(null);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    setApplying(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);

      const { data } = await applicationAPI.createApplication(formData);

      setAiScore(data.aiScore);
      setSuccess(true);

      setTimeout(() => {
        navigate('/candidate/applications');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Job not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{job.company}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-3 text-blue-600" />
                  <span>{job.type}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-3 text-green-600" />
                    <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Job Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Apply for this Job</h2>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                  {aiScore !== null && (
                    <div className="mb-4">
                      <p className="text-gray-600 mb-2">Your AI Match Score:</p>
                      <div className="text-4xl font-bold text-blue-600">{aiScore}/100</div>
                    </div>
                  )}
                  <p className="text-gray-600">Redirecting to applications...</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Resume (PDF) *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                        required
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        {resume ? (
                          <div className="flex items-center justify-center space-x-2 text-green-600">
                            <FileText className="h-6 w-6" />
                            <span className="font-medium">{resume.name}</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Click to upload PDF</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us why you're a great fit for this role..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Your resume will be analyzed by AI and scored based on job requirements
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
