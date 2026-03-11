import React from 'react';
import VibeSimulation from '../components/VibeSimulation';
import { motion } from 'motion/react';
import { Cpu, Sparkles, Network } from 'lucide-react';

export default function Simulation() {
  return (
    <div className="min-h-screen bg-[#030712] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest"
          >
            <Cpu className="w-4 h-4" /> Technical Demo
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-black tracking-tighter text-white"
          >
            Vibe Matching <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Simulation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-xl max-w-2xl mx-auto font-medium"
          >
            Experience how our intelligent engine analyzes multidimensional student data to find the perfect campus community.
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <VibeSimulation />
        </motion.div>

        <div className="mt-20 grid grid-cols-3 gap-12">
          {[
            {
              icon: Network,
              title: "Neural Mapping",
              desc: "Profiles are mapped into a high-dimensional vector space based on interests, skills, and goals."
            },
            {
              icon: Cpu,
              title: "Compatibility Engine",
              desc: "Real-time calculation of compatibility scores using weighted similarity algorithms."
            },
            {
              icon: Sparkles,
              title: "Vibe Identification",
              desc: "Identifying the 'Perfect Match' by evaluating both academic and lifestyle alignment."
            }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/5 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
