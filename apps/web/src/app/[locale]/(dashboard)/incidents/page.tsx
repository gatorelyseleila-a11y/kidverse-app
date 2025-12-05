'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Baby,
  Calendar,
  MapPin,
  Camera,
  Paperclip,
  Send,
  Download,
  MessageSquare,
  Shield,
  Heart,
  Frown,
  Users,
  ChevronRight
} from 'lucide-react';

interface Incident {
  id: string;
  type: 'injury' | 'behavior' | 'health' | 'security' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  childId?: string;
  childName?: string;
  location: string;
  date: string;
  time: string;
  reportedBy: string;
  witnesses: string[];
  actionsTaken: string;
  parentNotified: boolean;
  parentNotifiedAt?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'closed';
  reviewedBy?: string;
  reviewedAt?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  attachments: string[];
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'injury',
    severity: 'medium',
    title: 'Chute dans la cour',
    description: 'Emma est tombée en courant dans la cour. Elle s\'est éraflé le genou droit. La plaie a été nettoyée et un pansement a été appliqué.',
    childId: 'ch_001',
    childName: 'Emma Dupont',
    location: 'Cour extérieure',
    date: '2024-12-05',
    time: '10:30',
    reportedBy: 'Marie Tremblay',
    witnesses: ['Sophie Martin', 'Jean Lavoie'],
    actionsTaken: 'Nettoyage de la plaie, application de pansement, glace sur le genou',
    parentNotified: true,
    parentNotifiedAt: '2024-12-05T10:45:00',
    status: 'reviewed',
    reviewedBy: 'Directrice Julie',
    reviewedAt: '2024-12-05T11:00:00',
    followUpRequired: true,
    followUpNotes: 'Vérifier l\'état de la blessure demain',
    attachments: ['photo_blessure.jpg'],
  },
  {
    id: '2',
    type: 'behavior',
    severity: 'low',
    title: 'Conflit entre enfants',
    description: 'Lucas et Thomas se sont disputés pour un jouet. Intervention de l\'éducatrice pour médiation.',
    childId: 'ch_002',
    childName: 'Lucas Martin',
    location: 'Salle de jeux',
    date: '2024-12-05',
    time: '14:15',
    reportedBy: 'Sophie Martin',
    witnesses: [],
    actionsTaken: 'Médiation entre les deux enfants, discussion sur le partage',
    parentNotified: false,
    status: 'submitted',
    followUpRequired: false,
    attachments: [],
  },
  {
    id: '3',
    type: 'health',
    severity: 'high',
    title: 'Réaction allergique légère',
    description: 'Léa a présenté des rougeurs sur les bras après la collation. Suspicion de réaction allergique aux noix.',
    childId: 'ch_003',
    childName: 'Léa Tremblay',
    location: 'Salle à manger',
    date: '2024-12-04',
    time: '15:30',
    reportedBy: 'Jean Lavoie',
    witnesses: ['Marie Tremblay'],
    actionsTaken: 'Surveillance étroite, antihistaminique administré selon protocole, parents contactés immédiatement',
    parentNotified: true,
    parentNotifiedAt: '2024-12-04T15:35:00',
    status: 'closed',
    reviewedBy: 'Directrice Julie',
    reviewedAt: '2024-12-04T16:00:00',
    followUpRequired: true,
    followUpNotes: 'Mise à jour du dossier allergies, rendez-vous parents planifié',
    attachments: ['photo_reaction.jpg', 'formulaire_allergie.pdf'],
  },
  {
    id: '4',
    type: 'security',
    severity: 'critical',
    title: 'Tentative d\'accès non autorisé',
    description: 'Une personne inconnue a tenté d\'entrer dans l\'établissement sans autorisation à l\'heure de la sortie.',
    location: 'Entrée principale',
    date: '2024-12-03',
    time: '17:00',
    reportedBy: 'Réceptionniste Anne',
    witnesses: ['Marie Tremblay', 'Parent M. Dupont'],
    actionsTaken: 'Accès refusé, vérification identité, la personne s\'est avérée être un nouveau grand-parent non encore enregistré',
    parentNotified: false,
    status: 'closed',
    reviewedBy: 'Directrice Julie',
    reviewedAt: '2024-12-03T17:30:00',
    followUpRequired: true,
    followUpNotes: 'Mise à jour des personnes autorisées pour l\'enfant concerné',
    attachments: [],
  },
];

