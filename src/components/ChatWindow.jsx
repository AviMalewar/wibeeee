import { useState, useEffect, useRef } from 'react';
import { 
  getChatId, 
  sendMessage, 
  subscribeToMessages, 
  subscribeToStatus,
  markAsRead,
  setTypingStatus,
  subscribeToTypingStatus
} from '../services/chatService';
import { Send, ChevronLeft, MoreVertical, Loader2, Zap, Smile, Paperclip, Mic } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function ChatWindow({ user, senderProfile, receiver, receiverId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [onlineStatus, setOnlineStatus] = useState(null);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const chatId = getChatId(user?.uid, receiverId);

  useEffect(() => {
    if (!chatId || !receiverId) return;

    const unsubscribeMessages = subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
    });

    const unsubscribeStatus = subscribeToStatus(receiverId, (status) => {
      setOnlineStatus(status);
    });

    const unsubscribeTyping = subscribeToTypingStatus(chatId, receiverId, (isTyping) => {
      setIsOtherUserTyping(isTyping);
    });

    // Mark as read when opening chat
    if (user?.uid && receiverId) {
      markAsRead(user.uid, receiverId);
    }

    return () => {
      unsubscribeMessages();
      unsubscribeStatus();
      unsubscribeTyping();
      if (user?.uid && chatId) {
        setTypingStatus(chatId, user.uid, false);
      }
    };
  }, [receiverId, chatId, user?.uid]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOtherUserTyping]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    if (user?.uid && chatId) {
      setTypingStatus(chatId, user.uid, true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(chatId, user.uid, false);
      }, 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user?.uid || !receiver) return;

    const text = inputText;
    setInputText('');
    
    // Immediately stop typing status when sending
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingStatus(chatId, user.uid, false);
    
    await sendMessage(chatId, user.uid, receiverId, text, receiver, senderProfile);
  };

  if (!receiverId) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#030712] text-white/20">
        <div className="relative mb-12">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl"
          />
          <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center relative z-10">
            <Zap className="w-16 h-16 text-indigo-500 fill-current" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Select a Vibe</h2>
        <p className="max-w-xs text-center font-medium leading-relaxed">
          Pick a conversation from the left to start vibing with your campus peers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#030712] relative overflow-hidden flex-1">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] -z-0" />

      {/* Header */}
      <header className="h-[80px] bg-[#030712]/80 backdrop-blur-xl px-6 flex items-center justify-between z-20 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors text-white/40"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative cursor-pointer group" onClick={() => navigate(`/profile/${receiverId}`)}>
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 border-2 border-white/10 group-hover:border-indigo-500/50 transition-all">
              <img 
                src={receiver?.profileImage} 
                alt={receiver?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {onlineStatus?.state === 'online' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#030712]" />
            )}
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => navigate(`/profile/${receiverId}`)}>
            <h3 className="text-white font-black tracking-tight leading-tight">{receiver?.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                {isOtherUserTyping ? (
                  <span className="text-indigo-400">typing...</span>
                ) : (
                  onlineStatus?.state === 'online' ? 'online' : 'offline'
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/30">
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors hover:text-white">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 z-10 custom-scrollbar"
      >
        <div className="flex justify-center mb-12">
          <span className="bg-white/5 border border-white/5 text-white/20 text-[10px] px-4 py-2 rounded-full uppercase tracking-[0.2em] font-black">
            Vibe Session Started
          </span>
        </div>
        
        {messages.map((msg, i) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={msg.senderId === user?.uid} 
            showAvatar={i === 0 || messages[i-1].senderId !== msg.senderId}
          />
        ))}

        {isOtherUserTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5">
              <img src={receiver?.profileImage} alt="" className="w-full h-full object-cover opacity-50" />
            </div>
            <div className="bg-white/5 border border-white/5 text-white px-5 py-3 rounded-[1.5rem] rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <footer className="p-6 bg-[#030712]/80 backdrop-blur-xl z-20 border-t border-white/5">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button type="button" className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <Smile className="w-6 h-6" />
            </button>
            <button type="button" className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all">
              <Paperclip className="w-6 h-6 rotate-45" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your vibe..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-[2rem] py-4 px-8 outline-none placeholder:text-white/10 focus:border-indigo-500/50 transition-all font-medium"
            />
          </div>

          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={`p-4 rounded-2xl transition-all duration-300 ${
              inputText.trim() 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-white/10 cursor-not-allowed'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
}

function Search({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="currentColor">
      <path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2.1 4.6-4.6 4.6z"></path>
    </svg>
  );
}
