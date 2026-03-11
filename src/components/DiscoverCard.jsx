import { useNavigate } from 'react-router-dom';
import { MessageCircle, User, Music, Film, Gamepad2, Plane, BookOpen, Heart, Zap, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { calculateMatchScore } from '../services/matchService';

export default function DiscoverCard({ student }) {
  const navigate = useNavigate();
  const { profile: myProfile } = useAuth();

  if (!student) return null;

  const matchScore = myProfile ? calculateMatchScore(myProfile, student) : 0;

  // Map interests to icons if possible, or just use a default
  const getInterestIcon = (interest) => {
    const lower = interest.toLowerCase();
    if (lower.includes('music')) return <Music className="w-3 h-3" />;
    if (lower.includes('movie') || lower.includes('film')) return <Film className="w-3 h-3" />;
    if (lower.includes('game') || lower.includes('gaming')) return <Gamepad2 className="w-3 h-3" />;
    if (lower.includes('travel')) return <Plane className="w-3 h-3" />;
    if (lower.includes('read')) return <BookOpen className="w-3 h-3" />;
    return <Heart className="w-3 h-3" />;
  };

  // Combine some interests for "Vibe Keywords"
  const vibeKeywords = [
    ...(student.hobbies || []),
    ...(student.music || []),
    ...(student.movies || [])
  ].slice(0, 4);

  return (
    <div className="group relative p-8 rounded-[2.5rem] bg-[#0f111a] border border-white/5 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden">
      {/* Top Section */}
      <div className="flex items-start gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-[#1a1d29] border-4 border-[#1a1d29] shadow-2xl">
            <img 
              src={student.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
              alt={student.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center border-4 border-[#0f111a] shadow-lg">
            <Music className="w-4 h-4 text-white fill-current" />
          </div>
        </div>

        <div className="flex-1 pt-2">
          <h3 className="text-3xl font-black text-white mb-1 tracking-tight group-hover:text-purple-400 transition-colors">
            {student.name}
          </h3>
          <p className="text-blue-500 font-black text-sm uppercase tracking-wider mb-1">
            {student.course || 'CS'}
          </p>
          <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em]">
            {student.year || 'FRESHMAN'} YEAR
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-10">
        <p className="text-white/50 text-base italic leading-relaxed font-medium">
          "{student.bio || 'Living life one vibe at a time.'}"
        </p>
      </div>

      {/* Vibe Keywords */}
      <div className="mb-10">
        <h4 className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em] mb-5">
          VIBE KEYWORDS
        </h4>
        <div className="flex flex-wrap gap-3">
          {vibeKeywords.length > 0 ? vibeKeywords.map((keyword, idx) => (
            <span 
              key={`${keyword}-${idx}`} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-all"
            >
              {keyword} {getInterestIcon(keyword)}
            </span>
          )) : (
            <span className="text-white/10 text-xs italic">No keywords yet</span>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-8 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">POP</span>
          <Music className="w-4 h-4 text-white/20" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/10 text-[11px] font-black uppercase tracking-[0.3em]">MIX</span>
          <Film className="w-4 h-4 text-white/20" />
        </div>
      </div>

      {/* Hover Overlay Actions */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
        <button 
          onClick={() => navigate(`/compare/${student.uid}`)}
          className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          title="Compare Vibes"
        >
          <Zap className="w-6 h-6" />
        </button>
        {matchScore >= 60 ? (
          <button 
            onClick={() => navigate(`/messages/${student.uid}`)}
            className="p-4 rounded-2xl bg-purple-600 text-white shadow-xl shadow-purple-500/20 hover:bg-purple-500 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
            title="Start Chat"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        ) : (
          <div 
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/20 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 cursor-not-allowed"
            title="Score too low to chat (Need 60%)"
          >
            <Lock className="w-6 h-6" />
          </div>
        )}
        <button 
          onClick={() => navigate(`/profile/${student.uid}`)}
          className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
          title="View Profile"
        >
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
