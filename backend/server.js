const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Test DB connection
pool.query('SELECT NOW()', (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('✅ PostgreSQL connected');
});

// Basic keyword extractor (this is our "NLP")
function extractSkills(text, allSkills) {
  const lowerText = text.toLowerCase();
  return allSkills
    .filter(skill => lowerText.includes(skill.toLowerCase()))
    .filter((v, i, a) => a.indexOf(v) === i); // remove duplicates
}

app.post('/analyze', async (req, res) => {
  const { resumeText, jobDescText } = req.body;

  if (!resumeText || !jobDescText) {
    return res.status(400).json({ error: 'Both texts are required' });
  }

  try {
    const skillsRes = await pool.query('SELECT name FROM skills');
    const allSkills = skillsRes.rows.map(row => row.name);

    const resumeSkills = extractSkills(resumeText, allSkills);
    const jdSkills = extractSkills(jobDescText, allSkills);

    const matching = resumeSkills.filter(skill => jdSkills.includes(skill));
    const missing = jdSkills.filter(skill => !resumeSkills.includes(skill));

    const matchPercentage = jdSkills.length 
      ? Math.round((matching.length / jdSkills.length) * 100) 
      : 0;

    res.json({
      resumeSkills,
      jdSkills,
      matching,
      missing,
      matchPercentage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});