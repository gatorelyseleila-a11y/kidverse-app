'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Clock,
  Calendar,
  Users,
  Baby,
  DollarSign,
  Bell,
  Shield,
  FileText,
  Save,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Plus,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface CenterSettings {
  general: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    capacity: number;
    licenseNumber: string;
  };
  hours: {
    openTime: string;
    closeTime: string;
    earlyBirdStart: string;
    extendedEnd: string;
    daysOpen: string[];
  };
  ratios: {
    poupons: { min: number; max: number; ratio: number };
    bambins: { min: number; max: number; ratio: number };
    prescolaire: { min: number; max: number; ratio: number };
    maternelle: { min: number; max: number; ratio: number };
  };
  billing: {
    dailyRate: number;
    partTimeDailyRate: number;
    reducedContributionRate: number;
    latePickupFeePerMinute: number;
    registrationFee: number;
    billingCycle: 'weekly' | 'biweekly' | 'monthly';
    paymentDueDays: number;
    acceptedPaymentMethods: string[];
  };
  holidays: { date: string; name: string }[];
  notifications: {
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    enablePushNotifications: boolean;
    dailyReportTime: string;
    reminderDaysBeforePayment: number;
  };
}

const defaultSettings: CenterSettings = {
  general: {
    name: 'Garderie Les Petits Anges',
    address: '123 rue des Enfants, Montréal, QC H2X 1Y5',
    phone: '(514) 555-0123',
    email: 'info@petitsanges.ca',
    website: 'www.petitsanges.ca',
    logo: '',
    capacity: 80,
    licenseNumber: 'QC-2024-12345',
  },
  hours: {
    openTime: '07:00',
    closeTime: '18:00',
    earlyBirdStart: '06:30',
    extendedEnd: '18:30',
    daysOpen: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  },
  ratios: {
    poupons: { min: 0, max: 18, ratio: 5 },
    bambins: { min: 18, max: 36, ratio: 8 },
    prescolaire: { min: 36, max: 48, ratio: 10 },
    maternelle: { min: 48, max: 60, ratio: 15 },
  },
  billing: {
    dailyRate: 45.00,
    partTimeDailyRate: 35.00,
    reducedContributionRate: 8.85,
    latePickupFeePerMinute: 1.50,
    registrationFee: 100.00,
    billingCycle: 'monthly',
    paymentDueDays: 15,
    acceptedPaymentMethods: ['credit_card', 'bank_transfer', 'check'],
  },
  holidays: [
    { date: '2024-12-25', name: 'Noël' },
    { date: '2024-12-26', name: 'Lendemain de Noël' },
    { date: '2025-01-01', name: 'Jour de l\'An' },
    { date: '2025-01-02', name: 'Lendemain du Jour de l\'An' },
  ],
  notifications: {
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enablePushNotifications: true,
    dailyReportTime: '17:00',
    reminderDaysBeforePayment: 3,
  },
};

const daysOfWeek = [
  { id: 'monday', label: 'Lun' },
  { id: 'tuesday', label: 'Mar' },
  { id: 'wednesday', label: 'Mer' },
  { id: 'thursday', label: 'Jeu' },
  { id: 'friday', label: 'Ven' },
  { id: 'saturday', label: 'Sam' },
  { id: 'sunday', label: 'Dim' },
];

