'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  PiggyBank,
  BarChart3
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  childName: string;
  parentName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount?: number;
  createdAt: string;
}

interface FinancialSummary {
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  subsidiesReceived: number;
  monthlyGrowth: number;
}

export default function FinancePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    // Demo data
    setSummary({
      totalRevenue: 45750.00,
      pendingPayments: 8250.00,
      overduePayments: 1500.00,
      subsidiesReceived: 12500.00,
      monthlyGrowth: 8.5,
    });

    setInvoices([
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        childName: 'Emma Dupont',
        parentName: 'Jean Dupont',
        amount: 850.00,
        dueDate: '2024-12-15',
        status: 'paid',
        paidAmount: 850.00,
        createdAt: '2024-12-01',
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        childName: 'Lucas Martin',
        parentName: 'Marie Martin',
        amount: 850.00,
        dueDate: '2024-12-15',
        status: 'pending',
        createdAt: '2024-12-01',
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        childName: 'Léa Tremblay',
        parentName: 'Pierre Tremblay',
        amount: 950.00,
        dueDate: '2024-11-30',
        status: 'overdue',
        createdAt: '2024-11-15',
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        childName: 'Noah Roy',
        parentName: 'Sophie Roy',
        amount: 750.00,
        dueDate: '2024-12-15',
        status: 'partial',
        paidAmount: 400.00,
        createdAt: '2024-12-01',
      },
      {
        id: '5',
        invoiceNumber: 'INV-2024-005',
        childName: 'Olivia Gagnon',
        parentName: 'Marc Gagnon',
        amount: 850.00,
        dueDate: '2024-12-15',
        status: 'paid',
        paidAmount: 850.00,
        createdAt: '2024-12-01',
      },
      {
        id: '6',
        invoiceNumber: 'INV-2024-006',
        childName: 'William Lavoie',
        parentName: 'Anne Lavoie',
        amount: 800.00,
        dueDate: '2024-12-20',
        status: 'pending',
        createdAt: '2024-12-05',
      },
    ]);

    setLoading(false);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: BarChart3 },
    { id: 'invoices', label: 'Factures', icon: Receipt },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'subsidies', label: 'Subventions', icon: PiggyBank },
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
          <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
          <p className="text-gray-500">Facturation et gestion des paiements</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Exporter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-5 h-5" />
            Nouvelle facture
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Revenus du mois</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.totalRevenue || 0)}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+{summary?.monthlyGrowth}% vs mois dernier</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Paiements en attente</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.pendingPayments || 0)}</p>
              <p className="text-sm text-gray-500 mt-2">
                {invoices.filter(i => i.status === 'pending').length} facture(s)
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Paiements en retard</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.overduePayments || 0)}</p>
              <p className="text-sm text-red-500 mt-2">
                {invoices.filter(i => i.status === 'overdue').length} facture(s) en retard
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Subventions reçues</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.subsidiesReceived || 0)}</p>
              <p className="text-sm text-gray-500 mt-2">Ce mois-ci</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <PiggyBank className="w-6 h-6 text-purple-600" />
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
              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-4 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl text-white text-left hover:from-blue-600 hover:to-brand-blue transition-all">
                  <Receipt className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-1">Créer une facture</h3>
                  <p className="text-sm text-white/80">Facturation mensuelle automatique</p>
                </button>
                <button className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white text-left hover:from-emerald-600 hover:to-green-500 transition-all">
                  <CreditCard className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-1">Enregistrer un paiement</h3>
                  <p className="text-sm text-white/80">Paiement manuel ou partiel</p>
                </button>
                <button className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white text-left hover:from-violet-600 hover:to-purple-500 transition-all">
                  <FileText className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-1">Générer un rapport</h3>
                  <p className="text-sm text-white/80">Rapport financier complet</p>
                </button>
              </div>

              {/* Recent Invoices */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Dernières factures</h3>
                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className="text-sm text-brand-blue hover:underline"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="space-y-3">
                  {invoices.slice(0, 4).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-600' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-600' :
                          invoice.status === 'partial' ? 'bg-amber-100 text-amber-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {invoice.status === 'paid' && <CheckCircle className="w-5 h-5" />}
                          {invoice.status === 'overdue' && <AlertTriangle className="w-5 h-5" />}
                          {invoice.status === 'partial' && <Clock className="w-5 h-5" />}
                          {invoice.status === 'pending' && <Receipt className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">{invoice.childName} • {invoice.parentName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          invoice.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {invoice.status === 'paid' ? 'Payée' :
                           invoice.status === 'overdue' ? 'En retard' :
                           invoice.status === 'partial' ? 'Partiel' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une facture..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="paid">Payées</option>
                  <option value="partial">Partielles</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>

              {/* Invoice Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N° Facture</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Enfant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Parent</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Échéance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                        <td className="px-4 py-3 text-gray-600">{invoice.childName}</td>
                        <td className="px-4 py-3 text-gray-600">{invoice.parentName}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</span>
                          {invoice.status === 'partial' && (
                            <span className="text-sm text-gray-500 block">
                              Payé: {formatCurrency(invoice.paidAmount || 0)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(invoice.dueDate).toLocaleDateString('fr-CA')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                            invoice.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {invoice.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                            {invoice.status === 'overdue' && <AlertTriangle className="w-3 h-3" />}
                            {invoice.status === 'partial' && <Clock className="w-3 h-3" />}
                            {invoice.status === 'pending' && <Clock className="w-3 h-3" />}
                            {invoice.status === 'paid' ? 'Payée' :
                             invoice.status === 'overdue' ? 'En retard' :
                             invoice.status === 'partial' ? 'Partiel' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-brand-blue hover:underline text-sm font-medium">
                            Voir détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Historique des paiements</h3>
              <p className="text-gray-500 mb-4">
                Tous les paiements reçus et leur statut
              </p>
              <button className="text-brand-blue hover:underline">
                Enregistrer un paiement →
              </button>
            </div>
          )}

          {activeTab === 'subsidies' && (
            <div className="text-center py-12">
              <PiggyBank className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Gestion des subventions</h3>
              <p className="text-gray-500 mb-4">
                Subventions gouvernementales et programmes d'aide
              </p>
              <button className="text-brand-blue hover:underline">
                Configurer les subventions →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

