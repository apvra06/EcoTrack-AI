/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { User, CarbonProfile, Mission, Recommendation, EcoHealthStatus, Telemetry, EmissionHistoryItem } from '../src/types';
import bcrypt from "bcrypt";
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'db.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

interface DBState {
  users: User[];
  passwords: Record<string, string>; // userId -> password (simple hash/plain for prototype safety)
  profiles: CarbonProfile[];
  missions: Record<string, Mission[]>; // userId -> missions
  recommendations: Record<string, Recommendation[]>; // userId -> recommendations
}

const DEFAULT_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Kinetic Shift',
    description: 'Transition 50km of weekly transit from active personal motor combustion to electric rail or cycle.',
    category: 'transport',
    targetValue: 50,
    currentValue: 0,
    unit: 'km',
    points: 120,
    isCompleted: false,
    type: 'reduction'
  },
  {
    id: 'm2',
    title: 'The Static Hour',
    description: 'Reduce quarterly electrical energy demand by 30 kWh through hardware power shutdown protocols.',
    category: 'energy',
    targetValue: 30,
    currentValue: 0,
    unit: 'kWh',
    points: 150,
    isCompleted: false,
    type: 'lifestyle'
  },
  {
    id: 'm3',
    title: 'Primal Diet',
    description: 'Introduce exclusive plant-based diet protocols for 5 days of the week.',
    category: 'food',
    targetValue: 5,
    currentValue: 0,
    unit: 'days',
    points: 200,
    isCompleted: false,
    type: 'lifestyle'
  },
  {
    id: 'm4',
    title: 'Zero Core Leakage',
    description: 'Establish active zero-organic core waste compost cycles for two weeks.',
    category: 'waste',
    targetValue: 14,
    currentValue: 0,
    unit: 'days',
    points: 100,
    isCompleted: false,
    type: 'reduction'
  }
];

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    title: 'Electrified Concourse',
    category: 'transport',
    impact: 'High',
    difficulty: 'Medium',
    savings: 1840,
    explanation: 'Shifting your travel routines to shared electrified rail networks reduces personal kinetic carbon footprint by up to 88% per travel hour.'
  },
  {
    id: 'r2',
    title: 'Thermal Core Optimization',
    category: 'energy',
    impact: 'Medium',
    difficulty: 'Easy',
    savings: 450,
    explanation: 'Optimizing household HVAC and water heating thermals by just 1.5°C limits energy loss profiles without compromising core ambient comfort.'
  },
  {
    id: 'r3',
    title: 'Agrarian Cycle Adoption',
    category: 'food',
    impact: 'High',
    difficulty: 'Easy',
    savings: 1200,
    explanation: 'transitioning primary nutrition proteins to organic whole plant structures diminishes massive agricultural irrigation and transport multipliers.'
  },
  {
    id: 'r4',
    title: 'Consolidated Mass Reduction',
    category: 'waste',
    impact: 'Low',
    difficulty: 'Medium',
    savings: 280,
    explanation: 'Utilizing compost loops and prioritizing glass over plastic prevents volatile methane leakage and raw materials refining overhead.'
  }
];

function loadDB(): DBState {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading DB, resetting config:', e);
    }
  }

  const initialState: DBState = {
    users: [],
    passwords: {},
    profiles: [],
    missions: {},
    recommendations: {}
  };
  saveDB(initialState);
  return initialState;
}

function saveDB(data: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write database file:', e);
  }
}

// Memory database instance
let db = loadDB();

