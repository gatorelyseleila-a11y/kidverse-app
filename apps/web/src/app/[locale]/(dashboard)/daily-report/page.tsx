'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Baby,
  Utensils,
  Moon,
  Palette,
  Heart,
  MessageCircle,
  Camera,
  Save,
  Send,
  CheckCircle,
  Clock,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  Droplets,
  Apple,
  Coffee,
  Sun,
  Star,
  Plus,
  X,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  classroom: string;
  photoUrl?: string;
}

interface DailyReport {
  childId: string;
  meals: {
    breakfast: 'full' | 'partial' | 'none' | '';
    lunch: 'full' | 'partial' | 'none' | '';
    snackAM: 'full' | 'partial' | 'none' | '';
    snackPM: 'full' | 'partial' | 'none' | '';
  };
  naps: {
    start: string;
    end: string;
    quality: 'good' | 'restless' | 'difficult' | '';
  }[];
  diapers: {
    time: string;
    type: 'wet' | 'dirty' | 'both';
  }[];
  mood: 'happy' | 'normal' | 'upset' | '';
  activities: string[];
  notes: string;
  photos: string[];
  sent: boolean;
}

const mockChildren: Child[] = [
  { id: '1', firstName: 'Emma', lastName: 'Dupont', classroom: 'Poupons' },
  { id: '2', firstName: 'Lucas', lastName: 'Martin', classroom: 'Poupons' },
  { id: '3', firstName: 'Léa', lastName: 'Tremblay', classroom: 'Poupons' },
  { id: '4', firstName: 'Thomas', lastName: 'Roy', classroom: 'Poupons' },
];

const defaultReport: DailyReport = {
  childId: '',
  meals: { breakfast: '', lunch: '', snackAM: '', snackPM: '' },
  naps: [],
  diapers: [],
  mood: '',
  activities: [],
  notes: '',
  photos: [],
  sent: false,
};

const activityOptions = [
  { id: 'painting', label: 'Peinture', icon: Palette },
  { id: 'music', label: 'Musique', icon: Star },
  { id: 'outdoor', label: 'Jeux extérieurs', icon: Sun },
  { id: 'reading', label: 'Lecture', icon: Heart },
  { id: 'motor', label: 'Motricité', icon: ThumbsUp },
  { id: 'sensory', label: 'Sensoriel', icon: Droplets },
  { id: 'social', label: 'Jeux de groupe', icon: Baby },
  { id: 'free', label: 'Jeu libre', icon: Star },
];

