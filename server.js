require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// 1. IMPORTANT: This allows your server to read JSON bodies in POST requests
app.use(express.json());

// Serve everything inside the 'public' folder
app.use(express.static('public'));

// ==========================================
// ROUTE 1: College Scorecard API Proxy
// ==========================================
app.get('/api/colleges', async (req, res) => {
    try {
        const frontendParams = req.query;
        const API_KEY = process.env.LP_SCORECARD_API_KEY;

        if (!API_KEY) return res.status(500).json({ error: "College API key is missing." });

        const response = await axios.get('https://api.data.gov/ed/collegescorecard/v1/schools.json', {
            params: { ...frontendParams, api_key: API_KEY }
        });

        res.json(response.data);
    } catch (error) {
        console.error("College API Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch college data' });
    }
});

// ==========================================
// ROUTE 2: Anthropic Claude API Proxy
// ==========================================
app.post('/api/rewrite', async (req, res) => {
    try {
        // Grab the ENTIRE payload directly from the UI
        const fullPayloadFromUI = req.body;
        const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

        if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Anthropic API key is missing." });

        // Blindly forward the entire payload to Anthropic
        const response = await axios.post('https://api.anthropic.com/v1/messages', fullPayloadFromUI, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_KEY,
                "anthropic-version": "2023-06-01"
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to rewrite text' });
    }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running safely on http://localhost:${PORT}`));
}

module.exports = app;