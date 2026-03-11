import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';
import { MessageSquare, Users, User, LogOut, Zap, Search, MoreHorizontal, Menu, X, Cpu } from 'lucide-react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    setIsMoreOpen(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [location]);

  const navItems = [
    { to: '/discover', label: 'DISCOVER', icon: Search, important: true },
    { to: '/dashboard', label: 'MATCHES', icon: Users, important: true },
    { to: '/messages', label: 'MESSAGES', icon: MessageSquare, important: true },
    { to: '/simulation', label: 'SIMULATION', icon: Cpu, important: true },
    { to: '/profile', label: 'PROFILE', icon: User, important: true, isProfile: true },
    { to: '/dashboard', label: 'COMPARE', icon: Zap, important: false },
  ];

  const visibleItems = navItems.filter(item => item.important);
  const moreItems = navItems.filter(item => !item.important);

  return (
    <nav className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            wibe
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-1 md:gap-2">
            {/* Main Nav Items */}
            <div className="hidden lg:flex items-center gap-1">
              {visibleItems.map((item) => (
                <Link 
                  key={item.to + item.label}
                  to={item.to} 
                  className={`p-2 xl:px-4 xl:py-2 rounded-xl transition-all flex items-center gap-2 ${
                    location.pathname === item.to 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.isProfile ? (
                    <div className="w-6 h-6 rounded-lg overflow-hidden bg-white/10 border border-white/10">
                      <img 
                        src={profile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                  <span className="hidden xl:inline font-bold tracking-wider text-xs">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile/Tablet Nav (Icons only) */}
            <div className="flex lg:hidden items-center gap-1">
              {visibleItems.slice(0, 3).map((item) => (
                <Link 
                  key={item.to + item.label + 'mob'}
                  to={item.to} 
                  className={`p-2 rounded-xl transition-all ${
                    location.pathname === item.to 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`p-2 md:px-4 md:py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isMoreOpen ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="hidden md:inline font-bold tracking-wider text-xs">MORE</span>
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-56 py-2 bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-[60] animate-in fade-in zoom-in duration-200">
                  {/* Show Profile in dropdown for mobile if hidden */}
                  <div className="lg:hidden px-2 pb-2 mb-2 border-b border-white/5">
                    <Link 
                      to="/profile"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10">
                        <img 
                          src={profile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-none">{profile?.name || 'My Profile'}</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">View Profile</span>
                      </div>
                    </Link>
                  </div>

                  {moreItems.map((item) => (
                    <Link 
                      key={item.to + item.label + 'more'}
                      to={item.to} 
                      className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-bold text-xs tracking-widest">{item.label}</span>
                    </Link>
                  ))}

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors border-t border-white/5 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-bold text-xs tracking-widest text-left">LOGOUT</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!user && (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
