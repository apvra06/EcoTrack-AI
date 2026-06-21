/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type EcoHealthStatus = 'Healthy' | 'Stable' | 'Warning' | 'Critical';

export interface CarbonProfile {
  id: string;
  userId: string;
  carTravel: number; // km per week
  busTravel: number; // km per week
  trainTravel: number; // km per week
  electricityUsage: number; // kWh per month
  foodChoice: 'vegetarian' | 'mixed' | 'non-vegetarian';
  wasteChoice: 'low' | 'medium' | 'high';
  calculatedFootprint: number; // tonnes of CO2e per year
  status: EcoHealthStatus;
  updatedAt: string;
}

export interface Telemetry {
  ecoIndex: number; // 0 to 100
  planetStatus: EcoHealthStatus;
  trend: 'improving' | 'stable' | 'declining';
  carbonFootprint: number; // tonnes CO2e/year
  forecast: string; // text prediction
  topSource: string; // e.g. "Transportation"
}

export interface IntelligenceInsight {
  id: string;
  text: string;
  category: 'critical' | 'alert' | 'positive' | 'neutral';
  timestamp: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'waste';
  targetValue: number;
  currentValue: number;
  unit: string;
  points: number;
  isCompleted: boolean;
  type: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'transport' | 'energy' | 'food' | 'waste';
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  savings: number; // kg of CO2e per year
  explanation: string;
}

export interface EmissionHistoryItem {
  period: string; // e.g., 'Jan', 'Feb' or year
  transport: number;
  energy: number;
  food: number;
  waste: number;
  total: number;
}
