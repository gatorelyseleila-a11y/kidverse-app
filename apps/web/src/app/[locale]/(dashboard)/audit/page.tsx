'use client';

import { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  User,
  Baby,
  CreditCard,
  FileText,
  Settings,
  Shield,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Clock,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'export' | 'import';
  entity: 'child' | 'staff' | 'attendance' | 'payment' | 'document' | 'user' | 'settings' | 'report';
  entityId?: string;
  entityName?: string;
  details?: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-12-04T14:32:15',
    userId: 'usr_001',
    userName: 'Marie Lapointe',
    userRole: 'ADMIN',
    action: 'update',
    entity: 'child',
    entityId: 'ch_001',
    entityName: 'Emma Dupont',
    details: 'Mise à jour des informations de santé',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0 Windows',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2024-12-04T14:28:45',
    userId: 'usr_002',
    userName: 'Jean Tremblay',
    userRole: 'EDUCATOR',
    action: 'create',
    entity: 'attendance',
    entityId: 'att_001',
    entityName: 'Lucas Martin - Check-in',
    details: 'Enregistrement arrivée 08:15',
    ipAddress: '192.168.1.101',
    userAgent: 'Safari/17.0 iPad',
    status: 'success',
  },
  {
    id: '3',
    timestamp: '2024-12-04T14:15:30',
    userId: 'usr_003',
    userName: 'Sophie Martin',
    userRole: 'DIRECTOR',
    action: 'export',
    entity: 'report',
    entityName: 'Rapport de présences - Novembre 2024',
    details: 'Export PDF',
    ipAddress: '192.168.1.102',
    userAgent: 'Firefox/121.0 MacOS',
    status: 'success',
  },
  {
    id: '4',
    timestamp: '2024-12-04T13:45:00',
    userId: 'usr_001',
    userName: 'Marie Lapointe',
    userRole: 'ADMIN',
    action: 'delete',
    entity: 'document',
    entityId: 'doc_005',
    entityName: 'Ancien certificat médical',
    details: 'Document expiré supprimé',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0 Windows',
    status: 'success',
  },
  {
    id: '5',
    timestamp: '2024-12-04T13:30:22',
    userId: 'usr_004',
    userName: 'Pierre Gagnon',
    userRole: 'PARENT',
    action: 'view',
    entity: 'child',
    entityId: 'ch_003',
    entityName: 'Léa Gagnon',
    details: 'Consultation du profil enfant',
    ipAddress: '76.89.123.45',
    userAgent: 'Chrome/120.0 Android',
    status: 'success',
  },
  {
    id: '6',
    timestamp: '2024-12-04T12:15:00',
    userId: 'usr_005',
    userName: 'Inconnu',
    userRole: 'UNKNOWN',
    action: 'login',
    entity: 'user',
    details: 'Tentative de connexion échouée - mot de passe incorrect',
    ipAddress: '203.45.67.89',
    userAgent: 'Unknown',
    status: 'failure',
  },
  {
    id: '7',
    timestamp: '2024-12-04T11:45:30',
    userId: 'usr_001',
    userName: 'Marie Lapointe',
    userRole: 'ADMIN',
    action: 'update',
    entity: 'settings',
    entityName: 'Paramètres de facturation',
    details: 'Modification du tarif journalier: 45$ → 47$',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0 Windows',
    status: 'warning',
  },
  {
    id: '8',
    timestamp: '2024-12-04T10:30:00',
    userId: 'usr_002',
    userName: 'Jean Tremblay',
    userRole: 'EDUCATOR',
    action: 'login',
    entity: 'user',
    details: 'Connexion réussie',
    ipAddress: '192.168.1.101',
    userAgent: 'Safari/17.0 iPad',
    status: 'success',
  },
];

const actionConfig: Record<string, { icon: any; label: string; color: string }> = {
  create: { icon: Plus, label: 'Création', color: 'text-green-600 bg-green-100' },
  update: { icon: Edit, label: 'Modification', color: 'text-blue-600 bg-blue-100' },
  delete: { icon: Trash2, label: 'Suppression', color: 'text-red-600 bg-red-100' },
  view: { icon: Eye, label: 'Consultation', color: 'text-gray-600 bg-gray-100' },
  login: { icon: LogIn, label: 'Connexion', color: 'text-purple-600 bg-purple-100' },
  logout: { icon: LogOut, label: 'Déconnexion', color: 'text-purple-600 bg-purple-100' },
  export: { icon: Download, label: 'Export', color: 'text-amber-600 bg-amber-100' },
  import: { icon: RefreshCw, label: 'Import', color: 'text-cyan-600 bg-cyan-100' },
};