export default function CenterSettingsPage() {
  const [settings, setSettings] = useState<CenterSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Would save to API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleDay = (day: string) => {
    setSettings(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        daysOpen: prev.hours.daysOpen.includes(day)
          ? prev.hours.daysOpen.filter(d => d !== day)
          : [...prev.hours.daysOpen, day],
      },
    }));
  };

  const addHoliday = () => {
    if (!newHoliday.date || !newHoliday.name) return;
    setSettings(prev => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday].sort((a, b) => a.date.localeCompare(b.date)),
    }));
    setNewHoliday({ date: '', name: '' });
  };

  const removeHoliday = (date: string) => {
    setSettings(prev => ({
      ...prev,
      holidays: prev.holidays.filter(h => h.date !== date),
    }));
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Building2 },
    { id: 'hours', label: 'Horaires', icon: Clock },
    { id: 'ratios', label: 'Ratios', icon: Users },
    { id: 'billing', label: 'Facturation', icon: DollarSign },
    { id: 'holidays', label: 'Congés', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/centers" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres du centre</h1>
            <p className="text-gray-500">{settings.general.name}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Sauvegardé!' : 'Sauvegarder'}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
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
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
                
                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                  <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Logo du centre</h3>
                    <p className="text-sm text-gray-500 mb-2">PNG ou JPG, max 2MB</p>
                    <button className="text-sm text-brand-blue hover:underline">Changer le logo</button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du centre</label>
                    <input
                      type="text"
                      value={settings.general.name}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, name: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de licence</label>
                    <input
                      type="text"
                      value={settings.general.licenseNumber}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, licenseNumber: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={settings.general.address}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, address: e.target.value }
                      }))}
                      className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={settings.general.phone}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, phone: e.target.value }
                        }))}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Courriel</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={settings.general.email}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, email: e.target.value }
                        }))}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={settings.general.website}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, website: e.target.value }
                        }))}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacité maximale</label>
                  <input
                    type="number"
                    value={settings.general.capacity}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, capacity: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full max-w-xs px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <p className="text-xs text-gray-500 mt-1">Nombre d'enfants maximum selon la licence</p>
                </div>
              </div>
            )}

            {/* Hours Tab */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Horaires d'ouverture</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Heures régulières</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Ouverture</label>
                        <input
                          type="time"
                          value={settings.hours.openTime}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hours: { ...prev.hours, openTime: e.target.value }
                          }))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Fermeture</label>
                        <input
                          type="time"
                          value={settings.hours.closeTime}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hours: { ...prev.hours, closeTime: e.target.value }
                          }))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Heures prolongées</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Garde matinale</label>
                        <input
                          type="time"
                          value={settings.hours.earlyBirdStart}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hours: { ...prev.hours, earlyBirdStart: e.target.value }
                          }))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Garde soir</label>
                        <input
                          type="time"
                          value={settings.hours.extendedEnd}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hours: { ...prev.hours, extendedEnd: e.target.value }
                          }))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Jours d'ouverture</h3>
                  <div className="flex gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={`w-12 h-12 rounded-xl font-medium transition-all ${
                          settings.hours.daysOpen.includes(day.id)
                            ? 'bg-brand-blue text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ratios Tab */}
            {activeTab === 'ratios' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Ratios éducateur/enfants</h2>
                    <p className="text-sm text-gray-500">Selon les normes du Ministère de la Famille du Québec</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.ratios).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      poupons: 'Poupons',
                      bambins: 'Bambins',
                      prescolaire: 'Préscolaire',
                      maternelle: 'Maternelle',
                    };
                    return (
                      <div key={key} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{labels[key]}</h3>
                          <span className="text-sm text-gray-500">
                            {value.min}-{value.max} mois
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">1 éducateur pour</span>
                          <input
                            type="number"
                            value={value.ratio}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              ratios: {
                                ...prev.ratios,
                                [key]: { ...value, ratio: parseInt(e.target.value) || 0 }
                              }
                            }))}
                            className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          />
                          <span className="text-sm text-gray-600">enfants</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Paramètres de facturation</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Tarifs quotidiens</h3>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Temps plein</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          value={settings.billing.dailyRate}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            billing: { ...prev.billing, dailyRate: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Temps partiel</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          value={settings.billing.partTimeDailyRate}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            billing: { ...prev.billing, partTimeDailyRate: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Contribution réduite</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          value={settings.billing.reducedContributionRate}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            billing: { ...prev.billing, reducedContributionRate: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Autres frais</h3>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Frais d'inscription</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          value={settings.billing.registrationFee}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            billing: { ...prev.billing, registrationFee: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Frais retard ($/min)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          value={settings.billing.latePickupFeePerMinute}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            billing: { ...prev.billing, latePickupFeePerMinute: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cycle de facturation</label>
                    <select
                      value={settings.billing.billingCycle}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        billing: { ...prev.billing, billingCycle: e.target.value as any }
                      }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="weekly">Hebdomadaire</option>
                      <option value="biweekly">Bimensuel</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Délai de paiement (jours)</label>
                    <input
                      type="number"
                      value={settings.billing.paymentDueDays}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        billing: { ...prev.billing, paymentDueDays: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Holidays Tab */}
            {activeTab === 'holidays' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Jours fériés et congés</h2>

                <div className="flex gap-4">
                  <input
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                    className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <input
                    type="text"
                    placeholder="Nom du congé"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <button
                    onClick={addHoliday}
                    className="px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {settings.holidays.map((holiday) => (
                    <div key={holiday.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{holiday.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(holiday.date).toLocaleDateString('fr-CA', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeHoliday(holiday.date)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Préférences de notification</h2>

                <div className="space-y-4">
                  {[
                    { key: 'enableEmailNotifications', label: 'Notifications par courriel', description: 'Envoyer des courriels pour les rappels et alertes' },
                    { key: 'enableSMSNotifications', label: 'Notifications SMS', description: 'Envoyer des SMS pour les alertes urgentes' },
                    { key: 'enablePushNotifications', label: 'Notifications push', description: 'Notifications dans l\'application mobile' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, [item.key]: !prev.notifications[item.key as keyof typeof prev.notifications] }
                        }))}
                        className={`w-14 h-8 rounded-full transition-all ${
                          settings.notifications[item.key as keyof typeof settings.notifications]
                            ? 'bg-brand-blue'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          settings.notifications[item.key as keyof typeof settings.notifications]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure d'envoi du rapport quotidien</label>
                    <input
                      type="time"
                      value={settings.notifications.dailyReportTime}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, dailyReportTime: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rappel paiement (jours avant)</label>
                    <input
                      type="number"
                      value={settings.notifications.reminderDaysBeforePayment}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, reminderDaysBeforePayment: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
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

