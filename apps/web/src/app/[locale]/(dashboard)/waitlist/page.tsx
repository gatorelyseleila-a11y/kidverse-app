'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  Mail,
  Phone,
  Baby,
  CheckCircle,
  XCircle,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Send,
  Trash2,
  Edit2,
  Eye,
  Star,
  AlertCircle
} from 'lucide-react';

interface WaitlistEntry {
  id: string;
  childFirstName: string;
  childLastName: string;
  birthDate: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  preferredStartDate: string;
  preferredClassroom: string;
  status: 'pending' | 'contacted' | 'interview' | 'offered' | 'accepted' | 'declined';
  priority: 'normal' | 'high' | 'urgent';
  position: number;
  createdAt: string;
  notes?: string;
  siblings?: boolean;
}

const mockWaitlist: WaitlistEntry[] = [
  {
    id: '1',
    childFirstName: 'Charlotte',
    childLastName: 'Beaulieu',
    birthDate: '2023-03-15',
    parentName: 'Marc Beaulieu',
    parentEmail: 'marc.beaulieu@email.com',
    parentPhone: '514-555-0101',
    preferredStartDate: '2025-01-06',
    preferredClassroom: 'Poupons',
    status: 'interview',
    priority: 'high',
    position: 1,
    createdAt: '2024-09-15',
    siblings: true,
    notes: 'Frère déjà inscrit (Préscolaire)',
  },
  {
    id: '2',
    childFirstName: 'Olivier',
    childLastName: 'Gagnon',
    birthDate: '2022-08-20',
    parentName: 'Julie Gagnon',
    parentEmail: 'julie.gagnon@email.com',
    parentPhone: '514-555-0102',
    preferredStartDate: '2025-01-06',
    preferredClassroom: 'Bambins',
    status: 'contacted',
    priority: 'normal',
    position: 2,
    createdAt: '2024-10-01',
  },
  {
    id: '3',
    childFirstName: 'Émilie',
    childLastName: 'Tremblay',
    birthDate: '2023-01-10',
    parentName: 'Pierre Tremblay',
    parentEmail: 'pierre.tremblay@email.com',
    parentPhone: '514-555-0103',
    preferredStartDate: '2025-02-01',
    preferredClassroom: 'Poupons',
    status: 'pending',
    priority: 'urgent',
    position: 3,
    createdAt: '2024-10-15',
    notes: 'Urgence - retour au travail février',
  },
  {
    id: '4',
    childFirstName: 'Félix',
    childLastName: 'Roy',
    birthDate: '2022-05-25',
    parentName: 'Anne Roy',
    parentEmail: 'anne.roy@email.com',
    parentPhone: '514-555-0104',
    preferredStartDate: '2025-03-01',
    preferredClassroom: 'Bambins',
    status: 'offered',
    priority: 'normal',
    position: 4,
    createdAt: '2024-11-01',
  },
  {
    id: '5',
    childFirstName: 'Zoé',
    childLastName: 'Lavoie',
    birthDate: '2023-06-12',
    parentName: 'Michel Lavoie',
    parentEmail: 'michel.lavoie@email.com',
    parentPhone: '514-555-0105',
    preferredStartDate: '2025-04-01',
    preferredClassroom: 'Poupons',
    status: 'pending',
    priority: 'normal',
    position: 5,
    createdAt: '2024-11-10',
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'En attente', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  contacted: { label: 'Contacté', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  interview: { label: 'Entrevue', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  offered: { label: 'Offre envoyée', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  accepted: { label: 'Accepté', color: 'text-green-600', bgColor: 'bg-green-100' },
  declined: { label: 'Refusé', color: 'text-red-600', bgColor: 'bg-red-100' },
};

const priorityConfig: Record<string, { label: string; color: string; icon: any }> = {
  normal: { label: 'Normal', color: 'text-gray-500', icon: null },
  high: { label: 'Haute', color: 'text-amber-500', icon: Star },
  urgent: { label: 'Urgente', color: 'text-red-500', icon: AlertCircle },
};

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>(mockWaitlist);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classroomFilter, setClassroomFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredEntries = entries
    .filter(e => 
      `${e.childFirstName} ${e.childLastName} ${e.parentName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(e => statusFilter === 'all' || e.status === statusFilter)
    .filter(e => classroomFilter === 'all' || e.preferredClassroom === classroomFilter);

  const stats = {
    total: entries.length,
    pending: entries.filter(e => e.status === 'pending').length,
    contacted: entries.filter(e => e.status === 'contacted' || e.status === 'interview').length,
    offered: entries.filter(e => e.status === 'offered').length,
  };

  const moveUp = (id: string) => {
    const index = entries.findIndex(e => e.id === id);
    if (index > 0) {
      const newEntries = [...entries];
      [newEntries[index - 1], newEntries[index]] = [newEntries[index], newEntries[index - 1]];
      newEntries.forEach((e, i) => e.position = i + 1);
      setEntries(newEntries);
    }
  };

  const moveDown = (id: string) => {
    const index = entries.findIndex(e => e.id === id);
    if (index < entries.length - 1) {
      const newEntries = [...entries];
      [newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]];
      newEntries.forEach((e, i) => e.position = i + 1);
      setEntries(newEntries);
    }
  };

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return months < 12 ? `${months} mois` : `${Math.floor(months / 12)} an${Math.floor(months / 12) > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liste d'attente</h1>
          <p className="text-gray-500">Gestion des demandes d'inscription</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle demande
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total en attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500">À contacter</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
              <p className="text-xs text-gray-500">En processus</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Send className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.offered}</p>
              <p className="text-xs text-gray-500">Offres envoyées</p>
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
              placeholder="Rechercher un enfant ou parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={classroomFilter}
            onChange={(e) => setClassroomFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Toutes les classes</option>
            <option value="Poupons">Poupons</option>
            <option value="Bambins">Bambins</option>
            <option value="Préscolaire">Préscolaire</option>
            <option value="Maternelle">Maternelle</option>
          </select>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 w-12">#</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Enfant</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Parent</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Classe souhaitée</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date souhaitée</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.map((entry) => {
                const status = statusConfig[entry.status];
                const priority = priorityConfig[entry.priority];
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => moveUp(entry.id)}
                          disabled={entry.position === 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-900">{entry.position}</span>
                        <button
                          onClick={() => moveDown(entry.id)}
                          disabled={entry.position === entries.length}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                          {entry.childFirstName[0]}{entry.childLastName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {entry.childFirstName} {entry.childLastName}
                            </p>
                            {priority.icon && (
                              <priority.icon className={`w-4 h-4 ${priority.color}`} />
                            )}
                            {entry.siblings && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                Fratrie
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{getAge(entry.birthDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{entry.parentName}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {entry.parentEmail}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {entry.preferredClassroom}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {new Date(entry.preferredStartDate).toLocaleDateString('fr-CA')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune demande trouvée</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedEntry(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-2xl">
                  {selectedEntry.childFirstName[0]}{selectedEntry.childLastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedEntry.childFirstName} {selectedEntry.childLastName}
                  </h2>
                  <p className="text-gray-500">Position #{selectedEntry.position} sur la liste</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Informations de l'enfant</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date de naissance</span>
                    <span className="font-medium">{new Date(selectedEntry.birthDate).toLocaleDateString('fr-CA')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Âge actuel</span>
                    <span className="font-medium">{getAge(selectedEntry.birthDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Classe souhaitée</span>
                    <span className="font-medium">{selectedEntry.preferredClassroom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date de début souhaitée</span>
                    <span className="font-medium">{new Date(selectedEntry.preferredStartDate).toLocaleDateString('fr-CA')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Contact parent</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nom</span>
                    <span className="font-medium">{selectedEntry.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courriel</span>
                    <span className="font-medium">{selectedEntry.parentEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Téléphone</span>
                    <span className="font-medium">{selectedEntry.parentPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedEntry.notes && (
              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <h3 className="font-semibold text-amber-800 mb-2">Notes</h3>
                <p className="text-sm text-amber-700">{selectedEntry.notes}</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Changer le statut</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, { label, bgColor, color }]) => (
                  <button
                    key={key}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedEntry.status === key
                        ? `${bgColor} ${color} ring-2 ring-offset-2`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
              <button className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Envoyer un courriel
              </button>
              <button className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Convertir en inscription
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

