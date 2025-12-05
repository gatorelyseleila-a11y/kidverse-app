'use client';

import { useState } from 'react';
import {
  Mail,
  Plus,
  Search,
  Send,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  FileText,
  Image,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  AlignLeft,
  X,
  ChevronDown,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: 'all' | 'classroom' | 'custom';
  recipientCount: number;
  scheduledDate?: string;
  sentDate?: string;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  updatedAt: string;
}

interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

const mockNewsletters: Newsletter[] = [
  {
    id: '1',
    title: 'Infolettre de Noël',
    subject: '🎄 Nouvelles de la garderie - Décembre 2024',
    content: 'Chers parents, voici les nouvelles du mois...',
    status: 'sent',
    recipients: 'all',
    recipientCount: 45,
    sentDate: '2024-12-01',
    openRate: 78,
    clickRate: 23,
    createdAt: '2024-11-28',
    updatedAt: '2024-12-01',
  },
  {
    id: '2',
    title: 'Rappel - Congé des fêtes',
    subject: '📅 Rappel: Fermeture durant les fêtes',
    content: 'La garderie sera fermée du 23 décembre au 2 janvier...',
    status: 'scheduled',
    recipients: 'all',
    recipientCount: 45,
    scheduledDate: '2024-12-15T09:00:00',
    createdAt: '2024-12-01',
    updatedAt: '2024-12-01',
  },
  {
    id: '3',
    title: 'Sortie au musée - Préscolaire',
    subject: '🏛️ Sortie éducative au musée',
    content: 'Une sortie au musée est prévue pour le groupe préscolaire...',
    status: 'draft',
    recipients: 'classroom',
    recipientCount: 15,
    createdAt: '2024-12-03',
    updatedAt: '2024-12-03',
  },
];

