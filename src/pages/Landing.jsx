import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, MessageCircle, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
          <Zap className="w-4 h-4 fill-current" />
          <span>The Vibe Matching Platform for Students</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none">
          Find Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Perfect Vibe.
          </span>
        </h1>
        
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect with like-minded students based on shared music, movies, hobbies, and goals. 
          Automatically start chatting with your best matches.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            Sign In
          </Link>
        </div>
      </motion.div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          {
            title: "Interest Based",
            desc: "Match based on music, movies, hobbies, and technical skills.",
            icon: Zap,
            color: "text-indigo-400"
          },
          {
            title: "Real-time Chat",
            desc: "Instantly connect with your matches through our seamless chat.",
            icon: MessageCircle,
            color: "text-purple-400"
          },
          {
            title: "Student Only",
            desc: "A safe space exclusively for college students to network.",
            icon: ArrowRight,
            color: "text-pink-400"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors text-left"
          >
            <feature.icon className={`w-10 h-10 ${feature.color} mb-4`} />
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-white/50">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
