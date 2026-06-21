/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import PlanetSystem from '../components/PlanetSystem';
import { motion } from 'motion/react';
import { Sparkles, Shield, RefreshCw, Layers, Compass, TrendingUp, TrendingDown, Eye, Activity, Sliders, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    user, 
    profile, 
    telemetry, 
    aiNarrative, 
    aiObservations, 
    isAiLoading, 
    fetchAiInsights,
    logout 
  } = useEco();

  // If there is no profile, make sure they are redirected to calculator, or load default guest profiles
  useEffect(() => {
    if (!profile) {
      // Just loaded guest
    }
  }, [profile]);

  const getHealthBorder = (status?: string) => {
    switch (status) {
      case 'Healthy': return 'border-l-4 border-l-[#22C55E]';
      case 'Stable': return 'border-l-4 border-l-[#38BDF8]';
      case 'Warning': return 'border-l-4 border-l-[#F59E0B]';
      case 'Critical': return 'border-l-4 border-l-[#EF4444]';
      default: return 'border-slate-800';
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-[#22C55E]" />;
    return <TrendingDown className="w-4 h-4 text-[#EF4444]" />;
  };

  const currentFootprint = profile?.calculatedFootprint || 4.58;
  const currentStatus = profile?.status || 'Stable';

  // Calculate detailed fractions for orbit sizing
  const transportFraction = profile ? (
    ((profile.carTravel * 52 * 0.18 + profile.busTravel * 52 * 0.08 + profile.trainTravel * 52 * 0.04) / 1000)
  ) : 1.9;

  const energyFraction = profile ? (
    ((profile.electricityUsage * 12 * 0.35) / 1000)
  ) : 1.25;

  const foodFraction = profile ? (
    (profile.foodChoice === 'vegetarian' ? 1.5 : profile.foodChoice === 'non-vegetarian' ? 3.3 : 2.2)
  ) : 2.2;

  const wasteFraction = profile ? (
    (profile.wasteChoice === 'low' ? 0.2 : profile.wasteChoice === 'high' ? 0.9 : 0.5)
  ) : 0.5;

  return (
    <div className="relative min-h-screen bg-brand-bg atmospheric-ambient text-brand-text overflow-x-hidden pb-12">
      {/* Thin grid backdrop lines */}
      <div className="absolute inset-0 thin-lines pointer-events-none opacity-20" />

      {/* Auroral blurs */}
      <div className="absolute top-[5%] right-[10%] w-[420px] h-[420px] rounded-full bg-brand-blue/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[420px] h-[420px] rounded-full bg-brand-gold/2 blur-[120px] pointer-events-none" />

      {/* TOP NAVIGATION HEADER */}
      <header className="relative z-10 sticky top-0 frosted-glass border-b border-white/[0.04] px-6 py-4 flex justify-between items-center bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full border border-[#C9A45C] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full blur-[1px]"></div>
          </div>
          <div>
            <h1 className="font-serif italic font-medium text-sm text-brand-gold tracking-wide leading-none">
              EcoTrack <span className="text-brand-text">AI</span>
            </h1>
            <p className="text-[8px] text-brand-muted tracking-[0.15em] font-mono leading-none mt-0.5">OBSERVATORY CORE v1.0</p>
          </div>
        </div>

        {/* Global observatory tabs navigation bar */}
        <nav className="hidden md:flex items-center gap-6 text-[10px] font-mono tracking-widest text-[#94A3B8]">
          <button onClick={() => navigate('/dashboard')} className="text-brand-gold font-semibold uppercase">OBSERVATORY</button>
          <button onClick={() => navigate('/analytics')} className="hover:text-brand-text transition-colors uppercase">CHARTS</button>
          <button onClick={() => navigate('/missions')} className="hover:text-brand-text transition-colors uppercase">MISSIONS</button>
          <button onClick={() => navigate('/recommendations')} className="hover:text-brand-text transition-colors uppercase">RECOMMENDATIONS</button>
          <button onClick={() => navigate('/calculator')} className="flex items-center gap-1 hover:text-brand-text text-slate-400 transition-colors uppercase">
            <Sliders className="w-3 H-3" /> ADAPT CORES
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="text-[8px] font-mono tracking-[0.15em] text-slate-500 uppercase block">ACTIVE COMMANDER</span>
            <span className="text-[11px] font-display text-brand-text font-medium">{user?.name || 'Observer Guest'}</span>
          </div>
          <button 
            onClick={logout} 
            className="px-3.5 py-1.5 rounded-full border border-slate-800 text-[9px] font-mono tracking-widest text-slate-500 hover:text-brand-red hover:border-brand-red/30 transition-all duration-300 uppercase cursor-pointer"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 relative z-10">
        
        {/* UPPER STATUS SUMMARY BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-slate-950/20 border-b border-slate-900 pb-5">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand-gold">PLANETARY OBSERVATION SYSTEM</span>
            <h2 className="font-serif italic font-medium text-3xl tracking-wide text-brand-gold mt-1">Ecosystem Observatory</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Sync trigger button to refresh Gemini Insights manually */}
            <button
              onClick={fetchAiInsights}
              disabled={isAiLoading}
              className="px-4 py-2 rounded-full frosted-glass border border-slate-800 text-[10px] font-mono tracking-widest text-[#94A3B8] hover:text-brand-gold hover:border-brand-gold/40 flex items-center gap-2 duration-300 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              {isAiLoading ? 'REQUANTIZING PLANET COGNITION...' : 'REQUANTIZE AI ANALYSIS'}
            </button>
            <button
              onClick={() => navigate('/calculator')}
              className="px-4 py-2 rounded-full bg-brand-gold text-brand-bg text-[10px] font-mono tracking-widest uppercase font-semibold flex items-center gap-1 hover:scale-103 duration-300 shadow-lg shadow-brand-gold/15"
            >
              LAUNCH SIMULATOR <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PLANET INTELLIGENCE SYSTEM CENTERPIECE */}
        <div className="mb-8">
          <PlanetSystem
            planetState={currentStatus as any}
            ecoScore={telemetry?.ecoIndex || 83}
            predictedEmission={currentFootprint}
            biggestSource={telemetry?.topSource || 'Transportation Grid'}
            trend={telemetry?.trend === 'improving' ? 'Positive' : 'Stable'}
            observations={aiObservations}
          />
        </div>

        {/* ACTIVE RECOMMENDATION ACTION MODULE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="frosted-glass rounded-3xl p-6 border border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-brand-gold/25 duration-500 bg-slate-950/25 max-w-7xl mx-auto w-full select-none"
        >
          <div className="space-y-1">
            <h4 className="font-serif italic font-medium text-lg text-brand-text">Active Reduction Recommendation Modules</h4>
            <p className="text-xs text-brand-muted font-sans font-light max-w-xl leading-relaxed">
              Our Gemini engines have analyzed your carbon signature, structuring actionable target lists mapping thermal savings against lifestyle difficulty.
            </p>
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="px-5 py-2.5 rounded-full border border-slate-800 text-[10px] font-mono tracking-wider font-semibold text-brand-gold hover:bg-brand-gold/10 duration-300 w-full sm:w-auto text-center cursor-pointer transition-all"
          >
            ENGAGE RECOMMENDED SYSTEMS
          </button>
        </motion.div>

      </main>
    </div>
  );
}
