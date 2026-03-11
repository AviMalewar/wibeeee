import { useNavigate } from 'react-router-dom';
import { MessageCircle, User, Zap } from 'lucide-react';

export default function MatchCard({ match }) {
  const navigate = useNavigate();

  if (!match) return null;

  return (
    <div className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      <div className="absolute top-6 right-6 flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-500/20">
        <Zap className="w-3 h-3 fill-current" />
        {match.matchScore}%
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img 
          src={match.profileImage} 
          alt={match.name} 
          className="w-16 h-16 rounded-2xl bg-white/10 p-1"
        />
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
            {match.name}
          </h3>
          <p className="text-white/50 text-sm font-medium">{match.course} • {match.year} Year</p>
        </div>
      </div>

      <p className="text-white/60 text-sm mb-6 line-clamp-2 italic">
        "{match.bio || 'No bio yet...'}"
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {match.commonInterests?.map((interest, idx) => (
            <span 
              key={`${interest}-${idx}`} 
              className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold"
            >
              {interest}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button 
            onClick={() => navigate(`/compare/${match.uid}`)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
          >
            <Zap className="w-4 h-4" />
            Compare
          </button>
          {match.matchScore >= 60 ? (
            <button 
              onClick={() => navigate(`/messages/${match.uid}`)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/20 text-xs font-bold cursor-not-allowed">
              Locked
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
