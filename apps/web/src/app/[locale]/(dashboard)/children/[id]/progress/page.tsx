'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Star,
  Award,
  Brain,
  Users,
  Heart,
  Palette,
  MessageCircle,
  Activity,
  Calendar,
  ChevronRight,
  Plus,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  Puzzle,
  Music,
  Hand
} from 'lucide-react';

interface DevelopmentArea {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  milestones: {
    id: string;
    name: string;
    description: string;
    status: 'not_started' | 'in_progress' | 'achieved';
    achievedDate?: string;
    notes?: string;
  }[];
  progress: number;
}

interface Observation {
  id: string;
  date: string;
  area: string;
  content: string;
  observer: string;
  photos?: string[];
}

const childData = {
  id: 'ch_001',
  name: 'Emma Dupont',
  age: '3 ans 4 mois',
  group: 'Les Explorateurs',
  birthDate: '2021-08-15',
  enrollmentDate: '2024-01-15',
};

const developmentAreas: DevelopmentArea[] = [
  {
    id: 'cognitive',
    name: 'Développement cognitif',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Raisonnement, résolution de problèmes, mémoire',
    progress: 75,
    milestones: [
      { id: '1', name: 'Reconnaît les couleurs primaires', description: 'Rouge, bleu, jaune', status: 'achieved', achievedDate: '2024-09-15' },
      { id: '2', name: 'Compte jusqu\'à 10', description: 'Compte des objets', status: 'achieved', achievedDate: '2024-10-20' },
      { id: '3', name: 'Fait des puzzles simples', description: '4-6 pièces', status: 'in_progress', notes: 'Progresse bien avec les puzzles de 4 pièces' },
      { id: '4', name: 'Reconnaît son prénom écrit', description: 'Identifie les lettres', status: 'in_progress' },
      { id: '5', name: 'Comprend le concept de taille', description: 'Grand/petit, plus/moins', status: 'not_started' },
    ],
  },
  {
    id: 'language',
    name: 'Langage et communication',
    icon: MessageCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Expression orale, vocabulaire, compréhension',
    progress: 85,
    milestones: [
      { id: '1', name: 'Fait des phrases de 3-4 mots', description: 'Communication de base', status: 'achieved', achievedDate: '2024-08-10' },
      { id: '2', name: 'Pose des questions', description: 'Pourquoi, comment', status: 'achieved', achievedDate: '2024-09-25' },
      { id: '3', name: 'Raconte une histoire simple', description: 'Séquence d\'événements', status: 'achieved', achievedDate: '2024-11-05' },
      { id: '4', name: 'Utilise les pronoms correctement', description: 'Je, tu, il/elle', status: 'in_progress' },
      { id: '5', name: 'Chante des comptines', description: 'Mémorisation de paroles', status: 'achieved', achievedDate: '2024-10-15' },
    ],
  },
  {
    id: 'social',
    name: 'Développement social-émotionnel',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Relations, émotions, autonomie',
    progress: 70,
    milestones: [
      { id: '1', name: 'Joue avec les autres enfants', description: 'Jeu parallèle et coopératif', status: 'achieved', achievedDate: '2024-09-01' },
      { id: '2', name: 'Exprime ses émotions', description: 'Nomme ce qu\'il ressent', status: 'in_progress' },
      { id: '3', name: 'Partage les jouets', description: 'Avec aide de l\'adulte', status: 'in_progress', notes: 'Progresse, besoin de rappels occasionnels' },
      { id: '4', name: 'Suit les règles simples', description: 'Routine de groupe', status: 'achieved', achievedDate: '2024-10-01' },
      { id: '5', name: 'Gère les transitions', description: 'Changement d\'activité', status: 'not_started' },
    ],
  },
  {
    id: 'motor',
    name: 'Motricité',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Motricité fine et globale',
    progress: 80,
    milestones: [
      { id: '1', name: 'Court et saute', description: 'Coordination de base', status: 'achieved', achievedDate: '2024-08-01' },
      { id: '2', name: 'Tient un crayon correctement', description: 'Prise en tripode', status: 'achieved', achievedDate: '2024-09-20' },
      { id: '3', name: 'Utilise des ciseaux', description: 'Découpage de base', status: 'in_progress' },
      { id: '4', name: 'S\'habille seul(e)', description: 'Vêtements simples', status: 'in_progress' },
      { id: '5', name: 'Dessine des formes', description: 'Cercle, carré', status: 'achieved', achievedDate: '2024-11-10' },
    ],
  },
  {
    id: 'creative',
    name: 'Expression créative',
    icon: Palette,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    description: 'Art, musique, imagination',
    progress: 90,
    milestones: [
      { id: '1', name: 'Dessine un bonhomme', description: 'Avec tête et membres', status: 'achieved', achievedDate: '2024-10-05' },
      { id: '2', name: 'Utilise diverses couleurs', description: 'Choix intentionnel', status: 'achieved', achievedDate: '2024-09-15' },
      { id: '3', name: 'Fait semblant (jeu symbolique)', description: 'Imagination', status: 'achieved', achievedDate: '2024-08-20' },
      { id: '4', name: 'Participe aux activités musicales', description: 'Rythme, chant', status: 'achieved', achievedDate: '2024-09-01' },
      { id: '5', name: 'Crée avec différents matériaux', description: 'Pâte à modeler, collage', status: 'in_progress' },
    ],
  },
];

