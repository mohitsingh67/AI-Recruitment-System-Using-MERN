# AI-Powered Recruitment System Using MERN

A modern, full-stack recruitment platform built with the MERN stack that leverages AI to streamline the hiring process. The system features intelligent resume parsing, automated candidate scoring, and AI-generated interview questions.

## Features

### For Candidates
- **Smart Job Search**: Browse and search jobs with advanced filtering
- **AI-Powered Matching**: Get personalized job recommendations based on your skills
- **Resume Analysis**: Upload your resume and receive an AI-generated match score
- **Application Tracking**: Monitor the status of all your applications
- **Interview Management**: View scheduled interviews and join video calls

### For Recruiters
- **Job Management**: Create, edit, and manage job postings
- **AI Resume Screening**: Automatic resume parsing and candidate scoring
- **Application Management**: Review applications sorted by AI match scores
- **Interview Scheduling**: Schedule interviews with integrated Zoom meetings
- **AI Interview Questions**: Get relevant interview questions generated based on candidate profiles
- **Decision Tracking**: Mark candidates as shortlisted, rejected, or selected

## Tech Stack

### Backend
- **Node.js** & **Express.js**: RESTful API server
- **MongoDB** & **Mongoose**: Database and ODM
- **JWT**: Authentication
- **Cloudinary**: Resume file storage
- **Google Gemini AI**: Resume parsing and question generation
- **NodeMailer**: Email notifications
- **pdf-parse**: PDF text extraction

### Frontend
- **React 18**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Vite**: Build tool

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher)
2. **MongoDB** (local or cloud instance)
3. **Cloudinary Account** (for resume uploads)
4. **Google Gemini API Key** (for AI features)
5. **Email SMTP credentials** (for notifications)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-recruitment
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

FRONTEND_URL=http://localhost:5173
```

#### Getting API Keys:

**Cloudinary:**
1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret

**Google Gemini:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

**Gmail App Password:**
1. Enable 2-factor authentication on your Gmail account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password
4. Use this password in EMAIL_PASS

### 3. Frontend Setup

```bash
cd ..  # Go back to project root
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# If using MongoDB Compass or MongoDB Atlas, ensure your connection string is correct
```

### 5. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage Guide

### For Candidates

1. **Register**: Click "Get Started" and select "Candidate"
2. **Add Skills**: During registration, add your skills (required)
3. **Browse Jobs**: View all available jobs on the dashboard
4. **Apply**: Click on a job, upload your resume (PDF), and apply
5. **View Score**: After applying, see your AI-generated match score
6. **Track Applications**: Monitor application status in "Applications" tab
7. **Join Interviews**: Access scheduled interviews from "Interviews" tab

### For Recruiters

1. **Register**: Click "Get Started" and select "Recruiter"
2. **Post Jobs**: Create job postings with title, description, skills, and requirements
3. **Review Applications**: View applications sorted by AI match scores
4. **Shortlist/Reject**: Use AI scores to shortlist or reject candidates
5. **Schedule Interviews**: Schedule Zoom interviews with shortlisted candidates
6. **Conduct Interviews**: View AI-generated questions based on candidate resume
7. **Make Decisions**: Submit feedback and mark candidates as selected/rejected

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `POST /api/jobs` - Create job (recruiter only)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)
- `GET /api/jobs/my-jobs` - Get recruiter's jobs
- `GET /api/jobs/:id/applications` - Get job applications

### Applications
- `POST /api/applications` - Create application (candidate only)
- `GET /api/applications/my-applications` - Get candidate's applications
- `GET /api/applications/recommendations` - Get recommended jobs
- `GET /api/applications/:id` - Get application by ID
- `PUT /api/applications/:id/status` - Update application status (recruiter only)

### Interviews
- `POST /api/interviews/schedule` - Schedule interview (recruiter only)
- `GET /api/interviews/:id` - Get interview by ID
- `GET /api/interviews/recruiter-interviews` - Get recruiter's interviews
- `GET /api/interviews/candidate-interviews` - Get candidate's interviews
- `PUT /api/interviews/:id/status` - Update interview status
- `POST /api/interviews/:id/regenerate-questions` - Regenerate AI questions

## Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── interviewController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── interviewRoutes.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── gemini.js
│   │   ├── email.js
│   │   └── pdfParser.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── candidate/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Applications.jsx
│   │   │   └── Interviews.jsx
│   │   ├── recruiter/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── Interviews.jsx
│   │   │   └── InterviewRoom.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.tsx
├── .env
├── package.json
└── README.md
```

## Color Scheme

The application uses a professional color palette:
- **Primary (Blue)**: #2563EB - Actions, links, primary buttons
- **Success (Green)**: #059669 - Positive actions, success states
- **Neutral (Black/White/Gray)**: Text and backgrounds
- **Accents**: Purple for special features

## Features in Detail

### AI Resume Parsing
When a candidate uploads a resume, the system:
1. Extracts text from the PDF
2. Sends it to Google Gemini AI
3. Analyzes skills, experience, and education
4. Compares with job requirements
5. Generates a detailed score breakdown (0-100)

### Job Recommendations
The system matches candidates with jobs based on:
- Skill overlap
- Experience level
- Resume quality score
- Job requirements

### Interview Questions
AI generates relevant questions based on:
- Candidate's resume data
- Job description
- Required skills
- Experience level

Questions are categorized as:
- Technical
- Behavioral
- Situational

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access if using MongoDB Atlas

### Cloudinary Upload Fails
- Verify API credentials
- Check file size limits
- Ensure PDF format

### Email Not Sending
- Use app-specific password for Gmail
- Enable "Less secure app access" if needed
- Check SMTP settings

### AI Features Not Working
- Verify Gemini API key is valid
- Check API quota limits
- Ensure PDF text extraction is working

## Security Best Practices

- Never commit .env files
- Use strong JWT secrets
- Enable CORS appropriately
- Validate all user inputs
- Sanitize file uploads
- Use HTTPS in production
- Implement rate limiting
- Hash passwords (done via bcrypt)

## Future Enhancements

- Video interview recording
- Skills assessment tests
- Applicant tracking analytics
- Multi-language support
- Resume templates
- Advanced search filters
- Notification preferences
- Calendar integration
- Mobile app

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
