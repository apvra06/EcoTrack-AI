/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Globe, Leaf, Compass, Sparkles, TrendingUp, TrendingDown, RefreshCw, Activity, Layers, Utensils, Zap, Trash2, Car } from 'lucide-react';
import { EcoHealthStatus } from '../types';

export interface PlanetSystemProps {
  // Traditional compatibility props
  status?: EcoHealthStatus;
  profileScore?: number;
  details?: {
    transport: number;
    energy: number;
    food: number;
    waste: number;
  };

  // Direct modern centerpiece props requested
  planetState?: 'healthy' | 'stable' | 'warning' | 'critical' | 'Healthy' | 'Stable' | 'Warning' | 'Critical';
  ecoScore?: number;
  predictedEmission?: number | string;
  biggestSource?: string;
  trend?: string;
  observations?: string[];
  compact?: boolean;
}

// Cinematic Details for different Environmental Integrity States
const STATE_DETAILS = {
  healthy: {
    color: '#22C55E',
    shadowColor: 'rgba(34, 197, 94, 0.45)', // Emerald
    textAccent: 'text-[#22C55E]',
    glowClass: 'shadow-[0_0_65px_rgba(34,197,94,0.45)]',
    coreScale: [0.95, 1.15],
    atmosScale: [1.02, 1.08],
    auraPulseSpeed: 3.5,
    title: 'EQUILIBRIUM STANDARD',
    statusLabel: 'Planet Healthy',
    statusDesc: 'Atmospheric Sinks Resonant',
    indicatorGlow: 'bg-[#22C55E] shadow-[0_0_12px_#22C55E]',
    vitality: 'Gentle Pulse & Bright Vitality',
  },
  stable: {
    color: '#38BDF8',
    shadowColor: 'rgba(56, 189, 248, 0.4)', // Ocean Blue
    textAccent: 'text-[#38BDF8]',
    glowClass: 'shadow-[0_0_55px_rgba(56,189,248,0.35)]',
    coreScale: [0.97, 1.08],
    atmosScale: [1.01, 1.05],
    auraPulseSpeed: 5.0,
    title: 'STABLE SINK EQUILIBRIUM',
    statusLabel: 'Planet Stable',
    statusDesc: 'Healthy Localized Footprint',
    indicatorGlow: 'bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]',
    vitality: 'Calm Atmosphere & Safe Sinks',
  },
  warning: {
    color: '#F59E0B',
    shadowColor: 'rgba(245, 158, 11, 0.45)', // Amber
    textAccent: 'text-[#F59E0B]',
    glowClass: 'shadow-[0_0_60px_rgba(245,158,11,0.35)]',
    coreScale: [0.98, 1.05],
    atmosScale: [1.0, 1.03],
    auraPulseSpeed: 2.5,
    title: 'THERMAL FLUX INDICATOR',
    statusLabel: 'Sensory Warning',
    statusDesc: 'Atmospheric Sinks Buffering',
    indicatorGlow: 'bg-[#F59E0B] shadow-[0_0_12px_#F59E0B]',
    vitality: 'Amber Flux & Convective Stress',
  },
  critical: {
    color: '#EF4444',
    shadowColor: 'rgba(239, 68, 68, 0.6)', // Deep Red
    textAccent: 'text-[#EF4444]',
    glowClass: 'shadow-[0_0_75px_rgba(239,68,68,0.55)]',
    coreScale: [0.92, 1.2],
    atmosScale: [1.03, 1.12],
    auraPulseSpeed: 1.2,
    title: 'ECOLOGICAL OVERLAPPING BREACH',
    statusLabel: 'Critical Stress',
    statusDesc: 'Feedback Loop Destabilizing',
    indicatorGlow: 'bg-[#EF4444] shadow-[0_0_16px_#EF4444] animate-ping',
    vitality: 'Warning Pulse & Overheat Haze',
  },
};

