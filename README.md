
🚀 JobVista Pro – Job Board & Recruitment Management System
JobVista Pro is a full-stack MERN Job Board and Recruitment Management System designed to connect job seekers with recruiters through a modern, secure, and user-friendly platform.

This project demonstrates real-world implementation of authentication, role-based access, job posting, job applications, and dashboards using the MERN stack.

🔗 Live Demo: https://job-board-recruitment-system.vercel.app/

📌 Features
👨‍💼 Job Seeker
User authentication (Register / Login)
Browse & search job listings
Apply for jobs
View applied jobs
Profile management
🧑‍💼 Recruiter / Employer
Recruiter authentication
Post new job openings
Manage posted jobs
View applicants for each job
Recruitment dashboard
⚙️ Admin / System
Secure role-based access
Protected routes
Modern UI with responsive design
🛠️ Tech Stack
Frontend
React.js
Tailwind CSS
Axios
React Router
Backend
Node.js
Express.js
MongoDB
Mongoose
Authentication & Security
JWT (JSON Web Token)
bcrypt.js
Middleware-based route protection
Deployment
Frontend: Vercel
Backend: Node server
Database: MongoDB Atlas
🔐 Authentication Flow
JWT-based authentication
Tokens stored securely
Protected routes for recruiters and job seekers
Role-based authorization
🧪 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/jobvista-pro.git
cd jobvista-pro


## ⚙️ Backend Setup

```bash
cd server
npm install
npm start

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

##  Frontend Setup

cd client
npm install
npm start
