'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  Edit,
  Camera,
  Shield,
  Bell,
  FileText,
  Activity,
  Star,
  CheckCircle,
  Building2,
  Baby,
  TrendingUp,
  Heart
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

  const user = session?.user;
  const isStaff = user?.role === 'ADMIN' || user?.role === 'DIRECTOR' || user?.role === 'EDUCATOR';

  // Mock data for profile
  const profileData = {
    firstName: user?.firstName || 'Sophie',
    lastName: user?.lastName || 'Lavoie',
    email: user?.email || 'sophie@petitsexplorateurs.com',
    phone: '514-555-0002',
    role: user?.role || 'EDUCATOR',
    center: 'Les Petits Explorateurs',
    department: 'Pédagogie',
    hireDate: '2020-08-20',
    position: 'Éducatrice qualifiée',
    bio: 'Passionnée par l\'éducation préscolaire depuis plus de 5 ans. Spécialisée dans les activités créatives et le développement socio-émotionnel.',
    skills: ['Pédagogie Montessori', 'Arts plastiques', 'Développement moteur', 'Premiers soins'],
    classrooms: ['Poupons', 'Bambins'],
  };

  const stats = isStaff ? {
    childrenSupervised: 12,
    activitiesCreated: 45,
    observationsRecorded: 128,
    hoursThisMonth: 156,
  } : {
    children: 2,
    messagesExchanged: 34,
    documentsShared: 8,
    paymentsCompleted: 12,
  };

  const recentActivity = [
    { action: 'Observation ajoutée', target: 'Emma Dupont', time: 'Il y a 2h' },
    { action: 'Activité complétée', target: 'Peinture aux doigts', time: 'Il y a 4h' },
    { action: 'Message envoyé', target: 'Jean Dupont', time: 'Hier' },
    { action: 'Check-in enregistré', target: 'Lucas Martin', time: 'Hier' },
  ];

  const qualifications = [
    { name: 'DEC en Éducation à l\'enfance', issuer: 'Cégep de Montréal', date: '2019', verified: true },
    { name: 'Premiers soins - Niveau C', issuer: 'Croix-Rouge', date: '2024', verified: true, expiry: '2026' },
    { name: 'RCR - Adulte/Enfant', issuer: 'Croix-Rouge', date: '2024', verified: true, expiry: '2025' },
    { name: 'Formation Montessori', issuer: 'AMI', date: '2021', verified: false },
  ];

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'Administrateur',
      DIRECTOR: 'Directeur/rice',
      EDUCATOR: 'Éducateur/rice',
      ASSISTANT: 'Assistant(e)',
      PARENT: 'Parent',
    };
    return roles[role] || role;
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu' },
    { id: 'activity', label: 'Activité' },
    ...(isStaff ? [{ id: 'qualifications', label: 'Qualifications' }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-blue via-blue-500 to-brand-orange" />
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-4xl">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-brand-blue transition-colors border border-gray-200">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 md:mb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-gray-500">{profileData.position}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {profileData.center}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      user?.role === 'DIRECTOR' ? 'bg-blue-100 text-blue-700' :
                      user?.role === 'EDUCATOR' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getRoleLabel(profileData.role)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier le profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isStaff ? (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Baby className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.childrenSupervised}</p>
                  <p className="text-xs text-gray-500">Enfants supervisés</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.activitiesCreated}</p>
                  <p className="text-xs text-gray-500">Activités créées</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.observationsRecorded}</p>
                  <p className="text-xs text-gray-500">Observations</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.hoursThisMonth}h</p>
                  <p className="text-xs text-gray-500">Heures ce mois</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Baby className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.children}</p>
                  <p className="text-xs text-gray-500">Enfants inscrits</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.messagesExchanged}</p>
                  <p className="text-xs text-gray-500">Messages</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.documentsShared}</p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.paymentsCompleted}</p>
                  <p className="text-xs text-gray-500">Paiements</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex gap-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Informations de contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">{profileData.phone}</p>
                    </div>
                  </div>
                  {isStaff && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date d'embauche</p>
                          <p className="font-medium">{new Date(profileData.hireDate).toLocaleDateString('fr-CA')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Département</p>
                          <p className="font-medium">{profileData.department}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bio & Skills */}
              <div className="space-y-6">
                {profileData.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">À propos</h3>
                    <p className="text-gray-600">{profileData.bio}</p>
                  </div>
                )}

                {isStaff && profileData.skills && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Compétences</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isStaff && profileData.classrooms && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Classes assignées</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.classrooms.map((classroom, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {classroom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.target}</p>
                    </div>
                    <span className="text-sm text-gray-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'qualifications' && isStaff && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Qualifications & Certifications</h3>
                <button className="text-sm text-brand-blue hover:underline">
                  + Ajouter
                </button>
              </div>
              <div className="space-y-4">
                {qualifications.map((qual, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${qual.verified ? 'bg-green-100' : 'bg-amber-100'}`}>
                        <Award className={`w-5 h-5 ${qual.verified ? 'text-green-600' : 'text-amber-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{qual.name}</p>
                          {qual.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{qual.issuer} • {qual.date}</p>
                      </div>
                    </div>
                    {qual.expiry && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        new Date(qual.expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        Expire: {qual.expiry}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