export default function DailyReportPage() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [reports, setReports] = useState<Record<string, DailyReport>>({});
  const [currentReport, setCurrentReport] = useState<DailyReport>(defaultReport);
  const [showSummary, setShowSummary] = useState(false);

  const selectChild = (child: Child) => {
    setSelectedChild(child);
    setCurrentReport(reports[child.id] || { ...defaultReport, childId: child.id });
  };

  const updateMeal = (meal: keyof DailyReport['meals'], value: 'full' | 'partial' | 'none') => {
    setCurrentReport(prev => ({
      ...prev,
      meals: { ...prev.meals, [meal]: value },
    }));
  };

  const addNap = () => {
    setCurrentReport(prev => ({
      ...prev,
      naps: [...prev.naps, { start: '', end: '', quality: '' }],
    }));
  };

  const updateNap = (index: number, field: string, value: string) => {
    setCurrentReport(prev => ({
      ...prev,
      naps: prev.naps.map((nap, i) => i === index ? { ...nap, [field]: value } : nap),
    }));
  };

  const removeNap = (index: number) => {
    setCurrentReport(prev => ({
      ...prev,
      naps: prev.naps.filter((_, i) => i !== index),
    }));
  };

  const addDiaper = () => {
    const time = new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
    setCurrentReport(prev => ({
      ...prev,
      diapers: [...prev.diapers, { time, type: 'wet' }],
    }));
  };

  const toggleActivity = (activityId: string) => {
    setCurrentReport(prev => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter(a => a !== activityId)
        : [...prev.activities, activityId],
    }));
  };

  const saveReport = () => {
    if (!selectedChild) return;
    setReports(prev => ({
      ...prev,
      [selectedChild.id]: currentReport,
    }));
  };

  const sendReport = () => {
    if (!selectedChild) return;
    const updatedReport = { ...currentReport, sent: true };
    setReports(prev => ({
      ...prev,
      [selectedChild.id]: updatedReport,
    }));
    setCurrentReport(updatedReport);
    // Would send to parents via API
  };

  const getMealIcon = (value: string) => {
    switch (value) {
      case 'full': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial': return <Meh className="w-5 h-5 text-amber-600" />;
      case 'none': return <X className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-300" />;
    }
  };

  const completedCount = Object.values(reports).filter(r => r.sent).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapport journalier</h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gray-100 rounded-xl">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">{completedCount}</span>/{mockChildren.length} envoyés
            </span>
          </div>
          <button
            onClick={() => setShowSummary(true)}
            className="px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            Voir résumé
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Children List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Enfants présents</h2>
            <div className="space-y-2">
              {mockChildren.map((child) => {
                const report = reports[child.id];
                return (
                  <button
                    key={child.id}
                    onClick={() => selectChild(child)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedChild?.id === child.id
                        ? 'bg-brand-blue/10 border-2 border-brand-blue'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                      {child.firstName[0]}{child.lastName[0]}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{child.firstName}</p>
                      <p className="text-xs text-gray-500">{child.lastName}</p>
                    </div>
                    {report?.sent ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : report ? (
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Report Form */}
        <div className="lg:col-span-3">
          {selectedChild ? (
            <div className="space-y-6">
              {/* Child Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-2xl">
                      {selectedChild.firstName[0]}{selectedChild.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedChild.firstName} {selectedChild.lastName}
                      </h2>
                      <p className="text-gray-500">{selectedChild.classroom}</p>
                    </div>
                  </div>
                  {currentReport.sent && (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Envoyé aux parents
                    </span>
                  )}
                </div>
              </div>

              {/* Meals */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-600" />
                  Repas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'breakfast', label: 'Déjeuner', icon: Coffee },
                    { key: 'snackAM', label: 'Collation AM', icon: Apple },
                    { key: 'lunch', label: 'Dîner', icon: Utensils },
                    { key: 'snackPM', label: 'Collation PM', icon: Apple },
                  ].map((meal) => (
                    <div key={meal.key} className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <meal.icon className="w-4 h-4" />
                        {meal.label}
                      </label>
                      <div className="flex gap-1">
                        {['full', 'partial', 'none'].map((value) => (
                          <button
                            key={value}
                            onClick={() => updateMeal(meal.key as keyof DailyReport['meals'], value as any)}
                            className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                              currentReport.meals[meal.key as keyof DailyReport['meals']] === value
                                ? value === 'full' ? 'border-green-500 bg-green-50'
                                : value === 'partial' ? 'border-amber-500 bg-amber-50'
                                : 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {getMealIcon(value)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Naps */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-purple-600" />
                    Siestes
                  </h3>
                  <button
                    onClick={addNap}
                    className="text-sm text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une sieste
                  </button>
                </div>
                {currentReport.naps.length > 0 ? (
                  <div className="space-y-3">
                    {currentReport.naps.map((nap, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-purple-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={nap.start}
                            onChange={(e) => updateNap(index, 'start', e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          />
                          <span className="text-gray-400">à</span>
                          <input
                            type="time"
                            value={nap.end}
                            onChange={(e) => updateNap(index, 'end', e.target.value)}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <select
                          value={nap.quality}
                          onChange={(e) => updateNap(index, 'quality', e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="">Qualité</option>
                          <option value="good">Bon sommeil</option>
                          <option value="restless">Agité</option>
                          <option value="difficult">Difficile</option>
                        </select>
                        <button
                          onClick={() => removeNap(index)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">Aucune sieste enregistrée</p>
                )}
              </div>

              {/* Diapers (for younger children) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Baby className="w-5 h-5 text-blue-600" />
                    Couches
                  </h3>
                  <button
                    onClick={addDiaper}
                    className="text-sm text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
                {currentReport.diapers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentReport.diapers.map((diaper, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          diaper.type === 'wet' ? 'bg-blue-100 text-blue-700'
                          : diaper.type === 'dirty' ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {diaper.time} - {diaper.type === 'wet' ? 'Pipi' : diaper.type === 'dirty' ? 'Selle' : 'Les deux'}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">Aucun changement enregistré</p>
                )}
              </div>

              {/* Mood */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Humeur générale
                </h3>
                <div className="flex gap-4">
                  {[
                    { value: 'happy', icon: Smile, label: 'Joyeux', color: 'green' },
                    { value: 'normal', icon: Meh, label: 'Normal', color: 'amber' },
                    { value: 'upset', icon: Frown, label: 'Difficile', color: 'red' },
                  ].map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setCurrentReport(prev => ({ ...prev, mood: mood.value as any }))}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        currentReport.mood === mood.value
                          ? `border-${mood.color}-500 bg-${mood.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <mood.icon className={`w-8 h-8 ${
                        currentReport.mood === mood.value ? `text-${mood.color}-600` : 'text-gray-400'
                      }`} />
                      <span className="text-sm font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-600" />
                  Activités
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => toggleActivity(activity.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        currentReport.activities.includes(activity.id)
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      <activity.icon className="w-4 h-4" />
                      {activity.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Notes aux parents
                </h3>
                <textarea
                  value={currentReport.notes}
                  onChange={(e) => setCurrentReport(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Observations, moments spéciaux, apprentissages..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {/* Photos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-pink-600" />
                  Photos du jour
                </h3>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand-blue transition-colors cursor-pointer">
                  <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Cliquez pour ajouter des photos</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG • Max 5MB par photo</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={saveReport}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder brouillon
                </button>
                <button
                  onClick={sendReport}
                  disabled={currentReport.sent}
                  className="flex-1 py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {currentReport.sent ? 'Déjà envoyé' : 'Envoyer aux parents'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un enfant</h3>
              <p className="text-gray-500">Choisissez un enfant dans la liste pour compléter son rapport journalier</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSummary(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 p-6 max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé des rapports</h2>
            <div className="space-y-4">
              {mockChildren.map((child) => {
                const report = reports[child.id];
                return (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                        {child.firstName[0]}{child.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{child.firstName} {child.lastName}</p>
                        <p className="text-xs text-gray-500">{child.classroom}</p>
                      </div>
                    </div>
                    {report?.sent ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Envoyé
                      </span>
                    ) : report ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        Brouillon
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                        Non commencé
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowSummary(false)}
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

