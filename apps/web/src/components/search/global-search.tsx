'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Baby,
  Users,
  Building2,
  FileText,
  Calendar,
  MessageCircle,
  Clock,
  ArrowRight,
  Command,
  Hash,
  Star
} from 'lucide-react';

type ResultCategory = 'children' | 'staff' | 'documents' | 'messages' | 'events' | 'reports';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: ResultCategory;
  url: string;
  icon: any;
  starred?: boolean;
}

// Mock search data
const mockData: SearchResult[] = [
  // Children
  { id: 'c1', title: 'Emma Dupont', subtitle: 'Poupons • Présent', category: 'children', url: '/children/1', icon: Baby, starred: true },
  { id: 'c2', title: 'Lucas Martin', subtitle: 'Bambins • Présent', category: 'children', url: '/children/2', icon: Baby },
  { id: 'c3', title: 'Léa Tremblay', subtitle: 'Préscolaire • Absent', category: 'children', url: '/children/3', icon: Baby },
  { id: 'c4', title: 'Thomas Roy', subtitle: 'Maternelle • Présent', category: 'children', url: '/children/4', icon: Baby },
  
  // Staff
  { id: 's1', title: 'Sophie Lavoie', subtitle: 'Éducatrice • Poupons', category: 'staff', url: '/staff/1', icon: Users },
  { id: 's2', title: 'Julie Roy', subtitle: 'Éducatrice • Bambins', category: 'staff', url: '/staff/2', icon: Users },
  { id: 's3', title: 'Marc Gagnon', subtitle: 'Directeur', category: 'staff', url: '/staff/3', icon: Users, starred: true },
  
  // Documents
  { id: 'd1', title: 'Fiche inscription Emma Dupont', subtitle: 'PDF • 245 KB', category: 'documents', url: '/documents/1', icon: FileText },
  { id: 'd2', title: 'Rapport mensuel Novembre', subtitle: 'Excel • 1.2 MB', category: 'documents', url: '/documents/2', icon: FileText },
  { id: 'd3', title: 'Politique allergies', subtitle: 'PDF • 180 KB', category: 'documents', url: '/documents/3', icon: FileText },
  
  // Messages
  { id: 'm1', title: 'Message de Jean Dupont', subtitle: 'Concernant Emma', category: 'messages', url: '/messages/1', icon: MessageCircle },
  { id: 'm2', title: 'Message de Marie Martin', subtitle: 'Absence Lucas', category: 'messages', url: '/messages/2', icon: MessageCircle },
  
  // Events
  { id: 'e1', title: 'Réunion de parents', subtitle: 'Aujourd\'hui 18h00', category: 'events', url: '/calendar', icon: Calendar },
  { id: 'e2', title: 'Sortie au parc', subtitle: 'Demain 10h00', category: 'events', url: '/calendar', icon: Calendar },
  
  // Reports
  { id: 'r1', title: 'Rapport de présences', subtitle: 'Novembre 2024', category: 'reports', url: '/reports', icon: FileText },
  { id: 'r2', title: 'Rapport financier Q3', subtitle: '2024', category: 'reports', url: '/reports', icon: FileText },
];

const quickActions = [
  { label: 'Nouveau check-in', shortcut: 'C', url: '/attendance' },
  { label: 'Nouvelle inscription', shortcut: 'N', url: '/children/new' },
  { label: 'Envoyer un message', shortcut: 'M', url: '/messages' },
  { label: 'Générer un rapport', shortcut: 'R', url: '/reports' },
];

const categoryLabels: Record<ResultCategory, string> = {
  children: 'Enfants',
  staff: 'Personnel',
  documents: 'Documents',
  messages: 'Messages',
  events: 'Événements',
  reports: 'Rapports',
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Emma', 'Rapport', 'Sophie']);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (query.trim()) {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
    }
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    if (!recentSearches.includes(query) && query.trim()) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    router.push(result.url);
    onClose();
    setQuery('');
  };

  const handleQuickAction = (url: string) => {
    router.push(url);
    onClose();
  };

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<ResultCategory, SearchResult[]>);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="relative border-b border-gray-100">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher enfants, personnel, documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-14 py-5 text-lg focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim() ? (
              results.length > 0 ? (
                <div className="py-2">
                  {Object.entries(groupedResults).map(([category, categoryResults]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {categoryLabels[category as ResultCategory]}
                      </div>
                      {categoryResults.map((result, index) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              globalIndex === selectedIndex
                                ? 'bg-brand-blue/10'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              globalIndex === selectedIndex
                                ? 'bg-brand-blue text-white'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <result.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 truncate">
                                  {result.title}
                                </span>
                                {result.starred && (
                                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                                )}
                              </div>
                              {result.subtitle && (
                                <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                              )}
                            </div>
                            <ArrowRight className={`w-4 h-4 ${
                              globalIndex === selectedIndex ? 'text-brand-blue' : 'text-gray-300'
                            }`} />
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun résultat pour "{query}"</p>
                  <p className="text-sm text-gray-400 mt-1">Essayez avec d'autres termes</p>
                </div>
              )
            ) : (
              <div className="p-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      <Clock className="w-3 h-3" />
                      Recherches récentes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    <Command className="w-3 h-3" />
                    Actions rapides
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.url)}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-gray-700">{action.label}</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-500">
                          <Command className="w-3 h-3" />
                          {action.shortcut}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border rounded">↓</kbd>
                naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd>
                sélectionner
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border rounded">esc</kbd>
                fermer
              </span>
            </div>
            <span>KIDVERSE Search</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to open search with keyboard shortcut
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    openSearch: () => setIsOpen(true),
    closeSearch: () => setIsOpen(false),
  };
}

