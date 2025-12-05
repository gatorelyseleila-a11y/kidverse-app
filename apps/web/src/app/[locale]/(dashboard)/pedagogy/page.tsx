'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  BookOpen,
  Palette,
  Music,
  Dumbbell,
  Brain,
  Heart,
  Users,
  Camera,
  FileText,
  Clock,
  CheckCircle,
  Star,
  ChevronRight,
  Calendar,
  Baby,
  Eye,
  Target,
  Award
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  category: 'art' | 'music' | 'physical' | 'cognitive' | 'social' | 'language';
  duration: string;
  ageGroup: string;
  description: string;
  materials?: string[];
  objectives?: string[];
  createdBy: string;
  usageCount: number;
}

interface Observation {
  id: string;
  childId: string;
  childName: string;
  date: string;
  type: 'milestone' | 'behavior' | 'skill' | 'note';
  title: string;
  description: string;
  domain: string;
  educator: string;
  photos?: string[];
}

const activityCategories = [
  { id: 'art', label: 'Arts', icon: Palette, color: 'bg-pink-100 text-pink-600' },
  { id: 'music', label: 'Musique', icon: Music, color: 'bg-purple-100 text-purple-600' },
  { id: 'physical', label: 'Motricité', icon: Dumbbell, color: 'bg-green-100 text-green-600' },
  { id: 'cognitive', label: 'Cognitif', icon: Brain, color: 'bg-blue-100 text-blue-600' },
  { id: 'social', label: 'Social', icon: Heart, color: 'bg-red-100 text-red-600' },
  { id: 'language', label: 'Langage', icon: BookOpen, color: 'bg-amber-100 text-amber-600' },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Peinture aux doigts',
    category: 'art',
    duration: '30 min',
    ageGroup: '2-4 ans',
    description: 'Exploration créative avec de la peinture non toxique',
    materials: ['Peinture non toxique', 'Papier', 'Tabliers'],
    objectives: ['Motricité fine', 'Créativité', 'Expression artistique'],
    createdBy: 'Sophie L.',
    usageCount: 24,
  },
  {
    id: '2',
    title: 'Chansons et comptines',
    category: 'music',
    duration: '20 min',
    ageGroup: '1-3 ans',
    description: 'Session de chansons traditionnelles avec gestes',
    objectives: ['Développement du langage', 'Mémoire', 'Coordination'],
    createdBy: 'Julie R.',
    usageCount: 45,
  },
  {
    id: '3',
    title: 'Parcours moteur',
    category: 'physical',
    duration: '45 min',
    ageGroup: '3-5 ans',
    description: 'Circuit d\'obstacles pour développer la motricité globale',
    materials: ['Cônes', 'Cerceaux', 'Tunnels', 'Matelas'],
    objectives: ['Équilibre', 'Coordination', 'Confiance en soi'],
    createdBy: 'Marc G.',
    usageCount: 32,
  },
  {
    id: '4',
    title: 'Jeux de tri et classement',
    category: 'cognitive',
    duration: '25 min',
    ageGroup: '2-4 ans',
    description: 'Activité de tri par couleur, forme et taille',
    materials: ['Blocs de couleurs', 'Paniers', 'Formes géométriques'],
    objectives: ['Logique', 'Reconnaissance des couleurs', 'Concentration'],
    createdBy: 'Sophie L.',
    usageCount: 18,
  },
];

const mockObservations: Observation[] = [
  {
    id: '1',
    childId: '1',
    childName: 'Emma Dupont',
    date: '2024-12-04',
    type: 'milestone',
    title: 'Premier dessin de bonhomme',
    description: 'Emma a dessiné son premier bonhomme avec tête, yeux et jambes. Elle était très fière de montrer son dessin.',
    domain: 'Développement artistique',
    educator: 'Sophie L.',
  },
  {
    id: '2',
    childId: '2',
    childName: 'Lucas Martin',
    date: '2024-12-03',
    type: 'skill',
    title: 'Compte jusqu\'à 10',
    description: 'Lucas peut maintenant compter jusqu\'à 10 sans aide. Il aime compter les objets autour de lui.',
    domain: 'Développement cognitif',
    educator: 'Julie R.',
  },
  {
    id: '3',
    childId: '3',
    childName: 'Léa Tremblay',
    date: '2024-12-02',
    type: 'behavior',
    title: 'Partage avec les amis',
    description: 'Léa a spontanément partagé ses jouets avec un nouveau ami. Belle progression sociale!',
    domain: 'Développement social',
    educator: 'Sophie L.',
  },
];

