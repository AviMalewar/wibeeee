import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/authService';
import { calculateMatchScore } from '../services/matchService';
import { motion } from 'motion/react';
import { Loader2, ChevronLeft, Zap, Music, Film, Heart, Code, Target } from 'lucide-react';

export default function ComparisonPage() {
  const { uid } = useParams();
  const { profile: myProfile } = useAuth();
  const [targetProfile, setTargetProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (uid) {
        const data = await getUserProfile(uid);
        setTargetProfile(data);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [uid]);

  if (loading || !myProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-white/50 font-medium">Preparing comparison...</p>
      </div>
    );
  }

  if (!targetProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-8">
          <Zap className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tight">Vibe Not Found</h2>
        <p className="text-white/30 font-medium mb-12 max-w-md text-center">We couldn't locate this student's profile. They might have updated their settings or left the campus.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-10 py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const matchScore = calculateMatchScore(myProfile, targetProfile);

  const categories = [
    { id: 'music', title: 'Music', icon: Music, color: 'text-pink-400' },
    { id: 'movies', title: 'Movies', icon: Film, color: 'text-purple-400' },
    { id: 'hobbies', title: 'Hobbies', icon: Heart, color: 'text-red-400' },
    { id: 'skills', title: 'Skills', icon: Code, color: 'text-indigo-400' },
    { id: 'goals', title: 'Goals', icon: Target, color: 'text-emerald-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
          <h1 className="text-8xl font-black mb-4 tracking-tighter leading-none">Side-by-Side</h1>
          <p className="text-white/30 font-black uppercase tracking-[0.3em] text-xs">
            COMPARING 2 PEER VIBES • <span className="text-white/50">"{myProfile?.name?.toUpperCase() || 'YOU'}" IS YOUR REFERENCE</span>
          </p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="px-10 py-5 rounded-3xl bg-[#11131f] border border-white/5 text-white font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all shadow-2xl"
        >
          Back to Gallery
        </button>
      </header>

      <div className="grid grid-cols-2 gap-24 mb-24 max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-[#1a1d29] border-4 border-purple-500/50 shadow-[0_0_80px_rgba(168,85,247,0.2)]">
              <img src={myProfile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${myProfile?.uid}`} alt={myProfile?.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
              REFERENCE
            </div>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">{myProfile?.name?.toLowerCase() || 'you'}</h2>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-[#1a1d29] border-4 border-white/5 shadow-2xl">
            <img src={targetProfile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetProfile?.uid}`} alt={targetProfile?.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">{targetProfile?.name || 'Student'}</h2>
        </div>
      </div>

      <div className="rounded-[3rem] bg-[#0f111a] border border-white/5 overflow-hidden shadow-2xl">
        {/* Vibe Match Row */}
        <div className="grid grid-cols-[300px_1fr_1fr] border-b border-white/5">
          <div className="p-10 flex flex-col justify-center">
            <h3 className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">VIBE MATCH</h3>
          </div>
          <div className="p-10 border-r border-white/5 flex items-center">
            <span className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">BASELINE</span>
          </div>
          <div className="p-10 flex items-center gap-10">
            <div className="flex-1">
              <div className="flex justify-between items-end mb-5">
                <span className="text-6xl font-black tracking-tighter text-white">{matchScore}%</span>
                <span className="text-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-2">COMPATIBILITY</span>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${matchScore}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branch & Year Row */}
        <div className="grid grid-cols-[300px_1fr_1fr] border-b border-white/5">
          <div className="p-10 flex flex-col justify-center">
            <h3 className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">BRANCH & YEAR</h3>
          </div>
          <div className="p-10 border-r border-white/5">
            <p className="text-2xl font-black text-white mb-1">{myProfile?.course || 'cs'}</p>
            <p className="text-white/20 text-sm font-bold tracking-tight">{myProfile?.year || 'Freshman'} Year</p>
          </div>
          <div className="p-10">
            <p className="text-2xl font-black text-white mb-1">{targetProfile?.course || 'Cs'}</p>
            <p className="text-white/20 text-sm font-bold tracking-tight">{targetProfile?.year || 'Freshman'} Year</p>
          </div>
        </div>

        {/* Lifestyle Row */}
        <div className="grid grid-cols-[300px_1fr_1fr] border-b border-white/5">
          <div className="p-10 flex flex-col justify-center">
            <h3 className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">LIFESTYLE</h3>
          </div>
          <div className="p-10 border-r border-white/5">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/60 text-sm font-bold">
              {myProfile?.personality === 'Night owl' ? '🦉 Night Owl' : '☀️ Morning Person'}
            </span>
          </div>
          <div className="p-10">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-white/60 text-sm font-bold">
              {targetProfile?.personality === 'Night owl' ? '🦉 Night Owl' : '☀️ Morning Person'}
            </span>
          </div>
        </div>

        {/* Bio Row */}
        <div className="grid grid-cols-[300px_1fr_1fr] border-b border-white/5">
          <div className="p-10 flex flex-col justify-center">
            <h3 className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">BIO</h3>
          </div>
          <div className="p-10 border-r border-white/5">
            <p className="text-white/40 italic text-lg font-medium leading-relaxed">"{myProfile?.bio || 'sss'}"</p>
          </div>
          <div className="p-10">
            <p className="text-white/40 italic text-lg font-medium leading-relaxed">"{targetProfile?.bio || 'Hi'}"</p>
          </div>
        </div>

        {/* Interests Row */}
        <div className="grid grid-cols-[300px_1fr_1fr]">
          <div className="p-10 flex flex-col justify-center">
            <h3 className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">INTERESTS</h3>
          </div>
          <div className="p-10 border-r border-white/5">
            <div className="flex flex-wrap gap-3">
              {['music', 'movies', 'hobbies'].map(cat => (
                (myProfile?.[cat] || []).map(item => (
                  <span key={item} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/40">
                    {item} {item.toLowerCase().includes('movie') ? '🍿' : ''}
                  </span>
                ))
              ))}
            </div>
          </div>
          <div className="p-10">
            <div className="flex flex-wrap gap-3">
              {['music', 'movies', 'hobbies'].map(cat => (
                (targetProfile?.[cat] || []).map(item => {
                  const isCommon = (myProfile?.[cat] || []).includes(item);
                  return (
                    <span 
                      key={item} 
                      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                        isCommon 
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                          : 'bg-white/5 border-white/5 text-white/40'
                      }`}
                    >
                      {item} {item.toLowerCase().includes('movie') ? '🍿' : ''} {item.toLowerCase().includes('read') ? '📚' : ''} {item.toLowerCase().includes('game') ? '🎮' : ''} {item.toLowerCase().includes('travel') ? '✈️' : ''}
                    </span>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 flex justify-center">
        {matchScore >= 60 ? (
          <button 
            onClick={() => navigate(`/messages/${targetProfile?.uid}`)}
            className="px-16 py-6 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-2xl shadow-[0_0_60px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-6"
          >
            <Zap className="w-8 h-8 fill-current" />
            START VIBING
          </button>
        ) : (
          <div className="px-10 py-5 rounded-3xl bg-white/5 border border-white/5 text-white/20 font-black uppercase tracking-widest text-sm flex items-center gap-4">
            <Zap className="w-6 h-6 opacity-20" />
            SCORE TOO LOW TO VIBE (NEED 60%+)
          </div>
        )}
      </div>
    </div>
  );
}
