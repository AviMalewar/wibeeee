import { ref, push, onValue, off, set, serverTimestamp, update, get } from "firebase/database";
import { rtdb } from "../firebase/firebaseConfig";
import CryptoJS from 'crypto-js';

const SECRET_KEY = "vibe_app_secret_key"; // Simplified for demo

export const encryptMessage = (text, chatId) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY + chatId).toString();
};

export const decryptMessage = (cipherText, chatId) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY + chatId);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || "Message could not be decrypted";
  } catch (e) {
    return "Message could not be decrypted";
  }
};

export const getChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join("_");
};

export const sendMessage = async (chatId, senderId, receiverId, text, receiverProfile, senderProfile) => {
  const messagesRef = ref(rtdb, `messages/${chatId}`);
  const newMessageRef = push(messagesRef);
  
  const encryptedText = encryptMessage(text, chatId);
  
  const messageData = {
    senderId,
    receiverId,
    text: encryptedText,
    timestamp: serverTimestamp(),
    status: 'sent' // sent, delivered, read
  };

  await set(newMessageRef, messageData);
  
  // Update chat list for both users
  const updates = {};
  updates[`user_chats/${senderId}/${receiverId}`] = {
    chatId,
    lastMessage: encryptedText,
    timestamp: serverTimestamp(),
    unreadCount: 0,
    receiverName: receiverProfile.name,
    receiverPhoto: receiverProfile.profileImage
  };
  
  // For receiver, we need to increment unread count if they are not currently in the chat
  const receiverChatRef = ref(rtdb, `user_chats/${receiverId}/${senderId}`);
  const snapshot = await get(receiverChatRef);
  const currentUnread = (snapshot.val()?.unreadCount || 0) + 1;

  // We'll update the receiver's chat list too
  updates[`user_chats/${receiverId}/${senderId}`] = {
    chatId,
    lastMessage: encryptedText,
    timestamp: serverTimestamp(),
    unreadCount: currentUnread,
    receiverName: senderProfile?.name || "Unknown",
    receiverPhoto: senderProfile?.profileImage || ""
  };

  await update(ref(rtdb), updates);
};

export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = ref(rtdb, `messages/${chatId}`);
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data ? Object.entries(data).map(([id, msg]) => ({ 
      id, 
      ...msg,
      text: decryptMessage(msg.text, chatId)
    })) : [];
    callback(messages);
  });
  
  return () => off(messagesRef);
};

export const subscribeToChatList = (uid, callback) => {
  const chatListRef = ref(rtdb, `user_chats/${uid}`);
  onValue(chatListRef, (snapshot) => {
    const data = snapshot.val();
    const chats = data ? Object.entries(data).map(([receiverId, chat]) => ({
      receiverId,
      ...chat,
      lastMessage: decryptMessage(chat.lastMessage, chat.chatId)
    })).sort((a, b) => b.timestamp - a.timestamp) : [];
    callback(chats);
  });
  return () => off(chatListRef);
};

export const markAsRead = async (uid, receiverId) => {
  const chatRef = ref(rtdb, `user_chats/${uid}/${receiverId}`);
  await update(chatRef, { unreadCount: 0 });
};

export const setOnlineStatus = (uid, status) => {
  const statusRef = ref(rtdb, `status/${uid}`);
  set(statusRef, {
    state: status, // 'online' or 'offline'
    lastChanged: serverTimestamp()
  });
};

export const subscribeToStatus = (uid, callback) => {
  const statusRef = ref(rtdb, `status/${uid}`);
  onValue(statusRef, (snapshot) => {
    callback(snapshot.val());
  });
  return () => off(statusRef);
};

export const setTypingStatus = (chatId, uid, isTyping) => {
  const typingRef = ref(rtdb, `typing/${chatId}/${uid}`);
  set(typingRef, isTyping);
};

export const subscribeToTypingStatus = (chatId, uid, callback) => {
  const typingRef = ref(rtdb, `typing/${chatId}/${uid}`);
  onValue(typingRef, (snapshot) => {
    callback(snapshot.val() || false);
  });
  return () => off(typingRef);
};
