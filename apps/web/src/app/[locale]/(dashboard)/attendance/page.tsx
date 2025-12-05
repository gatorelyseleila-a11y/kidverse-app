'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Baby,
  AlertTriangle,
  Calendar,
  ChevronRight,
  QrCode,
  Smartphone,
  RefreshCw,
  Download,
  BarChart3,
  Users,
  CalendarX,
  History
} from 'lucide-react';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  classroom: string;
  classroomId: string;
  status: 'present' | 'absent' | 'late' | 'left';
  checkInTime?: string;
  checkOutTime?: string;
  checkedInBy?: string;
  checkedOutBy?: string;
  allergies: string[];
  expectedTime?: string;
}

interface Classroom {
  id: string;
  name: string;
  presentCount: number;
  totalCount: number;
  color: string;
}

const mockClassrooms: Classroom[] = [
  { id: '1', name: 'Poupons', presentCount: 7, totalCount: 10, color: 'bg-pink-500' },
  { id: '2', name: 'Bambins', presentCount: 12, totalCount: 15, color: 'bg-blue-500' },
  { id: '3', name: 'Préscolaire', presentCount: 13, totalCount: 15, color: 'bg-green-500' },
  { id: '4', name: 'Maternelle', presentCount: 8, totalCount: 10, color: 'bg-purple-500' },
];

const mockChildren: Child[] = [
  { id: '1', firstName: 'Emma', lastName: 'Dupont', classroom: 'Poupons', classroomId: '1', status: 'present', checkInTime: '08:15', checkedInBy: 'Jean Dupont', allergies: ['Arachides'], expectedTime: '08:00' },
  { id: '2', firstName: 'Lucas', lastName: 'Martin', classroom: 'Bambins', classroomId: '2', status: 'present', checkInTime: '08:22', checkedInBy: 'Marie Martin', allergies: [], expectedTime: '08:30' },
  { id: '3', firstName: 'Léa', lastName: 'Tremblay', classroom: 'Préscolaire', classroomId: '3', status: 'absent', allergies: [], expectedTime: '08:00' },
  { id: '4', firstName: 'Thomas', lastName: 'Roy', classroom: 'Bambins', classroomId: '2', status: 'late', checkInTime: '09:15', checkedInBy: 'Anne Roy', allergies: ['Lactose'], expectedTime: '08:00' },
  { id: '5', firstName: 'Sophie', lastName: 'Bernard', classroom: 'Maternelle', classroomId: '4', status: 'present', checkInTime: '07:55', checkedInBy: 'Pierre Bernard', allergies: [], expectedTime: '08:00' },
  { id: '6', firstName: 'Nathan', lastName: 'Gagnon', classroom: 'Préscolaire', classroomId: '3', status: 'left', checkInTime: '08:00', checkOutTime: '12:30', checkedInBy: 'Paul Gagnon', checkedOutBy: 'Paul Gagnon', allergies: [], expectedTime: '08:00' },
  { id: '7', firstName: 'Chloé', lastName: 'Lavoie', classroom: 'Poupons', classroomId: '1', status: 'absent', allergies: ['Gluten'], expectedTime: '08:30' },
  { id: '8', firstName: 'Gabriel', lastName: 'Côté', classroom: 'Bambins', classroomId: '2', status: 'present', checkInTime: '08:30', checkedInBy: 'Marie Côté', allergies: [], expectedTime: '08:30' },
  { id: '9', firstName: 'Zoé', lastName: 'Morin', classroom: 'Maternelle', classroomId: '4', status: 'present', checkInTime: '08:10', checkedInBy: 'Luc Morin', allergies: [], expectedTime: '08:00' },
  { id: '10', firstName: 'Alexis', lastName: 'Bouchard', classroom: 'Préscolaire', classroomId: '3', status: 'present', checkInTime: '08:05', checkedInBy: 'Claire Bouchard', allergies: [], expectedTime: '08:00' },
];

