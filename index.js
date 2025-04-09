// index.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchRepoData } from './fetchRepoData.js';

const app = express();
const PORT = 4000;

// Get __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static HTML from /public
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get repo info
app.get('/repo-info', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing GitHub repo URL' });
  }

  try {
    const info = await fetchRepoData(url);
    res.json(info);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch repo data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
