import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/authService';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, MapPin, GraduationCap, Music, Film, Heart, 
  Code, Target, UserCircle, Clock, Check, ChevronRight, ChevronLeft, Loader2, Camera 
} from 'lucide-react';
import InterestSelector from '../components/InterestSelector';

const SECTIONS = [
  { id: 'basic', title: 'Basic Info', icon: User },
  { id: 'music', title: 'Music', icon: Music },
  { id: 'movies', title: 'Movies', icon: Film },
  { id: 'hobbies', title: 'Hobbies', icon: Heart },
  { id: 'skills', title: 'Skills', icon: Code },
  { id: 'goals', title: 'Goals', icon: Target },
  { id: 'personality', title: 'Personality', icon: UserCircle },
  { id: 'availability', title: 'Availability', icon: Clock },
];

const OPTIONS = {
  music: ['Lofi', 'Hip Hop', 'Rap', 'Pop', 'Rock', 'EDM', 'Classical', 'Indie', 'Bollywood', 'K-Pop'],
  movies: ['Action', 'Sci-Fi', 'Anime', 'Thriller', 'Comedy', 'Documentary'],
  hobbies: ['Gaming', 'Photography', 'Reading', 'Gym', 'Traveling', 'Coding', 'Blogging', 'Designing'],
  skills: ['Web Development', 'React', 'Node.js', 'UI/UX', 'AI / ML', 'Data Science', 'Cybersecurity', 'App Development'],
  goals: ['Hackathons', 'Startup building', 'Study partners', 'Open source', 'Networking', 'Casual friends'],
  personality: ['Introvert', 'Extrovert', 'Morning person', 'Night owl', 'Solo Study', 'Group Study'],
  availability: ['Weekends', 'Evenings', 'Anytime']
};

export default function ProfileSetup() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    college: '',
    course: '',
    year: '',
    location: '',
    bio: '',
    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`,
    music: [],
    movies: [],
    hobbies: [],
    skills: [],
    goals: [],
    personality: '',
    availability: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (category, item) => {
    setFormData(prev => {
      const current = prev[category] || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [category]: updated };
    });
  };

  const handleSingleSelect = (category, value) => {
    setFormData(prev => ({ ...prev, [category]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < SECTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let profileImageUrl = formData.profileImage;

      if (imageFile) {
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        profileImageUrl = await getDownloadURL(storageRef);
      }

      await updateUserProfile(user.uid, { ...formData, profileImage: profileImageUrl });
      await refreshProfile();
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const section = SECTIONS[currentStep];
    
    switch (section.id) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 p-2 overflow-hidden shadow-2xl group-hover:border-indigo-500/50 transition-all">
                  <img 
                    src={formData.profileImage} 
                    alt="Avatar" 
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all hover:scale-110 active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Username</label>
                <input 
                  name="username" 
                  value={formData.username} 
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/50 font-bold">College</label>
                <input 
                  name="college" 
                  value={formData.college} 
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="University Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Course</label>
                <input 
                  name="course" 
                  value={formData.course} 
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="B.Tech CS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Year</label>
                <select 
                  name="year" 
                  value={formData.year} 
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Bio</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-24 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        );
      
      case 'personality':
      case 'availability':
        return (
          <div className="grid grid-cols-2 gap-3">
            {OPTIONS[section.id].map(opt => (
              <button
                key={opt}
                onClick={() => handleSingleSelect(section.id, opt)}
                className={`p-4 rounded-2xl border transition-all text-left ${
                  formData[section.id] === opt 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      default:
        return (
          <InterestSelector 
            options={OPTIONS[section.id]} 
            selected={formData[section.id]} 
            onToggle={(item) => handleInterestToggle(section.id, item)}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">Setup Your Profile</h1>
            <p className="text-white/50">Let's find your perfect student vibe.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-400">{currentStep + 1}</span>
            <span className="text-white/30 font-bold"> / {SECTIONS.length}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {SECTIONS.map((s, i) => (
            <div 
              key={s.id} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-indigo-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl min-h-[400px] flex flex-col"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            {(() => {
              const Icon = SECTIONS[currentStep].icon;
              return <Icon className="w-6 h-6" />;
            })()}
          </div>
          <h2 className="text-2xl font-bold">{SECTIONS[currentStep].title}</h2>
        </div>

        <div className="flex-1">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between mt-12 gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all disabled:opacity-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextStep}
            disabled={loading}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                {currentStep === SECTIONS.length - 1 ? 'Complete Setup' : 'Next Step'}
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
