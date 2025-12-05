'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Baby,
  Heart,
  Calendar,
  MessageCircle,
  Bell,
  Camera,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Utensils,
  Moon,
  Palette,
  Music,
  BookOpen,
  Star,
  ChevronRight,
  Download,
  CreditCard,
  Settings,
  User
} from 'lucide-react';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  classroom: string;
  age: string;
  status: 'present' | 'absent';
  checkInTime?: string;
  allergies: string[];
}

interface TimelineEvent {
  id: string;
  childId: string;
  type: 'checkin' | 'checkout' | 'meal' | 'nap' | 'activity' | 'photo' | 'note' | 'health';
  title: string;
  description?: string;
  time: string;
  icon: any;
  color: string;
  photoUrl?: string;
}

const mockChildren: Child[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Dupont',
    classroom: 'Poupons',
    age: '14 mois',
    status: 'present',
    checkInTime: '08:15',
    allergies: ['Arachides'],
  },
  {
    id: '2',
    firstName: 'Lucas',
    lastName: 'Dupont',
    classroom: 'Préscolaire',
    age: '3 ans',
    status: 'present',
    checkInTime: '08:20',
    allergies: [],
  },
];

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    childId: '1',
    type: 'checkin',
    title: 'Arrivée',
    description: 'Emma est arrivée avec papa',
    time: '08:15',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
  {
    id: '2',
    childId: '1',
    type: 'meal',
    title: 'Collation du matin',
    description: 'Fruits et craquelins - Tout mangé! 🍎',
    time: '09:30',
    icon: Utensils,
    color: 'bg-amber-500',
  },
  {
    id: '3',
    childId: '1',
    type: 'activity',
    title: 'Activité: Peinture',
    description: 'Emma a adoré mélanger les couleurs!',
    time: '10:00',
    icon: Palette,
    color: 'bg-pink-500',
    photoUrl: '/placeholder.jpg',
  },
  {
    id: '4',
    childId: '2',
    type: 'checkin',
    title: 'Arrivée',
    description: 'Lucas est arrivé avec maman',
    time: '08:20',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
  {
    id: '5',
    childId: '1',
    type: 'nap',
    title: 'Sieste',
    description: 'Début de la sieste',
    time: '11:30',
    icon: Moon,
    color: 'bg-purple-500',
  },
  {
    id: '6',
    childId: '2',
    type: 'activity',
    title: 'Activité: Musique',
    description: 'Chansons et instruments avec Julie',
    time: '10:30',
    icon: Music,
    color: 'bg-blue-500',
  },
  {
    id: '7',
    childId: '1',
    type: 'nap',
    title: 'Réveil',
    description: 'Fin de sieste - 1h30 de sommeil',
    time: '13:00',
    icon: Moon,
    color: 'bg-purple-500',
  },
  {
    id: '8',
    childId: '2',
    type: 'meal',
    title: 'Dîner',
    description: 'Pâtes aux légumes - Bien mangé',
    time: '11:45',
    icon: Utensils,
    color: 'bg-amber-500',
  },
  {
    id: '9',
    childId: '1',
    type: 'photo',
    title: 'Nouvelle photo',
    description: 'Emma joue avec les blocs',
    time: '14:30',
    icon: Camera,
    color: 'bg-indigo-500',
    photoUrl: '/placeholder.jpg',
  },
];

