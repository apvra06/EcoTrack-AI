/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { Compass, Sliders, Feather, Sparkles, AlertCircle, Leaf, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { recommendations, user, logout } = useEco();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-[#Ef4444]/10 text-[#Ef4444] border-[#Ef4444]/25';
      case 'Medium': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25';
      case 'Low':
      default:
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/25';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Hard': return 'bg-slate-700/10 text-[#94A3B8] border-slate-700/20';
      case 'Medium': return 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/25';
      case 'Easy':
      default:
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/25';
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-bg atmospheric-ambient text-brand-text overflow-x-hidden pb-12">
      <div className="absolute inset-0 thin-lines pointer-events-none opacity-20" />
      
      {/* Backlight glow */}
      <div className="absolute top-[20%] left-[20%] w-[420px] h-[420px] rounded-full bg-brand-gold/1 blur-[120px] pointer-events-none" />

      {/* TOP DECORATIVE NAV BAR */}
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
          <button onClick={() => navigate('/missions')} className="hover:text-brand-text transition-colors uppercase">MISSIONS</button>
          <button onClick={() => navigate('/recommendations')} className="text-brand-gold font-semibold uppercase">RECOMMENDATIONS</button>
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

      {/* BODY CONTEXT CARDS SECTION */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 relative z-10 space-y-8 select-none text-left">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#C9A45C]">Ecosystem Thermal Relief</span>
            <h2 className="font-serif italic font-medium text-3xl tracking-wide text-brand-gold mt-1">AI Recommendation Console</h2>
          </div>
          <div className="bg-slate-950/70 border border-slate-900/60 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono text-[#22C55E]">
            <Leaf className="w-4 h-4 text-[#22C55E]" />
            <span>CLIMATE SINK OFFSET CAPACITY LOGGED</span>
          </div>
        </div>

        {/* RECOM CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List of customized recommendations (Col-span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
              <h3 className="font-serif italic font-medium text-lg text-brand-gold tracking-wide">Tailored Atmospheric Interventions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((item) => (
                <div 
                  key={item.id}
                  className="gold-glass rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-brand-gold/30 transition-all duration-500 min-h-[300px]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-2">
                      <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border ${getImpactColor(item.impact)}`}>
                        {item.impact} Impact
                      </span>
                      <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded border ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty} Effort
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[7.5px] font-mono text-slate-500 tracking-widest uppercase">{item.category} optimization</span>
                      <h4 className="font-display font-medium text-sm text-brand-text uppercase leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-xs text-brand-muted leading-relaxed font-sans font-light">
                      {item.explanation}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-900/40 pt-4 flex justify-between items-end">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">ANNUAL CO₂ SAVINGS</p>
                      <p className="text-base font-bold text-[#22C55E] font-sans leading-none">{item.savings} <span className="text-[10px] text-slate-400 font-mono">KG</span></p>
                    </div>

                    <div className="flex -space-x-1">
                      {/* Atmospheric Leaf gauge visualization representing points of carbon bounds */}
                      {Array.from({ length: item.savings > 1000 ? 3 : item.savings > 400 ? 2 : 1 }).map((_, i) => (
                        <Leaf key={i} className="w-4 h-4 text-[#22C55E] fill-[#22C55E]/10 stroke-[1.8]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT OBSERVATION LOG (Col-span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="frosted-glass rounded-3xl p-6 border border-slate-905 space-y-4 select-none">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center border border-[#22C55E]/20 text-[#22C55E]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-display font-medium text-xs text-brand-text uppercase tracking-widest">Physics of intervention</h4>
              <p className="text-xs text-brand-muted font-sans font-light leading-relaxed">
                Applying action parameters reduces localized friction multipliers. When a directive is completed, the emission reduction translates to cooling indices that change your Interactive PlanetSystem immediately.
              </p>
              
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900/45">
                <span>ORACLE PIPELINE:</span>
                <span className="text-[#22C55E] font-medium uppercase">RESONATING</span>
              </div>
            </div>

            <div className="bg-slate-950/45 border border-slate-900 rounded-3xl p-6 space-y-3 font-mono text-[10px]">
              <span className="text-slate-500 uppercase block tracking-widest text-[8px] mb-2">INTELLIGENCE CHECKSUM LOGS</span>
              
              <div className="flex items-center gap-2 text-[#E2E8F0] uppercase">
                <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                <span>TRANSIT VECTOR OVERWEIGHT (1.8x)</span>
              </div>
              <p className="text-slate-500 text-[9px] font-sans font-light leading-relaxed">
                Atmospheric sensor readings confirmed high localized fuel combustion trails in your personal grid. Electrified transit parameters recommended under priority class HIGH.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