const templates: NewsletterTemplate[] = [
  { id: '1', name: 'Infolettre mensuelle', description: 'Template standard pour les nouvelles mensuelles', thumbnail: '📰' },
  { id: '2', name: 'Événement spécial', description: 'Pour annoncer un événement ou une activité', thumbnail: '🎉' },
  { id: '3', name: 'Rappel important', description: 'Pour les communications urgentes', thumbnail: '⚠️' },
  { id: '4', name: 'Félicitations', description: 'Pour célébrer les réussites', thumbnail: '🏆' },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  draft: { label: 'Brouillon', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: FileText },
  scheduled: { label: 'Planifié', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  sent: { label: 'Envoyé', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
};

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(mockNewsletters);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Editor state
  const [editorData, setEditorData] = useState({
    title: '',
    subject: '',
    content: '',
    recipients: 'all' as 'all' | 'classroom' | 'custom',
    classroom: '',
    scheduledDate: '',
  });

  const filteredNewsletters = newsletters
    .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(n => statusFilter === 'all' || n.status === statusFilter);

  const stats = {
    total: newsletters.length,
    sent: newsletters.filter(n => n.status === 'sent').length,
    scheduled: newsletters.filter(n => n.status === 'scheduled').length,
    avgOpenRate: Math.round(
      newsletters.filter(n => n.openRate).reduce((sum, n) => sum + (n.openRate || 0), 0) /
      newsletters.filter(n => n.openRate).length || 0
    ),
  };

  const openEditor = (newsletter?: Newsletter) => {
    if (newsletter) {
      setEditingNewsletter(newsletter);
      setEditorData({
        title: newsletter.title,
        subject: newsletter.subject,
        content: newsletter.content,
        recipients: newsletter.recipients,
        classroom: '',
        scheduledDate: newsletter.scheduledDate || '',
      });
    } else {
      setEditingNewsletter(null);
      setEditorData({
        title: '',
        subject: '',
        content: '',
        recipients: 'all',
        classroom: '',
        scheduledDate: '',
      });
    }
    setShowEditor(true);
  };

  const saveNewsletter = (asDraft: boolean) => {
    const newNewsletter: Newsletter = {
      id: editingNewsletter?.id || Date.now().toString(),
      title: editorData.title,
      subject: editorData.subject,
      content: editorData.content,
      status: asDraft ? 'draft' : editorData.scheduledDate ? 'scheduled' : 'sent',
      recipients: editorData.recipients,
      recipientCount: editorData.recipients === 'all' ? 45 : 15,
      scheduledDate: editorData.scheduledDate || undefined,
      sentDate: !asDraft && !editorData.scheduledDate ? new Date().toISOString() : undefined,
      createdAt: editingNewsletter?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingNewsletter) {
      setNewsletters(prev => prev.map(n => n.id === editingNewsletter.id ? newNewsletter : n));
    } else {
      setNewsletters(prev => [newNewsletter, ...prev]);
    }
    setShowEditor(false);
  };

  const deleteNewsletter = (id: string) => {
    setNewsletters(prev => prev.filter(n => n.id !== id));
  };

  const duplicateNewsletter = (newsletter: Newsletter) => {
    const duplicate: Newsletter = {
      ...newsletter,
      id: Date.now().toString(),
      title: `${newsletter.title} (copie)`,
      status: 'draft',
      sentDate: undefined,
      openRate: undefined,
      clickRate: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNewsletters(prev => [duplicate, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Infolettres</h1>
          <p className="text-gray-500">Communication avec les parents</p>
        </div>
        <button
          onClick={() => setShowTemplates(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle infolettre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total créées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
              <p className="text-xs text-gray-500">Envoyées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
              <p className="text-xs text-gray-500">Planifiées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgOpenRate}%</p>
              <p className="text-xs text-gray-500">Taux d'ouverture moy.</p>
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
              placeholder="Rechercher une infolettre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'scheduled', 'sent'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Toutes' : statusConfig[status]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletters List */}
      <div className="grid gap-4">
        {filteredNewsletters.map((newsletter) => {
          const status = statusConfig[newsletter.status];
          
          return (
            <div key={newsletter.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{newsletter.title}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bgColor} ${status.color}`}>
                      <status.icon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{newsletter.subject}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {newsletter.recipientCount} destinataires
                    </span>
                    {newsletter.status === 'scheduled' && newsletter.scheduledDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Prévu le {new Date(newsletter.scheduledDate).toLocaleDateString('fr-CA')}
                      </span>
                    )}
                    {newsletter.status === 'sent' && newsletter.sentDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Envoyé le {new Date(newsletter.sentDate).toLocaleDateString('fr-CA')}
                      </span>
                    )}
                  </div>
                  
                  {newsletter.status === 'sent' && newsletter.openRate !== undefined && (
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{newsletter.openRate}%</p>
                        <p className="text-xs text-gray-500">Taux d'ouverture</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{newsletter.clickRate}%</p>
                        <p className="text-xs text-gray-500">Taux de clic</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditor(newsletter)}
                    className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateNewsletter(newsletter)}
                    className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {newsletter.status === 'draft' && (
                    <button
                      onClick={() => deleteNewsletter(newsletter.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNewsletters.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune infolettre trouvée</p>
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplates && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowTemplates(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Choisir un modèle</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setShowTemplates(false);
                    openEditor();
                  }}
                  className="p-4 border-2 border-gray-200 rounded-xl text-left hover:border-brand-blue transition-colors"
                >
                  <div className="text-4xl mb-3">{template.thumbnail}</div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowTemplates(false);
                openEditor();
              }}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              Partir de zéro
            </button>
          </div>
        </>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowEditor(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden">
            {/* Editor Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingNewsletter ? 'Modifier l\'infolettre' : 'Nouvelle infolettre'}
              </h2>
              <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Editor Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre interne</label>
                    <input
                      type="text"
                      value={editorData.title}
                      onChange={(e) => setEditorData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Infolettre de décembre"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destinataires</label>
                    <select
                      value={editorData.recipients}
                      onChange={(e) => setEditorData(prev => ({ ...prev, recipients: e.target.value as any }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="all">Tous les parents (45)</option>
                      <option value="classroom">Par classe</option>
                      <option value="custom">Sélection personnalisée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objet du courriel</label>
                  <input
                    type="text"
                    value={editorData.subject}
                    onChange={(e) => setEditorData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="L'objet que verront les parents"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Mini toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                      <button className="p-2 hover:bg-gray-200 rounded-lg"><Bold className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg"><Italic className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg"><List className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg"><AlignLeft className="w-4 h-4" /></button>
                      <div className="w-px h-6 bg-gray-200 mx-2" />
                      <button className="p-2 hover:bg-gray-200 rounded-lg"><LinkIcon className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg"><Image className="w-4 h-4" /></button>
                      <div className="flex-1" />
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                        <Sparkles className="w-4 h-4" />
                        IA
                      </button>
                    </div>
                    <textarea
                      value={editorData.content}
                      onChange={(e) => setEditorData(prev => ({ ...prev, content: e.target.value }))}
                      rows={10}
                      placeholder="Rédigez votre message..."
                      className="w-full p-4 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Planifier l'envoi (optionnel)</label>
                  <input
                    type="datetime-local"
                    value={editorData.scheduledDate}
                    onChange={(e) => setEditorData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>
            </div>

            {/* Editor Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between">
                <button
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => saveNewsletter(true)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sauvegarder brouillon
                  </button>
                  <button className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Prévisualiser
                  </button>
                  <button
                    onClick={() => saveNewsletter(false)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {editorData.scheduledDate ? 'Planifier' : 'Envoyer maintenant'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