export default function PedagogyPage() {
  const [activeTab, setActiveTab] = useState('activities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'activities', label: 'Activités', icon: BookOpen, count: mockActivities.length },
    { id: 'observations', label: 'Observations', icon: Eye, count: mockObservations.length },
    { id: 'milestones', label: 'Jalons', icon: Target },
    { id: 'portfolio', label: 'Portfolios', icon: Camera },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pédagogie</h1>
          <p className="text-gray-500">Activités, observations et développement</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
          <Plus className="w-5 h-5" />
          {activeTab === 'activities' ? 'Nouvelle activité' : 'Nouvelle observation'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockActivities.length}</p>
              <p className="text-sm text-gray-500">Activités</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockObservations.length}</p>
              <p className="text-sm text-gray-500">Observations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-sm text-gray-500">Jalons atteints</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Portfolios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex gap-1 p-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'activities' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une activité..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="all">Toutes les catégories</option>
                  {activityCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Quick Filters */}
              <div className="flex flex-wrap gap-2">
                {activityCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-brand-blue text-white'
                        : `${cat.color} hover:opacity-80`
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Activities Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredActivities.map(activity => {
                  const category = activityCategories.find(c => c.id === activity.category);
                  return (
                    <div
                      key={activity.id}
                      className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${category?.color}`}>
                          {category && <category.icon className="w-5 h-5" />}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{activity.usageCount}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {activity.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Baby className="w-3.5 h-3.5" />
                          {activity.ageGroup}
                        </span>
                      </div>
                      {activity.objectives && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {activity.objectives.slice(0, 2).map((obj, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white rounded text-xs text-gray-600">
                              {obj}
                            </span>
                          ))}
                          {activity.objectives.length > 2 && (
                            <span className="px-2 py-0.5 bg-white rounded text-xs text-gray-400">
                              +{activity.objectives.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'observations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Observations récentes</h3>
                <button className="text-sm text-brand-blue hover:underline">
                  Voir tout →
                </button>
              </div>
              <div className="space-y-4">
                {mockObservations.map(obs => (
                  <div
                    key={obs.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-blue/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold">
                        {obs.childName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Link href={`/children/${obs.childId}`} className="font-medium text-gray-900 hover:text-brand-blue">
                            {obs.childName}
                          </Link>
                          <span className="text-xs text-gray-500">
                            {new Date(obs.date).toLocaleDateString('fr-CA')}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-800 text-sm">{obs.title}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{obs.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            obs.type === 'milestone' ? 'bg-green-100 text-green-700' :
                            obs.type === 'skill' ? 'bg-blue-100 text-blue-700' :
                            obs.type === 'behavior' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {obs.type === 'milestone' ? '🎯 Jalon' :
                             obs.type === 'skill' ? '⭐ Compétence' :
                             obs.type === 'behavior' ? '💚 Comportement' : '📝 Note'}
                          </span>
                          <span className="text-xs text-gray-400">{obs.domain}</span>
                          <span className="text-xs text-gray-400">par {obs.educator}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Jalons de développement</h3>
              <p className="text-gray-500 mb-4">
                Suivez les étapes de développement de chaque enfant
              </p>
              <button className="text-brand-blue hover:underline">
                Configurer les jalons →
              </button>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Portfolios numériques</h3>
              <p className="text-gray-500 mb-4">
                Créez des portfolios pour documenter la progression de chaque enfant
              </p>
              <button className="text-brand-blue hover:underline">
                Créer un portfolio →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

