/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { AreaChart as ChartIcon, Eye, Compass, Calendar, Sliders, Layers, Users, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { history, profile, user, logout } = useEco();
  const [activeChartTab, setActiveChartTab] = useState<'stacked' | 'compare'>('stacked');

  const currentFootprint = profile?.calculatedFootprint || 4.58;

  // Fractions calculating
  const c = profile?.carTravel ? (profile.carTravel * 52 * 0.18 / 1000) : 1.9;
  const b = profile?.busTravel ? (profile.busTravel * 52 * 0.08 / 1000) : 0.1;
  const t = profile?.trainTravel ? (profile.trainTravel * 52 * 0.04 / 1000) : 0.1;
  const transport = parseFloat((c + b + t).toFixed(2));
  
  const energy = profile?.electricityUsage ? parseFloat((profile.electricityUsage * 12 * 0.35 / 1000).toFixed(2)) : 1.25;
  const food = profile?.foodChoice === 'vegetarian' ? 1.5 : profile?.foodChoice === 'non-vegetarian' ? 3.3 : 2.2;
  const waste = profile?.wasteChoice === 'low' ? 0.2 : profile?.wasteChoice === 'high' ? 0.9 : 0.5;

  const pieData = [
    { name: 'Transport System', value: transport, color: '#38BDF8' },
    { name: 'Electrical Induction', value: energy, color: '#F59E0B' },
    { name: 'Nutrition Sink', value: food, color: '#22C55E' },
    { name: 'Landfill Core Waste', value: waste, color: '#C9A45C' }
  ];

  const totalEmissionsCalculated = parseFloat((transport + energy + food + waste).toFixed(2));

  return (
    <div className="relative min-h-screen bg-brand-bg atmospheric-ambient text-brand-text overflow-x-hidden pb-12">
      <div className="absolute inset-0 thin-lines pointer-events-none opacity-20" />
      
      {/* Auroral backlights */}
      <div className="absolute top-[20%] left-[10%] w-[420px] h-[420px] rounded-full bg-brand-gold/2 blur-[120px] pointer-events-none" />

      {/* TOP HEADER */}
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
          <button onClick={() => navigate('/analytics')} className="text-brand-gold font-semibold uppercase">CHARTS</button>
          <button onClick={() => navigate('/missions')} className="hover:text-brand-text transition-colors uppercase">MISSIONS</button>
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

      {/* BODY CARDS Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 relative z-10 space-y-8 select-none">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#C9A45C]">Historical Carbon Orbits</span>
            <h2 className="font-serif italic font-medium text-3xl tracking-wide text-brand-gold mt-1">Telemetry Charts</h2>
          </div>
          <div className="bg-slate-950/70 border border-slate-900/60 px-4 py-2 rounded-2xl flex items-center gap-3 text-xs font-mono text-slate-400">
            <XAxis dataKey="period" hide />
            <Calendar className="w-4 h-4 text-brand-gold" />
            <span>REPORT QUARTER: Q2 ACTIVE</span>
          </div>
        </div>

        {/* BENTO INNER SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SEC 1: STACKED REGULAR AREA CHART (Col-span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="gold-glass rounded-3xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] font-semibold">Emission Path</span>
                  <h3 className="font-serif italic font-medium text-2xl tracking-wide text-brand-text mt-0.5">Atmospheric Loading</h3>
                </div>
                
                {/* Micro mini-selector filter tabs */}
                <div className="flex bg-[#0a1424] border border-slate-900 rounded-lg p-1">
                  <button 
                    onClick={() => setActiveChartTab('stacked')}
                    className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded-md duration-300 ${
                      activeChartTab === 'stacked' ? 'bg-brand-gold text-brand-bg font-semibold' : 'text-slate-500 hover:text-brand-text'
                    }`}
                  >
                    CONSOLIDATED
                  </button>
                  <button 
                    onClick={() => setActiveChartTab('compare')}
                    className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded-md duration-300 ${
                      activeChartTab === 'compare' ? 'bg-brand-gold text-brand-bg font-semibold' : 'text-slate-500 hover:text-brand-text'
                    }`}
                  >
                    SEPARATED
                  </button>
                </div>
              </div>

              {/* Area Chart Implementation */}
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={history}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A45C" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#C9A45C" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="period" 
                      stroke="#475569" 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
                    />
                    <YAxis 
                      stroke="#475569" 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0c1524', 
                        borderColor: 'rgba(201,164,92,0.15)', 
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-sans)',
                        color: '#F8FAFC'
                      }}
                    />
                    
                    {activeChartTab === 'stacked' ? (
                      <>
                        <Area type="monotone" dataKey="transport" stackId="1" stroke="#38BDF8" fillOpacity={1} fill="url(#colorTransport)" />
                        <Area type="monotone" dataKey="energy" stackId="1" stroke="#F59E0B" fillOpacity={1} fill="url(#colorEnergy)" />
                        <Area type="monotone" dataKey="food" stackId="1" stroke="#22C55E" fillOpacity={1} fill="url(#colorFood)" />
                        <Area type="monotone" dataKey="waste" stackId="1" stroke="#C9A45C" fillOpacity={1} fill="url(#colorWaste)" />
                      </>
                    ) : (
                      <>
                        <Area type="monotone" dataKey="total" stroke="#C9A45C" fillOpacity={0.1} strokeWidth={2} fill="url(#colorWaste)" />
                        <Area type="monotone" dataKey="transport" stroke="#38BDF8" fillOpacity={0} />
                        <Area type="monotone" dataKey="energy" stroke="#F59E0B" fillOpacity={0} />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 mt-4 font-mono text-[9px] text-brand-muted tracking-widest uppercase">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" /> TRANSIT</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> POWER INDUCTION</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> NUTRITION</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C9A45C]" /> LANDFILL CORE</div>
              </div>
            </div>

            {/* LOWER EXPLANATORY SUMMARY COMP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="frosted-glass rounded-2xl p-5 space-y-1.5">
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Quarter Peak Loading</span>
                <p className="text-xl font-bold text-[#EF4444] font-sans">
                  {history && history.length > 0 ? history[0].total.toFixed(2) : '6.3'} <span className="text-[10px] text-slate-500 font-mono">T/yr</span>
                </p>
                <p className="text-[10px] text-brand-muted leading-relaxed font-light">Calculated maximum atmospheric load before strategic carbon calibration programs engaged.</p>
              </div>
              <div className="frosted-glass rounded-2xl p-5 space-y-1.5">
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Current Baseline Loading</span>
                <p className="text-xl font-bold text-brand-blue font-sans">
                  {currentFootprint.toFixed(2)} <span className="text-[10px] text-slate-500 font-mono">T/yr</span>
                </p>
                <p className="text-[10px] text-brand-muted leading-relaxed font-light">Present-day baseline net emissions based on latest adaptive lifestyle parameters.</p>
              </div>
              <div className="frosted-glass rounded-2xl p-5 space-y-1.5">
                <span className="text-[8px] font-mono text-slate-500 uppercase block">Averted Atmospheric Heat</span>
                <p className="text-xl font-bold text-[#22C55E] font-sans">
                  {( (history && history.length > 0 ? history[0].total : 6.3) - currentFootprint ).toFixed(2)} <span className="text-[10px] text-slate-500 font-mono">T/yr</span>
                </p>
                <p className="text-[10px] text-brand-muted leading-relaxed font-light">Consolidated atmospheric carbon offset achieved through active reductions.</p>
              </div>
            </div>
          </div>

          {/* SEC 2: PIE CATEGORY BREAKDOWN (Col-span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="frosted-glass rounded-3xl p-6 relative overflow-hidden">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] font-semibold">Distribution</span>
              <h3 className="font-serif italic font-medium text-2xl tracking-wide text-brand-text mt-0.5 mb-6">Sphere Fractions</h3>

              <div className="w-full h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0c1524', 
                        borderColor: '#1e293b', 
                        borderRadius: '8px', 
                        fontSize: '10px',
                        color: '#E2E8F0'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Details labels custom representation */}
              <div className="space-y-3 font-mono text-[10px] mt-2">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-900 pb-1.5 opacity-90">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-400">{item.name}</span>
                    </span>
                    <span className="text-brand-text font-bold">
                      {((item.value / totalEmissionsCalculated) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/45 border border-slate-900 rounded-3xl p-6 space-y-4">
              <h4 className="font-display font-medium text-xs text-brand-gold uppercase tracking-[0.15em]">Observatory Guidance</h4>
              <p className="text-xs text-brand-muted leading-relaxed font-sans font-light">
                Your highest atmospheric deflection vector is <span className="text-brand-red font-semibold uppercase">{transport > energy && transport > food ? 'Transport Infrastructure' : energy > food ? 'Grid Induction Coils' : 'Agrarian Nutritional Sinks'}</span>.
                Targeted intervention on this critical node will yield maximum relief on the global greenhouse convective zone. Use the Missions Console to set up milestones.
              </p>
              <button 
                onClick={() => navigate('/missions')} 
                className="w-full py-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-brand-gold hover:bg-brand-gold/10 duration-300 uppercase tracking-widest text-center"
              >
                MISSION PLATFORM
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