export default function AttendancePage() {
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInName, setCheckInName] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredChildren = children
    .filter(child => 
      `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(child => selectedClassroom === 'all' || child.classroomId === selectedClassroom)
    .filter(child => statusFilter === 'all' || child.status === statusFilter);

  const stats = {
    total: children.length,
    present: children.filter(c => c.status === 'present' || c.status === 'late').length,
    absent: children.filter(c => c.status === 'absent').length,
    left: children.filter(c => c.status === 'left').length,
    late: children.filter(c => c.status === 'late').length,
  };

  const handleCheckIn = (child: Child) => {
    setSelectedChild(child);
    setShowCheckInModal(true);
  };

  const handleCheckOut = (child: Child) => {
    setSelectedChild(child);
    setShowCheckInModal(true);
  };

  const confirmCheckIn = () => {
    if (!selectedChild || !checkInName) return;

    const time = currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
    
    setChildren(prev => prev.map(child => {
      if (child.id === selectedChild.id) {
        if (child.status === 'absent') {
          // Check in
          const isLate = child.expectedTime && time > child.expectedTime;
          return {
            ...child,
            status: isLate ? 'late' : 'present',
            checkInTime: time,
            checkedInBy: checkInName,
          };
        } else if (child.status === 'present' || child.status === 'late') {
          // Check out
          return {
            ...child,
            status: 'left',
            checkOutTime: time,
            checkedOutBy: checkInName,
          };
        }
      }
      return child;
    }));

    setShowCheckInModal(false);
    setSelectedChild(null);
    setCheckInName('');
  };

  const getStatusBadge = (status: Child['status']) => {
    switch (status) {
      case 'present':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Présent</span>;
      case 'absent':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3" /> Absent</span>;
      case 'late':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> En retard</span>;
      case 'left':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1"><UserX className="w-3 h-3" /> Parti</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Présences</h1>
          <p className="text-gray-500">
            {currentTime.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })} • {currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/attendance/absences"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <CalendarX className="w-4 h-4" />
            Absences
          </Link>
          <Link
            href="/kiosk"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Mode kiosque
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total inscrits</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              <p className="text-xs text-gray-500">Présents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              <p className="text-xs text-gray-500">Absents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
              <p className="text-xs text-gray-500">En retard</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.left}</p>
              <p className="text-xs text-gray-500">Partis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classroom Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockClassrooms.map((classroom) => (
          <button
            key={classroom.id}
            onClick={() => setSelectedClassroom(selectedClassroom === classroom.id ? 'all' : classroom.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedClassroom === classroom.id
                ? 'border-brand-blue bg-brand-blue/5'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${classroom.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                {classroom.name[0]}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{classroom.name}</p>
                <p className="text-sm text-gray-500">
                  {classroom.presentCount}/{classroom.totalCount} présents
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${classroom.color} transition-all`}
                style={{ width: `${(classroom.presentCount / classroom.totalCount) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un enfant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'present', label: 'Présents' },
              { value: 'absent', label: 'Absents' },
              { value: 'late', label: 'Retards' },
              { value: 'left', label: 'Partis' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        {selectedClassroom !== 'all' && (
          <button
            onClick={() => setSelectedClassroom('all')}
            className="mt-3 text-sm text-brand-blue hover:underline"
          >
            ← Voir toutes les classes
          </button>
        )}
      </div>

      {/* Children List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Enfant</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Classe</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Arrivée</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Départ</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                        {child.firstName[0]}{child.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{child.firstName} {child.lastName}</p>
                        {child.allergies.length > 0 && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-xs">{child.allergies.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{child.classroom}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(child.status)}
                  </td>
                  <td className="py-4 px-6">
                    {child.checkInTime ? (
                      <div>
                        <p className="font-medium text-gray-900">{child.checkInTime}</p>
                        <p className="text-xs text-gray-500">{child.checkedInBy}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {child.checkOutTime ? (
                      <div>
                        <p className="font-medium text-gray-900">{child.checkOutTime}</p>
                        <p className="text-xs text-gray-500">{child.checkedOutBy}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {child.status === 'absent' && (
                      <button
                        onClick={() => handleCheckIn(child)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Check-in
                      </button>
                    )}
                    {(child.status === 'present' || child.status === 'late') && (
                      <button
                        onClick={() => handleCheckOut(child)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Check-out
                      </button>
                    )}
                    {child.status === 'left' && (
                      <span className="text-gray-400 text-sm">Terminé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredChildren.length === 0 && (
          <div className="text-center py-12">
            <Baby className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun enfant trouvé</p>
          </div>
        )}
      </div>

      {/* Check-in/out Modal */}
      {showCheckInModal && selectedChild && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCheckInModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedChild.status === 'absent' ? 'Enregistrer l\'arrivée' : 'Enregistrer le départ'}
            </h2>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-lg">
                {selectedChild.firstName[0]}{selectedChild.lastName[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedChild.firstName} {selectedChild.lastName}</p>
                <p className="text-gray-500">{selectedChild.classroom}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedChild.status === 'absent' ? 'Accompagnateur' : 'Personne récupérant l\'enfant'}
                </label>
                <input
                  type="text"
                  value={checkInName}
                  onChange={(e) => setCheckInName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {selectedChild.allergies.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Allergies: {selectedChild.allergies.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmCheckIn}
                disabled={!checkInName}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                  selectedChild.status === 'absent'
                    ? 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                }`}
              >
                {selectedChild.status === 'absent' ? 'Confirmer l\'arrivée' : 'Confirmer le départ'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
