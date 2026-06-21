/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DBService } from './server/db';
import { GoogleGenAI, Type } from '@google/genai';
import { ApiClient } from '@google/genai/vertex_internal';
import rateLimit from "express-rate-limit";

// Initialize Gemini SDK with telemetry user-agent
const apiKey = process.env.GEMINI_API_KEY;
const aiClient = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function startServer() {
  const app = express();
  const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: {
      error: "Too many requests. Please try again later."
    }
  });
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Request logs helper
  app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  });

  // Simple Auth Middleware
  const getUserId = (req: express.Request): string => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    const headerId = req.headers['x-user-id'];
    if (headerId && typeof headerId === 'string') {
      return headerId;
    }
    return 'default_guest';
  };

  // --- API ROUTES ---

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'All administrative parameters (email, name, password) must be provided.' });
    }

    const newUser = DBService.registerUser(email, name, password);
    if (!newUser) {
      return res.status(400).json({ error: 'Credentials conflict. This identity parameters are already linked to the ecosystem.' });
    }

    res.status(201).json({ user: newUser });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Identification parameters (email, password) are required.' });
    }

    const user = DBService.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'System unauthorized. The credential combination could not be authenticated.' });
    }

    res.json({ user });
  });

  // User details
  app.get('/api/auth/me', (req, res) => {
    const userId = getUserId(req);
    const user = DBService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Current identity trace expired.' });
    }
    res.json({ user });
  });

  // Carbon profile
  app.get('/api/profile', (req, res) => {
    const userId = getUserId(req);
    const profile = DBService.getProfile(userId);
    res.json({ profile });
  });

  app.post('/api/profile', (req, res) => {
    const userId = getUserId(req);
    const updated = DBService.updateProfile(userId, req.body);
    res.json({ profile: updated });
  });

  // Telemetry
  app.get('/api/telemetry', (req, res) => {
    const userId = getUserId(req);
    const telemetry = DBService.getTelemetry(userId);
    res.json({ telemetry });
  });

  // Analytics history
  app.get('/api/analytics', (req, res) => {
    const userId = getUserId(req);
    const history = DBService.getAnalyticsHistory(userId);
    res.json({ history });
  });

  // Missions
  app.get('/api/missions', (req, res) => {
    const userId = getUserId(req);
    const missions = DBService.getMissions(userId);
    res.json({ missions });
  });

  app.post('/api/missions/:id/toggle', (req, res) => {
    const userId = getUserId(req);
    const { id } = req.params;
    const missions = DBService.toggleMission(userId, id);
    res.json({ missions });
  });

  // Recommendations
  app.get('/api/recommendations', (req, res) => {
    const userId = getUserId(req);
    const recommendations = DBService.getRecommendations(userId);
    res.json({ recommendations });
  });

  // AI Insights - Generates cinematic intelligence narrative, floating fragments, custom recommendation guides
  app.post('/api/insights', aiLimiter, async (req, res) => {
    const userId = getUserId(req);
    const profile = DBService.getProfile(userId);

    // Guard checking if API key exists. If not, fallback to static beautiful insights to keep the platform responsive
    
    if (!apiKey) {
      console.log('Gemini API key is not configured. Utilizing premium built-in insights.');
      return res.json({
        sustainabilityNarrative: `Your current carbon trace orbits at ${profile.calculatedFootprint} tonnes of CO2e. This density places your planetary sphere in a "${profile.status}" state. Warm currents flow across the northern convective zone, but carbon density in the transportation sector remains a persistent cloud canopy. Your carbon index represents a moderate balance. Transitioning key transit mechanics can shift this orbit toward perfect resonance.`,
        observations: [
          `Your dominant emission sector is ${profile.carTravel > 200 ? 'Transportation' : 'Ecosystem Household Energy'}.`,
          `Your lifestyle decisions trace a ${profile.foodChoice === 'vegetarian' ? 'low-intensity agrarian agricultural pattern' : 'complex protein intake matrix'}.`,
          `Your waste metrics show an organic footprint that is ${profile.wasteChoice === 'low' ? 'pristine' : 'moderately expansive and demands core reduction'}.`
        ],
        recommendations: [
          {
            title: "Micro-Grid Resonance",
            category: "energy",
            impact: "High",
            difficulty: "Medium",
            savings: 620,
            explanation: "Tuning your electricity intake down during high-load periods recalibrates the thermal footprint of your domestic grid."
          },
          {
            title: "Regenerate Organic Trails",
            category: "waste",
            impact: "Medium",
            difficulty: "Easy",
            savings: 420,
            explanation: "Aggressive reduction of organic food wastage stops localized anaerobic methane generation at critical landfill cores."
          }
        ]
      });
    }

    try {
      const prompt = `Perform an advanced, cinematic Environmental Intelligence Assessment for the following carbon footprint profile:
      - Car Travel: ${profile.carTravel} km/week
      - Bus Travel: ${profile.busTravel} km/week
      - Train Travel: ${profile.trainTravel} km/week
      - Electricity: ${profile.electricityUsage} kWh/month
      - Nutrition Model: ${profile.foodChoice}
      - Waste Level: ${profile.wasteChoice}
      - Estimated Core Carbon Impact: ${profile.calculatedFootprint} tonnes CO2e/year
      - Earth Status: ${profile.status}

      Write your analysis in the voice of an advanced, cinematic planetary monitoring system—combining precise telemetry logic with melancholic, deeply evocative, beautiful, prose-laden storytelling (like in premium, high-aesthetic digital designs).
      Ensure you describe:
      1. sustainabilityNarrative: A beautiful 3-4 sentence storytelling paragraph about their personal planetary sphere, current state, and the poetic impact of their choices on global thermals and tides. Keep it luxury, technical, yet highly cinematic and emotionally charged.
      2. observations: A list of 3 highly custom intelligence observations (atmospheric monitoring traces, like "Localized household combustion forms a persistent 1.2x light deflection shield").
      3. recommendations: An array of 2 tailored recommendations, each with 'title', 'category' (transport, energy, food, waste), 'impact' (High, Medium, Low), 'difficulty' (Easy, Medium, Hard), 'savings' (kg CO2e saved annually as integer), and 'explanation' (prose explaining the environmental physics of this change).`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an Environmental Intelligence Oracle. You deliver deeply narrative, elegant, cinematic assessments detailing environmental physics, carbon orbits, and organic telemetry.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sustainabilityNarrative: {
                type: Type.STRING,
                description: 'A luxurious, cinematic, scientific-poetic paragraph describing the planetary orbit details of this profile.'
              },
              observations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Three scientific, atmospheric telemetry observation items.'
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    category: { type: Type.STRING, description: 'Must be one of: transport, energy, food, waste' },
                    impact: { type: Type.STRING, description: 'High, Medium or Low' },
                    difficulty: { type: Type.STRING, description: 'Easy, Medium or Hard' },
                    savings: { type: Type.INTEGER, description: 'kg CO2e saved per year' },
                    explanation: { type: Type.STRING, description: ' poetics of why the change impacts planetary energy balance.' }
                  },
                  required: ['title', 'category', 'impact', 'difficulty', 'savings', 'explanation']
                }
              }
            },
            required: ['sustainabilityNarrative', 'observations', 'recommendations']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empirical telemetry failed to respond.');
      }

      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error('[Gemini Service Error]', err);
      res.status(500).json({
        error: 'Environmental intelligence pipeline experienced a local telemetry disturbance.',
        details: err.message
      });
    }
  });

  // --- DEV & PRODUCTION MIDDLEWARE ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EcoTrack AI Server] Active, monitoring stream on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Fatal Platform Crash]', err);
});
