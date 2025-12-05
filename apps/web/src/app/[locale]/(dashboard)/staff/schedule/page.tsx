'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  AlertTriangle,
  Check,
  X,
  Copy,
  Save,
  Printer,
  Download
} from 'lucide-react';

interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  classroom?: string;
  status: 'scheduled' | 'confirmed' | 'absent' | 'vacation';
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
  color: string;
  hoursThisWeek: number;
  maxHours: number;
}

const mockStaff: StaffMember[] = [
  { id: '1', name: 'Sophie Lavoie', position: 'Éducatrice', color: 'bg-blue-500', hoursThisWeek: 32, maxHours: 40 },
  { id: '2', name: 'Julie Roy', position: 'Éducatrice', color: 'bg-green-500', hoursThisWeek: 35, maxHours: 40 },
  { id: '3', name: 'Marc Gagnon', position: 'Éducateur', color: 'bg-purple-500', hoursThisWeek: 28, maxHours: 35 },
  { id: '4', name: 'Émilie Tremblay', position: 'Assistante', color: 'bg-pink-500', hoursThisWeek: 20, maxHours: 25 },
  { id: '5', name: 'Pierre Dubois', position: 'Éducateur', color: 'bg-amber-500', hoursThisWeek: 36, maxHours: 40 },
];

