'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Baby,
  Clock,
  Calendar,
  Camera,
  MessageCircle,
  FileText,
  Heart,
  Bell,
  ChevronRight,
  Sun,
  Moon,
  Utensils,
  Activity,
  Smile,
  Frown,
  Meh,
  Star,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Image,
  Play
} from 'lucide-react';

interface ChildData {
  id: string;
  name: string;
  age: string;
  group: string;
  avatar: string;
  isPresent: boolean;
  checkedInAt?: string;
  educator: string;
  todayMood?: 'happy' | 'neutral' | 'sad';
}

interface TimelineEvent {
  id: string;
  time: string;
  type: 'check_in' | 'meal' | 'nap' | 'activity' | 'diaper' | 'photo' | 'note';
  title: string;
  description?: string;
  photo?: string;
}

const childData: ChildData = {
  id: 'ch_001',
  name: 'Emma',
  age: '3 ans',
  group: 'Les Explorateurs',
  avatar: '/avatars/emma.jpg',
  isPresent: true,
  checkedInAt: '08:15',
  educator: 'Marie Tremblay',
  todayMood: 'happy',
};

const todayTimeline: TimelineEvent[] = [
  { id: '1', time: '08:15', type: 'check_in', title: 'Arrivée', description: 'Emma est arrivée avec papa' },
  { id: '2', time: '08:45', type: 'meal', title: 'Petit-déjeuner', description: 'Céréales et fruits - Bon appétit!' },
  { id: '3', time: '09:30', type: 'activity', title: 'Activité créative', description: 'Peinture - Thème: Les animaux de la ferme' },
  { id: '4', time: '10:00', type: 'diaper', title: 'Change', description: 'Couche propre ✓' },
  { id: '5', time: '10:30', type: 'photo', title: '📸 Nouvelle photo!', description: 'Emma joue avec ses amis', photo: '/photos/emma_play.jpg' },
  { id: '6', time: '11:30', type: 'meal', title: 'Collation', description: 'Compote de pommes' },
  { id: '7', time: '12:00', type: 'meal', title: 'Dîner', description: 'Pâtes au poulet, légumes - A bien mangé!' },
  { id: '8', time: '12:45', type: 'nap', title: 'Début de sieste', description: 'S\'est endormie rapidement' },
];

const quickStats = {
  meals: { eaten: 3, total: 4 },
  napDuration: '1h30',
  activities: 2,
  photos: 3,
};

const upcomingEvents = [
  { id: '1', date: '2024-12-10', title: 'Fête de Noël', type: 'event' },
  { id: '2', date: '2024-12-15', title: 'Photo avec le Père Noël', type: 'event' },
  { id: '3', date: '2024-12-15', title: 'Facture décembre', type: 'payment', amount: 827.64 },
];

const moodIcons = {
  happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-100', label: 'Très bien!' },
  neutral: { icon: Meh, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Correct' },
  sad: { icon: Frown, color: 'text-red-500', bg: 'bg-red-100', label: 'Difficile' },
};

const eventTypeIcons = {
  check_in: { icon: Clock, color: 'text-green-600', bg: 'bg-green-100' },
  meal: { icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-100' },
  nap: { icon: Moon, color: 'text-purple-600', bg: 'bg-purple-100' },
  activity: { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
  diaper: { icon: Baby, color: 'text-pink-600', bg: 'bg-pink-100' },
  photo: { icon: Camera, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  note: { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function ParentMobilePage() {
  const [activeTab, setActiveTab] = useState<'today' | 'photos' | 'messages'>('today');
  const mood = childData.todayMood ? moodIcons[childData.todayMood] : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-brand-blue to-purple-600 text-white px-4 py-4 pb-16 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">Bonjour,</p>
            <h1 className="text-xl font-bold">Jean Dupont 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white/20 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">2</span>
            </button>
          </div>
        </div>
      </div>

      {/* Child Card - Overlapping header */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {childData.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{childData.name}</h2>
                {childData.isPresent && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Présente
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{childData.group} • {childData.age}</p>
              <p className="text-xs text-gray-400 mt-1">Avec {childData.educator}</p>
            </div>
            {mood && (
              <div className={`p-3 rounded-xl ${mood.bg}`}>
                <mood.icon className={`w-6 h-6 ${mood.color}`} />
              </div>
            )}
          </div>

          {childData.checkedInAt && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Arrivée à {childData.checkedInAt}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Utensils className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{quickStats.meals.eaten}/{quickStats.meals.total}</p>
            <p className="text-xs text-gray-400">Repas</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Moon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{quickStats.napDuration}</p>
            <p className="text-xs text-gray-400">Sieste</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Activity className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{quickStats.activities}</p>
            <p className="text-xs text-gray-400">Activités</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Camera className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{quickStats.photos}</p>
            <p className="text-xs text-gray-400">Photos</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'today', label: 'Aujourd\'hui' },
            { id: 'photos', label: 'Photos' },
            { id: 'messages', label: 'Messages' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        {activeTab === 'today' && (
          <div className="space-y-4">
            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Journée d'Emma</h3>
              <div className="space-y-4">
                {todayTimeline.map((event, idx) => {
                  const eventType = eventTypeIcons[event.type];
                  return (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-xl ${eventType.bg}`}>
                          <eventType.icon className={`w-4 h-4 ${eventType.color}`} />
                        </div>
                        {idx < todayTimeline.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <span className="text-xs text-gray-400">{event.time}</span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                        )}
                        {event.photo && (
                          <div className="mt-2 bg-gray-100 rounded-xl h-32 flex items-center justify-center">
                            <div className="text-center">
                              <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                              <span className="text-xs text-gray-500">Voir la photo</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">À venir</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className={`p-2 rounded-lg ${
                      event.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {event.type === 'payment' ? (
                        <CreditCard className="w-5 h-5 text-green-600" />
                      ) : (
                        <Calendar className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-CA', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                        {event.amount && ` • ${event.amount} $`}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Galerie photos</h3>
              <span className="text-sm text-brand-blue">Voir tout</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div key={idx} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
                  MT
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">Marie Tremblay</p>
                    <span className="text-xs text-gray-400">10:30</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    Emma a passé une excellente matinée! Elle a...
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full py-3 bg-brand-blue text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Nouveau message
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-around">
        {[
          { icon: Baby, label: 'Accueil', href: '/parent/mobile', active: true },
          { icon: Calendar, label: 'Calendrier', href: '/calendar' },
          { icon: Camera, label: 'Photos', href: '#' },
          { icon: MessageCircle, label: 'Messages', href: '/messages' },
          { icon: CreditCard, label: 'Paiements', href: '/finance' },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 ${
              item.active ? 'text-brand-blue' : 'text-gray-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

