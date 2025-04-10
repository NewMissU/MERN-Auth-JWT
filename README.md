# 🔐 MERN Auth App (Vite + MongoDB + Express + React + Node.js)

This is a full-stack authentication application built with the **MERN Stack** using **Vite** for fast frontend development.  
It allows users to:

- ✅ Sign up
- ✅ Log in
- ✅ Reset password
- ✅ Send OTP to user email for verification


## Backend (MongoDB)

The backend is built with Expressjs and uses MongoDB for storing user data.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/NewMissU/MERN-Auth-JWT.git
cd MERN-Auth-JWT
```

2. Navigate to the backend folder:

```bash
cd backend
```

3. Install dependencies:

```bash
npm i nodemon nodemailer morgan mongoose jsonwebtoken express dotenv cors cookie-parser bcryptjs
```

4. Set up environment variables:

Create a .env file in the backend directory and add the following configuration for PostgreSQL:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# SMTP (for email verification)
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SENDER_EMAIL=your_verified_sender_email

```
6. Start the backend server:

```bash
npm run dev
```

The backend will be available at 👉 http://127.0.0.1:4000



## Frontend (React with Vite)

The frontend is built using React.js with Vite for fast development, and Tailwind CSS v4.0 for styling the user interface.

### Installation
Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install tailwindcss @tailwindcss/vite axios react-router-dom react-toastify
```

Start the React app:

```bash
npm run dev
```

The frontend will be available at 👉 http://localhost:5173