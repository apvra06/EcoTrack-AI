/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { Compass, Sparkles, Activity, Shield, Feather, ChevronRight, Globe, Layers, Wind } from 'lucide-react';
import PlanetSystem from '../components/PlanetSystem';

export default function LandingPage() {
  const navigate = useNavigate();
  const { profile } = useEco();
  const [particleCount, setParticleCount] = useState<Array<{ id: number; x: number; y: number; s: number; d: number }>>([]);

  // Generate randomized cinematic environmental floating dust particles
  useEffect(() => {
    const list = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2.5 + 1.2,
      d: Math.random() * 5 + 4
    }));
    setParticleCount(list);
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-bg atmospheric-ambient text-brand-text overflow-hidden flex flex-col justify-between">
      {/* Absolute Thin Alignment Grid Lines */}
      <div className="absolute inset-0 thin-lines pointer-events-none opacity-45" />

      {/* Decorative Alignment Wires matching Artistic Flair style */}
      <div className="artistic-wire-left pointer-events-none" />
      <div className="artistic-wire-right pointer-events-none" />

      {/* Ambient Pulsing Sparkle Stars */}
      <div className="absolute top-20 left-40 w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse pointer-events-none"></div>
      <div className="absolute top-60 right-80 w-[2px] h-[2px] bg-white rounded-full blur-[1px] pointer-events-none"></div>

      {/* Blurry Golden Atmosphere Light Projections */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full bg-brand-blue/3 blur-[100px] pointer-events-none" />

      {/* Floating Cinematic Ambient Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particleCount.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-brand-gold/25"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}px`,
              height: `${p.s}px`
            }}
            animate={{
              y: ['0%', '-50%', '0%'],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: p.d * 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* TOP HEADER */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center bg-transparent border-b border-slate-900/35">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-[#C9A45C] flex items-center justify-center">
            <div className="w-4 h-4 bg-[#22C55E] rounded-full blur-[2px]"></div>
          </div>
          <div>
            <h1 className="font-serif italic font-medium text-lg text-brand-gold tracking-wider uppercase leading-none">
              EcoTrack <span className="text-brand-text">AI</span>
            </h1>
            <p className="text-[9px] text-brand-muted tracking-[0.15em] font-mono mt-0.5">ENVIRONMENTAL INTELLIGENCE</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono text-brand-muted uppercase tracking-widest">
          <a href="#metrics" className="hover:text-brand-gold transition-colors">PLANETARY METRICS</a>
          <a href="#features" className="hover:text-brand-gold transition-colors">OBSERVATORY</a>
          <a href="#about" className="hover:text-brand-gold transition-colors">THE POETICS OF CHOICE</a>
        </nav>

        <button 
          onClick={() => navigate('/auth')} 
          className="px-4 py-1.5 rounded-full gold-glass text-[11px] font-mono text-brand-gold uppercase tracking-wider hover:bg-brand-gold/10 transition-all duration-300 active:scale-95"
        >
          Initialize Console
        </button>
      </header>

      {/* MAIN CINEMATIC STORY-DRIVEN HERO SECTION */}
      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-6 flex flex-col justify-center py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Poetic Left Side Hero Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center select-none text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/40 border border-slate-800/60 rounded-full w-max text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold mb-6"
            >
              <Wind className="w-3.5 h-3.5 text-brand-gold animate-spin" style={{ animationDuration: '8s' }} />
              Planet Ecosystem Tracker
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-brand-text tracking-tight leading-[1.08] mb-6"
            >
              Every Choice <br />
              <span className="font-semibold text-brand-gold italic">Shapes A World</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.25 }}
              className="text-sm sm:text-base text-brand-muted leading-relaxed font-sans font-light max-w-lg mb-10"
            >
              EcoTrack AI transforms everyday decisions into a living planetary ecosystem. Reflecting carbon telemetry into a beautiful orbital sphere, your travel, food, and metabolic waste balances dictate real-time planetary weather.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="flex flex-wrap items-center gap-5"
            >
              <button 
                onClick={() => navigate('/calculator')}
                className="px-6 py-3 rounded-full bg-brand-gold text-brand-bg text-xs font-mono font-medium uppercase tracking-[0.150em] flex items-center gap-3 shadow-2xl shadow-brand-gold/25 hover:scale-[1.03] transition-all duration-300 hover:shadow-brand-gold/45 active:scale-95"
              >
                Enter Your Ecosystem
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="px-6 py-3 rounded-full frosted-glass border border-slate-700/60 text-xs font-mono text-brand-text uppercase tracking-[0.150em] flex items-center gap-2 hover:bg-slate-900/40 hover:border-brand-gold/30 transition-all duration-300"
              >
                Continue Journey
              </button>
            </motion.div>
          </div>

          {/* Living Interactive Planetary Graphic Right Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.1 }}
            className="lg:col-span-5 flex justify-center py-6"
          >
            <div className="relative border border-slate-800/10 rounded-3xl p-4 bg-[radial-gradient(circle_at_center,rgba(16,27,45,0.4)_0%,transparent_80%)]">
              <PlanetSystem 
                status="Stable" 
                profileScore={4.58} 
                details={{ transport: 1.9, energy: 1.2, food: 1.1, waste: 0.38 }} 
                compact={true}
              />
              
              {/* Abs Floating Overlay indicators showing ecosystem integrity */}
              <div className="absolute top-8 right-6 frosted-glass py-1.5 px-3 rounded-full border border-slate-800 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#22C55E]">
                <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
                ORBIT STABLE [72%]
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* FEATURE TILES SECTION (Ecosystem Features, AI observations display) */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 border-t border-slate-900/35">
        <h3 className="font-mono text-[10px] uppercase text-brand-gold tracking-[0.3em] text-center mb-10 w-full">ENVIRONMENTAL INTELLIGENCE PLATFORM SYSTEM FEATURES</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="frosted-glass rounded-2xl p-6 hover:border-brand-gold/30 transition-all duration-500 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 mb-4">
                <Compass className="w-4 h-4 text-brand-blue" />
              </div>
              <h4 className="font-display font-medium text-base text-brand-text mb-2">Guided Celestial Assessment</h4>
              <p className="text-xs text-brand-muted leading-relaxed font-light">Interactive assessment modules for transit flow, power generation grids, nutrition model selection, and mechanical composting logs.</p>
            </div>
            <span className="text-[9px] font-mono text-brand-gold tracking-widest mt-4">CALCULATOR CORE</span>
          </div>

          <div className="frosted-glass rounded-2xl p-6 hover:border-[#22C55E]/30 transition-all duration-500 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center border border-[#22C55E]/20 mb-4">
                <Globe className="w-4 h-4 text-[#22C55E]" />
              </div>
              <h4 className="font-display font-medium text-base text-brand-text mb-2">Orbital Telemetry Constellation</h4>
              <p className="text-xs text-brand-muted leading-relaxed font-light">Visualizing transport, energy, food, and metabolic waste nodes orbiting around the personal Earth, linked by gold atomic energy lines.</p>
            </div>
            <span className="text-[9px] font-mono text-brand-gold tracking-widest mt-4">CONSTELLATION VISUALIZER</span>
          </div>

          <div className="frosted-glass rounded-2xl p-6 hover:border-brand-gold/30 transition-all duration-500 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 mb-4">
                <Sparkles className="w-4 h-4 text-brand-gold" />
              </div>
              <h4 className="font-display font-medium text-base text-brand-text mb-2">AI Observatory Oracle</h4>
              <p className="text-xs text-brand-muted leading-relaxed font-light">Deep assessment generated in real-time by the Gemini-3.5-flash server, conveying poetic prose narratives, air warnings, and adaptive advice.</p>
            </div>
            <span className="text-[9px] font-mono text-brand-gold tracking-widest mt-4">GEMINI COGNITION CORE</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 bg-transparent border-t border-slate-900/40 text-center flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-brand-muted tracking-widest gap-4">
        <p>© 2026 ECOTRACK AI INC. ORBITAL ENVIRONMENT MONITORS.</p>
        <div className="flex gap-6 uppercase">
          <span className="text-brand-gold">PLANETARY OBSERVATION LABS</span>
          <span className="opacity-45">SYSTEM LEVEL: ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
