'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Lock,
  CheckCircle,
  AlertTriangle,
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Shield,
  Loader2
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  childName: string;
  period: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
}

const mockInvoice: Invoice = {
  id: 'inv_001',
  number: 'KIDV-2024-001234',
  childName: 'Emma Dupont',
  period: 'Décembre 2024',
  amount: 892.50,
  dueDate: '2024-12-15',
  status: 'pending',
};

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm_1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
  { id: 'pm_2', type: 'card', last4: '5555', brand: 'Mastercard', isDefault: false },
  { id: 'pm_3', type: 'bank', last4: '6789', bankName: 'Desjardins', isDefault: false },
];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>(mockPaymentMethods.find(m => m.isDefault)?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentComplete(true);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  if (paymentComplete) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi!</h1>
          <p className="text-gray-500 mb-6">
            Votre paiement de <span className="font-semibold">{mockInvoice.amount.toFixed(2)} $</span> a été traité avec succès.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Numéro de facture</span>
              <span className="font-medium">{mockInvoice.number}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Date de paiement</span>
              <span className="font-medium">{new Date().toLocaleDateString('fr-CA')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Confirmation</span>
              <span className="font-medium text-green-600">TXN-{Date.now()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/finance"
              className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Retour aux finances
            </Link>
            <button className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors flex items-center justify-center gap-2">
              <Receipt className="w-4 h-4" />
              Télécharger reçu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/finance" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiement de facture</h1>
          <p className="text-gray-500">Facture #{mockInvoice.number}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-blue" />
              Détails de la facture
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Enfant</span>
                <span className="font-medium">{mockInvoice.childName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Période</span>
                <span className="font-medium">{mockInvoice.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date d'échéance</span>
                <span className="font-medium">{new Date(mockInvoice.dueDate).toLocaleDateString('fr-CA')}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Montant à payer</span>
                <span className="font-bold text-xl text-brand-blue">{mockInvoice.amount.toFixed(2)} $</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-blue" />
              Mode de paiement
            </h2>

            <div className="space-y-3">
              {mockPaymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    method.type === 'card' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-green-500'
                  }`}>
                    {method.type === 'card' ? (
                      <CreditCard className="w-6 h-6 text-white" />
                    ) : (
                      <Building2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">
                      {method.type === 'card' ? method.brand : method.bankName}
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded">
                          Par défaut
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {method.type === 'card' ? '•••• •••• •••• ' : 'Compte terminant par '}
                      {method.last4}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-brand-blue bg-brand-blue'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              ))}

              <button
                onClick={() => setShowAddCard(true)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Ajouter une nouvelle carte
              </button>
            </div>
          </div>

          {/* Add New Card Form */}
          {showAddCard && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Nouvelle carte</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                  <input
                    type="text"
                    value={newCard.number}
                    onChange={(e) => setNewCard({ ...newCard, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
                    <input
                      type="text"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                    <input
                      type="text"
                      value={newCard.cvc}
                      onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom sur la carte</label>
                  <input
                    type="text"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddCard(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                    Ajouter la carte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Résumé</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span>{mockInvoice.amount.toFixed(2)} $</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">TPS (5%)</span>
                <span>{(mockInvoice.amount * 0.05).toFixed(2)} $</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">TVQ (9.975%)</span>
                <span>{(mockInvoice.amount * 0.09975).toFixed(2)} $</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl">{(mockInvoice.amount * 1.14975).toFixed(2)} $</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className="w-full py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Payer maintenant
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-4 h-4" />
              Paiement sécurisé par Stripe
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Rappel</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Le paiement doit être effectué avant le {new Date(mockInvoice.dueDate).toLocaleDateString('fr-CA')} pour éviter les frais de retard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

