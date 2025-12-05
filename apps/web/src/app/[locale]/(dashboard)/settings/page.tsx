'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  CreditCard,
  Building2,
  Key,
  Smartphone,
  LogOut
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: session?.user?.firstName || 'Jean',
    lastName: session?.user?.lastName || 'Dupont',
    email: session?.user?.email || 'jean.dupont@email.com',
    phone: '514-555-1234',
    language: 'fr',
    timezone: 'America/Montreal',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    attendance: true,
    messages: true,
    payments: true,
    health: true,
    reports: false,
  });

  const [appearance, setAppearance] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    compactMode: false,
    animations: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-500">Gérez votre compte et vos préférences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : saved ? (
            <>
              <Check className="w-5 h-5" />
              Enregistré!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Enregistrer
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-2xl">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-brand-blue transition-colors border border-gray-200">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-gray-500">{session?.user?.role || 'Utilisateur'}</p>
                    <button className="text-sm text-brand-blue hover:underline mt-1">
                      Changer la photo
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Langue
                    </label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile(p => ({ ...p, language: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile(p => ({ ...p, timezone: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="America/Montreal">Montréal (EST)</option>
                      <option value="America/Toronto">Toronto (EST)</option>
                      <option value="America/Vancouver">Vancouver (PST)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Préférences de notifications</h2>

                {/* Channels */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Canaux de notification</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: 'Email', icon: Mail, desc: 'Recevoir les notifications par email' },
                      { key: 'push', label: 'Push', icon: Bell, desc: 'Notifications dans le navigateur' },
                      { key: 'sms', label: 'SMS', icon: Smartphone, desc: 'Recevoir les alertes urgentes par SMS' },
                    ].map((channel) => (
                      <div key={channel.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <channel.icon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{channel.label}</p>
                            <p className="text-sm text-gray-500">{channel.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[channel.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(n => ({ ...n, [channel.key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-brand-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Types de notifications</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { key: 'attendance', label: 'Présences', desc: 'Arrivées et départs' },
                      { key: 'messages', label: 'Messages', desc: 'Nouveaux messages' },
                      { key: 'payments', label: 'Paiements', desc: 'Factures et paiements' },
                      { key: 'health', label: 'Santé', desc: 'Alertes santé' },
                      { key: 'reports', label: 'Rapports', desc: 'Rapports générés' },
                    ].map((type) => (
                      <div key={type.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[type.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(n => ({ ...n, [type.key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:ring-4 peer-focus:ring-brand-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Apparence</h2>

                {/* Theme */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Thème</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Clair', icon: Sun },
                      { value: 'dark', label: 'Sombre', icon: Moon },
                      { value: 'system', label: 'Système', icon: Monitor },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setAppearance(a => ({ ...a, theme: theme.value as any }))}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          appearance.theme === theme.value
                            ? 'border-brand-blue bg-brand-blue/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <theme.icon className={`w-6 h-6 ${
                          appearance.theme === theme.value ? 'text-brand-blue' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          appearance.theme === theme.value ? 'text-brand-blue' : 'text-gray-600'
                        }`}>
                          {theme.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Mode compact</p>
                      <p className="text-sm text-gray-500">Réduire les espacements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearance.compactMode}
                        onChange={(e) => setAppearance(a => ({ ...a, compactMode: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-brand-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Animations</p>
                      <p className="text-sm text-gray-500">Activer les animations de l'interface</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearance.animations}
                        onChange={(e) => setAppearance(a => ({ ...a, animations: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-brand-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>

                {/* Password */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Mot de passe</p>
                        <p className="text-sm text-gray-500">Dernière modification il y a 30 jours</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-brand-blue font-medium hover:bg-brand-blue/10 rounded-lg transition-colors">
                      Modifier
                    </button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                        <p className="text-sm text-gray-500">Non activée</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-brand-blue text-white font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
                      Activer
                    </button>
                  </div>
                </div>

                {/* Sessions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Sessions actives</h3>
                  <div className="space-y-2">
                    {[
                      { device: 'Windows PC', location: 'Montréal, QC', current: true },
                      { device: 'iPhone 14', location: 'Montréal, QC', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{session.device}</p>
                            <p className="text-xs text-gray-500">{session.location}</p>
                          </div>
                        </div>
                        {session.current ? (
                          <span className="text-xs text-green-600 font-medium">Session actuelle</span>
                        ) : (
                          <button className="text-xs text-red-500 hover:underline">Déconnecter</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-red-600 mb-3">Zone de danger</h3>
                  <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Déconnecter toutes les sessions
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Facturation</h2>

                {/* Current Plan */}
                <div className="p-6 bg-gradient-to-r from-brand-blue to-blue-600 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Plan actuel</p>
                      <h3 className="text-2xl font-bold mt-1">Professionnel</h3>
                      <p className="text-white/80 mt-2">399$/mois • Renouvel. 15 janv. 2025</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-brand-blue font-medium rounded-lg hover:bg-gray-100 transition-colors">
                      Changer de plan
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Visa •••• 4242</p>
                        <p className="text-sm text-gray-500">Expire 12/2025</p>
                      </div>
                    </div>
                    <button className="text-brand-blue font-medium hover:underline text-sm">
                      Modifier
                    </button>
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Historique de facturation</h3>
                  <div className="space-y-2">
                    {[
                      { date: '01/12/2024', amount: '399.00', status: 'paid' },
                      { date: '01/11/2024', amount: '399.00', status: 'paid' },
                      { date: '01/10/2024', amount: '399.00', status: 'paid' },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{invoice.date}</p>
                          <p className="text-xs text-gray-500">{invoice.amount}$ CAD</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-green-600 font-medium">Payé</span>
                          <button className="text-xs text-brand-blue hover:underline">Télécharger</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

