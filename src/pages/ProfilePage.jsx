import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/authService';
import { motion } from 'motion/react';
import ProfileCard from '../components/ProfileCard';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { uid } = useParams();
  const { user, profile: myProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const targetUid = uid || user?.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      if (targetUid) {
        const data = await getUserProfile(targetUid);
        setProfile(data);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [targetUid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <ProfileCard profile={profile} isOwn={targetUid === user?.uid} />
      </motion.div>
    </div>
  );
}
