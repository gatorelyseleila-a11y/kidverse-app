'use client';

import { useState } from 'react';
import {
  FileText,
  Folder,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  Share2,
  Clock,
  File,
  Image,
  FileSpreadsheet,
  Film,
  ChevronRight,
  Grid3X3,
  List,
  Star,
  Lock
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'video' | 'folder' | 'other';
  size?: string;
  modifiedAt: Date;
  modifiedBy: string;
  category: string;
  isStarred?: boolean;
  isShared?: boolean;
  isPrivate?: boolean;
}

const mockFolders = [
  { id: 'f1', name: 'Inscriptions', count: 12, color: 'bg-blue-500' },
  { id: 'f2', name: 'Contrats', count: 8, color: 'bg-green-500' },
  { id: 'f3', name: 'Rapports mensuels', count: 24, color: 'bg-purple-500' },
  { id: 'f4', name: 'Photos & Vidéos', count: 156, color: 'bg-pink-500' },
  { id: 'f5', name: 'Formulaires', count: 15, color: 'bg-amber-500' },
  { id: 'f6', name: 'Politiques', count: 6, color: 'bg-red-500' },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Fiche inscription - Emma Dupont.pdf',
    type: 'pdf',
    size: '245 KB',
    modifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    modifiedBy: 'Marie T.',
    category: 'Inscriptions',
    isStarred: true,
  },
  {
    id: '2',
    name: 'Rapport mensuel - Novembre 2024.xlsx',
    type: 'spreadsheet',
    size: '1.2 MB',
    modifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    modifiedBy: 'Sophie L.',
    category: 'Rapports mensuels',
  },
  {
    id: '3',
    name: 'Photo activité peinture.jpg',
    type: 'image',
    size: '3.4 MB',
    modifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    modifiedBy: 'Julie R.',
    category: 'Photos & Vidéos',
    isShared: true,
  },
  {
    id: '4',
    name: 'Contrat de service 2024-2025.pdf',
    type: 'pdf',
    size: '520 KB',
    modifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    modifiedBy: 'Marie T.',
    category: 'Contrats',
    isPrivate: true,
  },
  {
    id: '5',
    name: 'Politique allergies alimentaires.pdf',
    type: 'pdf',
    size: '180 KB',
    modifiedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    modifiedBy: 'Direction',
    category: 'Politiques',
  },
  {
    id: '6',
    name: 'Formulaire autorisation sortie.pdf',
    type: 'pdf',
    size: '95 KB',
    modifiedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    modifiedBy: 'Marie T.',
    category: 'Formulaires',
    isStarred: true,
  },
];

export default function DocumentsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const getIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'image': return <Image className="w-6 h-6 text-green-500" />;
      case 'spreadsheet': return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      case 'video': return <Film className="w-6 h-6 text-purple-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSelect = (id: string) => {
    setSelectedDocuments(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">Gérez tous vos fichiers et documents</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <Folder className="w-5 h-5" />
            Nouveau dossier
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
            <Upload className="w-5 h-5" />
            Téléverser
          </button>
        </div>
      </div>

      {/* Quick Access Folders */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Dossiers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockFolders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setSelectedCategory(folder.name)}
              className={`p-4 bg-white rounded-xl border-2 transition-all hover:shadow-md text-left ${
                selectedCategory === folder.name ? 'border-brand-blue' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 ${folder.color} rounded-lg flex items-center justify-center mb-3`}>
                <Folder className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 truncate">{folder.name}</h3>
              <p className="text-sm text-gray-500">{folder.count} fichiers</p>
            </button>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="all">Tous les dossiers</option>
                {mockFolders.map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
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
            </div>
          </div>

          {/* Selection Actions */}
          {selectedDocuments.length > 0 && (
            <div className="flex items-center gap-4 mt-4 p-3 bg-brand-blue/5 rounded-xl">
              <span className="text-sm font-medium text-brand-blue">
                {selectedDocuments.length} sélectionné(s)
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-brand-blue/10 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-brand-blue" />
                </button>
                <button className="p-2 hover:bg-brand-blue/10 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4 text-brand-blue" />
                </button>
                <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <button
                onClick={() => setSelectedDocuments([])}
                className="ml-auto text-sm text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Files Grid/List */}
        <div className="p-4">
          {view === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  className={`relative p-4 bg-gray-50 rounded-xl border-2 transition-all cursor-pointer group ${
                    selectedDocuments.includes(doc.id) ? 'border-brand-blue bg-brand-blue/5' : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => toggleSelect(doc.id)}
                >
                  {/* Checkbox */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedDocuments.includes(doc.id)
                      ? 'bg-brand-blue border-brand-blue'
                      : 'border-gray-300 opacity-0 group-hover:opacity-100'
                  }`}>
                    {selectedDocuments.includes(doc.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Star */}
                  {doc.isStarred && (
                    <Star className="absolute top-2 right-2 w-4 h-4 text-amber-400 fill-amber-400" />
                  )}

                  {/* Icon */}
                  <div className="flex justify-center mb-3 mt-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getIcon(doc.type)}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-medium text-gray-900 text-sm truncate text-center">{doc.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {doc.isPrivate && <Lock className="w-3 h-3 text-gray-400" />}
                    {doc.isShared && <Share2 className="w-3 h-3 text-brand-blue" />}
                    <span className="text-xs text-gray-500">{doc.size}</span>
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded-lg"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
                    selectedDocuments.includes(doc.id) ? 'bg-brand-blue/5' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleSelect(doc.id)}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedDocuments.includes(doc.id)
                      ? 'bg-brand-blue border-brand-blue'
                      : 'border-gray-300'
                  }`}>
                    {selectedDocuments.includes(doc.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Icon */}
                  {getIcon(doc.type)}

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                      {doc.isStarred && <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />}
                      {doc.isPrivate && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      {doc.isShared && <Share2 className="w-4 h-4 text-brand-blue flex-shrink-0" />}
                    </div>
                  </div>

                  {/* Category */}
                  <span className="hidden md:block px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                    {doc.category}
                  </span>

                  {/* Modified */}
                  <div className="hidden lg:block text-sm text-gray-500 w-32">
                    {doc.modifiedAt.toLocaleDateString('fr-CA')}
                  </div>

                  {/* Size */}
                  <div className="text-sm text-gray-500 w-20 text-right">
                    {doc.size}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun document</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Aucun résultat pour votre recherche' : 'Commencez par téléverser un document'}
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                <Upload className="w-5 h-5" />
                Téléverser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

