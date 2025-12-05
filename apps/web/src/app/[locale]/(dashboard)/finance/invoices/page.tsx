'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  DollarSign,
  Printer,
  Mail,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  CreditCard,
  RefreshCw
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  childId: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  period: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'KIDV-2024-001234',
    childId: 'ch_001',
    childName: 'Emma Dupont',
    parentName: 'Jean Dupont',
    parentEmail: 'jean@email.com',
    period: 'Décembre 2024',
    issueDate: '2024-12-01',
    dueDate: '2024-12-15',
    amount: 892.50,
    tax: 133.40,
    total: 1025.90,
    status: 'sent',
    items: [
      { description: 'Frais de garde - Temps plein (20 jours)', quantity: 20, unitPrice: 45.00, total: 900.00 },
      { description: 'Crédit contribution réduite', quantity: 1, unitPrice: -7.50, total: -7.50 },
    ],
  },
  {
    id: '2',
    number: 'KIDV-2024-001233',
    childId: 'ch_002',
    childName: 'Lucas Martin',
    parentName: 'Marie Martin',
    parentEmail: 'marie@email.com',
    period: 'Décembre 2024',
    issueDate: '2024-12-01',
    dueDate: '2024-12-15',
    amount: 720.00,
    tax: 107.64,
    total: 827.64,
    status: 'paid',
    paidDate: '2024-12-03',
    paidAmount: 827.64,
    paymentMethod: 'Carte de crédit',
    items: [
      { description: 'Frais de garde - Temps plein (16 jours)', quantity: 16, unitPrice: 45.00, total: 720.00 },
    ],
  },
  {
    id: '3',
    number: 'KIDV-2024-001232',
    childId: 'ch_003',
    childName: 'Léa Tremblay',
    parentName: 'Pierre Tremblay',
    parentEmail: 'pierre@email.com',
    period: 'Novembre 2024',
    issueDate: '2024-11-01',
    dueDate: '2024-11-15',
    amount: 900.00,
    tax: 134.55,
    total: 1034.55,
    status: 'overdue',
    items: [
      { description: 'Frais de garde - Temps plein (20 jours)', quantity: 20, unitPrice: 45.00, total: 900.00 },
    ],
  },
  {
    id: '4',
    number: 'KIDV-2024-001231',
    childId: 'ch_004',
    childName: 'Thomas Roy',
    parentName: 'Anne Roy',
    parentEmail: 'anne@email.com',
    period: 'Décembre 2024',
    issueDate: '2024-12-01',
    dueDate: '2024-12-15',
    amount: 560.00,
    tax: 83.72,
    total: 643.72,
    status: 'draft',
    items: [
      { description: 'Frais de garde - Temps partiel (16 jours)', quantity: 16, unitPrice: 35.00, total: 560.00 },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  draft: { label: 'Brouillon', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Edit2 },
  sent: { label: 'Envoyée', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Send },
  paid: { label: 'Payée', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  overdue: { label: 'En retard', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle },
  cancelled: { label: 'Annulée', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: XCircle },
};

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredInvoices = invoices
    .filter(inv => 
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.parentName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(inv => statusFilter === 'all' || inv.status === statusFilter)
    .filter(inv => periodFilter === 'all' || inv.period.includes(periodFilter));

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    pending: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
    count: {
      total: invoices.length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      pending: invoices.filter(inv => inv.status === 'sent').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/finance" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
            <p className="text-gray-500">Gestion de la facturation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Générer factures
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle facture
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total facturé</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total.toFixed(2)} $</p>
              <p className="text-xs text-gray-400">{stats.count.total} factures</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payé</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid.toFixed(2)} $</p>
              <p className="text-xs text-gray-400">{stats.count.paid} factures</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending.toFixed(2)} $</p>
              <p className="text-xs text-gray-400">{stats.count.pending} factures</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En retard</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue.toFixed(2)} $</p>
              <p className="text-xs text-gray-400">{stats.count.overdue} factures</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Alert */}
      {stats.count.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">
                {stats.count.overdue} facture{stats.count.overdue > 1 ? 's' : ''} en retard de paiement
              </h3>
              <p className="text-sm text-red-700">
                Montant total: {stats.overdue.toFixed(2)} $
              </p>
            </div>
            <button className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Envoyer rappels
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro, enfant ou parent..."
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
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Toutes les périodes</option>
            <option value="Décembre 2024">Décembre 2024</option>
            <option value="Novembre 2024">Novembre 2024</option>
            <option value="Octobre 2024">Octobre 2024</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Numéro</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Enfant / Parent</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Période</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Échéance</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Montant</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const isOverdue = invoice.status === 'overdue';

                return (
                  <tr key={invoice.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50/30' : ''}`}>
                    <td className="py-4 px-4">
                      <p className="font-mono text-sm font-medium text-gray-900">{invoice.number}</p>
                      <p className="text-xs text-gray-500">{new Date(invoice.issueDate).toLocaleDateString('fr-CA')}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{invoice.childName}</p>
                      <p className="text-sm text-gray-500">{invoice.parentName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700">{invoice.period}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                        {new Date(invoice.dueDate).toLocaleDateString('fr-CA')}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-semibold text-gray-900">{invoice.total.toFixed(2)} $</p>
                      <p className="text-xs text-gray-500">TPS/TVQ: {invoice.tax.toFixed(2)} $</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bgColor} ${status.color}`}>
                        <status.icon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger">
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Envoyer">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {invoice.status === 'sent' && (
                          <Link
                            href={`/finance/payment?invoice=${invoice.id}`}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Enregistrer paiement"
                          >
                            <CreditCard className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune facture trouvée</p>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedInvoice(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-auto">
            {/* Invoice Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Facture {selectedInvoice.number}</h2>
                  <p className="text-gray-500">{selectedInvoice.period}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Printer className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Facturer à</h3>
                  <p className="font-medium text-gray-900">{selectedInvoice.parentName}</p>
                  <p className="text-sm text-gray-600">{selectedInvoice.parentEmail}</p>
                  <p className="text-sm text-gray-600 mt-2">Enfant: {selectedInvoice.childName}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date d'émission:</span>
                      <span className="text-sm font-medium">{new Date(selectedInvoice.issueDate).toLocaleDateString('fr-CA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date d'échéance:</span>
                      <span className="text-sm font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString('fr-CA')}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">Statut:</span>
                      {(() => {
                        const status = statusConfig[selectedInvoice.status];
                        return (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-500">Qté</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Prix unit.</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-700">{item.description}</td>
                      <td className="py-3 text-sm text-gray-700 text-center">{item.quantity}</td>
                      <td className="py-3 text-sm text-gray-700 text-right">{item.unitPrice.toFixed(2)} $</td>
                      <td className="py-3 text-sm font-medium text-gray-900 text-right">{item.total.toFixed(2)} $</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sous-total</span>
                      <span className="text-gray-900">{selectedInvoice.amount.toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">TPS (5%)</span>
                      <span className="text-gray-900">{(selectedInvoice.amount * 0.05).toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">TVQ (9.975%)</span>
                      <span className="text-gray-900">{(selectedInvoice.amount * 0.09975).toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-brand-blue">{selectedInvoice.total.toFixed(2)} $</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedInvoice.status === 'paid' && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <h4 className="font-medium text-green-800 mb-2">Informations de paiement</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Date: {selectedInvoice.paidDate}</p>
                    <p>Montant: {selectedInvoice.paidAmount?.toFixed(2)} $</p>
                    <p>Méthode: {selectedInvoice.paymentMethod}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Fermer
                </button>
                {selectedInvoice.status === 'draft' && (
                  <button className="px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                    Envoyer la facture
                  </button>
                )}
                {selectedInvoice.status === 'sent' && (
                  <Link
                    href={`/finance/payment?invoice=${selectedInvoice.id}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    Enregistrer le paiement
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
