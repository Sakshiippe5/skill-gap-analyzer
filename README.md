# SkillGap Analyzer

Full-stack web app that analyzes skill gaps between your resume and a job description.

## Features
- Paste resume text + job description
- Extracts skills from PostgreSQL database
- Shows match percentage, matching skills, missing skills
- Clean React UI with Tailwind

## Tech Stack
- Frontend: React.js + Tailwind CSS + Axios
- Backend: Node.js + Express + pg (PostgreSQL client)
- Database: PostgreSQL (stores list of skills)

## How to run locally
1. Backend: `cd backend && npm install && npm run dev`
2. Frontend: `cd frontend && npm install && npm start`

Made as a 1-day full-stack project to demonstrate React + Node + DB integration.
