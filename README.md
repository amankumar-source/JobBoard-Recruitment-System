# 🚀 JobVista Pro – Job Board & Recruitment Management System

**JobVista Pro** is a full-stack **MERN Job Board & Recruitment Management System** designed to connect job seekers with recruiters through a modern, secure, and user-friendly platform.

This project demonstrates real-world implementation of authentication, role-based access, job posting, job applications, and dashboards using the **MERN stack**.

🔗 **Live Demo:**  
👉 https://job-board-recruitment-system.vercel.app/

---

## 📌 Features

### 👨‍💼 Job Seeker
- User authentication (Register / Login)
- Browse and search job listings
- Apply for jobs
- View applied jobs
- Profile management

### 🧑‍💼 Recruiter / Employer
- Recruiter authentication
- Post new job openings
- Manage posted jobs
- View applicants for each job
- Recruitment dashboard

### ⚙️ Admin / System
- Secure role-based access
- Protected routes
- Modern UI with fully responsive design

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Token)
- bcrypt.js
- Middleware-based route protection

### Deployment
- **Frontend:** Vercel
- **Backend:** Node.js Server
- **Database:** MongoDB Atlas

---

## 🔐 Authentication Flow
- JWT-based authentication
- Tokens stored securely
- Protected routes for recruiters and job seekers
- Role-based authorization

---

## 🧪 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/jobvista-pro.git
cd jobvista-pro



### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```
Create a `.env` file in the `backend` folder:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Create a `.env` file in the `frontend` folder:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_id
```

## 📌 Future Enhancements

Resume download tracking

Email notifications

Admin analytics dashboard

Job recommendations



🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.




👨‍💻 Author

Aman Kumar

GitHub: https://github.com/amankumar-source

