'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Phone,
  Users,
  Baby,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Bell,
  Siren,
  Heart,
  Flame,
  Droplets,
  Wind,
  AlertOctagon,
  PhoneCall,
  ClipboardCheck,
  UserCheck,
  Download,
  Printer
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  available: boolean;
}

interface EmergencyProcedure {
  id: string;
  type: 'fire' | 'medical' | 'lockdown' | 'evacuation' | 'weather' | 'other';
  title: string;
  steps: string[];
  lastDrill?: string;
  nextDrill?: string;
}

interface Child {
  id: string;
  name: string;
  classroom: string;
  status: 'safe' | 'pending' | 'missing';
  allergies: string[];
  medicalNeeds?: string;
}

const emergencyContacts: EmergencyContact[] = [
  { id: '1', name: 'Marie Lapointe', role: 'Directrice', phone: '514-555-0001', available: true },
  { id: '2', name: 'Jean Tremblay', role: 'Coordonnateur sécurité', phone: '514-555-0002', available: true },
  { id: '3', name: 'Sophie Martin', role: 'Infirmière', phone: '514-555-0003', available: false },
];

const emergencyServices = [
  { name: 'Urgences', number: '911', icon: Siren },
  { name: 'Centre antipoison', number: '1-800-463-5060', icon: AlertOctagon },
  { name: 'Police non-urgence', number: '514-280-2222', icon: Shield },
  { name: 'Info-Santé', number: '811', icon: Heart },
];

const procedures: EmergencyProcedure[] = [
  {
    id: '1',
    type: 'fire',
    title: 'Incendie',
    steps: [
      'Déclencher l\'alarme incendie',
      'Évacuer tous les enfants par la sortie la plus proche',
      'Prendre la liste de présence',
      'Se rendre au point de rassemblement',
      'Compter tous les enfants',
      'Appeler les pompiers si pas automatique',
      'Attendre les autorités',
    ],
    lastDrill: '2024-11-15',
    nextDrill: '2025-01-15',
  },
  {
    id: '2',
    type: 'medical',
    title: 'Urgence médicale',
    steps: [
      'Évaluer la situation et la gravité',
      'Appeler le 911 si nécessaire',
      'Administrer les premiers soins',
      'Contacter les parents immédiatement',
      'Documenter l\'incident',
      'Suivre le plan d\'intervention de l\'enfant si applicable',
    ],
    lastDrill: '2024-10-20',
    nextDrill: '2025-01-20',
  },
  {
    id: '3',
    type: 'lockdown',
    title: 'Confinement',
    steps: [
      'Déclencher l\'alerte de confinement',
      'Rassembler tous les enfants à l\'intérieur',
      'Verrouiller toutes les portes',
      'Fermer les stores et rideaux',
      'Garder les enfants calmes et silencieux',
      'Attendre les instructions des autorités',
      'Ne pas ouvrir les portes sauf aux autorités identifiées',
    ],
    lastDrill: '2024-09-10',
    nextDrill: '2024-12-10',
  },
  {
    id: '4',
    type: 'weather',
    title: 'Alerte météo',
    steps: [
      'Surveiller les alertes météo',
      'Faire rentrer les enfants de l\'extérieur',
      'Éloigner les enfants des fenêtres',
      'Se rendre dans l\'abri désigné si tornade',
      'Avoir les fournitures d\'urgence à portée',
      'Informer les parents de la situation',
    ],
    lastDrill: '2024-08-15',
    nextDrill: '2025-02-15',
  },
];

const mockChildren: Child[] = [
  { id: '1', name: 'Emma Dupont', classroom: 'Poupons', status: 'safe', allergies: ['Arachides'] },
  { id: '2', name: 'Lucas Martin', classroom: 'Bambins', status: 'safe', allergies: [] },
  { id: '3', name: 'Léa Tremblay', classroom: 'Préscolaire', status: 'pending', allergies: [], medicalNeeds: 'Inhalateur asthme' },
  { id: '4', name: 'Thomas Roy', classroom: 'Bambins', status: 'safe', allergies: ['Lactose'] },
  { id: '5', name: 'Sophie Bernard', classroom: 'Maternelle', status: 'safe', allergies: [] },
];