export default function PlanetSystem({
  status,
  profileScore,
  details,
  planetState,
  ecoScore,
  predictedEmission,
  biggestSource,
  trend,
  observations,
  compact = false,
}: PlanetSystemProps) {

  // Normalise physical and environmental properties
  const normalizedState = useMemo(() => {
    const raw = (planetState || status || 'Stable').toLowerCase();
    if (raw.includes('health')) return 'healthy';
    if (raw.includes('warn')) return 'warning';
    if (raw.includes('crit')) return 'critical';
    return 'stable';
  }, [planetState, status]);

  const stateDetails = STATE_DETAILS[normalizedState] || STATE_DETAILS.stable;

  const currentEcoScore = useMemo(() => {
    if (ecoScore !== undefined) return ecoScore;
    if (profileScore !== undefined) {
      // Scale profile score (tonnes/yr) into a 0 to 100 ecosystem integrity index (lower footprint is higher index)
      return Math.max(10, Math.min(100, Math.round(100 - profileScore * 8.5)));
    }
    return 83;
  }, [ecoScore, profileScore]);

  const currentEmission = useMemo(() => {
    if (predictedEmission !== undefined) return predictedEmission;
    if (profileScore !== undefined) return profileScore;
    return 4.58;
  }, [predictedEmission, profileScore]);

  const currentTrend = useMemo(() => {
    if (trend) return trend;
    return 'Positive';
  }, [trend]);

  const currentBiggestSource = useMemo(() => {
    if (biggestSource) return biggestSource;
    if (details) {
      const { transport, energy, food, waste } = details;
      const maxVal = Math.max(transport || 0, energy || 0, food || 0, waste || 0);
      if (maxVal === transport) return 'Transportation';
      if (maxVal === energy) return 'Energy';
      if (maxVal === food) return 'Nutrition';
      return 'Waste';
    }
    return 'Transport';
  }, [biggestSource, details]);

  // Fallback default observations if none are calculated/passed
  const displayObservations = useMemo(() => {
    if (observations && observations.length > 0) return observations;
    return [
      "Mobility contributes more emissions than household energy usage.",
      "Your environmental profile indicates highly sustainable behavior.",
      "Transportation remains the dominant emission source.",
      "Future emissions are projected to decrease by 12%."
    ];
  }, [observations]);

  // Helper icons representing sources of emissions
  const getSourceIcon = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('food') || s.includes('nutri')) return <Utensils className="w-5 h-5" />;
    if (s.includes('elect') || s.includes('energy') || s.includes('thermal')) return <Zap className="w-5 h-5" />;
    if (s.includes('waste') || s.includes('recycle')) return <Trash2 className="w-5 h-5" />;
    return <Car className="w-5 h-5" />;
  };

  // Circular planet presentation
  const planetVisual = (
    <div className="planet-system-container relative flex flex-col items-center justify-center p-2 select-none w-full max-w-[480px]">

      {/* Floating Earth Sphere Wrapper */}
      <motion.div
        animate={{
          y: [-8, 8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full flex items-center justify-center z-20"
      >
        
        {/* Central Environmental Energy Glow (Borders extending beyond Earth - Centered & floating in lockstep) */}
        <motion.div
          animate={{
            scale: stateDetails.coreScale,
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: stateDetails.auraPulseSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full blur-[80px] pointer-events-none mix-blend-screen transition-all duration-1000"
          style={{ backgroundColor: stateDetails.color }}
        />
        
        {/* POETIC SPECTROMETER ATMOSPHERE SHADOW */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-1000 opacity-90 mix-blend-color-dodge ring-1 ring-white/10"
          style={{ background: 'radial-gradient(circle, rgba(16,27,45,0.7) 0%, rgba(8,17,31,0.2) 100%)' }}
        />

        {/* GLOWING ATMOSPHERIC BLOOM */}
        <motion.div 
          animate={{
            scale: stateDetails.atmosScale,
          }}
          transition={{
            duration: stateDetails.auraPulseSpeed / 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className={`absolute inset-[-4px] rounded-full filter blur-[10px] transition-all duration-1000 border-2 opacity-65 ${stateDetails.glowClass}`} 
          style={{ borderColor: stateDetails.color }}
        />

        {/* HIGH QUALITY EARTH IMAGE WITH PERFECT MAPPING CIRCLE */}
        <div className="absolute inset-[6px] rounded-full overflow-hidden bg-[#050D19] border border-slate-800/80 shadow-inner">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png"
            alt="Living Earth Digital Twin"
            className="w-full h-full object-cover select-none pointer-events-none opacity-90 scale-102"
            referrerPolicy="no-referrer"
          />

          {/* Dynamic state shade overlays to represent ecological warning, stable, or heavy stresses */}
          <div 
            className="absolute inset-0 transition-all duration-1000 mix-blend-soft-light opacity-65 pointer-events-none"
            style={{ 
              background: normalizedState === 'healthy' ? 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 80%)' :
                          normalizedState === 'stable' ? 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 80%)' :
                          normalizedState === 'warning' ? 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 80%)' :
                          'radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 80%)'
            }}
          />

          {/* Spherical Shadow overlay simulating night/day contrast and spatial depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,transparent_35%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
        </div>

        {/* THREE ANIMATED CONCENTRIC GLASS ENERGY RINGS (Centered in lockstep inside float wrapper) */}
        <svg 
          viewBox="0 0 420 420"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none overflow-visible z-10"
        >
          <defs>
            <radialGradient id={`glow-${normalizedState}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={stateDetails.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={stateDetails.color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit Line 1: Inner (Dashed style, fast rotation) */}
          <motion.g 
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 210px" }}
          >
            <ellipse cx="210" cy="210" rx="150" ry="145" fill="none" stroke={stateDetails.color} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6, 12" />
            <circle r="4.5" fill={stateDetails.color} className="shadow-lg">
              <animateMotion dur="7s" repeatCount="indefinite" path="M 60,210 A 150,145 0 1,1 360,210 A 150,145 0 1,1 60,210" />
            </circle>
          </motion.g>

          {/* Orbit Line 2: Middle (Elegant Glassy Wave line, reverse speed) */}
          <motion.g 
            animate={{ rotate: -360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 210px" }}
          >
            <ellipse cx="210" cy="210" rx="180" ry="170" fill="none" stroke={stateDetails.color} strokeWidth="1.2" strokeOpacity="0.18" />
            {/* Travelling energy particles glowing up the line */}
            <circle r="4" fill="#FFFFFF" className="blur-[0.5px]">
              <animateMotion dur="12s" repeatCount="indefinite" path="M 30,210 A 180,170 0 1,1 390,210 A 180,170 0 1,1 30,210" />
            </circle>
            <circle r="3" fill="#C9A45C">
              <animateMotion dur="11s" repeatCount="indefinite" path="M 210,40 A 180,170 0 1,1 210,380 A 180,170 0 1,1 210,40" />
            </circle>
          </motion.g>

          {/* Orbit Line 3: Outer (Double tech-tick circle, slow and deep pacing) */}
          <motion.g 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 210px" }}
          >
            <ellipse cx="210" cy="210" rx="210" ry="195" fill="none" stroke={stateDetails.color} strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="30, 100, 5, 20" />
            <circle r="5" fill={stateDetails.color} className="shadow-[0_0_8px_#FFF]">
              <animateMotion dur="20s" repeatCount="indefinite" path="M 0,210 A 210,195 0 1,1 420,210 A 210,195 0 1,1 0,210" />
            </circle>
          </motion.g>

          {/* ORGANIC GEODESIC CONSTELLATION WEB OVERLAY */}
          <g>
            <line x1="90" y1="130" x2="310" y2="330" stroke={stateDetails.color} strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="3,3" />
            <line x1="330" y1="160" x2="120" y2="310" stroke={stateDetails.color} strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="3,3" />
            <circle cx="90" cy="130" r="2" fill={stateDetails.color} opacity="0.4" />
            <circle cx="310" cy="330" r="2" fill={stateDetails.color} opacity="0.4" />
            <circle cx="330" cy="160" r="2" fill={stateDetails.color} opacity="0.4" />
            <circle cy="310" cx="120" r="2" fill={stateDetails.color} opacity="0.4" />
          </g>
        </svg>

        {/* FLOATING AMBIENT ELECTRIC PARTICLES (Dust sparks) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-30, 30],
                x: [-20, 20],
                scale: [0.5, 1.2, 0.5],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: i * 0.7,
              }}
              className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px]"
              style={{
                top: `${20 + i * 14}%`,
                left: `${15 + i * 13}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* SPACECRAFT TELEMETRY DOCK (Positioned beautifully beneath Earth) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.3 }}
        className="w-full mt-6 frosted-glass rounded-2xl py-4 px-6 border border-white/[0.04] grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/65 shadow-2xl relative overflow-hidden select-none"
      >
        {/* Technical crosshairs framing telemetry */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-slate-700/60" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-slate-700/60" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-slate-700/60" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-slate-700/60" />

        {/* Telemetry Col 1: Eco Index */}
        <div className="pb-3 sm:pb-0 sm:pr-4 flex flex-col justify-center">
          <span className="text-[9px] font-mono tracking-[0.25em] text-slate-500 block">ECO INDEX</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-4xl font-extrabold font-sans tracking-tight ${stateDetails.textAccent}`}>
              {currentEcoScore}
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold uppercase">/ 100</span>
          </div>
        </div>

        {/* Telemetry Col 2: Planet Status */}
        <div className="py-3 sm:py-0 sm:px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900/35 overflow-hidden">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-1000 ${stateDetails.indicatorGlow} bg-opacity-10`}>
              <Leaf className={`w-4 h-4 text-white p-0.5`} />
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-[white] leading-tight flex items-center gap-1.5 capitalize">
              {stateDetails.statusLabel}
            </h5>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-none">
              {stateDetails.statusDesc}
            </p>
          </div>
        </div>

        {/* Telemetry Col 3: Trend & Speed */}
        <div className="pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center">
          <span className="text-[9px] font-mono tracking-[0.25em] text-slate-500 block">TREND</span>
          <div className="flex items-center gap-2 mt-1">
            {currentTrend.toLowerCase() === 'positive' || currentTrend.toLowerCase() === 'improving' ? (
              <>
                <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                <span className="text-sm font-bold text-[#22C55E] uppercase tracking-wider font-sans">Positive</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-[#EF4444]" />
                <span className="text-sm font-bold text-[#EF4444] uppercase tracking-wider font-sans">Instationary</span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Render Compact sidebar widget
  if (compact) {
    return (
      <div className="relative flex flex-col items-center justify-center w-full min-h-[420px]">
        {planetVisual}
      </div>
    );
  }

  // Render complete double-grid observatory dashboard centered around the planet
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-7xl mx-auto py-4">
      
      {/* LEFT COLUMN: NARRATIVES AND FLOATING OBSERVATION REPORT FRAGMENTS */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-8 h-full bg-transparent">
        
        {/* Cinematic Title Block */}
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#C9A45C] font-mono uppercase tracking-[0.3em] font-semibold select-none">
            <span>AI OBSERVATORY</span>
            <div className="w-16 h-[0.5px] bg-gradient-to-r from-[#C9A45C] to-transparent" />
          </div>

          <motion.h2 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="font-serif italic font-medium text-3xl sm:text-4xl lg:text-5xl tracking-normal text-brand-text mt-3 mb-4 leading-tight"
          >
            Environmental <br />Intelligence Report
          </motion.h2>

          <p className="text-[#94A3B8] text-xs sm:text-sm font-sans font-light leading-relaxed max-w-lg">
            EcoTrack AI continuously analyzes your lifestyle patterns and reconstructs the environmental story hidden within your data.
          </p>
        </div>

        {/* Dynamic active observatory pill */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/10 bg-green-500/5 text-[9px] font-mono tracking-[0.18em] text-[#22C55E] w-fit select-none">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="font-semibold">AI OBSERVATORY ACTIVE</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">REAL-TIME MOLECULAR SIMULATION</span>
        </div>

        {/* Two Floating bento-glass reports side-by-side matches image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          
          {/* Card 1: Sustainability Status */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(201, 164, 92, 0.25)' }}
            className="gold-glass rounded-2xl p-5 pl-6 relative overflow-hidden select-none border border-white/[0.04] transition-all duration-300"
          >
            <div className="absolute top-4 right-4 text-brand-gold opacity-55">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            
            {/* Circle with Leaf inside */}
            <div className={`w-9 h-9 rounded-full bg-green-500/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] mb-5`}>
              <Leaf className="w-4 h-4" />
            </div>

            <span className="text-[9px] font-mono tracking-widest text-[#B0B0C0] uppercase">Sustainability Status</span>
            <h4 className="font-serif mt-1 mb-3 text-lg font-medium text-white italic tracking-wide">
              {normalizedState === 'healthy' ? 'Highly Sustainable' : 
               normalizedState === 'stable' ? 'Stable Equilibrium' :
               normalizedState === 'warning' ? 'Dynamic Flux' : 'High Friction Threshold'}
            </h4>

            {/* Glowing gauge line */}
            <div className="w-full bg-slate-900/60 h-[3px] rounded-full overflow-hidden mb-4 relative">
              <div 
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                style={{ 
                  backgroundColor: stateDetails.color,
                  width: `${currentEcoScore}%`,
                  boxShadow: `0 0 8px ${stateDetails.color}` 
                }}
              />
            </div>

            <p className="text-[11px] text-slate-400 font-sans font-light leading-relaxed">
              {normalizedState === 'healthy' || normalizedState === 'stable'
                ? "Your environmental profile indicates highly sustainable behavior. Keep up the awesome work!"
                : "Your lifestyle pattern triggers convection stress. Engaging optimization scripts is advised."}
            </p>
          </motion.div>

          {/* Card 2: Dominant Source */}
          <motion.div
            whileHover={{ y: -4, borderColor: 'rgba(201, 164, 92, 0.25)' }}
            className="gold-glass rounded-2xl p-5 pl-6 relative overflow-hidden select-none border border-white/[0.04] transition-all duration-300"
          >
            <div className="absolute top-4 right-4 text-brand-gold opacity-55">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            
            {/* Circle with custom emission source icon */}
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-5">
              {getSourceIcon(currentBiggestSource)}
            </div>

            <span className="text-[9px] font-mono tracking-widest text-[#B0B0C0] uppercase">Dominant Emission Source</span>
            <h4 className="font-serif mt-1 mb-3 text-lg font-medium text-white italic tracking-wide">
              {currentBiggestSource}
            </h4>

            {/* Glowing gauge line (orange for warning aspects) */}
            <div className="w-full bg-slate-900/60 h-[3px] rounded-full overflow-hidden mb-4 relative">
              <div 
                className="absolute left-0 top-0 h-full rounded-full bg-amber-500 transition-all duration-1000"
                style={{ 
                  width: normalizedState === 'healthy' ? '30%' : normalizedState === 'stable' ? '45%' : '75%',
                  boxShadow: '0 0 8px #F59E0B'
                }}
              />
            </div>

            <p className="text-[11px] text-slate-400 font-sans font-light leading-relaxed">
              {currentBiggestSource.includes('nutrition') || currentBiggestSource.includes('Food') 
                ? "Food consumption contributes heavily to your carbon footprint. Consider more sustainable choice blocks."
                : "Transportation remains the dominant emission source. Opting for pooled or electric transit shifts the vector."}
            </p>
          </motion.div>

        </div>

        {/* Cinematic micro-bullets representing intelligence fragments */}
        <div className="bg-slate-950/20 rounded-2xl p-4 border border-slate-900/80 mt-2 select-none">
          <span className="text-[8px] font-mono text-[#C9A45C] tracking-[0.25em] block uppercase mb-2">INTELLIGENCE FRAGMENTS</span>
          <div className="space-y-1.5">
            {displayObservations.slice(0, 3).map((obs, oIdx) => (
              <div key={oIdx} className="flex items-center gap-2.5 text-[11px] text-slate-300 font-sans font-light leading-normal">
                <span className="text-[#C9A45C]">✦</span>
                <p>{obs}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: EARTH ORB VISUALIZATION CONTAINER */}
      <div className="lg:col-span-5 flex items-center justify-center relative min-h-[500px]">
        {planetVisual}
      </div>

    </div>
  );
}
