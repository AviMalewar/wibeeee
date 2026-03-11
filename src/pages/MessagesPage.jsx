import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ChatPanel from '../components/ChatPanel';
import ChatWindow from '../components/ChatWindow';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function MessagesPage() {
  const { user, profile: senderProfile } = useAuth();
  const { receiverId: urlReceiverId } = useParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [receiverProfile, setReceiverProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (urlReceiverId) {
      fetchReceiverProfile(urlReceiverId);
    } else {
      setSelectedChat(null);
      setReceiverProfile(null);
    }
  }, [urlReceiverId]);

  const fetchReceiverProfile = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setReceiverProfile(data);
      setSelectedChat({
        receiverId: uid,
        receiverName: data.name,
        receiverPhoto: data.profileImage
      });
    }
  };

  const handleSelectChat = (chat) => {
    navigate(`/messages/${chat.receiverId}`);
  };

  const handleBack = () => {
    navigate('/messages');
  };

  return (
    <div className="flex h-screen w-full bg-[#0b141a] overflow-hidden fixed inset-0 z-[100]">
      {/* Left Panel */}
      <div className={`${urlReceiverId ? 'hidden md:block' : 'block'} w-full md:w-[400px] h-full`}>
        <ChatPanel 
          onSelectChat={handleSelectChat} 
          selectedChatId={urlReceiverId}
        />
      </div>

      {/* Right Window */}
      <div className={`${urlReceiverId ? 'block' : 'hidden md:block'} flex-1 h-full`}>
        <ChatWindow 
          user={user} 
          senderProfile={senderProfile}
          receiver={receiverProfile} 
          receiverId={urlReceiverId}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