export default function ParentPortalPage() {
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [timelineFilter, setTimelineFilter] = useState<string>('all');

  const filteredTimeline = mockTimeline
    .filter(event => selectedChild === 'all' || event.childId === selectedChild)
    .filter(event => timelineFilter === 'all' || event.type === timelineFilter)
    .sort((a, b) => b.time.localeCompare(a.time));

  const quickStats = [
    { label: 'Présents aujourd\'hui', value: '2/2', icon: Baby, color: 'text-green-600 bg-green-100' },
    { label: 'Messages non lus', value: '3', icon: MessageCircle, color: 'text-blue-600 bg-blue-100' },
    { label: 'Photos du jour', value: '5', icon: Camera, color: 'text-pink-600 bg-pink-100' },
    { label: 'Prochaine facture', value: '15 déc', icon: CreditCard, color: 'text-amber-600 bg-amber-100' },
  ];

  const currentDate = new Date().toLocaleDateString('fr-CA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portail Parent</h1>
          <p className="text-gray-500 capitalize">{currentDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Messages
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Children Cards */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Mes enfants</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mockChildren.map((child) => (
            <div
              key={child.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all cursor-pointer ${
                selectedChild === child.id
                  ? 'border-brand-blue shadow-md'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => setSelectedChild(selectedChild === child.id ? 'all' : child.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-xl">
                  {child.firstName[0]}{child.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{child.firstName} {child.lastName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      child.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {child.status === 'present' ? `✓ Présent depuis ${child.checkInTime}` : 'Absent'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{child.classroom} • {child.age}</p>
                  
                  {child.allergies.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">
                        Allergies: {child.allergies.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/children/${child.id}`}
                  className="flex-1 py-2 text-center text-sm font-medium text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Voir profil
                </Link>
                <Link
                  href={`/messages?child=${child.id}`}
                  className="flex-1 py-2 text-center text-sm font-medium text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Message
                </Link>
                <Link
                  href={`/documents?child=${child.id}`}
                  className="flex-1 py-2 text-center text-sm font-medium text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Documents
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Journal de la journée</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={timelineFilter}
                    onChange={(e) => setTimelineFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="all">Tout</option>
                    <option value="meal">Repas</option>
                    <option value="nap">Siestes</option>
                    <option value="activity">Activités</option>
                    <option value="photo">Photos</option>
                  </select>
                </div>
              </div>
              {selectedChild !== 'all' && (
                <button
                  onClick={() => setSelectedChild('all')}
                  className="mt-2 text-sm text-brand-blue hover:underline"
                >
                  ← Voir tous les enfants
                </button>
              )}
            </div>

            <div className="p-4">
              {filteredTimeline.length > 0 ? (
                <div className="space-y-4">
                  {filteredTimeline.map((event, index) => {
                    const child = mockChildren.find(c => c.id === event.childId);
                    return (
                      <div key={event.id} className="flex gap-4">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full ${event.color} flex items-center justify-center text-white`}>
                            <event.icon className="w-5 h-5" />
                          </div>
                          {index < filteredTimeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gray-200 my-2" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{event.title}</span>
                            <span className="text-xs text-gray-400">{event.time}</span>
                            {selectedChild === 'all' && child && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                {child.firstName}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600">{event.description}</p>
                          )}
                          {event.photoUrl && (
                            <div className="mt-2 relative group">
                              <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                                <Camera className="w-8 h-8 text-gray-300" />
                              </div>
                              <button className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Download className="w-6 h-6 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune activité pour le moment</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Upcoming */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Prochainement</h3>
            <div className="space-y-3">
              {[
                { title: 'Réunion de parents', date: 'Jeudi 5 déc, 18h00', type: 'meeting' },
                { title: 'Sortie au parc', date: 'Vendredi 6 déc, 10h00', type: 'activity' },
                { title: 'Congé des fêtes', date: '23 déc - 2 jan', type: 'holiday' },
              ].map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.type === 'meeting' ? 'bg-blue-100' :
                    event.type === 'activity' ? 'bg-green-100' : 'bg-amber-100'
                  }`}>
                    <Calendar className={`w-5 h-5 ${
                      event.type === 'meeting' ? 'text-blue-600' :
                      event.type === 'activity' ? 'text-green-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Accès rapide</h3>
            <div className="space-y-2">
              {[
                { label: 'Signaler une absence', href: '/attendance/absence', icon: Calendar },
                { label: 'Télécharger les factures', href: '/finance', icon: FileText },
                { label: 'Mettre à jour les contacts', href: '/settings', icon: User },
                { label: 'Voir les photos', href: '/documents?type=photos', icon: Camera },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{link.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2">Besoin d'aide?</h3>
            <p className="text-white/80 text-sm mb-4">
              Notre équipe est disponible pour répondre à vos questions.
            </p>
            <Link
              href="/messages?to=admin"
              className="block w-full py-2 bg-white text-brand-blue rounded-xl text-center font-medium hover:bg-gray-100 transition-colors"
            >
              Contacter la garderie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
