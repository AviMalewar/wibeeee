import { 
  User, MapPin, GraduationCap, Music, Film, Heart, 
  Code, Target, UserCircle, Clock, Zap, MessageCircle, Edit3 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileCard({ profile, isOwn }) {
  const navigate = useNavigate();

  if (!profile) return null;

  const sections = [
    { title: 'Music', icon: Music, data: profile.music, color: 'text-pink-400' },
    { title: 'Movies', icon: Film, data: profile.movies, color: 'text-purple-400' },
    { title: 'Hobbies', icon: Heart, data: profile.hobbies, color: 'text-red-400' },
    { title: 'Skills', icon: Code, data: profile.skills, color: 'text-indigo-400' },
    { title: 'Goals', icon: Target, data: profile.goals, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <img 
            src={profile.profileImage} 
            alt={profile.name} 
            className="w-40 h-40 rounded-[2rem] bg-white/5 border border-white/10 p-2 shadow-2xl"
          />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-black">{profile.name}</h1>
              <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-bold">
                @{profile.username}
              </span>
            </div>
            
            <p className="text-xl text-white/60 mb-6 max-w-xl italic">
              "{profile.bio || 'No bio yet...'}"
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/40 font-bold text-sm uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {profile.college}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {profile.location || 'Location not set'}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {isOwn ? (
              <button 
                onClick={() => navigate('/profile-setup')}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/messages/${profile.uid}`)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Start Vibe
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personality & Availability */}
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-indigo-400" />
            Personality & Availability
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Vibe Type</p>
              <p className="font-bold">{profile.personality || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Active Time</p>
              <p className="font-bold">{profile.availability || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Interests Sections */}
        {sections.map(section => (
          <div key={section.title} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <section.icon className={`w-6 h-6 ${section.color}`} />
              {section.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.data?.length > 0 ? (
                section.data.map(item => (
                  <span 
                    key={item} 
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/70"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-white/20 text-sm italic">No {section.title.toLowerCase()} added yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