const typeConfig: Record<string, { icon: any; label: string; color: string; bgColor: string }> = {
  injury: { icon: Heart, label: 'Blessure', color: 'text-red-700', bgColor: 'bg-red-100' },
  behavior: { icon: Users, label: 'Comportement', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  health: { icon: AlertCircle, label: 'Santé', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  security: { icon: Shield, label: 'Sécurité', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  other: { icon: FileText, label: 'Autre', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

const severityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Faible', color: 'text-green-700', bgColor: 'bg-green-100' },
  medium: { label: 'Moyen', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  high: { label: 'Élevé', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { label: 'Critique', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  draft: { label: 'Brouillon', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: Edit2 },
  submitted: { label: 'Soumis', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Send },
  reviewed: { label: 'Révisé', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Eye },
  closed: { label: 'Fermé', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
};

export default function IncidentsPage() {
  const [incidents] = useState<Incident[]>(mockIncidents);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const filteredIncidents = incidents
    .filter(inc => 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.childName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(inc => typeFilter === 'all' || inc.type === typeFilter)
    .filter(inc => severityFilter === 'all' || inc.severity === severityFilter)
    .filter(inc => statusFilter === 'all' || inc.status === statusFilter);

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status !== 'closed').length,
    critical: incidents.filter(i => i.severity === 'critical' && i.status !== 'closed').length,
    followUp: incidents.filter(i => i.followUpRequired && i.status !== 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports d'incidents</h1>
          <p className="text-gray-500">Documentation et suivi des incidents</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Signaler un incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total incidents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              <p className="text-xs text-gray-500">En cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-xs text-gray-500">Critiques actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.followUp}</p>
              <p className="text-xs text-gray-500">Suivi requis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert */}
      {stats.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
            <div>
              <h3 className="font-medium text-red-800">
                {stats.critical} incident{stats.critical > 1 ? 's' : ''} critique{stats.critical > 1 ? 's' : ''} en cours
              </h3>
              <p className="text-sm text-red-700">
                Requiert une attention immédiate
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
              placeholder="Rechercher un incident..."
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
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Toutes sévérités</option>
            {Object.entries(severityConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous statuts</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => {
          const type = typeConfig[incident.type];
          const severity = severityConfig[incident.severity];
          const status = statusConfig[incident.status];

          return (
            <div
              key={incident.id}
              className={`bg-white rounded-2xl shadow-sm border-2 p-5 transition-all cursor-pointer hover:shadow-md ${
                incident.severity === 'critical' ? 'border-red-200' :
                incident.severity === 'high' ? 'border-orange-200' : 'border-gray-100'
              }`}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Type Icon */}
                <div className={`p-3 rounded-xl ${type.bgColor} shrink-0`}>
                  <type.icon className={`w-6 h-6 ${type.color}`} />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${severity.bgColor} ${severity.color}`}>
                      {severity.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">{incident.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {incident.childName && (
                      <span className="flex items-center gap-1">
                        <Baby className="w-3.5 h-3.5" />
                        {incident.childName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(incident.date).toLocaleDateString('fr-CA')} à {incident.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {incident.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {incident.reportedBy}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bgColor} ${status.color}`}>
                      <status.icon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                    {incident.parentNotified && (
                      <p className="text-xs text-green-600 mt-1">✓ Parent notifié</p>
                    )}
                    {incident.followUpRequired && incident.status !== 'closed' && (
                      <p className="text-xs text-amber-600 mt-1">⚠ Suivi requis</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun incident trouvé</p>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedIncident(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig[selectedIncident.type].bgColor} ${typeConfig[selectedIncident.type].color}`}>
                      {typeConfig[selectedIncident.type].label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityConfig[selectedIncident.severity].bgColor} ${severityConfig[selectedIncident.severity].color}`}>
                      {severityConfig[selectedIncident.severity].label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig[selectedIncident.status].bgColor} ${statusConfig[selectedIncident.status].color}`}>
                      {statusConfig[selectedIncident.status].label}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedIncident.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedIncident.childName && (
                  <div>
                    <label className="text-xs text-gray-500">Enfant concerné</label>
                    <p className="font-medium text-gray-900">{selectedIncident.childName}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500">Date et heure</label>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedIncident.date).toLocaleDateString('fr-CA')} à {selectedIncident.time}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Lieu</label>
                  <p className="font-medium text-gray-900">{selectedIncident.location}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Signalé par</label>
                  <p className="font-medium text-gray-900">{selectedIncident.reportedBy}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Description de l'incident</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl">{selectedIncident.description}</p>
              </div>

              {/* Actions Taken */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Actions prises</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl">{selectedIncident.actionsTaken}</p>
              </div>

              {/* Witnesses */}
              {selectedIncident.witnesses.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Témoins</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.witnesses.map((witness, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                        {witness}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Parent Notification */}
              <div className={`p-4 rounded-xl ${selectedIncident.parentNotified ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-2">
                  {selectedIncident.parentNotified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Parent notifié</p>
                        <p className="text-sm text-green-700">
                          Le {new Date(selectedIncident.parentNotifiedAt!).toLocaleString('fr-CA')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800">Parent non notifié</p>
                        <p className="text-sm text-amber-700">Action requise</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Follow-up */}
              {selectedIncident.followUpRequired && (
                <div className="p-4 bg-amber-50 rounded-xl">
                  <h4 className="font-medium text-amber-800 mb-2">Suivi requis</h4>
                  <p className="text-sm text-amber-700">{selectedIncident.followUpNotes}</p>
                </div>
              )}

              {/* Review Info */}
              {selectedIncident.reviewedBy && (
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium text-purple-800 mb-1">Révisé par</h4>
                  <p className="text-sm text-purple-700">
                    {selectedIncident.reviewedBy} - {new Date(selectedIncident.reviewedAt!).toLocaleString('fr-CA')}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {selectedIncident.attachments.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Pièces jointes</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.attachments.map((file, idx) => (
                      <button
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        {file}
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between">
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter PDF
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedIncident(null)}
                    className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Fermer
                  </button>
                  {selectedIncident.status !== 'closed' && (
                    <button className="px-6 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                      Marquer comme fermé
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Incident Form Modal */}
      {showNewForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowNewForm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Signaler un incident</h2>
              <p className="text-gray-500">Documentez l'incident de manière détaillée</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'incident *</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue">
                    {Object.entries(typeConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sévérité *</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue">
                    {Object.entries(severityConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  placeholder="Résumé bref de l'incident"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enfant concerné</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  <option value="">Aucun enfant spécifique</option>
                  <option value="ch_001">Emma Dupont</option>
                  <option value="ch_002">Lucas Martin</option>
                  <option value="ch_003">Léa Tremblay</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
                  <input
                    type="text"
                    placeholder="ex: Cour extérieure"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée *</label>
                <textarea
                  rows={4}
                  placeholder="Décrivez ce qui s'est passé..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actions prises *</label>
                <textarea
                  rows={3}
                  placeholder="Quelles mesures ont été prises..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Témoins</label>
                <input
                  type="text"
                  placeholder="Noms des témoins (séparés par virgule)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pièces jointes</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Glissez des photos ou documents ici</p>
                  <button className="mt-2 text-sm text-brand-blue hover:underline">ou parcourir</button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="notify-parent" className="w-4 h-4 rounded border-gray-300" />
                <label htmlFor="notify-parent" className="text-sm text-gray-700">
                  Notifier le parent immédiatement
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="follow-up" className="w-4 h-4 rounded border-gray-300" />
                <label htmlFor="follow-up" className="text-sm text-gray-700">
                  Suivi requis
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors">
                  Sauvegarder brouillon
                </button>
                <button className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
                  Soumettre
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