export const DBService = {
  // Auth operations
  registerUser: async (email: string, name: string, password: string): Promise<User | null> => {
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return null;

    

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    const passwordHash = await bcrypt.hash(password, 10);
    db.passwords[newUser.id] = passwordHash;

    // Seed default missions and recommendations for this brand new user
    db.missions[newUser.id] = JSON.parse(JSON.stringify(DEFAULT_MISSIONS));
    db.recommendations[newUser.id] = JSON.parse(JSON.stringify(DEFAULT_RECOMMENDATIONS));

    saveDB(db);
    return newUser;
  },

  loginUser: async (
    email: string,
    password: string
  ): Promise<User | null> => {

    const user = db.users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) return null;

    const storedPass = db.passwords[user.id];

    const isValid = await bcrypt.compare(
      password,
      storedPass
    );

    if (!isValid) {
      return null;
    }

    return user;
  },

  getUserById: (id: string): User | null => {
    return db.users.find(u => u.id === id) || null;
  },

  // Carbon Profile operations
  getProfile: (userId: string): CarbonProfile => {
    let profile = db.profiles.find(p => p.userId === userId);
    if (!profile) {
      // Default placeholder Profile
      profile = {
        id: Math.random().toString(36).substring(2, 11),
        userId,
        carTravel: 100,
        busTravel: 20,
        trainTravel: 40,
        electricityUsage: 250,
        foodChoice: 'mixed',
        wasteChoice: 'medium',
        calculatedFootprint: 4.8,
        status: 'Stable',
        updatedAt: new Date().toISOString()
      };
      db.profiles.push(profile);
      saveDB(db);
    }
    return profile;
  },

  updateProfile: (userId: string, update: Partial<CarbonProfile>): CarbonProfile => {
    let profile = db.profiles.find(p => p.userId === userId);
    if (!profile) {
      profile = {
        id: Math.random().toString(36).substring(2, 11),
        userId,
        carTravel: 100,
        busTravel: 20,
        trainTravel: 40,
        electricityUsage: 250,
        foodChoice: 'mixed',
        wasteChoice: 'medium',
        calculatedFootprint: 4.8,
        status: 'Stable',
        updatedAt: new Date().toISOString()
      };
      db.profiles.push(profile);
    }

    // Merge updates
    Object.assign(profile, update);

    // Calculate dynamic carbon footprint in tonnes/year
    const carEmissions = (profile.carTravel * 52 * 0.18) / 1000;
    const busEmissions = (profile.busTravel * 52 * 0.08) / 1000;
    const trainEmissions = (profile.trainTravel * 52 * 0.04) / 1000;
    const electricityEmissions = (profile.electricityUsage * 12 * 0.35) / 1000;

    let foodEmissions = 2.2;
    if (profile.foodChoice === 'vegetarian') foodEmissions = 1.5;
    else if (profile.foodChoice === 'non-vegetarian') foodEmissions = 3.3;

    let wasteEmissions = 0.5;
    if (profile.wasteChoice === 'low') wasteEmissions = 0.2;
    else if (profile.wasteChoice === 'high') wasteEmissions = 0.9;

    const totalCalculated = carEmissions + busEmissions + trainEmissions + electricityEmissions + foodEmissions + wasteEmissions;
    profile.calculatedFootprint = parseFloat(totalCalculated.toFixed(2));

    // Calculate Environmental Health Status
    let healthState: EcoHealthStatus = 'Stable';
    if (profile.calculatedFootprint < 3.0) {
      healthState = 'Healthy';
    } else if (profile.calculatedFootprint >= 3.0 && profile.calculatedFootprint < 6.0) {
      healthState = 'Stable';
    } else if (profile.calculatedFootprint >= 6.0 && profile.calculatedFootprint < 10.0) {
      healthState = 'Warning';
    } else {
      healthState = 'Critical';
    }

    profile.status = healthState;
    profile.updatedAt = new Date().toISOString();

    saveDB(db);
    return profile;
  },

  // Telemetry Operations
  getTelemetry: (userId: string): Telemetry => {
    const profile = DBService.getProfile(userId);
    const footprint = profile.calculatedFootprint;

    // Map footprint into ecoIndex (0 to 100 scale where lower footprint = higher index)
    // 0 is critical (footprint > 15), 100 is healthy (footprint around 1.0)
    let ecoIndex = 100 - (footprint * 6);
    if (ecoIndex < 5) ecoIndex = 5;
    if (ecoIndex > 98) ecoIndex = 98;
    ecoIndex = Math.round(ecoIndex);

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (ecoIndex > 75) trend = 'improving';
    else if (ecoIndex < 45) trend = 'declining';

    // Figure out the core emission contributor string
    const carEmissions = (profile.carTravel * 52 * 0.18) / 1000;
    const electricityEmissions = (profile.electricityUsage * 12 * 0.35) / 1000;
    const foodEmissions = profile.foodChoice === 'vegetarian' ? 1.5 : profile.foodChoice === 'non-vegetarian' ? 3.3 : 2.2;
    const wasteEmissions = profile.wasteChoice === 'low' ? 0.2 : profile.wasteChoice === 'high' ? 0.9 : 0.5;

    let topSource = 'Transportation';
    let maxVal = carEmissions;

    if (electricityEmissions > maxVal) {
      maxVal = electricityEmissions;
      topSource = 'Electricity';
    }
    if (foodEmissions > maxVal) {
      maxVal = foodEmissions;
      topSource = 'Food System';
    }
    if (wasteEmissions > maxVal) {
      maxVal = wasteEmissions;
      topSource = 'Waste Refinement';
    }

    let forecast = 'Stable orbit';
    if (profile.status === 'Healthy') {
      forecast = 'Planetary orbit balancing. Target index alignment ahead is excellent.';
    } else if (profile.status === 'Stable') {
      forecast = 'Minimal ecological strain. Further reduction can secure safe planetary orbit.';
    } else if (profile.status === 'Warning') {
      forecast = 'Accelerating ecological overshoot. Immediate carbon offset interventions advised.';
    } else {
      forecast = 'Intense atmospheric heating forecast. Disruptive local ecosystem destabilization likely.';
    }

    return {
      ecoIndex,
      planetStatus: profile.status,
      trend,
      carbonFootprint: footprint,
      forecast,
      topSource
    };
  },

  // Analytics operations
  getAnalyticsHistory: (userId: string): EmissionHistoryItem[] => {
    const profile = DBService.getProfile(userId);
    const car = (profile.carTravel * 52 * 0.18) / 1000;
    const bus = (profile.busTravel * 52 * 0.08) / 1000;
    const train = (profile.trainTravel * 52 * 0.04) / 1000;
    const transport = parseFloat((car + bus + train).toFixed(2));
    const energy = parseFloat(((profile.electricityUsage * 12 * 0.35) / 1000).toFixed(2));
    
    let food = 2.2;
    if (profile.foodChoice === 'vegetarian') food = 1.5;
    else if (profile.foodChoice === 'non-vegetarian') food = 3.3;

    let waste = 0.5;
    if (profile.wasteChoice === 'low') waste = 0.2;
    else if (profile.wasteChoice === 'high') waste = 0.9;

    // Generate 6 historic months scaling down to the current state as the user enters optimization goals
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, idx) => {
      // Create slight historic overshoot to show improvement
      const multiplier = 1.25 - (idx * 0.05); // From 1.25x down to 1.0x
      const mTrans = parseFloat((transport * multiplier).toFixed(2));
      const mElec = parseFloat((energy * multiplier).toFixed(2));
      const mFood = parseFloat((food * (1.1 - idx * 0.02)).toFixed(2));
      const mWaste = parseFloat((waste * (1.15 - idx * 0.03)).toFixed(2));
      const total = parseFloat((mTrans + mElec + mFood + mWaste).toFixed(2));

      return {
        period: m,
        transport: mTrans,
        energy: mElec,
        food: mFood,
        waste: mWaste,
        total
      };
    });
  },

  // Mission management
  getMissions: (userId: string): Mission[] => {
    if (!db.missions[userId]) {
      db.missions[userId] = JSON.parse(JSON.stringify(DEFAULT_MISSIONS));
      saveDB(db);
    }
    return db.missions[userId];
  },

  toggleMission: (userId: string, id: string): Mission[] => {
    const userMissions = DBService.getMissions(userId);
    const mission = userMissions.find(m => m.id === id);
    if (mission) {
      mission.isCompleted = !mission.isCompleted;
      mission.currentValue = mission.isCompleted ? mission.targetValue : 0;
      saveDB(db);
    }
    return userMissions;
  },

  // Recommendation management
  getRecommendations: (userId: string): Recommendation[] => {
    if (!db.recommendations[userId]) {
      db.recommendations[userId] = JSON.parse(JSON.stringify(DEFAULT_RECOMMENDATIONS));
      saveDB(db);
    }
    return db.recommendations[userId];
  }
};
