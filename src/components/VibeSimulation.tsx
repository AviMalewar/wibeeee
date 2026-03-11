import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Search, Users, MessageSquare, Shield, Cpu, Network, Sparkles, CheckCircle2 } from 'lucide-react';

const AVI_PROFILE = {
  name: "Avi",
  branch: "Computer Science",
  college: "WIBE Institute",
  year: "3rd Year",
  interests: ["Coding", "AI", "Gaming", "Startups"],
  skills: ["React", "Web Development"],
  goals: ["Hackathons", "Networking"],
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Avi"
};

const PEERS = [
  { name: "Sarah", interests: ["Music", "Design"], image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Leo", interests: ["AI", "Startups"], image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo" },
  { name: "Maya", interests: ["Coding", "Hackathons"], image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" },
  { name: "Chris", interests: ["Gaming", "Movies"], image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris" },
];

export default function VibeSimulation() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setProgress((p) => (p < 100 ? p + 1 : 100));
      }, 40);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [step]);

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-video bg-[#030712] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Step Indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20"
            >
              <Zap className="w-12 h-12 text-white fill-current" />
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter mb-4">WIBE AI</h1>
            <p className="text-white/40 text-xl font-medium tracking-widest uppercase">Intelligent Student Matching Engine</p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent mt-8"
            />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center p-12"
          >
            <div className="grid grid-cols-2 gap-12 items-center w-full">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
                  <Cpu className="w-4 h-4" /> Step 01: Data Input
                </div>
                <h2 className="text-5xl font-black tracking-tighter leading-none">Capturing the <br/><span className="text-indigo-500">Student Vibe</span></h2>
                <p className="text-white/40 text-lg">System ingesting profile attributes for multidimensional analysis.</p>
                
                <div className="space-y-3">
                  {['Analyzing Interests', 'Mapping Skills', 'Evaluating Goals'].map((text, i) => (
                    <motion.div 
                      key={text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.2 }}
                      className="flex items-center gap-3 text-white/60 font-bold"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      {text}
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="relative p-8 rounded-[2.5rem] bg-[#0f111a] border border-white/10 shadow-2xl"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border-2 border-white/10">
                    <img src={AVI_PROFILE.image} alt="Avi" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black">{AVI_PROFILE.name}</h3>
                    <p className="text-indigo-400 font-bold text-sm uppercase tracking-wider">{AVI_PROFILE.branch}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Interests</p>
                    <p className="text-xs font-bold text-white/60">{AVI_PROFILE.interests.join(', ')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Skills</p>
                    <p className="text-xs font-bold text-white/60">{AVI_PROFILE.skills.join(', ')}</p>
                  </div>
                </div>
                
                {/* Flowing Lines Animation */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="h-px w-24 bg-gradient-to-r from-indigo-500 to-transparent"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Node */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-64 h-64 rounded-full border border-indigo-500/20 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                <div className="w-48 h-48 rounded-full bg-indigo-500/5 flex flex-col items-center justify-center text-center p-6">
                  <Cpu className="w-12 h-12 text-indigo-500 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">WIBE AI ENGINE</p>
                </div>
              </motion.div>

              {/* Orbiting Profiles */}
              {PEERS.map((peer, i) => (
                <motion.div 
                  key={peer.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: Math.cos((i * 90 * Math.PI) / 180) * 280,
                    y: Math.sin((i * 90 * Math.PI) / 180) * 180,
                  }}
                  className="absolute p-4 rounded-2xl bg-[#0f111a] border border-white/5 flex items-center gap-4 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5">
                    <img src={peer.image} alt={peer.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black">{peer.name}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">{peer.interests[0]}</p>
                  </div>
                  
                  {/* Connection Line */}
                  <motion.div 
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute h-px bg-indigo-500/30 origin-left"
                    style={{ 
                      width: '180px',
                      left: i % 2 === 0 ? (i === 0 ? '-180px' : '60px') : '30px',
                      top: '50%',
                      transform: `rotate(${i * 90 + 180}deg)`
                    }}
                  />
                </motion.div>
              ))}

              {/* Scanning Text */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-2">
                <p className="text-white/40 font-black uppercase tracking-[0.4em] text-xs">
                  {progress < 30 ? "Analyzing shared interests..." : 
                   progress < 60 ? "Evaluating compatibility..." : 
                   progress < 90 ? "Calculating vibe score..." : "Analysis Complete"}
                </p>
                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <h2 className="text-4xl font-black tracking-tighter mb-12">Compatibility Matrix</h2>
            <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
              {[
                { name: "Sarah", score: 65, color: "from-blue-500 to-indigo-500" },
                { name: "Leo", score: 82, color: "from-indigo-500 to-purple-500" },
                { name: "Maya", score: 91, color: "from-purple-500 to-pink-500", top: true },
              ].map((m, i) => (
                <motion.div 
                  key={m.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className={`relative p-8 rounded-[2.5rem] bg-[#0f111a] border ${m.top ? 'border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.2)]' : 'border-white/5'} flex flex-col items-center text-center`}
                >
                  {m.top && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                      TOP MATCH
                    </div>
                  )}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 mb-6">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">{m.name}</h3>
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                      <motion.circle 
                        cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="251.2"
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * m.score) / 100 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="text-indigo-500"
                      />
                    </svg>
                    <span className="absolute text-2xl font-black">{m.score}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.3em] mb-6">
                <CheckCircle2 className="w-5 h-5" /> Perfect Vibe Match Identified
              </div>
              <h2 className="text-6xl font-black tracking-tighter">It's a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Match!</span></h2>
            </motion.div>

            <div className="flex items-center gap-12">
              <motion.div 
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl"
              >
                <img src={AVI_PROFILE.image} alt="Avi" className="w-full h-full object-cover" />
              </motion.div>

              <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-32 h-32 rounded-full bg-purple-500/20 blur-xl"
                />
                <Zap className="w-16 h-16 text-purple-500 fill-current relative z-10" />
              </div>

              <motion.div 
                animate={{ x: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-purple-500/50 shadow-[0_0_60px_rgba(168,85,247,0.3)]"
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" alt="Maya" className="w-full h-full object-cover" />
              </motion.div>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3 text-white/40 font-black uppercase tracking-widest text-xs">
                <MessageSquare className="w-4 h-4" /> Real-Time Chat Enabled
              </div>
              <div className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black tracking-widest uppercase text-sm">
                Connecting Avi & Maya...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="absolute bottom-8 right-12 flex items-center gap-3 opacity-30">
        <Zap className="w-5 h-5 fill-current" />
        <span className="font-black tracking-tighter text-xl">wibe</span>
      </div>
    </div>
  );
}
