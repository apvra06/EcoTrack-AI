/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CarbonProfile, Telemetry, Mission, Recommendation, EmissionHistoryItem } from '../types';

interface EcoContextType {
  user: User | null;
  profile: CarbonProfile | null;
  telemetry: Telemetry | null;
  history: EmissionHistoryItem[];
  missions: Mission[];
  recommendations: Recommendation[];
  aiNarrative: string;
  aiObservations: string[];
  isLoading: boolean;
  isAiLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCarbonProfile: (data: Partial<CarbonProfile>) => Promise<void>;
  toggleMissionStatus: (id: string) => Promise<void>;
  fetchAiInsights: () => Promise<void>;
  updateAnonymousProfile: (profile: CarbonProfile) => void;
}

const EcoContext = createContext<EcoContextType | undefined>(undefined);

const GUEST_PROFILE: CarbonProfile = {
  id: 'guest_prof',
  userId: 'default_guest',
  carTravel: 120,
  busTravel: 30,
  trainTravel: 40,
  electricityUsage: 220,
  foodChoice: 'mixed',
  wasteChoice: 'medium',
  calculatedFootprint: 4.58,
  status: 'Stable',
  updatedAt: new Date().toISOString()
};

const GUEST_TELEMETRY: Telemetry = {
  ecoIndex: 72,
  planetStatus: 'Stable',
  trend: 'stable',
  carbonFootprint: 4.58,
  forecast: 'Moderate atmospheric equilibrium. Personal reductions can secure a Healthy orbit.',
  topSource: 'Transportation Grid'
};

const GUEST_HISTORY: EmissionHistoryItem[] = [
  { period: 'Jan', transport: 2.1, energy: 1.5, food: 2.2, waste: 0.5, total: 6.3 },
  { period: 'Feb', transport: 1.9, energy: 1.4, food: 2.2, waste: 0.5, total: 6.0 },
  { period: 'Mar', transport: 1.8, energy: 1.3, food: 2.2, waste: 0.5, total: 5.8 },
  { period: 'Apr', transport: 1.7, energy: 1.1, food: 2.2, waste: 0.5, total: 5.5 },
  { period: 'May', transport: 1.4, energy: 1.0, food: 2.2, waste: 0.5, total: 5.1 },
  { period: 'Jun', transport: 1.25, energy: 0.83, food: 2.2, waste: 0.5, total: 4.58 }
];

