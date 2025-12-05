'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  Baby,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  Calendar,
  ChevronRight,
  Star,
  Shield
} from 'lucide-react';

interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  capacity: number;
  currentEnrollment: number;
  openingTime: string;
  closingTime: string;
  status: 'active' | 'inactive' | 'pending';
  licenseExpiry?: string;
  classrooms: number;
  staffCount: number;
  rating?: number;
}

export default function CentersPage() {
  const { data: session } = useSession();
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await fetch(
        `/api/v1/centers`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCenters(data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
      // Demo data
      setCenters([
        {
          id: '1',
          name: 'Les Petits Explorateurs',
          address: '123 rue des Enfants',
          city: 'Montréal, QC H2X 1Y2',
          phone: '514-555-1234',
          email: 'info@petitsexplorateurs.com',
          capacity: 60,
          currentEnrollment: 45,
          openingTime: '07:00',
          closingTime: '18:00',
          status: 'active',
          licenseExpiry: '2025-06-30',
          classrooms: 4,
          staffCount: 12,
          rating: 4.8,
        },
        {
          id: '2',
          name: 'Garderie Arc-en-ciel',
          address: '456 avenue des Bambins',
          city: 'Laval, QC H7N 3K8',
          phone: '450-555-5678',
          email: 'contact@arcenciel.com',
          capacity: 45,
          currentEnrollment: 42,
          openingTime: '07:30',
          closingTime: '17:30',
          status: 'active',
          licenseExpiry: '2024-12-31',
          classrooms: 3,
          staffCount: 9,
          rating: 4.6,
        },
        {
          id: '3',
          name: 'Centre Éducatif Soleil',
          address: '789 boulevard de l\'Éducation',
          city: 'Longueuil, QC J4K 2M5',
          phone: '450-555-9012',
          email: 'info@soleil-garderie.com',
          capacity: 75,
          currentEnrollment: 38,
          openingTime: '06:30',
          closingTime: '18:30',
          status: 'pending',
          classrooms: 5,
          staffCount: 8,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter((center) =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalCenters: centers.length,
    activeCenters: centers.filter(c => c.status === 'active').length,
    totalCapacity: centers.reduce((sum, c) => sum + c.capacity, 0),
    totalEnrollment: centers.reduce((sum, c) => sum + c.currentEnrollment, 0),
    totalStaff: centers.reduce((sum, c) => sum + c.staffCount, 0),
    expiringLicenses: centers.filter(c => {
      if (!c.licenseExpiry) return false;
      const daysUntilExpiry = Math.ceil((new Date(c.licenseExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 90;
    }).length,
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Centres</h1>
          <p className="text-gray-500">Gestion de vos installations de garderie</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
          <Plus className="w-5 h-5" />
          Ajouter un centre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.totalCenters}</p>
              <p className="text-xs text-gray-500">Centres</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.activeCenters}</p>
              <p className="text-xs text-gray-500">Actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Baby className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.totalEnrollment}</p>
              <p className="text-xs text-gray-500">Enfants</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.totalStaff}</p>
              <p className="text-xs text-gray-500">Personnel</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.totalCapacity}</p>
              <p className="text-xs text-gray-500">Capacité</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.expiringLicenses}</p>
              <p className="text-xs text-gray-500">Licences à renouveler</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un centre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-orange rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {center.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{center.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {center.city}
                    </p>
                    {center.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{center.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  center.status === 'active' ? 'bg-green-100 text-green-700' :
                  center.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {center.status === 'active' ? 'Actif' : center.status === 'pending' ? 'En attente' : 'Inactif'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{center.currentEnrollment}</p>
                  <p className="text-xs text-gray-500">Enfants</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{center.capacity}</p>
                  <p className="text-xs text-gray-500">Capacité</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{center.classrooms}</p>
                  <p className="text-xs text-gray-500">Classes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{center.staffCount}</p>
                  <p className="text-xs text-gray-500">Personnel</p>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Taux d'occupation</span>
                  <span className="font-medium">
                    {Math.round((center.currentEnrollment / center.capacity) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (center.currentEnrollment / center.capacity) > 0.9
                        ? 'bg-red-500'
                        : (center.currentEnrollment / center.capacity) > 0.7
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(center.currentEnrollment / center.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* License Warning */}
              {center.licenseExpiry && (() => {
                const daysUntilExpiry = Math.ceil((new Date(center.licenseExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysUntilExpiry <= 90) {
                  return (
                    <div className={`p-3 rounded-lg flex items-center gap-2 ${
                      daysUntilExpiry <= 30 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">
                        Licence expire dans {daysUntilExpiry} jour(s)
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {center.openingTime} - {center.closingTime}
                </span>
                <a href={`tel:${center.phone}`} className="flex items-center gap-1 hover:text-brand-blue">
                  <Phone className="w-4 h-4" />
                  {center.phone}
                </a>
              </div>
              <Link
                href={`/centers/${center.id}`}
                className="flex items-center gap-1 text-brand-blue hover:underline text-sm font-medium"
              >
                Gérer
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCenters.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun centre trouvé</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Essayez avec d\'autres critères de recherche' : 'Commencez par ajouter un centre'}
          </p>
        </div>
      )}
    </div>
  );
}

