import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { subscribeToChatList, markAsRead } from '../services/chatService';
import { Search, MessageSquare, UserPlus, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ChatPanel({ onSelectChat, selectedChatId }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToChatList(user.uid, (chatList) => {
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredChats = chats.filter(chat => 
    chat.receiverName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (chat) => {
    onSelectChat(chat);
    if (user?.uid) {
      markAsRead(user.uid, chat.receiverId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] border-r border-white/5 w-full md:w-[400px]">
      {/* Header */}
      <header className="h-[80px] px-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white">wibe</h2>
        </div>
        <div className="flex items-center gap-4 text-white/30">
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors hover:text-white">
            <UserPlus className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="p-6">
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-indigo-500/50 transition-all">
          <Search className="w-5 h-5 text-white/20 mr-3" />
          <input 
            type="text" 
            placeholder="Search vibes..."
            className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/20 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
        <div className="px-3 mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">ACTIVE CONVERSATIONS</h3>
        </div>
        
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium leading-relaxed">No chats yet. <br/>Start matching to find people to vibe with!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div 
                key={chat.receiverId}
                onClick={() => handleSelect(chat)}
                className={`flex items-center p-4 cursor-pointer rounded-[1.5rem] transition-all duration-300 ${
                  selectedChatId === chat.receiverId 
                    ? 'bg-white/10 border border-white/10 shadow-xl' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="relative mr-4">
                  <div className={`w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border-2 ${selectedChatId === chat.receiverId ? 'border-indigo-500/50' : 'border-white/5'}`}>
                    <img 
                      src={chat.receiverPhoto} 
                      alt={chat.receiverName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-4 border-[#030712] flex items-center justify-center">
                      <span className="text-[8px] font-black text-white">{chat.unreadCount}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-black tracking-tight truncate ${selectedChatId === chat.receiverId ? 'text-white' : 'text-white/80'}`}>
                      {chat.receiverName}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      {chat.timestamp ? formatDistanceToNow(chat.timestamp, { addSuffix: false }) : ''}
                    </span>
                  </div>
                  <p className={`text-sm truncate pr-2 font-medium ${chat.unreadCount > 0 ? 'text-indigo-400 font-bold' : 'text-white/30'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