const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function StaffSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [view, setView] = useState<'week' | 'day'>('week');

  // Get week dates
  const getWeekDates = () => {
    const dates: Date[] = [];
    const monday = new Date(currentWeek);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });
  };

  // Mock shifts
  const shifts: Shift[] = [
    { id: '1', staffId: '1', staffName: 'Sophie L.', date: weekDates[0]?.toISOString().split('T')[0] || '', startTime: '07:00', endTime: '15:00', classroom: 'Poupons', status: 'confirmed' },
    { id: '2', staffId: '2', staffName: 'Julie R.', date: weekDates[0]?.toISOString().split('T')[0] || '', startTime: '09:00', endTime: '17:00', classroom: 'Bambins', status: 'confirmed' },
    { id: '3', staffId: '3', staffName: 'Marc G.', date: weekDates[0]?.toISOString().split('T')[0] || '', startTime: '10:00', endTime: '18:00', classroom: 'Préscolaire', status: 'scheduled' },
    { id: '4', staffId: '1', staffName: 'Sophie L.', date: weekDates[1]?.toISOString().split('T')[0] || '', startTime: '07:00', endTime: '15:00', classroom: 'Poupons', status: 'confirmed' },
    { id: '5', staffId: '2', staffName: 'Julie R.', date: weekDates[1]?.toISOString().split('T')[0] || '', startTime: '09:00', endTime: '17:00', classroom: 'Bambins', status: 'confirmed' },
    { id: '6', staffId: '4', staffName: 'Émilie T.', date: weekDates[1]?.toISOString().split('T')[0] || '', startTime: '08:00', endTime: '13:00', classroom: 'Poupons', status: 'scheduled' },
    { id: '7', staffId: '5', staffName: 'Pierre D.', date: weekDates[2]?.toISOString().split('T')[0] || '', startTime: '07:00', endTime: '15:00', classroom: 'Préscolaire', status: 'confirmed' },
    { id: '8', staffId: '3', staffName: 'Marc G.', date: weekDates[2]?.toISOString().split('T')[0] || '', startTime: '10:00', endTime: '18:00', status: 'vacation' },
  ];

  const getShiftsForStaffAndDay = (staffId: string, date: string) => {
    return shifts.filter(s => s.staffId === staffId && s.date === date);
  };

  const getStatusColor = (status: Shift['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-800';
      case 'scheduled': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'absent': return 'bg-red-100 border-red-300 text-red-800';
      case 'vacation': return 'bg-amber-100 border-amber-300 text-amber-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/staff"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planning du personnel</h1>
            <p className="text-gray-500">Gérez les horaires de travail</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Copy className="w-4 h-4" />
            Copier semaine
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-medium hover:bg-brand-blue-dark">
            <Plus className="w-4 h-4" />
            Ajouter un quart
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Semaine du {weekDates[0]?.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' })}
            </h2>
            <p className="text-sm text-gray-500">
              {weekDates[0]?.toLocaleDateString('fr-CA', { year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-gray-500">Employés actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">180h</p>
              <p className="text-xs text-gray-500">Heures planifiées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-xs text-gray-500">Quarts non confirmés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Check className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">98%</p>
              <p className="text-xs text-gray-500">Couverture</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-500 w-48 border-r border-gray-200">
                  Employé
                </th>
                {weekDates.map((date, index) => (
                  <th key={index} className="px-4 py-3 text-center text-sm font-medium text-gray-500 min-w-[150px]">
                    <div>{weekDays[index]}</div>
                    <div className="text-xs font-normal">{formatDate(date)}</div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 w-24 border-l border-gray-200">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockStaff.map(staff => {
                const weekTotal = shifts
                  .filter(s => s.staffId === staff.id)
                  .reduce((acc, s) => {
                    const start = parseInt(s.startTime.split(':')[0]);
                    const end = parseInt(s.endTime.split(':')[0]);
                    return acc + (end - start);
                  }, 0);

                return (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white px-4 py-3 border-r border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${staff.color}`} />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{staff.name}</p>
                          <p className="text-xs text-gray-500">{staff.position}</p>
                        </div>
                      </div>
                    </td>
                    {weekDates.map((date, dayIndex) => {
                      const dayShifts = getShiftsForStaffAndDay(staff.id, date.toISOString().split('T')[0]);
                      
                      return (
                        <td key={dayIndex} className="px-2 py-2 align-top">
                          {dayShifts.length > 0 ? (
                            <div className="space-y-1">
                              {dayShifts.map(shift => (
                                <button
                                  key={shift.id}
                                  onClick={() => setSelectedShift(shift)}
                                  className={`w-full p-2 rounded-lg border text-left text-xs transition-all hover:shadow-md ${getStatusColor(shift.status)}`}
                                >
                                  <div className="font-medium">
                                    {shift.startTime} - {shift.endTime}
                                  </div>
                                  {shift.classroom && (
                                    <div className="opacity-75">{shift.classroom}</div>
                                  )}
                                  {shift.status === 'vacation' && (
                                    <div className="opacity-75">Vacances</div>
                                  )}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <button className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-colors text-xs">
                              + Ajouter
                            </button>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center border-l border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{weekTotal}h</div>
                      <div className={`text-xs ${weekTotal > staff.maxHours ? 'text-red-500' : 'text-gray-500'}`}>
                        / {staff.maxHours}h
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-500" />
            Confirmé
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500" />
            Planifié
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500" />
            Vacances
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-500" />
            Absent
          </span>
        </div>
      </div>

      {/* Shift Detail Modal */}
      {selectedShift && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedShift(null)}
          />
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-96 bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails du quart</h3>
              <button
                onClick={() => setSelectedShift(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Employé</label>
                <p className="font-medium">{selectedShift.staffName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Début</label>
                  <p className="font-medium">{selectedShift.startTime}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Fin</label>
                  <p className="font-medium">{selectedShift.endTime}</p>
                </div>
              </div>
              {selectedShift.classroom && (
                <div>
                  <label className="text-sm text-gray-500">Classe</label>
                  <p className="font-medium">{selectedShift.classroom}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Statut</label>
                <p className={`inline-block px-2 py-1 rounded text-sm font-medium ${getStatusColor(selectedShift.status)}`}>
                  {selectedShift.status === 'confirmed' ? 'Confirmé' :
                   selectedShift.status === 'scheduled' ? 'Planifié' :
                   selectedShift.status === 'vacation' ? 'Vacances' : 'Absent'}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-brand-blue-dark">
                  Modifier
                </button>
                <button className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

