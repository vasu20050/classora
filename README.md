# Classora 🎓

Classora is a modern, premium, and highly responsive learning management platform inspired by Google Classroom. Designed specifically for college students and educators, it delivers an immersive, dark-themed virtual learning space built with state-of-the-art web technologies.

Deploy is successfully completed and live on **Vercel**! 🚀

---

## ✨ Features

- **🔑 Multi-Role Authentication:** Dedicated dashboards, navigation structures, and workspaces custom-tailored for `students` and `teachers`.
- **🏫 Classroom Management:** Teachers can create virtual classrooms instantly; students can enroll seamlessly using an automated 6-character unique class code.
- **📅 Dynamic Calendar Dashboard:** A fully interactive calendar module for both roles to visualize scheduling, track assignments, and view upcoming class deadlines with a premium responsive layout.
- **📝 Assignments & Grading:** 
  - Teachers can post assignments, set due dates, attach descriptions, grade student submissions, and leave detailed feedback.
  - Students can upload work, track assignment statuses, and receive instant grading alerts.
- **📣 Classroom Stream:** Real-time announcements, instructions, and communication feeds directly within each classroom.
- **🎨 Premium UI/UX:** Built with glassmorphism aesthetics, deep cosmic dark default theme (`bg-[#04040f]`), smooth transitions, responsive layouts, and modern typography.

---

## 🛠️ Tech Stack

- **Core & Framework:** Next.js (App Router), React, Tailwind CSS, Lucide Icons, Date-fns (Calendar Engine)
- **Database:** MongoDB + Mongoose (Optimized async pre-save hooks & connection pooling)
- **Security & Auth:** JSON Web Tokens (JWT) powered by the edge-compatible `jose` library, stored in secure HTTP-only cookies.
- **Validation:** Strong compile-time and runtime validation using **Zod** schema parser.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory and configure the following variables:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/classora
JWT_SECRET=your_secure_jwt_secret_key
```

### 3. Run Development Server (with Auto-Browser Launch)
We have optimized the dev workflow with an automated browser launcher script:
```bash
npm run dev
```
*This launches the Next.js server and automatically opens `http://localhost:3000` in your default browser once the server is ready!*

---

## 📦 Deployment Configuration

Classora is optimized for serverless hosting on **Vercel**:

1. **Environment Variables**: Make sure to set `MONGODB_URI` and `JWT_SECRET` in your **Vercel Project Settings > Environment Variables**.
2. **Build Safety**: Mongoose connection helpers are fully optimized to ensure the application builds cleanly during Vercel's static analysis phase.

---

## 📂 Codebase Architecture

- `app/api/` — Backend serverless REST endpoints with typecheck-safe Zod validation.
- `app/dashboard/` — Protected role-based workspaces and layouts.
- `app/dashboard/calendar/` — The interactive schedule & assignment calendar view.
- `models/` — Scalable database schemas for User, Classroom, Assignment, and Submission.
- `lib/db.ts` — Connection pooling wrapper for MongoDB Atlas.
- `lib/auth.ts` — Middleware helpers, token verification, and session context hooks.
- `scripts/dev.js` — Custom development launcher for optimized local startup.
