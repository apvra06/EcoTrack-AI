/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { ShieldAlert, Compass, Sparkles, ChevronRight, User, Mail, Lock, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, user } = useEco();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert('Operational warning: Please complete all terminal credentials.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const ok = await login(email, password);
        if (ok) {
          navigate('/dashboard');
        }
      } else {
        const ok = await register(email, name, password);
        if (ok) {
          navigate('/calculator'); // Redirect registered users directly to calculator first
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-bg atmospheric-ambient text-brand-text overflow-hidden flex flex-col justify-center items-center p-4">
      {/* Absolute background grid */}
      <div className="absolute inset-0 thin-lines pointer-events-none opacity-20" />
      
      {/* Decorative Alignment Wires matching Artistic Flair style */}
      <div className="artistic-wire-left pointer-events-none opacity-40" />
      <div className="artistic-wire-right pointer-events-none opacity-40" />

      {/* Ambient Pulsing Sparkle Stars */}
      <div className="absolute top-20 left-40 w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse pointer-events-none"></div>
      <div className="absolute top-60 right-80 w-[2px] h-[2px] bg-white rounded-full blur-[1px] pointer-events-none"></div>

      {/* Auroral backlight */}
      <div className="absolute top-1/4 left-1/4 w-[340px] h-[340px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[340px] h-[340px] rounded-full bg-brand-blue/5 blur-[120px] pointer-events-none animate-pulse" />

      {/* Floating back button to return to home page */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-1.5 rounded-full frosted-glass border border-slate-800 text-[10px] font-mono tracking-widest text-slate-400 uppercase hover:text-brand-gold hover:border-brand-gold/30 transition-all active:scale-95 duration-300"
        >
          ← EXIT SIMULATOR
        </button>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Observatory capsule header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl gold-glass items-center justify-center mb-4">
            <Compass className="w-6 h-6 text-brand-gold animate-spin" style={{ animationDuration: '40s' }} />
          </div>
          <h2 className="font-serif italic font-medium text-3xl tracking-wide text-brand-gold">
            {isLogin ? 'Observatory Console' : 'Register Sphere'}
          </h2>
          <p className="text-[10px] font-mono text-brand-muted tracking-[0.2em] uppercase mt-2">
            {isLogin ? 'Establish connection to telemetry grids' : 'Proclaim brand-new environmental lifecycle'}
          </p>
        </div>

        {/* AUTH CARD */}
        <div className="gold-glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Card header accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  <label className="block text-[9px] font-mono uppercase tracking-[0.25em] text-brand-gold">
                    CITIZEN NAME
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-[#0a1424] border border-slate-800/80 rounded-xl text-xs text-brand-text placeholder-slate-650 focus:outline-none focus:border-brand-gold/50 font-sans tracking-wide transition-colors"
                      placeholder="e.g. Rachel Carson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="block text-[9px] font-mono uppercase tracking-[0.25em] text-brand-gold">
                COMMUNICATION ADDRESS (EMAIL)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#0a1424] border border-slate-800/80 rounded-xl text-xs text-brand-text placeholder-slate-650 focus:outline-none focus:border-brand-gold/50 font-sans tracking-wide transition-colors"
                  placeholder="rachel.carson@planet.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-mono uppercase tracking-[0.25em] text-brand-gold">
                RESTRICTED SYSTEM KEY (PASSWORD)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-[#0a1424] border border-slate-800/80 rounded-xl text-xs text-brand-text placeholder-slate-650 focus:outline-none focus:border-brand-gold/50 font-sans tracking-wide transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* BUTTON TRIGGER */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-brand-gold text-brand-bg hover:bg-brand-gold/90 border border-transparent font-mono text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/30 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>INITIALIZING CRYO-DATABASE CORE...</span>
              ) : (
                <>
                  <span>{isLogin ? 'ENGAGE TELEMETRY STREAM' : 'PROVISION PLANETARY CORE'}</span>
                  <ChevronRight className="w-4 h-4 text-brand-bg stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* TOGGLE LINK */}
          <div className="mt-8 text-center border-t border-slate-900/40 pt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-[10px] font-mono tracking-widest text-slate-400 uppercase hover:text-brand-gold transition-colors focus:outline-none"
            >
              {isLogin 
                ? "First lifecycle? Create observatory context" 
                : "Existing observatory alignment? Engage connection"
              }
            </button>
          </div>
        </div>

        {/* Observatory safety certification logs */}
        <p className="text-[8px] text-center text-slate-500 font-mono tracking-[0.2em] mt-6 uppercase select-none">
          SECURE PROTOCOL CLOUD RUN COG // SYSTEM ID #8FB813-AI
        </p>
      </div>
    </div>
  );
}
