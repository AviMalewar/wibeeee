import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { subscribeToAllStudents } from '../services/matchService';
import { motion } from 'motion/react';
import DiscoverCard from '../components/DiscoverCard';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';

export default function Discover() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAllStudents(user, (data) => {
      setStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-white/50 font-medium tracking-widest uppercase text-xs">Loading the vibe...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <header className="relative py-12">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 blur-[120px] -z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[120px] -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter text-white">
              Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Peers</span>
            </h1>
            <p className="text-white/40 text-xl font-medium max-w-xl">
              Explore students vibing on campus. Connect, collaborate, and create your community.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text"
                placeholder="Search by name or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Grid Section */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5">
          <p className="text-white/30 text-xl">No students found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudents.map((student, i) => (
            <motion.div
              key={student.uid}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: i * 0.05,
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              <DiscoverCard student={student} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
