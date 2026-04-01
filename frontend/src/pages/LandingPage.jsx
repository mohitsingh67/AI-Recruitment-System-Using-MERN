import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Users, Brain, Zap, CheckCircle, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    navigate(user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 fixed w-full z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">AI Recruit</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Recruitment
              <span className="text-blue-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Connect talented candidates with top employers using cutting-edge AI technology.
              Smart matching, automated screening, and seamless interview scheduling.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg"
              >
                Find Your Dream Job
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-lg"
              >
                Hire Top Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need for modern recruitment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-blue-50 rounded-xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Resume Analysis</h3>
              <p className="text-gray-600">
                Advanced AI automatically parses and scores resumes, identifying the best candidates instantly.
              </p>
            </div>

            <div className="p-8 bg-green-50 rounded-xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600">
                Get personalized job recommendations based on your skills, experience, and career goals.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Interviews</h3>
              <p className="text-gray-600">
                Schedule interviews with one click. AI generates relevant questions based on candidate profiles.
              </p>
            </div>

            <div className="p-8 bg-blue-50 rounded-xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Automated Screening</h3>
              <p className="text-gray-600">
                Save hours with automated candidate screening and ranking based on job requirements.
              </p>
            </div>

            <div className="p-8 bg-green-50 rounded-xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Collaborative Hiring</h3>
              <p className="text-gray-600">
                Manage applications, shortlist candidates, and make decisions with your team seamlessly.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Job Posting</h3>
              <p className="text-gray-600">
                Create and manage job listings in minutes. Track applications and engagement in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of companies and candidates who trust AI Recruit for their hiring needs.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">AI Recruit</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2026 AI Recruit. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
