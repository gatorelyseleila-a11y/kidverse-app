'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Briefcase,
  Wrench,
  User,
  Camera,
  FileText,
  Phone,
  Building2,
  Calendar,
  LogIn,
  LogOut,
  AlertTriangle,
  Eye,
  Edit2,
  Trash2,
  Badge
} from 'lucide-react';

interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  type: 'parent' | 'contractor' | 'delivery' | 'inspector' | 'other';
  purpose: string;
  hostName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'expected' | 'checked_in' | 'checked_out';
  badgeNumber?: string;
  photo?: string;
  notes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

const mockVisitors: Visitor[] = [
  {
    id: '1',
    firstName: 'Pierre',
    lastName: 'Gagnon',
    phone: '514-555-0301',
    type: 'parent',
    purpose: 'Visite de la garderie',
    hostName: 'Marie Lapointe',
    checkInTime: '09:30',
    status: 'checked_in',
    badgeNumber: 'V-001',
    scheduledDate: '2024-12-04',
    scheduledTime: '09:30',
  },
  {
    id: '2',
    firstName: 'Luc',
    lastName: 'Tremblay',
    company: 'Électricité Plus',
    phone: '514-555-0302',
    type: 'contractor',
    purpose: 'Réparation éclairage salle 3',
    hostName: 'Jean Tremblay',
    checkInTime: '08:00',
    checkOutTime: '11:30',
    status: 'checked_out',
    badgeNumber: 'V-002',
    scheduledDate: '2024-12-04',
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Martin',
    company: 'Ministère de la Famille',
    phone: '514-555-0303',
    type: 'inspector',
    purpose: 'Inspection annuelle',
    hostName: 'Marie Lapointe',
    status: 'expected',
    scheduledDate: '2024-12-05',
    scheduledTime: '10:00',
    notes: 'Documents à préparer: permis, ratios, sécurité',
  },
  {
    id: '4',
    firstName: 'Marc',
    lastName: 'Bouchard',
    company: 'Sysco',
    phone: '514-555-0304',
    type: 'delivery',
    purpose: 'Livraison fournitures alimentaires',
    checkInTime: '07:15',
    checkOutTime: '07:45',
    status: 'checked_out',
    scheduledDate: '2024-12-04',
  },
  {
    id: '5',
    firstName: 'Anne',
    lastName: 'Roy',
    phone: '514-555-0305',
    type: 'parent',
    purpose: 'Réunion d\'inscription',
    hostName: 'Marie Lapointe',
    status: 'expected',
    scheduledDate: '2024-12-04',
    scheduledTime: '14:00',
  },
];

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
  parent: { icon: User, label: 'Parent', color: 'bg-blue-100 text-blue-700' },
  contractor: { icon: Wrench, label: 'Entrepreneur', color: 'bg-amber-100 text-amber-700' },
  delivery: { icon: Truck, label: 'Livraison', color: 'bg-green-100 text-green-700' },
  inspector: { icon: Briefcase, label: 'Inspecteur', color: 'bg-purple-100 text-purple-700' },
  other: { icon: Users, label: 'Autre', color: 'bg-gray-100 text-gray-700' },
};

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredVisitors = visitors
    .filter(v => 
      `${v.firstName} ${v.lastName} ${v.company || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(v => typeFilter === 'all' || v.type === typeFilter)
    .filter(v => statusFilter === 'all' || v.status === statusFilter)
    .filter(v => v.scheduledDate === today || v.status === 'checked_in');

  const stats = {
    today: visitors.filter(v => v.scheduledDate === today).length,
    currentlyIn: visitors.filter(v => v.status === 'checked_in').length,
    expected: visitors.filter(v => v.status === 'expected' && v.scheduledDate === today).length,
  };

  const checkIn = (id: string) => {
    const time = currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
    const badgeNumber = `V-${String(visitors.length + 1).padStart(3, '0')}`;
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'checked_in', checkInTime: time, badgeNumber } : v
    ));
  };

  const checkOut = (id: string) => {
    const time = currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'checked_out', checkOutTime: time } : v
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des visiteurs</h1>
          <p className="text-gray-500">
            {currentTime.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau visiteur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              <p className="text-xs text-gray-500">Prévus aujourd'hui</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <LogIn className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.currentlyIn}</p>
              <p className="text-xs text-gray-500">Actuellement présents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.expected}</p>
              <p className="text-xs text-gray-500">En attente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Currently In Alert */}
      {stats.currentlyIn > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Badge className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">
                {stats.currentlyIn} visiteur{stats.currentlyIn > 1 ? 's' : ''} actuellement dans le bâtiment
              </h3>
              <p className="text-sm text-green-700">
                {visitors.filter(v => v.status === 'checked_in').map(v => `${v.firstName} ${v.lastName}`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un visiteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous les types</option>
            {Object.entries(typeConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous les statuts</option>
            <option value="expected">Attendu</option>
            <option value="checked_in">Présent</option>
            <option value="checked_out">Parti</option>
          </select>
        </div>
      </div>

      {/* Visitors List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Visiteur</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Motif</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Hôte</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Horaire</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVisitors.map((visitor) => {
                const type = typeConfig[visitor.type];

                return (
                  <tr key={visitor.id} className={`hover:bg-gray-50 ${
                    visitor.status === 'checked_in' ? 'bg-green-50/50' : ''
                  }`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {visitor.firstName} {visitor.lastName}
                          </p>
                          {visitor.company && (
                            <p className="text-sm text-gray-500">{visitor.company}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${type.color}`}>
                        <type.icon className="w-3.5 h-3.5" />
                        {type.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700 max-w-xs">{visitor.purpose}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{visitor.hostName || '-'}</p>
                    </td>
                    <td className="py-4 px-4">
                      {visitor.status === 'expected' ? (
                        <p className="text-sm text-gray-600">{visitor.scheduledTime || 'Non défini'}</p>
                      ) : (
                        <div className="text-sm">
                          <p className="text-green-600">↓ {visitor.checkInTime}</p>
                          {visitor.checkOutTime && (
                            <p className="text-blue-600">↑ {visitor.checkOutTime}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {visitor.status === 'expected' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                          Attendu
                        </span>
                      )}
                      {visitor.status === 'checked_in' && (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1 w-fit">
                          <Badge className="w-3 h-3" />
                          {visitor.badgeNumber}
                        </span>
                      )}
                      {visitor.status === 'checked_out' && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                          Parti
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {visitor.status === 'expected' && (
                          <button
                            onClick={() => checkIn(visitor.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <LogIn className="w-4 h-4" />
                            Arrivée
                          </button>
                        )}
                        {visitor.status === 'checked_in' && (
                          <button
                            onClick={() => checkOut(visitor.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <LogOut className="w-4 h-4" />
                            Départ
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedVisitor(visitor)}
                          className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredVisitors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun visiteur trouvé</p>
          </div>
        )}
      </div>

      {/* Add Visitor Modal */}
      {showAddForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAddForm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Nouveau visiteur</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de visiteur</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  {Object.entries(typeConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise (optionnel)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motif de la visite</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personne à rencontrer</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  <option value="">Sélectionner</option>
                  <option value="marie">Marie Lapointe (Directrice)</option>
                  <option value="jean">Jean Tremblay (Coordonnateur)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date prévue</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure prévue</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                Enregistrer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

