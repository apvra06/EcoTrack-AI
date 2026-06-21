/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEco } from '../context/EcoContext';
import { Compass, Car, Train, Activity, Flame, Shield, ArrowRight, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

export default function Calculator() {
  const navigate = useNavigate();
  const { profile, updateCarbonProfile } = useEco();

  // Step selector: 0 = Transport, 1 = Electricity, 2 = Food, 3 = Waste, 4 = Review & Save
  const [step, setStep] = useState(0);

  // Local temp fields for live calculations
  const [carTravel, setCarTravel] = useState(100);
  const [busTravel, setBusTravel] = useState(20);
  const [trainTravel, setTrainTravel] = useState(40);
  const [electricityUsage, setElectricityUsage] = useState(250);
  const [foodChoice, setFoodChoice] = useState<'vegetarian' | 'mixed' | 'non-vegetarian'>('mixed');
  const [wasteChoice, setWasteChoice] = useState<'low' | 'medium' | 'high'>('medium');

  // Load existing profile values if available on mount
  useEffect(() => {
    if (profile) {
      setCarTravel(profile.carTravel);
      setBusTravel(profile.busTravel);
      setTrainTravel(profile.trainTravel);
      setElectricityUsage(profile.electricityUsage);
      setFoodChoice(profile.foodChoice);
      setWasteChoice(profile.wasteChoice);
    }
  }, [profile]);

  // Live dynamic footprint calculation for user visual response
  const calculateLiveFootprint = () => {
    const carEmissions = (carTravel * 52 * 0.18) / 1000;
    const busEmissions = (busTravel * 52 * 0.08) / 1000;
    const trainEmissions = (trainTravel * 52 * 0.04) / 1000;
    const electricityEmissions = (electricityUsage * 12 * 0.35) / 1000;

    let foodEmissions = 2.2;
    if (foodChoice === 'vegetarian') foodEmissions = 1.5;
    else if (foodChoice === 'non-vegetarian') foodEmissions = 3.3;

    let wasteEmissions = 0.5;
    if (wasteChoice === 'low') wasteEmissions = 0.2;
    else if (wasteChoice === 'high') wasteEmissions = 0.9;

    return parseFloat((carEmissions + busEmissions + trainEmissions + electricityEmissions + foodEmissions + wasteEmissions).toFixed(2));
  };

  const liveScore = calculateLiveFootprint();

  // Get color depending on the score
  const getRatingColor = (score: number) => {
    if (score < 3.0) return 'text-[#22C55E]';
    if (score < 6.0) return 'text-[#38BDF8]';
    if (score < 10.0) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  const getRatingLabel = (score: number) => {
    if (score < 3.0) return 'EQUILIBRIUM (HEALTHY)';
    if (score < 6.0) return 'BUFFERED ORBIT (STABLE)';
    if (score < 10.0) return 'STRAINED ORBIT (WARNING)';
    return 'THRESHOLD BREACH (CRITICAL)';
  };

  // Sections description and storytelling strings
  const stories = [
    {
      title: "I. Kinetic Transport Currents",
      desc: "Every mechanical traverse across terrestrial soil releases a velocity thermal plume. Kinetic transit choice is the largest contributor to personal climate deflection scales."
    },
    {
      title: "II. Grid Induction Current",
      desc: "Household hardware, continuous refrigeration coils, and microchip grids demand consistent baseline electrical power, generating greenhouse overhead at local coal/natural gas converters."
    },
    {
      title: "III. Nutrition Agricultural Sink",
      desc: "Food cultivation demands immense hydrological irrigation, raw deforestation clearance, and fertilizer refining cycles. Meat extraction loops exponentially compound this density."
    },
    {
      title: "IV. Composition Solid Core Waste",
      desc: "Organic garbage compressed in dense mechanical landfills undergoes anaerobic decomposition, outgassing heavy localized methane columns that trap thermal heat faster than standard Carbon."
    }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSave = async () => {
    await updateCarbonProfile({
      carTravel,
      busTravel,
      trainTravel,
      electricityUsage,
      foodChoice,
      wasteChoice
    });
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-brand-bg atmospheric-ambient text-brand-text overflow-hidden flex flex-col justify-between p-6">
      <div className="absolute inset-0 thin-lines pointer-events-none opacity-20" />

      {/* HEADER BAR AND LIVE METER */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center sm:py-4 border-b border-slate-900/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-[#C9A45C] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full blur-[1px]"></div>
          </div>
          <span className="font-serif italic text-sm tracking-wider text-brand-gold">
            Ecosystem Calibration
          </span>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="hidden sm:block">
            <p className="text-[8px] font-mono tracking-widest text-[#94A3B8] uppercase">LIVE TELEMETRY EST.</p>
            <p className="text-[10px] font-mono font-semibold text-brand-gold tracking-widest uppercase">
              {getRatingLabel(liveScore)}
            </p>
          </div>
          <div className="bg-slate-950/75 border border-slate-900 px-4 py-1.5 rounded-full flex items-baseline gap-1.5">
            <span className={`text-base font-bold font-mono ${getRatingColor(liveScore)}`}>
              {liveScore.toFixed(2)}
            </span>
            <span className="text-[8px] font-mono text-slate-500 uppercase">T/CO₂e</span>
          </div>
        </div>
      </header>

      {/* MAIN GUIDED FORM CAPULE */}
      <main className="max-w-2xl mx-auto w-full py-8">
        {/* Floating Indicator Grid */}
        <div className="flex justify-between items-center mb-8 px-4">
          {[0, 1, 2, 3].map((val) => (
            <button
              key={val}
              onClick={() => setStep(val)}
              className="flex items-center gap-1.5 focus:outline-none"
            >
              <div 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  step === val 
                    ? 'bg-brand-gold scale-125 shadow-[0_0_8px_#C9A45C]' 
                    : step > val 
                    ? 'bg-brand-blue opacity-80'
                    : 'bg-slate-800'
                }`}
              />
              <span className={`text-[8px] font-mono tracking-widest hidden sm:inline uppercase ${
                step === val ? 'text-brand-gold font-medium' : 'text-slate-500'
              }`}>
                {['Transit', 'Energy', 'Nutrition', 'Waste'][val]}
              </span>
            </button>
          ))}
          <button 
            onClick={() => setStep(4)}
            className={`w-3.5 h-3.5 rounded border transition-all duration-500 ${
              step === 4 ? 'bg-brand-gold border-brand-gold text-brand-bg scale-110' : 'border-slate-800'
            }`}
          />
        </div>

        {/* PROGRESSIVE PAGES VIEW */}
        <div className="gold-glass rounded-3xl p-8 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Context poetics titles */}
              {step < 4 && (
                <div className="border-b border-slate-900/40 pb-4 select-none">
                  <h3 className="font-serif text-lg font-medium text-brand-gold italic tracking-wide">
                    {stories[step].title}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1.5 leading-relaxed font-light italic font-sans">
                    {stories[step].desc}
                  </p>
                </div>
              )}

              {/* STEP 0: TRANSPORTATION */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#38BDF8] uppercase tracking-wide flex items-center gap-1">
                        🚗 Personal Combustor (Car)
                      </span>
                      <span className="text-slate-300 font-medium">{carTravel} km/week</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={carTravel}
                      onChange={(e) => setCarTravel(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#0a1424] rounded-lg appearance-none cursor-ew-resize accent-brand-gold"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono tracking-widest">
                      <span>STATIONARY</span>
                      <span>500 KM</span>
                      <span>1,000 KM</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#38BDF8] uppercase tracking-wide flex items-center gap-1">
                        🚌 Mass Transit (Bus)
                      </span>
                      <span className="text-slate-300 font-medium">{busTravel} km/week</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="5"
                      value={busTravel}
                      onChange={(e) => setBusTravel(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#0a1424] rounded-lg appearance-none cursor-ew-resize accent-brand-gold"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono tracking-widest">
                      <span>0 KM</span>
                      <span>200 KM</span>
                      <span>400 KM</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#38BDF8] uppercase tracking-wide flex items-center gap-1">
                        🚇 Kinetic Rail (Train)
                      </span>
                      <span className="text-slate-300 font-medium">{trainTravel} km/week</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="5"
                      value={trainTravel}
                      onChange={(e) => setTrainTravel(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#0a1424] rounded-lg appearance-none cursor-ew-resize accent-brand-gold"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono tracking-widest">
                      <span>0 KM</span>
                      <span>200 KM</span>
                      <span>400 KM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: ELECTRICITY */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-brand-gold uppercase tracking-wide">
                        ⚡ Induction Grid Consumption
                      </span>
                      <span className="text-slate-300 font-medium">{electricityUsage} kWh/month</span>
                    </div>
                    
                    {/* Live visualization bar corresponding to current consumption levels */}
                    <div className="relative w-full h-[3px] bg-slate-900 rounded overflow-hidden">
                      <div 
                        className="h-full bg-brand-gold transition-all duration-300"
                        style={{ width: `${Math.min(100, (electricityUsage / 800) * 100)}%` }}
                      />
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="20"
                      value={electricityUsage}
                      onChange={(e) => setElectricityUsage(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#0a1424] rounded-lg appearance-none cursor-ew-resize accent-brand-gold"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono tracking-widest">
                      <span>ZERO INPUT</span>
                      <span>500 KWH (AVG)</span>
                      <span>1,000 KWH</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl text-center select-none">
                    <p className="text-[11px] text-brand-muted font-sans font-light leading-relaxed">
                      Your household electrical signature releases approximately <span className="text-brand-gold font-mono font-semibold">{((electricityUsage * 12 * 0.35) / 1000).toFixed(2)}</span> tonnes CO₂e per annum directly to global convective clouds based on standard grid mixes.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: FOOD CHOICES */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { 
                        val: 'vegetarian', 
                        label: 'Agrarian Pure', 
                        sub: 'VEGETARIAN', 
                        icon: '🌿', 
                        desc: 'Exclusive plant-protein loops. Minimizes agrarian land clearing ratios drastically.' 
                      },
                      { 
                        val: 'mixed', 
                        label: 'Standard Converge', 
                        sub: 'MIXED / FLEXI', 
                        icon: '🥩', 
                        desc: 'Balanced nourishment structures with moderate red/poultry agricultural factors.' 
                      },
                      { 
                        val: 'non-vegetarian', 
                        label: 'Heavy Livestock', 
                        sub: 'NON-VEGETARIAN', 
                        icon: '🥩🔥', 
                        desc: 'Continuous red meat consumption. Extremely high hydrological irrigation footprint.' 
                      }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setFoodChoice(opt.val as any)}
                        className={`p-5 rounded-2xl text-left border flex flex-col justify-between transition-all duration-300 min-h-[160px] cursor-pointer ${
                          foodChoice === opt.val 
                            ? 'bg-brand-gold/10 border-brand-gold shadow-[0_0_15px_rgba(201,164,92,0.1)]' 
                            : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xl">{opt.icon}</span>
                            <span className="text-[8px] font-mono tracking-widest text-[#C9A45C] uppercase">{opt.sub}</span>
                          </div>
                          <h4 className="font-display font-medium text-sm text-brand-text mb-1">{opt.label}</h4>
                          <p className="text-[10px] text-brand-muted leading-relaxed font-light">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: WASTE CHOICES */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { 
                        val: 'low', 
                        label: 'Zero Decay Core', 
                        sub: 'LOW WASTE', 
                        icon: '📦', 
                        desc: 'Aggressive organic composting, packaging reduction, and recycling, preventing landfill decay.' 
                      },
                      { 
                        val: 'medium', 
                        label: 'Standard Refinement', 
                        sub: 'MEDIUM WASTE', 
                        icon: '🗑️', 
                        desc: 'Satisfactory municipal garbage disposal loops, standard single-use package factors.' 
                      },
                      { 
                        val: 'high', 
                        label: 'Unchecked Plume', 
                        sub: 'HIGH WASTE', 
                        icon: '🏭', 
                        desc: 'Extensive food waste, unsegregated paper/plastic inputs accelerating core methane leakage.' 
                      }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.val}
                        onClick={() => setWasteChoice(opt.val as any)}
                        className={`p-5 rounded-2xl text-left border flex flex-col justify-between transition-all duration-300 min-h-[160px] cursor-pointer ${
                          wasteChoice === opt.val 
                            ? 'bg-brand-gold/10 border-brand-gold shadow-[0_0_15px_rgba(201,164,92,0.1)]' 
                            : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xl">{opt.icon}</span>
                            <span className="text-[8px] font-mono tracking-widest text-[#C9A45C] uppercase">{opt.sub}</span>
                          </div>
                          <h4 className="font-display font-medium text-sm text-brand-text mb-1">{opt.label}</h4>
                          <p className="text-[10px] text-brand-muted leading-relaxed font-light">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SAVE */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center sm:py-4">
                    <div className="inline-flex w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 items-center justify-center mb-3">
                      <Layers className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className="font-serif italic font-medium text-2xl tracking-wide text-brand-gold">
                      Intelligence Assessment Ready
                    </h3>
                    <p className="text-[9px] font-mono text-brand-muted tracking-widest uppercase mt-1">
                      Authorize environmental ledger sync configuration below
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-900/40 py-5 font-mono text-[11px] select-none text-left">
                    <div className="space-y-2">
                      <p className="text-slate-500">🚗 CAR TRAVEL: <span className="text-slate-300 font-semibold">{carTravel} km/wk</span></p>
                      <p className="text-slate-500">🚌 BUS TRAVEL: <span className="text-slate-300 font-semibold">{busTravel} km/wk</span></p>
                      <p className="text-slate-500">🚇 RAIL TRANSLIT: <span className="text-slate-300 font-semibold">{trainTravel} /wk</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-500">⚡ POWER INDUCTION: <span className="text-brand-gold font-semibold">{electricityUsage} kWh/mo</span></p>
                      <p className="text-slate-500">🌿 NUTRITION MODEL: <span className="text-slate-300 uppercase font-semibold">{foodChoice}</span></p>
                      <p className="text-slate-500">♻️ WASTE COMPOS: <span className="text-slate-300 uppercase font-semibold">{wasteChoice}</span></p>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-900/80 text-center text-xs text-brand-muted leading-relaxed">
                    By syncing, the system will execute premium <span className="text-brand-gold font-semibold font-mono">Gemini AI models</span> server-side to generate poetic atmospheric narratives, weather indicators, and customized emission goals specifically for your sphere.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* CARD NAVIGATION */}
          <div className="mt-8 border-t border-slate-900/45 pt-6 flex justify-between items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 border border-transparent hover:text-brand-gold transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-20 disabled:pointer-events-none`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-brand-gold text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <span>NEXT MODULE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-full bg-brand-gold text-brand-bg hover:bg-brand-gold/90 font-mono text-[11px] uppercase tracking-[0.150em] font-semibold flex items-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg shadow-brand-gold/25"
              >
                <span>SYNC OBSERVATORY MODULE</span>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center md:py-2 select-none">
        <p className="text-[8px] font-mono text-slate-500 tracking-[0.2em] uppercase">
          ECOTRACK AI PLATFORM CONSOLE // SYSTEM ACTIVE
        </p>
      </footer>
    </div>
  );
}
