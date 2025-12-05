'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Bell,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Save,
  X,
  Check,
  FileText,
  Clock,
  DollarSign,
  Heart,
  Calendar,
  Baby,
  Users,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'attendance' | 'payment' | 'health' | 'general' | 'reminder';
  type: 'email' | 'sms' | 'push';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  lastModified: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Confirmation d\'arrivée',
    category: 'attendance',
    type: 'email',
    subject: '✓ {{childName}} est arrivé(e) à la garderie',
    content: `Bonjour {{parentName}},

Nous vous confirmons que {{childName}} est bien arrivé(e) à la garderie {{centerName}} à {{checkInTime}}.

Bonne journée!

L'équipe KIDVERSE`,
    variables: ['childName', 'parentName', 'centerName', 'checkInTime'],
    isActive: true,
    lastModified: '2024-12-01',
  },
  {
    id: '2',
    name: 'Confirmation de départ',
    category: 'attendance',
    type: 'email',
    subject: '{{childName}} a quitté la garderie',
    content: `Bonjour {{parentName}},

{{childName}} a quitté la garderie {{centerName}} à {{checkOutTime}}.

À demain!

L'équipe KIDVERSE`,
    variables: ['childName', 'parentName', 'centerName', 'checkOutTime'],
    isActive: true,
    lastModified: '2024-12-01',
  },
  {
    id: '3',
    name: 'Rappel de paiement',
    category: 'payment',
    type: 'email',
    subject: 'Rappel: Facture {{invoiceNumber}} à payer',
    content: `Bonjour {{parentName}},

Nous vous rappelons que la facture {{invoiceNumber}} d'un montant de {{amount}} $ est en attente de paiement.

Date d'échéance: {{dueDate}}

Vous pouvez effectuer votre paiement en ligne via votre portail parent.

Merci de votre collaboration.

L'équipe KIDVERSE`,
    variables: ['parentName', 'invoiceNumber', 'amount', 'dueDate'],
    isActive: true,
    lastModified: '2024-11-28',
  },
  {
    id: '4',
    name: 'Alerte santé',
    category: 'health',
    type: 'sms',
    content: `KIDVERSE - Alerte: {{childName}} présente {{symptom}}. Veuillez nous contacter au {{phone}}.`,
    variables: ['childName', 'symptom', 'phone'],
    isActive: true,
    lastModified: '2024-11-25',
  },
  {
    id: '5',
    name: 'Rappel événement',
    category: 'reminder',
    type: 'push',
    content: `N'oubliez pas: {{eventName}} le {{eventDate}} à {{eventTime}}`,
    variables: ['eventName', 'eventDate', 'eventTime'],
    isActive: true,
    lastModified: '2024-11-20',
  },
  {
    id: '6',
    name: 'Rapport quotidien',
    category: 'general',
    type: 'email',
    subject: 'Journée de {{childName}} - {{date}}',
    content: `Bonjour {{parentName}},

Voici le résumé de la journée de {{childName}}:

🍽️ Repas: {{meals}}
😴 Sieste: {{napTime}}
🎨 Activités: {{activities}}

Notes de l'éducateur:
{{notes}}

Bonne soirée!

L'équipe KIDVERSE`,
    variables: ['parentName', 'childName', 'date', 'meals', 'napTime', 'activities', 'notes'],
    isActive: true,
    lastModified: '2024-12-02',
  },
];

const categoryConfig: Record<string, { icon: any; label: string; color: string }> = {
  attendance: { icon: Clock, label: 'Présence', color: 'bg-blue-100 text-blue-700' },
  payment: { icon: DollarSign, label: 'Paiement', color: 'bg-green-100 text-green-700' },
  health: { icon: Heart, label: 'Santé', color: 'bg-red-100 text-red-700' },
  reminder: { icon: Bell, label: 'Rappel', color: 'bg-amber-100 text-amber-700' },
  general: { icon: FileText, label: 'Général', color: 'bg-gray-100 text-gray-700' },
};

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
  email: { icon: Mail, label: 'Email', color: 'bg-purple-100 text-purple-700' },
  sms: { icon: MessageSquare, label: 'SMS', color: 'bg-cyan-100 text-cyan-700' },
  push: { icon: Bell, label: 'Push', color: 'bg-pink-100 text-pink-700' },
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editForm, setEditForm] = useState<Partial<Template>>({});

  const filteredTemplates = templates
    .filter(t => categoryFilter === 'all' || t.category === categoryFilter)
    .filter(t => typeFilter === 'all' || t.type === typeFilter);

  const openEditor = (template?: Template) => {
    if (template) {
      setSelectedTemplate(template);
      setEditForm(template);
    } else {
      setSelectedTemplate(null);
      setEditForm({
        name: '',
        category: 'general',
        type: 'email',
        subject: '',
        content: '',
        variables: [],
        isActive: true,
      });
    }
    setIsEditing(true);
  };

  const saveTemplate = () => {
    // Would save to API
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const toggleActive = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const duplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `${Date.now()}`,
      name: `${template.name} (copie)`,
      lastModified: new Date().toISOString().split('T')[0],
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modèles de communication</h1>
            <p className="text-gray-500">Personnalisez vos emails, SMS et notifications</p>
          </div>
        </div>
        <button
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau modèle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">Toutes</option>
              {Object.entries(categoryConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">Tous</option>
              {Object.entries(typeConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const category = categoryConfig[template.category];
          const type = typeConfig[template.type];

          return (
            <div
              key={template.id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all ${
                !template.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${category.color}`}>
                    <category.icon className="w-4 h-4" />
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${type.color}`}>
                    {type.label}
                  </span>
                </div>
                <button
                  onClick={() => toggleActive(template.id)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    template.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    template.isActive ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              {template.subject && (
                <p className="text-sm text-gray-500 mb-2 truncate">{template.subject}</p>
              )}
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{template.content}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.variables.slice(0, 3).map((v) => (
                  <span key={v} className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded text-xs font-mono">
                    {`{{${v}}}`}
                  </span>
                ))}
                {template.variables.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                    +{template.variables.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  Modifié le {new Date(template.lastModified).toLocaleDateString('fr-CA')}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditor(template)}
                    className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateTemplate(template)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun modèle trouvé</p>
        </div>
      )}

      {/* Editor Modal */}
      {isEditing && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsEditing(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du modèle</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select
                      value={editForm.category || 'general'}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      {Object.entries(categoryConfig).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={editForm.type || 'email'}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      {Object.entries(typeConfig).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {editForm.type === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={editForm.subject || ''}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                <textarea
                  value={editForm.content || ''}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono text-sm"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Variables disponibles
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Utilisez ces variables dans votre contenu, elles seront remplacées automatiquement.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['childName', 'parentName', 'centerName', 'date', 'time', 'amount', 'invoiceNumber'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setEditForm({
                        ...editForm,
                        content: (editForm.content || '') + `{{${v}}}`
                      })}
                      className="px-2 py-1 bg-white text-blue-700 rounded text-xs font-mono hover:bg-blue-100 transition-colors"
                    >
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Eye className="w-4 h-4" />
                  Prévisualiser
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={saveTemplate}
                    className="px-6 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
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