const recentObservations: Observation[] = [
  {
    id: '1',
    date: '2024-12-04',
    area: 'cognitive',
    content: 'Emma a réussi à compléter un puzzle de 6 pièces sans aide aujourd\'hui. Elle était très fière d\'elle!',
    observer: 'Marie Tremblay',
  },
  {
    id: '2',
    date: '2024-12-03',
    area: 'social',
    content: 'Belle interaction avec Lucas pendant le jeu libre. Emma a partagé les blocs spontanément.',
    observer: 'Sophie Martin',
  },
  {
    id: '3',
    date: '2024-12-02',
    area: 'creative',
    content: 'A créé un magnifique dessin de sa famille. Utilise maintenant 5-6 couleurs différentes.',
    observer: 'Marie Tremblay',
  },
];

export default function ProgressPage() {
  const params = useParams();
  const [selectedArea, setSelectedArea] = useState<DevelopmentArea | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'observations'>('overview');

  const overallProgress = Math.round(
    developmentAreas.reduce((sum, area) => sum + area.progress, 0) / developmentAreas.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/children/${params.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suivi du développement</h1>
            <p className="text-gray-500">{childData.name} • {childData.age}</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
          <Plus className="w-5 h-5" />
          Ajouter observation
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'milestones', label: 'Jalons', icon: Target },
            { id: 'observations', label: 'Observations', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-gradient-to-br from-brand-blue to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium opacity-90">Progression globale</h2>
                <p className="text-4xl font-bold mt-1">{overallProgress}%</p>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl">
                <Sparkles className="w-10 h-10" />
              </div>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-sm mt-3 opacity-80">
              {developmentAreas.filter(a => a.progress >= 80).length} domaines en excellente progression
            </p>
          </div>

          {/* Development Areas Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {developmentAreas.map((area) => (
              <div
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${area.bgColor}`}>
                    <area.icon className={`w-6 h-6 ${area.color}`} />
                  </div>
                  <span className={`text-2xl font-bold ${area.color}`}>{area.progress}%</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{area.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{area.description}</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      area.progress >= 80 ? 'bg-green-500' :
                      area.progress >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${area.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>
                    {area.milestones.filter(m => m.status === 'achieved').length}/{area.milestones.length} jalons
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Dernières réussites
            </h3>
            <div className="space-y-3">
              {developmentAreas.flatMap(area => 
                area.milestones
                  .filter(m => m.status === 'achieved' && m.achievedDate)
                  .map(m => ({ ...m, area }))
              )
              .sort((a, b) => new Date(b.achievedDate!).getTime() - new Date(a.achievedDate!).getTime())
              .slice(0, 5)
              .map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-green-50 rounded-xl">
                  <div className={`p-2 rounded-lg ${milestone.area.bgColor}`}>
                    <milestone.area.icon className={`w-5 h-5 ${milestone.area.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{milestone.name}</p>
                    <p className="text-sm text-gray-500">{milestone.area.name}</p>
                  </div>
                  <div className="text-right">
                    <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                    <p className="text-xs text-gray-400">
                      {new Date(milestone.achievedDate!).toLocaleDateString('fr-CA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          {developmentAreas.map((area) => (
            <div key={area.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`p-4 ${area.bgColor}`}>
                <div className="flex items-center gap-3">
                  <area.icon className={`w-6 h-6 ${area.color}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{area.name}</h3>
                    <p className="text-sm text-gray-600">
                      {area.milestones.filter(m => m.status === 'achieved').length}/{area.milestones.length} jalons atteints
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {area.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`flex items-start gap-3 p-3 rounded-xl ${
                      milestone.status === 'achieved' ? 'bg-green-50' :
                      milestone.status === 'in_progress' ? 'bg-amber-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`p-1 rounded-full ${
                      milestone.status === 'achieved' ? 'bg-green-500' :
                      milestone.status === 'in_progress' ? 'bg-amber-500' : 'bg-gray-300'
                    }`}>
                      {milestone.status === 'achieved' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{milestone.name}</p>
                      <p className="text-sm text-gray-500">{milestone.description}</p>
                      {milestone.notes && (
                        <p className="text-sm text-amber-700 mt-1 italic">Note: {milestone.notes}</p>
                      )}
                      {milestone.achievedDate && (
                        <p className="text-xs text-green-600 mt-1">
                          Atteint le {new Date(milestone.achievedDate).toLocaleDateString('fr-CA')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Observations Tab */}
      {activeTab === 'observations' && (
        <div className="space-y-4">
          {recentObservations.map((obs) => {
            const area = developmentAreas.find(a => a.id === obs.area);
            return (
              <div key={obs.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start gap-4">
                  {area && (
                    <div className={`p-2 rounded-xl ${area.bgColor} shrink-0`}>
                      <area.icon className={`w-5 h-5 ${area.color}`} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">{area?.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(obs.date).toLocaleDateString('fr-CA')}
                      </span>
                    </div>
                    <p className="text-gray-700">{obs.content}</p>
                    <p className="text-sm text-gray-500 mt-2">— {obs.observer}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-colors">
            <Plus className="w-5 h-5 mx-auto mb-1" />
            Ajouter une observation
          </button>
        </div>
      )}

      {/* Area Detail Modal */}
      {selectedArea && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedArea(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-auto">
            <div className={`p-6 ${selectedArea.bgColor}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/50 rounded-xl">
                  <selectedArea.icon className={`w-8 h-8 ${selectedArea.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedArea.name}</h2>
                  <p className="text-gray-600">{selectedArea.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span className="font-bold">{selectedArea.progress}%</span>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${selectedArea.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">Jalons de développement</h3>
              {selectedArea.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-xl border-2 ${
                    milestone.status === 'achieved' ? 'border-green-200 bg-green-50' :
                    milestone.status === 'in_progress' ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${
                      milestone.status === 'achieved' ? 'bg-green-500' :
                      milestone.status === 'in_progress' ? 'bg-amber-500' : 'bg-gray-300'
                    }`}>
                      {milestone.status === 'achieved' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="w-4 h-4 text-white" />
                      ) : (
                        <Target className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{milestone.name}</p>
                      <p className="text-sm text-gray-500">{milestone.description}</p>
                      {milestone.notes && (
                        <p className="text-sm text-amber-700 mt-2 bg-amber-100 p-2 rounded-lg">
                          💡 {milestone.notes}
                        </p>
                      )}
                      {milestone.achievedDate && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ Atteint le {new Date(milestone.achievedDate).toLocaleDateString('fr-CA')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setSelectedArea(null)}
                className="w-full py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

