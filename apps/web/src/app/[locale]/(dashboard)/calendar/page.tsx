'use client';

import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Baby,
  AlertTriangle,
  Filter,
  List,
  Grid3X3
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime?: string;
  type: 'meeting' | 'activity' | 'holiday' | 'reminder' | 'inspection';
  description?: string;
  location?: string;
  attendees?: string[];
  color: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Réunion de parents',
    date: new Date(2024, 11, 10),
    startTime: '18:00',
    endTime: '19:30',
    type: 'meeting',
    description: 'Réunion trimestrielle avec les parents',
    location: 'Salle principale',
    attendees: ['Parents', 'Éducateurs', 'Direction'],
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Sortie au parc',
    date: new Date(2024, 11, 12),
    startTime: '10:00',
    endTime: '11:30',
    type: 'activity',
    description: 'Sortie extérieure au parc municipal',
    location: 'Parc Mont-Royal',
    color: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Journée pédagogique',
    date: new Date(2024, 11, 20),
    startTime: '09:00',
    type: 'holiday',
    description: 'Garderie fermée - Formation du personnel',
    color: 'bg-amber-500',
  },
  {
    id: '4',
    title: 'Inspection annuelle',
    date: new Date(2024, 11, 15),
    startTime: '09:00',
    endTime: '12:00',
    type: 'inspection',
    description: 'Inspection du ministère de la Famille',
    color: 'bg-red-500',
  },
  {
    id: '5',
    title: 'Atelier cuisine',
    date: new Date(2024, 11, 8),
    startTime: '14:00',
    endTime: '15:00',
    type: 'activity',
    description: 'Préparation de biscuits avec les enfants',
    location: 'Cuisine',
    color: 'bg-purple-500',
  },
  {
    id: '6',
    title: 'Rappel: Vaccinations',
    date: new Date(2024, 11, 5),
    startTime: '09:00',
    type: 'reminder',
    description: 'Vérifier les carnets de vaccination',
    color: 'bg-pink-500',
  },
];

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  const [events] = useState<Event[]>(mockEvents);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const upcomingEvents = events
    .filter(e => e.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
          <p className="text-gray-500">Planification et événements</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`p-2 rounded-md transition-colors ${view === 'month' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-5 h-5" />
            Nouvel événement
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayEvents = getEventsForDate(day);
                const hasEvents = dayEvents.length > 0;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-1 rounded-xl text-sm transition-all relative ${
                      isToday(day)
                        ? 'bg-brand-blue text-white font-bold'
                        : isSelected(day)
                        ? 'bg-brand-blue/10 text-brand-blue font-semibold ring-2 ring-brand-blue'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="block">{day.getDate()}</span>
                    {hasEvents && (
                      <div className="flex justify-center gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Réunion
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                Activité
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Congé
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Inspection
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Rappel
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {selectedDate.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className={`w-1 h-full min-h-[40px] rounded-full ${event.color}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            {event.startTime}{event.endTime && ` - ${event.endTime}`}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun événement pour cette date
                </p>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-blue" />
              Prochains événements
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg ${event.color} bg-opacity-20 flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${event.color.replace('bg-', 'text-')}`}>
                      {event.date.getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{event.title}</h4>
                    <p className="text-xs text-gray-500">
                      {event.date.toLocaleDateString('fr-CA', { weekday: 'short', month: 'short' })} • {event.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add */}
          <div className="bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2">Ajouter rapidement</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Réunion', icon: Users },
                { label: 'Activité', icon: Baby },
                { label: 'Rappel', icon: AlertTriangle },
                { label: 'Congé', icon: CalendarIcon },
              ].map((item, i) => (
                <button
                  key={i}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

