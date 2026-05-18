# Classora

Classora is a modern, lightweight education platform inspired by Google Classroom, designed specifically for college students and educators. Built with Next.js App Router, Tailwind CSS, and MongoDB.

## Features

- **Role-based Auth:** Separate flows and dashboards for `students` and `teachers`.
- **Classroom Management:** Teachers can create classrooms; students can join using a 6-character code.
- **Assignments:** Post assignments, attach deadlines, and track submissions.
- **Grading System:** Review student submissions, assign marks, and leave feedback.
- **Live Stream:** Post announcements and updates directly to the classroom feed.
- **Premium UI:** Dark-mode by default, built with Tailwind v4, glassmorphism, and responsive design.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React
- **Backend:** Next.js API Routes (Serverless/Edge ready), Node.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (Jose library for Edge compatibility), HTTP-only cookies
- **Validation:** Zod, React Hook Form

## Getting Started

1. **Clone and Install:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/classora
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open Application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture

- `app/api/*`: Backend REST endpoints.
- `app/dashboard/*`: Protected dashboard layout and pages.
- `models/*`: Mongoose database schemas.
- `contexts/AuthContext.tsx`: Global auth state and JWT token management.
- `lib/validations/`: Shared Zod schemas for frontend and backend validation.

## Design

The UI utilizes a deep dark theme (`bg-[#04040f]`) with vibrant gradients (Violet to Indigo). It uses subtle `backdrop-blur` for a glassmorphism effect, giving it a premium, native-app feel suitable for a modern SaaS product.
