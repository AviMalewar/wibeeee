import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { subscribeToMatches } from '../services/matchService';
import { motion } from 'motion/react';
import MatchCard from '../components/MatchCard';
import { Sparkles, Loader2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;

    const unsubscribe = subscribeToMatches(profile, (data) => {
      setMatches(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-white/50 font-medium">Finding your perfect vibes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black mb-2">Your Matches</h1>
          <p className="text-white/50 text-lg">Based on your interests and personality.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
          <Sparkles className="w-5 h-5 fill-current" />
          <span>{matches.length} Potential Vibes</span>
        </div>
      </header>

      {matches.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center">
          <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No matches yet</h3>
          <p className="text-white/50">Try updating your profile with more interests!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match, i) => (
            <motion.div
              key={match.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <MatchCard match={match} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
