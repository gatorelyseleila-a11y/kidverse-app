'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CalendarX,
  CalendarCheck,
  Baby,
  User,
  FileText,
  Download,
  ChevronDown
} from 'lucide-react';

interface Absence {
  id: string;
  childId: string;
  childName: string;
  startDate: string;
  endDate: string;
  reason: 'sick' | 'vacation' | 'appointment' | 'family' | 'other';
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  reportedBy: string;
  reportedAt: string;
  document?: string;
}

const mockAbsences: Absence[] = [
  {
    id: '1',
    childId: '1',
    childName: 'Emma Dupont',
    startDate: '2024-12-05',
    endDate: '2024-12-05',
    reason: 'appointment',
    notes: 'Rendez-vous chez le médecin à 10h',
    status: 'approved',
    reportedBy: 'Jean Dupont',
    reportedAt: '2024-12-03',
  },
  {
    id: '2',
    childId: '2',
    childName: 'Lucas Martin',
    startDate: '2024-12-09',
    endDate: '2024-12-13',
    reason: 'vacation',
    notes: 'Vacances en famille',
    status: 'approved',
    reportedBy: 'Marie Martin',
    reportedAt: '2024-11-20',
  },
  {
    id: '3',
    childId: '3',
    childName: 'Léa Tremblay',
    startDate: '2024-12-04',
    endDate: '2024-12-06',
    reason: 'sick',
    notes: 'Grippe - Certificat médical fourni',
    status: 'approved',
    reportedBy: 'Pierre Tremblay',
    reportedAt: '2024-12-04',
    document: 'certificat_medical.pdf',
  },
  {
    id: '4',
    childId: '4',
    childName: 'Thomas Roy',
    startDate: '2024-12-10',
    endDate: '2024-12-10',
    reason: 'family',
    notes: 'Événement familial',
    status: 'pending',
    reportedBy: 'Anne Roy',
    reportedAt: '2024-12-02',
  },
];

const reasonLabels: Record<string, { label: string; color: string; icon: any }> = {
  sick: { label: 'Maladie', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  vacation: { label: 'Vacances', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  appointment: { label: 'Rendez-vous', color: 'bg-purple-100 text-purple-700', icon: Clock },
  family: { label: 'Famille', color: 'bg-amber-100 text-amber-700', icon: User },
  other: { label: 'Autre', color: 'bg-gray-100 text-gray-700', icon: FileText },
};

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approuvé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function AbsencesPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  // New absence form state
  const [newAbsence, setNewAbsence] = useState({
    childId: '',
    startDate: '',
    endDate: '',
    reason: 'sick',
    notes: '',
  });

  const filteredAbsences = mockAbsences
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => a.childName.toLowerCase().includes(searchQuery.toLowerCase()));

  const pendingCount = mockAbsences.filter(a => a.status === 'pending').length;

  const getDaysCount = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/attendance"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des absences</h1>
            <p className="text-gray-500">Signalements et congés planifiés</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Signaler une absence
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-xs text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CalendarX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Absents aujourd'hui</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-gray-500">Congés planifiés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-xs text-gray-500">Taux de présence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
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
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tout' :
                 status === 'pending' ? 'En attente' :
                 status === 'approved' ? 'Approuvé' : 'Refusé'}
                {status === 'pending' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Absences List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Enfant</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Période</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Raison</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Signalé par</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAbsences.map((absence) => {
                const reason = reasonLabels[absence.reason];
                const status = statusLabels[absence.status];
                const days = getDaysCount(absence.startDate, absence.endDate);

                return (
                  <tr key={absence.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                          {absence.childName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{absence.childName}</p>
                          {absence.notes && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{absence.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(absence.startDate).toLocaleDateString('fr-CA')}
                          {absence.startDate !== absence.endDate && (
                            <> → {new Date(absence.endDate).toLocaleDateString('fr-CA')}</>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{days} jour{days > 1 ? 's' : ''}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${reason.color}`}>
                        <reason.icon className="w-3.5 h-3.5" />
                        {reason.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                        <status.icon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900">{absence.reportedBy}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(absence.reportedAt).toLocaleDateString('fr-CA')}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {absence.document && (
                          <button className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {absence.status === 'pending' && (
                          <>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAbsences.length === 0 && (
          <div className="text-center py-12">
            <CalendarX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune absence trouvée</p>
          </div>
        )}
      </div>

      {/* New Absence Modal */}
      {showNewForm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowNewForm(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Signaler une absence</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enfant</label>
                <select
                  value={newAbsence.childId}
                  onChange={(e) => setNewAbsence({ ...newAbsence, childId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">Sélectionner un enfant</option>
                  <option value="1">Emma Dupont</option>
                  <option value="2">Lucas Martin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={newAbsence.startDate}
                    onChange={(e) => setNewAbsence({ ...newAbsence, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={newAbsence.endDate}
                    onChange={(e) => setNewAbsence({ ...newAbsence, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison</label>
                <select
                  value={newAbsence.reason}
                  onChange={(e) => setNewAbsence({ ...newAbsence, reason: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="sick">Maladie</option>
                  <option value="vacation">Vacances</option>
                  <option value="appointment">Rendez-vous</option>
                  <option value="family">Événement familial</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
                <textarea
                  value={newAbsence.notes}
                  onChange={(e) => setNewAbsence({ ...newAbsence, notes: e.target.value })}
                  rows={3}
                  placeholder="Informations supplémentaires..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Justificatif (optionnel)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-blue transition-colors cursor-pointer">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Cliquez pour ajouter un document</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewForm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
              >
                Signaler l'absence
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

