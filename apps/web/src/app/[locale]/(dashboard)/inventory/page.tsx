'use client';

import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Edit2,
  Trash2,
  History,
  ShoppingCart,
  Box,
  Pill,
  Utensils,
  Paintbrush,
  Baby,
  Droplets,
  CheckCircle,
  Clock,
  Download,
  BarChart3
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'food' | 'medical' | 'cleaning' | 'art' | 'diapers' | 'other';
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
  location: string;
  lastRestocked: string;
  expirationDate?: string;
  supplier?: string;
  unitCost: number;
  status: 'ok' | 'low' | 'critical' | 'expired';
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Couches taille 3',
    category: 'diapers',
    quantity: 45,
    unit: 'unités',
    minQuantity: 50,
    maxQuantity: 200,
    location: 'Armoire B',
    lastRestocked: '2024-12-01',
    supplier: 'Huggies',
    unitCost: 0.35,
    status: 'low',
  },
  {
    id: '2',
    name: 'Lingettes humides',
    category: 'diapers',
    quantity: 12,
    unit: 'paquets',
    minQuantity: 20,
    maxQuantity: 50,
    location: 'Armoire B',
    lastRestocked: '2024-11-28',
    supplier: 'Pampers',
    unitCost: 4.99,
    status: 'critical',
  },
  {
    id: '3',
    name: 'Lait maternisé',
    category: 'food',
    quantity: 8,
    unit: 'boîtes',
    minQuantity: 5,
    maxQuantity: 15,
    location: 'Cuisine',
    lastRestocked: '2024-12-02',
    expirationDate: '2025-06-15',
    supplier: 'Similac',
    unitCost: 42.99,
    status: 'ok',
  },
  {
    id: '4',
    name: 'Désinfectant mains',
    category: 'cleaning',
    quantity: 15,
    unit: 'bouteilles',
    minQuantity: 10,
    maxQuantity: 30,
    location: 'Rangement principal',
    lastRestocked: '2024-11-25',
    supplier: 'Purell',
    unitCost: 8.99,
    status: 'ok',
  },
  {
    id: '5',
    name: 'Peinture lavable',
    category: 'art',
    quantity: 3,
    unit: 'ensembles',
    minQuantity: 5,
    maxQuantity: 15,
    location: 'Salle d\'art',
    lastRestocked: '2024-11-15',
    supplier: 'Crayola',
    unitCost: 15.99,
    status: 'low',
  },
  {
    id: '6',
    name: 'Acétaminophène enfants',
    category: 'medical',
    quantity: 2,
    unit: 'bouteilles',
    minQuantity: 3,
    maxQuantity: 8,
    location: 'Pharmacie',
    lastRestocked: '2024-11-20',
    expirationDate: '2025-03-01',
    supplier: 'Tylenol',
    unitCost: 12.99,
    status: 'low',
  },
  {
    id: '7',
    name: 'Collations (crackers)',
    category: 'food',
    quantity: 25,
    unit: 'boîtes',
    minQuantity: 15,
    maxQuantity: 40,
    location: 'Cuisine',
    lastRestocked: '2024-12-01',
    expirationDate: '2025-04-30',
    supplier: 'Goldfish',
    unitCost: 3.49,
    status: 'ok',
  },
];

const categoryConfig: Record<string, { icon: any; label: string; color: string }> = {
  food: { icon: Utensils, label: 'Alimentation', color: 'bg-amber-100 text-amber-700' },
  medical: { icon: Pill, label: 'Médical', color: 'bg-red-100 text-red-700' },
  cleaning: { icon: Droplets, label: 'Nettoyage', color: 'bg-blue-100 text-blue-700' },
  art: { icon: Paintbrush, label: 'Art/Activités', color: 'bg-purple-100 text-purple-700' },
  diapers: { icon: Baby, label: 'Couches/Hygiène', color: 'bg-pink-100 text-pink-700' },
  other: { icon: Box, label: 'Autre', color: 'bg-gray-100 text-gray-700' },
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  ok: { label: 'OK', color: 'text-green-700', bgColor: 'bg-green-100' },
  low: { label: 'Bas', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  critical: { label: 'Critique', color: 'text-red-700', bgColor: 'bg-red-100' },
  expired: { label: 'Expiré', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => statusFilter === 'all' || item.status === statusFilter);

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(i => i.status === 'low').length,
    critical: inventory.filter(i => i.status === 'critical').length,
    totalValue: inventory.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0),
  };

  const updateQuantity = (id: string, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        let newStatus: InventoryItem['status'] = 'ok';
        if (newQuantity <= item.minQuantity * 0.5) newStatus = 'critical';
        else if (newQuantity <= item.minQuantity) newStatus = 'low';
        return { ...item, quantity: newQuantity, status: newStatus };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventaire & Fournitures</h1>
          <p className="text-gray-500">Gestion du stock et des commandes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Créer commande
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter article
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Articles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.lowStock}</p>
              <p className="text-xs text-gray-500">Stock bas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-xs text-gray-500">Critiques</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalValue.toFixed(2)} $</p>
              <p className="text-xs text-gray-500">Valeur totale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert */}
      {stats.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div className="flex-1">
              <h3 className="font-medium text-red-800">
                {stats.critical} article{stats.critical > 1 ? 's' : ''} en stock critique
              </h3>
              <p className="text-sm text-red-700">
                {inventory.filter(i => i.status === 'critical').map(i => i.name).join(', ')}
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Commander maintenant
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
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Toutes catégories</option>
            {Object.entries(categoryConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous statuts</option>
            <option value="ok">OK</option>
            <option value="low">Stock bas</option>
            <option value="critical">Critique</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const category = categoryConfig[item.category];
          const status = statusConfig[item.status];
          const stockPercentage = Math.min(100, (item.quantity / item.maxQuantity) * 100);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-sm border-2 p-5 transition-all ${
                item.status === 'critical' ? 'border-red-200' :
                item.status === 'low' ? 'border-amber-200' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="w-5 h-5" />
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${status.bgColor} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.location} • {item.supplier}</p>

              {/* Stock Level Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Stock</span>
                  <span className="font-medium">
                    {item.quantity} / {item.maxQuantity} {item.unit}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.status === 'critical' ? 'bg-red-500' :
                      item.status === 'low' ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Min: {item.minQuantity} {item.unit}</p>
              </div>

              {/* Expiration Warning */}
              {item.expirationDate && (
                <div className={`text-xs mb-3 ${
                  new Date(item.expirationDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                    ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  Expire: {new Date(item.expirationDate).toLocaleDateString('fr-CA')}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  -1
                </button>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  +1
                </button>
                <button
                  onClick={() => updateQuantity(item.id, 10)}
                  className="flex-1 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-brand-blue-dark transition-colors"
                >
                  +10
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-2">
                Dernier réapprovisionnement: {new Date(item.lastRestocked).toLocaleDateString('fr-CA')}
              </p>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun article trouvé</p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAddForm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ajouter un article</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'article</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue">
                    {Object.entries(categoryConfig).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
                  <input
                    type="text"
                    placeholder="ex: unités, boîtes..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emplacement</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
                Ajouter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

