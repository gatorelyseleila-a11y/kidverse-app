'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Plus,
  Search,
  Calendar,
  User,
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Edit2,
  Eye
} from 'lucide-react';

interface Evaluation {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  staffAvatar?: string;
  period: string;
  date: string;
  evaluator: string;
  overallScore: number;
  status: 'draft' | 'completed' | 'reviewed';
  categories: {
    name: string;
    score: number;
    maxScore: number;
    comments?: string;
  }[];
  strengths: string[];
  improvements: string[];
  goals: string[];
  comments: string;
}

const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    staffId: 's_001',
    staffName: 'Marie Tremblay',
    staffRole: 'Éducatrice principale',
    period: 'Q4 2024',
    date: '2024-12-01',
    evaluator: 'Directrice Julie',
    overallScore: 4.5,
    status: 'completed',
    categories: [
      { name: 'Compétences pédagogiques', score: 5, maxScore: 5, comments: 'Excellente planification des activités' },
      { name: 'Communication', score: 4, maxScore: 5, comments: 'Bonne communication avec les parents' },
      { name: 'Travail d\'équipe', score: 5, maxScore: 5, comments: 'Toujours prête à aider ses collègues' },
      { name: 'Ponctualité', score: 4, maxScore: 5 },
      { name: 'Initiative', score: 4, maxScore: 5 },
      { name: 'Gestion de classe', score: 5, maxScore: 5 },
    ],
    strengths: [
      'Excellente relation avec les enfants',
      'Créativité dans les activités',
      'Leadership naturel',
    ],
    improvements: [
      'Documentation des observations',
      'Utilisation des outils numériques',
    ],
    goals: [
      'Suivre une formation sur la documentation pédagogique',
      'Mentorer un nouveau membre de l\'équipe',
    ],
    comments: 'Marie est un atout précieux pour notre équipe. Son dévouement et sa passion sont remarquables.',
  },
  {
    id: '2',
    staffId: 's_002',
    staffName: 'Sophie Martin',
    staffRole: 'Éducatrice',
    period: 'Q4 2024',
    date: '2024-12-02',
    evaluator: 'Directrice Julie',
    overallScore: 4.0,
    status: 'completed',
    categories: [
      { name: 'Compétences pédagogiques', score: 4, maxScore: 5 },
      { name: 'Communication', score: 4, maxScore: 5 },
      { name: 'Travail d\'équipe', score: 4, maxScore: 5 },
      { name: 'Ponctualité', score: 5, maxScore: 5 },
      { name: 'Initiative', score: 3, maxScore: 5 },
      { name: 'Gestion de classe', score: 4, maxScore: 5 },
    ],
    strengths: [
      'Très ponctuelle et fiable',
      'Bonne relation avec les familles',
    ],
    improvements: [
      'Prendre plus d\'initiatives',
      'Varier les activités proposées',
    ],
    goals: [
      'Proposer une nouvelle activité par mois',
      'Participer à un comité',
    ],
    comments: 'Sophie montre une belle progression depuis son arrivée.',
  },
  {
    id: '3',
    staffId: 's_003',
    staffName: 'Jean Lavoie',
    staffRole: 'Éducateur',
    period: 'Q4 2024',
    date: '2024-12-05',
    evaluator: 'Directrice Julie',
    overallScore: 0,
    status: 'draft',
    categories: [
      { name: 'Compétences pédagogiques', score: 0, maxScore: 5 },
      { name: 'Communication', score: 0, maxScore: 5 },
      { name: 'Travail d\'équipe', score: 0, maxScore: 5 },
      { name: 'Ponctualité', score: 0, maxScore: 5 },
      { name: 'Initiative', score: 0, maxScore: 5 },
      { name: 'Gestion de classe', score: 0, maxScore: 5 },
    ],
    strengths: [],
    improvements: [],
    goals: [],
    comments: '',
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  draft: { label: 'Brouillon', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: Edit2 },
  completed: { label: 'Complétée', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  reviewed: { label: 'Révisée', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Eye },
};

export default function EvaluationsPage() {
  const [evaluations] = useState<Evaluation[]>(mockEvaluations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  const filteredEvaluations = evaluations
    .filter(e => e.staffName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(e => statusFilter === 'all' || e.status === statusFilter);

  const stats = {
    total: evaluations.length,
    completed: evaluations.filter(e => e.status === 'completed').length,
    pending: evaluations.filter(e => e.status === 'draft').length,
    avgScore: evaluations.filter(e => e.overallScore > 0).reduce((sum, e) => sum + e.overallScore, 0) / 
              evaluations.filter(e => e.overallScore > 0).length || 0,
  };

  const renderStars = (score: number, maxScore: number = 5) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxScore }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(score) 
                ? 'text-amber-400 fill-amber-400' 
                : i < score 
                  ? 'text-amber-400 fill-amber-200' 
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{score.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/staff" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Évaluations du personnel</h1>
            <p className="text-gray-500">Suivi des performances et développement</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
          <Plus className="w-5 h-5" />
          Nouvelle évaluation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Évaluations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-500">Complétées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-xs text-gray-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.avgScore.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Score moyen</p>
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
              placeholder="Rechercher un employé..."
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
        </div>
      </div>

      {/* Evaluations List */}
      <div className="space-y-4">
        {filteredEvaluations.map((evaluation) => {
          const status = statusConfig[evaluation.status];

          return (
            <div
              key={evaluation.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all cursor-pointer hover:shadow-md"
              onClick={() => setSelectedEvaluation(evaluation)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {evaluation.staffName.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{evaluation.staffName}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{evaluation.staffRole}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {evaluation.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {evaluation.evaluator}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-4 shrink-0">
                  {evaluation.overallScore > 0 ? (
                    <div className="text-center">
                      {renderStars(evaluation.overallScore)}
                      <p className="text-xs text-gray-400 mt-1">Score global</p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Non évalué</span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Quick Stats */}
              {evaluation.overallScore > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {evaluation.strengths.length} points forts
                  </div>
                  <div className="flex items-center gap-2 text-amber-600">
                    <Target className="w-4 h-4" />
                    {evaluation.improvements.length} axes d'amélioration
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Award className="w-4 h-4" />
                    {evaluation.goals.length} objectifs
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredEvaluations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune évaluation trouvée</p>
        </div>
      )}

      {/* Evaluation Detail Modal */}
      {selectedEvaluation && selectedEvaluation.overallScore > 0 && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedEvaluation(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedEvaluation.staffName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEvaluation.staffName}</h2>
                  <p className="text-gray-500">{selectedEvaluation.staffRole}</p>
                  <p className="text-sm text-gray-400">{selectedEvaluation.period} • Évaluateur: {selectedEvaluation.evaluator}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 text-center">
                <p className="text-sm text-amber-700 mb-2">Score global</p>
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < Math.floor(selectedEvaluation.overallScore)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-3xl font-bold text-amber-700 mt-2">
                  {selectedEvaluation.overallScore.toFixed(1)} / 5.0
                </p>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Évaluation par catégorie</h3>
                <div className="space-y-3">
                  {selectedEvaluation.categories.map((cat, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        {renderStars(cat.score, cat.maxScore)}
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                          style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                        />
                      </div>
                      {cat.comments && (
                        <p className="text-sm text-gray-500 mt-2">{cat.comments}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              {selectedEvaluation.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Points forts
                  </h3>
                  <div className="space-y-2">
                    {selectedEvaluation.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-green-800">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {selectedEvaluation.improvements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    Axes d'amélioration
                  </h3>
                  <div className="space-y-2">
                    {selectedEvaluation.improvements.map((improvement, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-amber-800">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals */}
              {selectedEvaluation.goals.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Objectifs pour la prochaine période
                  </h3>
                  <div className="space-y-2">
                    {selectedEvaluation.goals.map((goal, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-blue-800">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              {selectedEvaluation.comments && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    Commentaires généraux
                  </h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedEvaluation.comments}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedEvaluation(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Fermer
                </button>
                <button className="px-6 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                  Exporter PDF
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

