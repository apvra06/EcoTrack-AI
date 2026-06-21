/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { Compass, Sliders, CheckCircle2, Circle, Flame, Sparkles, Trophy, Award, Lock } from 'lucide-react';

export default function MissionsPage() {
  const navigate = useNavigate();
  const { missions, toggleMissionStatus, user, logout } = useEco();

  // Calculate complete ratios for the cinematic progress circular ring
  const completedCount = missions.filter(m => m.isCompleted).length;
  const totalCount = missions.length || 1;
  const completePercentage = Math.round((completedCount / totalCount) * 100);

  // Total points earned
  const totalPointsEarned = missions.filter(m => m.isCompleted).reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="relative min-h-screen bg-brand-bg atmospheric-ambient text-brand-text overflow-x-hidden pb-12">
      <div className="absolute inset-0 thin-lines pointer-events-none opacity-20" />
      
      {/* Backlight projection */}
      <div className="absolute top-[30%] right-[15%] w-[420px] h-[420px] rounded-full bg-[#22C55E]/2 blur-[120px] pointer-events-none" />

      {/* TOP REGULAR NAVBAR */}
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

        <nav className="hidden md:flex items-center gap-6 text-[10px] font-mono tracking-widest text-[#94A3B8]">
          <button onClick={() => navigate('/dashboard')} className="hover:text-brand-text transition-colors uppercase">OBSERVATORY</button>
          <button onClick={() => navigate('/analytics')} className="hover:text-brand-text transition-colors uppercase">CHARTS</button>
          <button onClick={() => navigate('/missions')} className="text-brand-gold font-semibold uppercase">MISSIONS</button>
          <button onClick={() => navigate('/recommendations')} className="hover:text-brand-text transition-colors uppercase">RECOMMENDATIONS</button>
          <button onClick={() => navigate('/calculator')} className="flex items-center gap-1 hover:text-brand-text text-slate-400 transition-colors uppercase">
            <Sliders className="w-3 h-3" /> ADAPT CORES
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="text-[8px] font-mono tracking-[0.15em] text-slate-500 uppercase block">ACTIVE COMMANDER</span>
            <span className="text-[11px] font-display text-brand-text font-medium">{user?.name || 'Observer Guest'}</span>
          </div>
          <button onClick={logout} className="px-3.5 py-1.5 rounded-full border border-slate-800 text-[9px] font-mono tracking-widest text-slate-500 hover:text-brand-red hover:border-brand-red/30 transition-all duration-300 uppercase cursor-pointer">
            DISCONNECT
          </button>
        </div>
      </header>

      {/* BODY CONTENT CARDS */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 relative z-10 space-y-8 select-none text-left">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#C9A45C]">Ecosystem Target Sinks</span>
            <h2 className="font-serif italic font-medium text-3xl tracking-wide text-brand-gold mt-1">Environmental Mission System</h2>
          </div>
          <div className="bg-slate-950/70 border border-slate-900/60 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono text-brand-gold">
            <Trophy className="w-4 h-4" />
            <span>SINKING SECTOR POINTS: {totalPointsEarned} GP</span>
          </div>
        </div>

        {/* BENTO CORES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SEC 1: DYNAMIC ACTIVE MISSION LIST (Col-span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              <h3 className="font-serif italic font-medium text-lg text-brand-gold tracking-wide">Target Directives</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {missions.map((mission) => (
                <div 
                  key={mission.id}
                  className={`gold-glass rounded-2xl p-6 border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 ${
                    mission.isCompleted ? 'border-[#22C55E]/30 bg-slate-950/20' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-2 max-w-lg">
                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-mono tracking-widest px-2 py-0.5 rounded uppercase ${
                        mission.category === 'transport' ? 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20' : 
                        mission.category === 'energy' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' :
                        mission.category === 'food' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' :
                        'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                      }`}>
                        {mission.category} target
                      </span>
                      <span className="font-mono text-[9px] text-[#C9A45C]">{mission.points} POINTS</span>
                    </div>

                    <h4 className={`font-display font-medium text-base text-brand-text ${
                      mission.isCompleted ? 'line-through opacity-55' : ''
                    }`}>
                      {mission.title}
                    </h4>
                    
                    <p className="text-xs text-brand-muted leading-relaxed font-sans font-light">
                      {mission.description}
                    </p>
                  </div>

                  {/* Manual Toggle Switch Button styled like high-end telemetry hardware */}
                  <button
                    onClick={() => toggleMissionStatus(mission.id)}
                    className={`px-5 py-2.5 rounded-full border text-[10px] font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 w-full md:w-auto justify-center active:scale-95 cursor-pointer ${
                      mission.isCompleted 
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/40 hover:bg-[#22C55E]/20' 
                        : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-brand-gold hover:border-brand-gold/40'
                    }`}
                  >
                    {mission.isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                        DIRECTIVE ACTIVE
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-slate-600" />
                        ENGAGE TARGET
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEC 2: CIRCULAR VISUAL PROGRESS RING (Col-span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="frosted-glass rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center select-none">
              <span className="text-[8px] font-mono tracking-widest text-[#C9A45C] uppercase mb-4 block">Ecosystem Sync Ratio</span>
              
              {/* Complex circular visual progress indicator */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Embedded SVG circular ring */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke={completePercentage > 0 ? '#C9A45C' : 'transparent'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={427}
                    strokeDashoffset={427 - (427 * completePercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-in-out"
                    style={{ filter: completePercentage > 0 ? 'drop-shadow(0 0 4px rgba(201,164,92,0.3))' : 'none' }}
                  />
                </svg>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-sans tracking-tight text-brand-text">
                    {completePercentage}%
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">ALIGNMENT</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-brand-muted font-sans font-light leading-relaxed max-w-xs">
                You have synchronized <span className="text-brand-gold font-semibold font-mono">{completedCount} of {totalCount}</span> planetary directives. Aligning targets will buffer your atmospheric convective sphere.
              </div>
            </div>

            {/* MILESTONE TROPHIES */}
            <div className="frosted-glass rounded-3xl p-6 space-y-4">
              <h4 className="font-display font-medium text-xs text-brand-gold uppercase tracking-wider">Milestone achievements</h4>
              
              <div className="space-y-3 font-mono text-[10px]">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/20 border border-slate-900/60">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-[#C9A45C]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-brand-text font-semibold uppercase leading-none">Pioneer Orbit</p>
                    <p className="text-slate-500 text-[8px] mt-0.5">Seeded baseline assessment [UNLOCKED]</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                  totalPointsEarned >= 200 ? 'bg-slate-950/20 border-slate-900/60' : 'opacity-40 border-slate-900/40'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    {totalPointsEarned >= 200 ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-brand-text font-semibold uppercase leading-none">Atmosphere Bufferer</p>
                    <p className="text-slate-500 text-[8px] mt-0.5">Reach 200 emission points [LOCKED]</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                  totalPointsEarned >= 400 ? 'bg-slate-950/20 border-slate-900/60' : 'opacity-40 border-slate-900/40'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
                    {totalPointsEarned >= 400 ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-brand-text font-semibold uppercase leading-none">Planetary Guardian</p>
                    <p className="text-slate-500 text-[8px] mt-0.5">Reach 400 emission points [LOCKED]</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
