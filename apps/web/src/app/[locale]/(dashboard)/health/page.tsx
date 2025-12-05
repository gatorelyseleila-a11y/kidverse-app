'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Heart,
  AlertTriangle,
  Pill,
  Syringe,
  Thermometer,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Baby,
  Activity,
  FileText,
  Bell
} from 'lucide-react';

interface HealthAlert {
  id: string;
  type: 'allergy' | 'medication' | 'vaccination' | 'incident';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  childName: string;
  childId: string;
  date: string;
  resolved: boolean;
}

interface DailyHealthCheck {
  id: string;
  childId: string;
  childName: string;
  date: string;
  temperature?: number;
  symptoms?: string[];
  mood: 'happy' | 'normal' | 'tired' | 'upset';
  appetite: 'good' | 'normal' | 'poor';
  notes?: string;
  checkedBy: string;
  status: 'cleared' | 'monitoring' | 'sent_home';
}

export default function HealthPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [healthChecks, setHealthChecks] = useState<DailyHealthCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    // Demo data
    setAlerts([
      {
        id: '1',
        type: 'allergy',
        severity: 'high',
        title: 'Allergie sévère - Arachides',
        description: 'EpiPen requis en cas de réaction',
        childName: 'Emma Dupont',
        childId: '1',
        date: new Date().toISOString(),
        resolved: false,
      },
      {
        id: '2',
        type: 'vaccination',
        severity: 'medium',
        title: 'Vaccination à mettre à jour',
        description: 'DTaP-IPV-Hib - rappel dû',
        childName: 'Lucas Martin',
        childId: '2',
        date: new Date().toISOString(),
        resolved: false,
      },
      {
        id: '3',
        type: 'medication',
        severity: 'medium',
        title: 'Administration médicament',
        description: 'Ventolin à administrer avant activité physique',
        childName: 'Léa Tremblay',
        childId: '3',
        date: new Date().toISOString(),
        resolved: false,
      },
      {
        id: '4',
        type: 'incident',
        severity: 'low',
        title: 'Incident mineur',
        description: 'Éraflure au genou lors du jeu',
        childName: 'Noah Roy',
        childId: '4',
        date: new Date(Date.now() - 86400000).toISOString(),
        resolved: true,
      },
    ]);

    setHealthChecks([
      {
        id: '1',
        childId: '1',
        childName: 'Emma Dupont',
        date: new Date().toISOString(),
        temperature: 36.8,
        mood: 'happy',
        appetite: 'good',
        checkedBy: 'Sophie L.',
        status: 'cleared',
      },
      {
        id: '2',
        childId: '2',
        childName: 'Lucas Martin',
        date: new Date().toISOString(),
        temperature: 37.2,
        symptoms: ['Nez qui coule'],
        mood: 'normal',
        appetite: 'normal',
        notes: 'Surveiller température',
        checkedBy: 'Julie R.',
        status: 'monitoring',
      },
      {
        id: '3',
        childId: '3',
        childName: 'Léa Tremblay',
        date: new Date().toISOString(),
        temperature: 38.2,
        symptoms: ['Fièvre', 'Fatigue'],
        mood: 'tired',
        appetite: 'poor',
        notes: 'Parents contactés',
        checkedBy: 'Sophie L.',
        status: 'sent_home',
      },
      {
        id: '4',
        childId: '4',
        childName: 'Noah Roy',
        date: new Date().toISOString(),
        temperature: 36.5,
        mood: 'happy',
        appetite: 'good',
        checkedBy: 'Marc G.',
        status: 'cleared',
      },
      {
        id: '5',
        childId: '5',
        childName: 'Olivia Gagnon',
        date: new Date().toISOString(),
        temperature: 36.9,
        mood: 'normal',
        appetite: 'good',
        checkedBy: 'Sophie L.',
        status: 'cleared',
      },
    ]);

    setLoading(false);
  };

  const stats = {
    childrenWithAllergies: 8,
    activeMedications: 3,
    pendingVaccinations: 5,
    todayChecks: healthChecks.length,
    clearedToday: healthChecks.filter(h => h.status === 'cleared').length,
    monitoring: healthChecks.filter(h => h.status === 'monitoring').length,
    sentHome: healthChecks.filter(h => h.status === 'sent_home').length,
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
    { id: 'daily', label: 'Triage quotidien', icon: Thermometer },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
    { id: 'medications', label: 'Médicaments', icon: Pill },
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Santé & Sécurité</h1>
          <p className="text-gray-500">Suivi médical et triage quotidien</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            Rapport santé
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-5 h-5" />
            Nouveau triage
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.childrenWithAllergies}</p>
              <p className="text-sm text-gray-500">Allergies</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Pill className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeMedications}</p>
              <p className="text-sm text-gray-500">Médicaments actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Syringe className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingVaccinations}</p>
              <p className="text-sm text-gray-500">Vaccins à jour</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.clearedToday}/{stats.todayChecks}</p>
              <p className="text-sm text-gray-500">Triés aujourd'hui</p>
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
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Active Alerts */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-500" />
                  Alertes actives
                </h3>
                <div className="space-y-3">
                  {alerts.filter(a => !a.resolved).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border-2 ${
                        alert.severity === 'high'
                          ? 'bg-red-50 border-red-200'
                          : alert.severity === 'medium'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            alert.type === 'allergy' ? 'bg-red-200' :
                            alert.type === 'medication' ? 'bg-purple-200' :
                            alert.type === 'vaccination' ? 'bg-amber-200' :
                            'bg-blue-200'
                          }`}>
                            {alert.type === 'allergy' && <AlertTriangle className="w-5 h-5 text-red-700" />}
                            {alert.type === 'medication' && <Pill className="w-5 h-5 text-purple-700" />}
                            {alert.type === 'vaccination' && <Syringe className="w-5 h-5 text-amber-700" />}
                            {alert.type === 'incident' && <Heart className="w-5 h-5 text-blue-700" />}
                          </div>
                          <div>
                            <h4 className="font-semibold">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.description}</p>
                            <Link href={`/children/${alert.childId}`} className="text-sm text-brand-blue hover:underline mt-1 inline-block">
                              {alert.childName}
                            </Link>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                          alert.severity === 'medium' ? 'bg-amber-200 text-amber-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {alert.severity === 'high' ? 'Urgent' : alert.severity === 'medium' ? 'Important' : 'Info'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Triage Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-brand-blue" />
                  Résumé du triage - {new Date().toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-700">{stats.clearedToday}</p>
                        <p className="text-sm text-green-600">Autorisés</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <Eye className="w-8 h-8 text-amber-600" />
                      <div>
                        <p className="text-2xl font-bold text-amber-700">{stats.monitoring}</p>
                        <p className="text-sm text-amber-600">Sous surveillance</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold text-red-700">{stats.sentHome}</p>
                        <p className="text-sm text-red-600">Renvoyés maison</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Triage du jour</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {healthChecks.filter(h => h.status !== 'cleared').length} enfant(s) à surveiller
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Enfant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Temp.</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Humeur</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Appétit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Symptômes</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Par</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {healthChecks.map((check) => (
                      <tr key={check.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link href={`/children/${check.childId}`} className="font-medium text-gray-900 hover:text-brand-blue">
                            {check.childName}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${
                            (check.temperature || 0) >= 38 ? 'text-red-600' :
                            (check.temperature || 0) >= 37.5 ? 'text-amber-600' :
                            'text-gray-900'
                          }`}>
                            {check.temperature}°C
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            check.mood === 'happy' ? 'bg-green-100 text-green-700' :
                            check.mood === 'normal' ? 'bg-gray-100 text-gray-700' :
                            check.mood === 'tired' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {check.mood === 'happy' ? '😊 Joyeux' :
                             check.mood === 'normal' ? '😐 Normal' :
                             check.mood === 'tired' ? '😴 Fatigué' : '😢 Contrarié'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm ${
                            check.appetite === 'good' ? 'text-green-600' :
                            check.appetite === 'normal' ? 'text-gray-600' :
                            'text-red-600'
                          }`}>
                            {check.appetite === 'good' ? 'Bon' : check.appetite === 'normal' ? 'Normal' : 'Faible'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {check.symptoms && check.symptoms.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {check.symptoms.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">Aucun</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            check.status === 'cleared' ? 'bg-green-100 text-green-700' :
                            check.status === 'monitoring' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {check.status === 'cleared' && <CheckCircle className="w-3 h-3" />}
                            {check.status === 'monitoring' && <Eye className="w-3 h-3" />}
                            {check.status === 'sent_home' && <XCircle className="w-3 h-3" />}
                            {check.status === 'cleared' ? 'Autorisé' :
                             check.status === 'monitoring' ? 'Surveillance' : 'Renvoyé'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {check.checkedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'allergies' && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Liste des allergies</h3>
              <p className="text-gray-500 mb-4">
                Vue complète de toutes les allergies des enfants
              </p>
              <Link href="/children" className="text-brand-blue hover:underline">
                Voir tous les profils enfants →
              </Link>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="text-center py-12">
              <Pill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Gestion des médicaments</h3>
              <p className="text-gray-500 mb-4">
                Suivi des administrations et des prescriptions
              </p>
              <button className="text-brand-blue hover:underline">
                Ajouter un médicament →
              </button>
            </div>
          )}

          {activeTab === 'vaccinations' && (
            <div className="text-center py-12">
              <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Carnet de vaccination</h3>
              <p className="text-gray-500 mb-4">
                Suivi des vaccins et rappels automatiques
              </p>
              <Link href="/children" className="text-brand-blue hover:underline">
                Voir les profils enfants →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

