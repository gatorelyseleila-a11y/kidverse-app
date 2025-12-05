'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Star,
  Zap,
  Crown,
  Building2,
  Users,
  Baby,
  BarChart3,
  Shield,
  Clock,
  CreditCard,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Download,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceYearly: number;
  icon: any;
  color: string;
  bgColor: string;
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
    limit?: string;
  }[];
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Démarrage',
    description: 'Idéal pour les petites garderies',
    price: 49,
    priceYearly: 470,
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    features: [
      { name: 'Enfants', included: true, limit: 'Jusqu\'à 30' },
      { name: 'Personnel', included: true, limit: 'Jusqu\'à 5' },
      { name: 'Gestion des présences', included: true },
      { name: 'Portail parents', included: true },
      { name: 'Rapports de base', included: true },
      { name: 'Support email', included: true },
      { name: 'Multi-centres', included: false },
      { name: 'Analytics avancés', included: false },
      { name: 'API access', included: false },
      { name: 'Support prioritaire', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professionnel',
    description: 'Pour les garderies en croissance',
    price: 99,
    priceYearly: 950,
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    popular: true,
    features: [
      { name: 'Enfants', included: true, limit: 'Jusqu\'à 100' },
      { name: 'Personnel', included: true, limit: 'Jusqu\'à 15' },
      { name: 'Gestion des présences', included: true },
      { name: 'Portail parents', included: true },
      { name: 'Rapports avancés', included: true },
      { name: 'Support prioritaire', included: true },
      { name: 'Multi-centres', included: true, limit: 'Jusqu\'à 3' },
      { name: 'Analytics avancés', included: true },
      { name: 'API access', included: false },
      { name: 'Personnalisation marque', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Pour les réseaux de garderies',
    price: 249,
    priceYearly: 2390,
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    features: [
      { name: 'Enfants', included: true, limit: 'Illimité' },
      { name: 'Personnel', included: true, limit: 'Illimité' },
      { name: 'Gestion des présences', included: true },
      { name: 'Portail parents', included: true },
      { name: 'Rapports personnalisés', included: true },
      { name: 'Support dédié 24/7', included: true },
      { name: 'Multi-centres', included: true, limit: 'Illimité' },
      { name: 'Analytics avancés', included: true },
      { name: 'API access', included: true },
      { name: 'Personnalisation complète', included: true },
    ],
  },
];

const currentSubscription = {
  planId: 'professional',
  status: 'active',
  currentPeriodStart: '2024-12-01',
  currentPeriodEnd: '2025-01-01',
  cancelAtPeriodEnd: false,
  paymentMethod: {
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2026,
  },
};

const invoiceHistory = [
  { id: 'INV-2024-12', date: '2024-12-01', amount: 99, status: 'paid' },
  { id: 'INV-2024-11', date: '2024-11-01', amount: 99, status: 'paid' },
  { id: 'INV-2024-10', date: '2024-10-01', amount: 99, status: 'paid' },
  { id: 'INV-2024-09', date: '2024-09-01', amount: 99, status: 'paid' },
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showChangePlan, setShowChangePlan] = useState(false);

  const currentPlan = plans.find(p => p.id === currentSubscription.planId)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Abonnement</h1>
          <p className="text-gray-500">Gérez votre plan et facturation</p>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${currentPlan.bgColor}`}>
              <currentPlan.icon className={`w-8 h-8 ${currentPlan.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Plan {currentPlan.name}</h2>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Actif
                </span>
              </div>
              <p className="text-gray-500">{currentPlan.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{currentPlan.price} $<span className="text-lg font-normal text-gray-500">/mois</span></p>
            <p className="text-sm text-gray-500">Facturé mensuellement</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Prochaine facturation</span>
            </div>
            <p className="font-semibold text-gray-900">
              {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('fr-CA')}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Moyen de paiement</span>
            </div>
            <p className="font-semibold text-gray-900 capitalize">
              {currentSubscription.paymentMethod.brand} •••• {currentSubscription.paymentMethod.last4}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Membre depuis</span>
            </div>
            <p className="font-semibold text-gray-900">
              Septembre 2024
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowChangePlan(true)}
            className="px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            Changer de plan
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Mettre à jour le paiement
          </button>
          <button className="px-4 py-2 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors">
            Annuler l'abonnement
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Utilisation du plan</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 flex items-center gap-2">
                <Baby className="w-4 h-4" /> Enfants
              </span>
              <span className="font-medium">67 / 100</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full" style={{ width: '67%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" /> Personnel
              </span>
              <span className="font-medium">12 / 15</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Centres
              </span>
              <span className="font-medium">2 / 3</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '66%' }} />
            </div>
          </div>
        </div>

        {/* Warning if approaching limits */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Vous approchez de votre limite de personnel</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            Passez au plan Entreprise pour un nombre illimité de membres du personnel.
          </p>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Historique de facturation</h3>
          <button className="text-brand-blue text-sm font-medium hover:underline">
            Voir tout
          </button>
        </div>
        <div className="space-y-3">
          {invoiceHistory.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{invoice.id}</p>
                  <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString('fr-CA')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">{invoice.amount} $</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Payé
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Plan Modal */}
      {showChangePlan && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowChangePlan(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Changer de plan</h2>
              <p className="text-gray-500">Choisissez le plan qui convient le mieux à vos besoins</p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className={billingCycle === 'monthly' ? 'font-medium text-gray-900' : 'text-gray-500'}>
                  Mensuel
                </span>
                <button
                  onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                  className="w-14 h-8 bg-brand-blue rounded-full relative"
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
                <span className={billingCycle === 'yearly' ? 'font-medium text-gray-900' : 'text-gray-500'}>
                  Annuel <span className="text-green-600 text-sm font-medium">-20%</span>
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const isCurrent = plan.id === currentSubscription.planId;
                  const price = billingCycle === 'monthly' ? plan.price : Math.round(plan.priceYearly / 12);

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-2xl border-2 p-6 relative ${
                        plan.popular ? 'border-brand-blue shadow-lg' : 'border-gray-200'
                      } ${isCurrent ? 'bg-gray-50' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-blue text-white text-xs font-medium rounded-full">
                          Populaire
                        </div>
                      )}

                      <div className={`w-12 h-12 rounded-xl ${plan.bgColor} flex items-center justify-center mb-4`}>
                        <plan.icon className={`w-6 h-6 ${plan.color}`} />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900">{price} $</span>
                        <span className="text-gray-500">/mois</span>
                        {billingCycle === 'yearly' && (
                          <p className="text-sm text-green-600 mt-1">
                            {plan.priceYearly} $ facturé annuellement
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {feature.included ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 text-gray-300">—</div>
                            )}
                            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                              {feature.name}
                              {feature.limit && feature.included && (
                                <span className="text-gray-500 text-sm ml-1">({feature.limit})</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          isCurrent
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : plan.popular
                              ? 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isCurrent}
                      >
                        {isCurrent ? 'Plan actuel' : 'Choisir ce plan'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Des questions? <a href="#" className="text-brand-blue hover:underline">Contactez-nous</a>
                </p>
                <button
                  onClick={() => setShowChangePlan(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