const GUEST_RECOMMENDATIONS: Recommendation[] = [
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
  }
];

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CarbonProfile | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [history, setHistory] = useState<EmissionHistoryItem[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [aiNarrative, setAiNarrative] = useState<string>('');
  const [aiObservations, setAiObservations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ecotrack_user');
    const storedUserId = localStorage.getItem('ecotrack_userid');
    if (storedUser && storedUserId) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadSessionData(parsedUser.id);
      } catch (err) {
        localStorage.removeItem('ecotrack_user');
        localStorage.removeItem('ecotrack_userid');
        loadGuestData();
      }
    } else {
      loadGuestData();
    }
  }, []);

  const loadGuestData = () => {
    setProfile(GUEST_PROFILE);
    setTelemetry(GUEST_TELEMETRY);
    setHistory(GUEST_HISTORY);
    setRecommendations(GUEST_RECOMMENDATIONS);
    setMissions([
      { id: 'm1', title: 'Kinetic Shift', description: 'Transition 50km of weekly transit from active motor combustion to electric rail.', category: 'transport', targetValue: 50, currentValue: 0, unit: 'km', points: 120, isCompleted: false, type: 'reduction' },
      { id: 'm2', title: 'The Static Hour', description: 'Reduce electrical energy demand by 30 kWh through computer core shutdowns.', category: 'energy', targetValue: 30, currentValue: 0, unit: 'kWh', points: 150, isCompleted: false, type: 'lifestyle' }
    ]);
    setAiNarrative("Your planetary ecosystem currently orbits in a Stable state. Small adjustments to your Kinetic travel loops will move your sphere toward healthy green thermal alignment.");
    setAiObservations([
      "Transit grids generate the primary thermal reflection shield of your sphere.",
      "Nutrition metrics trace a standard omnivorous mixed protein model.",
      "Household energy indices remain within optimal safety buffers."
    ]);
    setIsLoading(false);
  };

  const loadSessionData = async (userId: string) => {
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${userId}`, 'Content-Type': 'application/json' };
      
      const [profileRes, telemetryRes, analyticsRes, missionsRes, recommendationsRes] = await Promise.all([
        fetch('/api/profile', { headers }),
        fetch('/api/telemetry', { headers }),
        fetch('/api/analytics', { headers }),
        fetch('/api/missions', { headers }),
        fetch('/api/recommendations', { headers })
      ]);

      const profJson = await profileRes.json();
      const telJson = await telemetryRes.json();
      const anaJson = await analyticsRes.json();
      const misJson = await missionsRes.json();
      const recJson = await recommendationsRes.json();

      setProfile(profJson.profile);
      setTelemetry(telJson.telemetry);
      setHistory(anaJson.history);
      setMissions(misJson.missions);
      setRecommendations(recJson.recommendations || GUEST_RECOMMENDATIONS);

      // Trigger Gemini assessments synchronously
      fetchAiInsightsForUser(userId);
    } catch (e) {
      console.error('Failed to load session databases:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAiInsightsForUser = async (userId: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userId}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data && !data.error) {
        setAiNarrative(data.sustainabilityNarrative);
        setAiObservations(data.observations || []);
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
        }
      }
    } catch (err) {
      console.error('Gemini Insights transmission failure:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('ecotrack_user', JSON.stringify(data.user));
        localStorage.setItem('ecotrack_userid', data.user.id);
        await loadSessionData(data.user.id);
        return true;
      } else {
        throw new Error(data.error || 'Authentication rejected by database core.');
      }
    } catch (err: any) {
      alert(err.message || 'Ecosystem credentials could not be updated.');
      return false;
    }
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('ecotrack_user', JSON.stringify(data.user));
        localStorage.setItem('ecotrack_userid', data.user.id);
        await loadSessionData(data.user.id);
        return true;
      } else {
        throw new Error(data.error || 'Identity declaration rejected.');
      }
    } catch (err: any) {
      alert(err.message || 'Identity register error.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecotrack_user');
    localStorage.removeItem('ecotrack_userid');
    loadGuestData();
  };

  const updateCarbonProfile = async (update: Partial<CarbonProfile>) => {
    if (!user) {
      // Local Guest calculations
      const newProf = { ...profile!, ...update } as CarbonProfile;
      // Do instant simple client calculation
      const car = (newProf.carTravel * 52 * 0.18) / 1000;
      const bus = (newProf.busTravel * 52 * 0.08) / 1000;
      const train = (newProf.trainTravel * 52 * 0.04) / 1000;
      const electricity = (newProf.electricityUsage * 12 * 0.35) / 1000;
      const food = newProf.foodChoice === 'vegetarian' ? 1.5 : newProf.foodChoice === 'non-vegetarian' ? 3.3 : 2.2;
      const waste = newProf.wasteChoice === 'low' ? 0.2 : newProf.wasteChoice === 'high' ? 0.9 : 0.5;
      
      const score = car + bus + train + electricity + food + waste;
      newProf.calculatedFootprint = parseFloat(score.toFixed(2));
      newProf.status = score < 3.0 ? 'Healthy' : score < 6.0 ? 'Stable' : score < 10.0 ? 'Warning' : 'Critical';
      
      setProfile(newProf);
      // update guest telemetry
      setTelemetry({
        ecoIndex: Math.round(Math.max(5, Math.min(98, 100 - (score * 6)))),
        planetStatus: newProf.status,
        trend: score < 4.0 ? 'improving' : score < 8.0 ? 'stable' : 'declining',
        carbonFootprint: newProf.calculatedFootprint,
        forecast: `${newProf.status} environment state. Transit and electricity parameters aligned.`,
        topSource: car > electricity ? 'Transportation Grid' : 'Household Energy Feed'
      });
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        
        // Refresh telemetry & analytics history on carbon update
        const [telRes, anaRes] = await Promise.all([
          fetch('/api/telemetry', { headers: { 'Authorization': `Bearer ${user.id}` } }),
          fetch('/api/analytics', { headers: { 'Authorization': `Bearer ${user.id}` } })
        ]);
        const telJson = await telRes.json();
        const anaJson = await anaRes.json();
        setTelemetry(telJson.telemetry);
        setHistory(anaJson.history);

        // Fetch new Gemini Narrative
        fetchAiInsightsForUser(user.id);
      }
    } catch (e) {
      console.error('Failed updating carbon metrics:', e);
    }
  };

  const toggleMissionStatus = async (id: string) => {
    if (!user) {
      setMissions(prev => 
        prev.map(m => m.id === id ? { ...m, isCompleted: !m.isCompleted, currentValue: !m.isCompleted ? m.targetValue : 0 } : m)
      );
      return;
    }

    try {
      const res = await fetch(`/api/missions/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.missions) {
        setMissions(data.missions);
      }
    } catch (err) {
      console.error('Failed toggling mission protocol:', err);
    }
  };

  const fetchAiInsights = async () => {
    if (user) {
      await fetchAiInsightsForUser(user.id);
    }
  };

  const updateAnonymousProfile = (prof: CarbonProfile) => {
    setProfile(prof);
  };

  return (
    <EcoContext.Provider value={{
      user,
      profile,
      telemetry,
      history,
      missions,
      recommendations,
      aiNarrative,
      aiObservations,
      isLoading,
      isAiLoading,
      login,
      register,
      logout,
      updateCarbonProfile,
      toggleMissionStatus,
      fetchAiInsights,
      updateAnonymousProfile
    }}>
      {children}
    </EcoContext.Provider>
  );
};

export const useEco = () => {
  const context = useContext(EcoContext);
  if (context === undefined) {
    throw new Error('useEco mechanical error: context hook executed outside EcoProvider.');
  }
  return context;
};
