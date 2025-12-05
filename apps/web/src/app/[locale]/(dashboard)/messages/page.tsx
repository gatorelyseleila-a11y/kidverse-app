'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Search,
  Send,
  Paperclip,
  Image,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Clock,
  Plus,
  Users,
  Star,
  Archive,
  Trash2,
  Pin
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isGroup: boolean;
  participants?: string[];
  isPinned?: boolean;
  isOnline?: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    lastMessage: 'Merci pour les photos d\'Emma!',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    isGroup: false,
    isPinned: true,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Marie Martin',
    lastMessage: 'Lucas sera absent demain',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 0,
    isGroup: false,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Équipe Poupons',
    lastMessage: 'Sophie: Réunion à 14h',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 5,
    isGroup: true,
    participants: ['Sophie', 'Julie', 'Marc'],
  },
  {
    id: '4',
    name: 'Pierre Tremblay',
    lastMessage: 'D\'accord, merci pour l\'information',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    isGroup: false,
    isOnline: true,
  },
  {
    id: '5',
    name: 'Direction',
    lastMessage: 'Rappel: Formation vendredi',
    lastMessageTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
    unreadCount: 1,
    isGroup: true,
    participants: ['Marie T.', 'Tous les éducateurs'],
    isPinned: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', content: 'Bonjour! Comment va Emma aujourd\'hui?', senderId: 'parent1', senderName: 'Jean Dupont', timestamp: new Date(Date.now() - 60 * 60 * 1000), read: true, type: 'text' },
    { id: '2', content: 'Bonjour M. Dupont! Emma va très bien. Elle a beaucoup aimé l\'activité de peinture ce matin.', senderId: 'me', senderName: 'Moi', timestamp: new Date(Date.now() - 55 * 60 * 1000), read: true, type: 'text' },
    { id: '3', content: 'Voici quelques photos de son œuvre:', senderId: 'me', senderName: 'Moi', timestamp: new Date(Date.now() - 54 * 60 * 1000), read: true, type: 'text' },
    { id: '4', content: '📷 emma_peinture.jpg', senderId: 'me', senderName: 'Moi', timestamp: new Date(Date.now() - 53 * 60 * 1000), read: true, type: 'image' },
    { id: '5', content: 'Merci pour les photos d\'Emma!', senderId: 'parent1', senderName: 'Jean Dupont', timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false, type: 'text' },
    { id: '6', content: 'Elle était tellement fière de montrer son dessin 😊', senderId: 'parent1', senderName: 'Jean Dupont', timestamp: new Date(Date.now() - 4 * 60 * 1000), read: false, type: 'text' },
  ],
  '2': [
    { id: '1', content: 'Bonjour, Lucas sera absent demain pour un rendez-vous médical.', senderId: 'parent2', senderName: 'Marie Martin', timestamp: new Date(Date.now() - 30 * 60 * 1000), read: true, type: 'text' },
    { id: '2', content: 'D\'accord, merci de nous prévenir. J\'espère que tout va bien!', senderId: 'me', senderName: 'Moi', timestamp: new Date(Date.now() - 25 * 60 * 1000), read: true, type: 'text' },
  ],
};

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'me',
      senderName: 'Moi',
      timestamp: new Date(),
      read: false,
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update last message in conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id
        ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date() }
        : conv
    ));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'Hier';
    return `${days}j`;
  };

  const filteredConversations = conversations
    .filter(conv => {
      const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'unread' ? conv.unreadCount > 0 :
        filter === 'pinned' ? conv.isPinned : true;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
    });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'unread', label: `Non lus (${totalUnread})` },
              { value: 'pinned', label: 'Épinglés' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-brand-blue/5' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  conversation.isGroup 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-br from-brand-blue to-brand-orange'
                }`}>
                  {conversation.isGroup ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    conversation.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                {conversation.isOnline && !conversation.isGroup && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-900 truncate flex items-center gap-1">
                    {conversation.isPinned && <Pin className="w-3 h-3 text-brand-blue" />}
                    {conversation.name}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {getTimeAgo(conversation.lastMessageTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-brand-blue text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                selectedConversation.isGroup 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-brand-blue to-brand-orange'
              }`}>
                {selectedConversation.isGroup ? (
                  <Users className="w-4 h-4" />
                ) : (
                  selectedConversation.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedConversation.isGroup 
                    ? `${selectedConversation.participants?.length} participants` 
                    : selectedConversation.isOnline ? 'En ligne' : 'Hors ligne'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Info className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => {
              const isMe = message.senderId === 'me';
              const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== message.senderId);
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {!isMe && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {message.senderName.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  {!isMe && !showAvatar && <div className="w-8" />}
                  
                  <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isMe
                          ? 'bg-brand-blue text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {message.type === 'image' ? (
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          <span className="text-sm">{message.content}</span>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        message.read 
                          ? <CheckCheck className="w-3 h-3 text-brand-blue" />
                          : <Check className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Écrire un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Vos messages</h3>
            <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
          </div>
        </div>
      )}
    </div>
  );
}