const entityConfig: Record<string, { icon: any; label: string }> = {
  child: { icon: Baby, label: 'Enfant' },
  staff: { icon: User, label: 'Personnel' },
  attendance: { icon: Clock, label: 'Présence' },
  payment: { icon: CreditCard, label: 'Paiement' },
  document: { icon: FileText, label: 'Document' },
  user: { icon: Shield, label: 'Utilisateur' },
  settings: { icon: Settings, label: 'Paramètres' },
  report: { icon: FileText, label: 'Rapport' },
};

const statusConfig: Record<string, { icon: any; color: string }> = {
  success: { icon: CheckCircle, color: 'text-green-500' },
  failure: { icon: XCircle, color: 'text-red-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-500' },
};

export default function AuditPage() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs
    .filter(log => 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(log => actionFilter === 'all' || log.action === actionFilter)
    .filter(log => entityFilter === 'all' || log.entity === entityFilter)
    .filter(log => statusFilter === 'all' || log.status === statusFilter);

  const stats = {
    total: logs.length,
    today: logs.filter(l => l.timestamp.startsWith('2024-12-04')).length,
    failures: logs.filter(l => l.status === 'failure').length,
    criticalActions: logs.filter(l => ['delete', 'update'].includes(l.action) && l.entity === 'settings').length,
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return {
      date: date.toLocaleDateString('fr-CA'),
      time: date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal d'audit</h1>
          <p className="text-gray-500">Historique complet des activités système</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total événements</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              <p className="text-xs text-gray-500">Aujourd'hui</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.failures}</p>
              <p className="text-xs text-gray-500">Échecs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.criticalActions}</p>
              <p className="text-xs text-gray-500">Actions critiques</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par utilisateur, entité ou détails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="all">Toutes les actions</option>
              {Object.entries(actionConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="all">Toutes les entités</option>
              {Object.entries(entityConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="success">Succès</option>
              <option value="failure">Échec</option>
              <option value="warning">Avertissement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date/Heure</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Utilisateur</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Action</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Entité</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Détails</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => {
                const action = actionConfig[log.action];
                const entity = entityConfig[log.entity];
                const status = statusConfig[log.status];
                const { date, time } = formatTimestamp(log.timestamp);

                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{time}</p>
                        <p className="text-xs text-gray-500">{date}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{log.userName}</p>
                          <p className="text-xs text-gray-500">{log.userRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${action.color}`}>
                        <action.icon className="w-3.5 h-3.5" />
                        {action.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <entity.icon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-700">{entity.label}</p>
                          {log.entityName && (
                            <p className="text-xs text-gray-500">{log.entityName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate">{log.details || '-'}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <status.icon className={`w-5 h-5 mx-auto ${status.color}`} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun événement trouvé</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedLog(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Détails de l'événement</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date et heure</p>
                  <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString('fr-CA')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Statut</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const status = statusConfig[selectedLog.status];
                      return <status.icon className={`w-5 h-5 ${status.color}`} />;
                    })()}
                    <span className="font-medium capitalize">{selectedLog.status}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Utilisateur</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedLog.userName}</p>
                    <p className="text-sm text-gray-500">{selectedLog.userRole} • ID: {selectedLog.userId}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Action</p>
                  {(() => {
                    const action = actionConfig[selectedLog.action];
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${action.color}`}>
                        <action.icon className="w-3.5 h-3.5" />
                        {action.label}
                      </span>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Entité</p>
                  <p className="font-medium">{entityConfig[selectedLog.entity].label}</p>
                  {selectedLog.entityName && (
                    <p className="text-sm text-gray-500">{selectedLog.entityName}</p>
                  )}
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Détails</p>
                  <p className="text-sm">{selectedLog.details}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Informations techniques</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">IP:</span> {selectedLog.ipAddress}</p>
                  <p><span className="font-medium">Navigateur:</span> {selectedLog.userAgent}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full mt-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </>
      )}
    </div>
  );
}

