'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Pill,
  Syringe,
  Users,
  Clock,
  FileText,
  Camera,
  Shield,
  Activity,
  Plus,
  MoreVertical,
  Check,
  X
} from 'lucide-react';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  photoUrl?: string;
  status: string;
  enrollmentDate: string;
  notes?: string;
  classroom?: { id: string; name: string };
  center?: { id: string; name: string };
  parents?: Array<{
    parent: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    relationship: string;
    isPrimary: boolean;
  }>;
  emergencyContacts?: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    priority: number;
  }>;
  allergies?: Array<{
    id: string;
    allergen: string;
    severity: string;
    reactions?: string;
    treatment?: string;
  }>;
  medications?: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    instructions?: string;
  }>;
  vaccinations?: Array<{
    id: string;
    name: string;
    dateAdministered: string;
    nextDueDate?: string;
  }>;
  authorizedPickups?: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    photoUrl?: string;
  }>;
}

export default function ChildProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchChild();
  }, [childId]);

  const fetchChild = async () => {
    try {
      const response = await fetch(
        `/api/v1/children/${childId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChild(data);
      }
    } catch (error) {
      console.error('Error fetching child:', error);
      // Demo data
      setChild({
        id: childId,
        firstName: 'Emma',
        lastName: 'Dupont',
        dateOfBirth: '2021-03-15',
        gender: 'FEMALE',
        status: 'ACTIVE',
        enrollmentDate: '2023-09-01',
        notes: 'Emma adore les activités artistiques et la lecture. Elle fait une sieste après le dîner.',
        classroom: { id: '1', name: 'Poupons' },
        center: { id: '1', name: 'Les Petits Explorateurs' },
        parents: [
          {
            parent: {
              id: '1',
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@email.com',
              phone: '514-555-1234',
            },
            relationship: 'Père',
            isPrimary: true,
          },
          {
            parent: {
              id: '2',
              firstName: 'Marie',
              lastName: 'Dupont',
              email: 'marie.dupont@email.com',
              phone: '514-555-5678',
            },
            relationship: 'Mère',
            isPrimary: false,
          },
        ],
        emergencyContacts: [
          { id: '1', name: 'Grand-mère Louise', relationship: 'Grand-mère', phone: '514-555-9999', priority: 1 },
          { id: '2', name: 'Oncle Pierre', relationship: 'Oncle', phone: '514-555-8888', priority: 2 },
        ],
        allergies: [
          { id: '1', allergen: 'Arachides', severity: 'SEVERE', reactions: 'Anaphylaxie', treatment: 'EpiPen' },
          { id: '2', allergen: 'Kiwi', severity: 'MILD', reactions: 'Démangeaisons' },
        ],
        medications: [
          { id: '1', name: 'Ventolin', dosage: '2 puffs', frequency: 'Au besoin', instructions: 'En cas de difficulté respiratoire' },
        ],
        vaccinations: [
          { id: '1', name: 'DTaP-IPV-Hib', dateAdministered: '2021-05-15', nextDueDate: '2025-03-15' },
          { id: '2', name: 'RRO', dateAdministered: '2022-03-20' },
          { id: '3', name: 'Hépatite B', dateAdministered: '2021-03-15' },
        ],
        authorizedPickups: [
          { id: '1', name: 'Louise Tremblay', relationship: 'Grand-mère', phone: '514-555-9999' },
          { id: '2', name: 'Pierre Dupont', relationship: 'Oncle', phone: '514-555-8888' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      const totalMonths = months + (today.getDate() < birth.getDate() ? -1 : 0) + 12;
      return `${totalMonths} mois`;
    }
    if (years === 1 && months < 0) {
      return `${12 + months} mois`;
    }
    return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` et ${months} mois` : ''}`;
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: FileText },
    { id: 'health', label: 'Santé', icon: Heart },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'activity', label: 'Activité', icon: Activity },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Enfant non trouvé</p>
        <Link href="/children" className="text-brand-blue hover:underline mt-2 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {child.firstName} {child.lastName}
          </h1>
          <p className="text-gray-500">{child.classroom?.name} • {child.center?.name}</p>
        </div>
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
          <Edit className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 p-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg ${
                child.gender === 'FEMALE' 
                  ? 'bg-gradient-to-br from-pink-400 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-400 to-blue-500'
              }`}>
                {child.firstName.charAt(0)}{child.lastName.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-brand-blue transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{child.firstName} {child.lastName}</h2>
                {child.allergies && child.allergies.length > 0 && (
                  <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {child.allergies.length} allergie(s)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 text-white/80">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {getAge(child.dateOfBirth)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Inscrit depuis {new Date(child.enrollmentDate).toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                child.status === 'ACTIVE' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {child.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-blue" />
                  Informations générales
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date de naissance</span>
                    <span className="font-medium">{new Date(child.dateOfBirth).toLocaleDateString('fr-CA')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Genre</span>
                    <span className="font-medium">{child.gender === 'FEMALE' ? 'Fille' : 'Garçon'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Classe</span>
                    <span className="font-medium">{child.classroom?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date d'inscription</span>
                    <span className="font-medium">{new Date(child.enrollmentDate).toLocaleDateString('fr-CA')}</span>
                  </div>
                </div>

                {child.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-medium text-amber-800 mb-2">Notes</h4>
                    <p className="text-amber-700 text-sm">{child.notes}</p>
                  </div>
                )}
              </div>

              {/* Primary Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-blue" />
                  Contact principal
                </h3>
                {child.parents?.filter(p => p.isPrimary).map((parent) => (
                  <div key={parent.parent.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">
                        {parent.parent.firstName.charAt(0)}{parent.parent.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{parent.parent.firstName} {parent.parent.lastName}</p>
                        <p className="text-sm text-gray-500">{parent.relationship}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <a href={`tel:${parent.parent.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-brand-blue">
                        <Phone className="w-4 h-4" />
                        {parent.parent.phone}
                      </a>
                      <a href={`mailto:${parent.parent.email}`} className="flex items-center gap-2 text-gray-600 hover:text-brand-blue">
                        <Mail className="w-4 h-4" />
                        {parent.parent.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Allergies */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Allergies
                  </h3>
                  <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
                {child.allergies && child.allergies.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {child.allergies.map((allergy) => (
                      <div
                        key={allergy.id}
                        className={`p-4 rounded-xl border-2 ${
                          allergy.severity === 'SEVERE'
                            ? 'bg-red-50 border-red-200'
                            : allergy.severity === 'MODERATE'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{allergy.allergen}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              allergy.severity === 'SEVERE'
                                ? 'bg-red-200 text-red-800'
                                : allergy.severity === 'MODERATE'
                                ? 'bg-amber-200 text-amber-800'
                                : 'bg-yellow-200 text-yellow-800'
                            }`}>
                              {allergy.severity === 'SEVERE' ? 'Sévère' : allergy.severity === 'MODERATE' ? 'Modéré' : 'Léger'}
                            </span>
                          </div>
                        </div>
                        {allergy.reactions && (
                          <p className="text-sm mt-2"><strong>Réactions:</strong> {allergy.reactions}</p>
                        )}
                        {allergy.treatment && (
                          <p className="text-sm mt-1"><strong>Traitement:</strong> {allergy.treatment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune allergie enregistrée</p>
                )}
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-500" />
                    Médicaments
                  </h3>
                  <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
                {child.medications && child.medications.length > 0 ? (
                  <div className="space-y-3">
                    {child.medications.map((med) => (
                      <div key={med.id} className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-purple-900">{med.name}</h4>
                          <span className="text-sm text-purple-600">{med.frequency}</span>
                        </div>
                        <p className="text-sm text-purple-700 mt-1">Dosage: {med.dosage}</p>
                        {med.instructions && (
                          <p className="text-sm text-purple-600 mt-1">{med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucun médicament enregistré</p>
                )}
              </div>

              {/* Vaccinations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-green-500" />
                    Vaccinations
                  </h3>
                  <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
                {child.vaccinations && child.vaccinations.length > 0 ? (
                  <div className="space-y-2">
                    {child.vaccinations.map((vax) => (
                      <div key={vax.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium">{vax.name}</span>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-green-700">{new Date(vax.dateAdministered).toLocaleDateString('fr-CA')}</p>
                          {vax.nextDueDate && (
                            <p className="text-gray-500">Prochain: {new Date(vax.nextDueDate).toLocaleDateString('fr-CA')}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune vaccination enregistrée</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              {/* Parents */}
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-brand-blue" />
                  Parents / Tuteurs
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {child.parents?.map((parent) => (
                    <div key={parent.parent.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">
                          {parent.parent.firstName.charAt(0)}{parent.parent.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{parent.parent.firstName} {parent.parent.lastName}</p>
                          <p className="text-sm text-gray-500">{parent.relationship}</p>
                        </div>
                        {parent.isPrimary && (
                          <span className="ml-auto text-xs bg-brand-blue text-white px-2 py-1 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <a href={`tel:${parent.parent.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-brand-blue">
                          <Phone className="w-4 h-4" />
                          {parent.parent.phone}
                        </a>
                        <a href={`mailto:${parent.parent.email}`} className="flex items-center gap-2 text-gray-600 hover:text-brand-blue">
                          <Mail className="w-4 h-4" />
                          {parent.parent.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-500" />
                    Contacts d'urgence
                  </h3>
                  <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
                <div className="space-y-3">
                  {child.emergencyContacts?.map((contact, index) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center font-bold text-sm">
                          {contact.priority}
                        </span>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.relationship}</p>
                        </div>
                      </div>
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authorized Pickups */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Personnes autorisées
                  </h3>
                  <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {child.authorizedPickups?.map((person) => (
                    <div key={person.id} className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-gray-500">{person.relationship}</p>
                        <p className="text-sm text-green-600">{person.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Historique d'activités</h3>
              <p className="text-gray-500">
                Les activités, présences et observations de l'enfant apparaîtront ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