const procedureIcons: Record<string, { icon: any; color: string; bgColor: string }> = {
  fire: { icon: Flame, color: 'text-red-600', bgColor: 'bg-red-100' },
  medical: { icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  lockdown: { icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  evacuation: { icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  weather: { icon: Wind, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  other: { icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-100' },
};

export default function EmergencyPage() {
  const [activeEmergency, setActiveEmergency] = useState<string | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<EmergencyProcedure | null>(null);
  const [childStatuses, setChildStatuses] = useState<Record<string, 'safe' | 'pending' | 'missing'>>(
    mockChildren.reduce((acc, child) => ({ ...acc, [child.id]: child.status }), {})
  );

  const activateEmergency = (type: string) => {
    setActiveEmergency(type);
    const procedure = procedures.find(p => p.type === type);
    if (procedure) setSelectedProcedure(procedure);
  };

  const updateChildStatus = (childId: string, status: 'safe' | 'pending' | 'missing') => {
    setChildStatuses(prev => ({ ...prev, [childId]: status }));
  };

  const safeCount = Object.values(childStatuses).filter(s => s === 'safe').length;
  const pendingCount = Object.values(childStatuses).filter(s => s === 'pending').length;
  const missingCount = Object.values(childStatuses).filter(s => s === 'missing').length;

  return (
    <div className="space-y-6">
      {/* Active Emergency Banner */}
      {activeEmergency && (
        <div className="bg-red-600 text-white rounded-2xl p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Siren className="w-10 h-10" />
              <div>
                <h2 className="text-2xl font-bold">URGENCE ACTIVE</h2>
                <p className="text-red-100">
                  {procedures.find(p => p.type === activeEmergency)?.title} - Procédure en cours
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveEmergency(null);
                setSelectedProcedure(null);
              }}
              className="px-6 py-2 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
            >
              Terminer l'urgence
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre d'urgence</h1>
          <p className="text-gray-500">Procédures, contacts et gestion des situations d'urgence</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" />
            Imprimer procédures
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exporter liste
          </button>
        </div>
      </div>

      {/* Quick Emergency Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {procedures.slice(0, 4).map((procedure) => {
          const config = procedureIcons[procedure.type];
          return (
            <button
              key={procedure.id}
              onClick={() => activateEmergency(procedure.type)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                activeEmergency === procedure.type
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <config.icon className={`w-6 h-6 ${config.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-center">{procedure.title}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                Dernier exercice: {procedure.lastDrill ? new Date(procedure.lastDrill).toLocaleDateString('fr-CA') : 'N/A'}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Procedure Steps */}
          {selectedProcedure && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const config = procedureIcons[selectedProcedure.type];
                  return (
                    <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}>
                      <config.icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Procédure: {selectedProcedure.title}</h2>
                  <p className="text-sm text-gray-500">Suivez les étapes ci-dessous</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedProcedure.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Child Accountability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Comptage des enfants</h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-600">En sécurité: {safeCount}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-gray-600">En attente: {pendingCount}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-gray-600">Manquant: {missingCount}</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {mockChildren.map((child) => (
                <div
                  key={child.id}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    childStatuses[child.id] === 'safe' ? 'bg-green-50' :
                    childStatuses[child.id] === 'missing' ? 'bg-red-50' : 'bg-amber-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-sm border">
                      {child.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{child.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{child.classroom}</span>
                        {child.allergies.length > 0 && (
                          <span className="text-red-600">• Allergies: {child.allergies.join(', ')}</span>
                        )}
                        {child.medicalNeeds && (
                          <span className="text-purple-600">• {child.medicalNeeds}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateChildStatus(child.id, 'safe')}
                      className={`p-2 rounded-lg transition-colors ${
                        childStatuses[child.id] === 'safe'
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-400 hover:text-green-500'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateChildStatus(child.id, 'pending')}
                      className={`p-2 rounded-lg transition-colors ${
                        childStatuses[child.id] === 'pending'
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-gray-400 hover:text-amber-500'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateChildStatus(child.id, 'missing')}
                      className={`p-2 rounded-lg transition-colors ${
                        childStatuses[child.id] === 'missing'
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Services */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-600" />
              Services d'urgence
            </h3>
            <div className="space-y-2">
              {emergencyServices.map((service) => (
                <a
                  key={service.name}
                  href={`tel:${service.number}`}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <service.icon className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <span className="font-bold text-red-600">{service.number}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Staff Contacts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-blue" />
              Contacts internes
            </h3>
            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${contact.available ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Point */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Point de rassemblement
            </h3>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="font-medium text-gray-900">Stationnement arrière</p>
              <p className="text-sm text-gray-600 mt-1">
                Près de l'entrée secondaire, zone délimitée par les cônes orange
              </p>
            </div>
          </div>

          {/* Drill Schedule */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-purple-600" />
              Prochains exercices
            </h3>
            <div className="space-y-2">
              {procedures.filter(p => p.nextDrill).map((procedure) => (
                <div key={procedure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-900">{procedure.title}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(procedure.nextDrill!).toLocaleDateString('fr-CA')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

