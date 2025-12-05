'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Filter,
  Baby,
  Phone,
  Mail,
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  Users,
  Calendar,
  Heart
} from 'lucide-react';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  photoUrl?: string;
  status: string;
  classroom?: { id: string; name: string };
  parents?: Array<{
    parent: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string;
    };
    relationship: string;
  }>;
  allergies?: Array<{ allergen: string; severity: string }>;
}

export default function ChildrenPage() {
  const { data: session } = useSession();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch(`/api/v1/children`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setChildren(data);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      // Demo data
      setChildren([
        {
          id: '1',
          firstName: 'Emma',
          lastName: 'Dupont',
          dateOfBirth: '2021-03-15',
          gender: 'FEMALE',
          status: 'ACTIVE',
          classroom: { id: '1', name: 'Poupons' },
          parents: [{ parent: { id: '1', firstName: 'Jean', lastName: 'Dupont', phone: '514-555-1234' }, relationship: 'Père' }],
          allergies: [{ allergen: 'Arachides', severity: 'SEVERE' }],
        },
        {
          id: '2',
          firstName: 'Lucas',
          lastName: 'Martin',
          dateOfBirth: '2020-08-22',
          gender: 'MALE',
          status: 'ACTIVE',
          classroom: { id: '2', name: 'Bambins' },
          parents: [{ parent: { id: '2', firstName: 'Marie', lastName: 'Martin', phone: '514-555-5678' }, relationship: 'Mère' }],
          allergies: [],
        },
        {
          id: '3',
          firstName: 'Léa',
          lastName: 'Tremblay',
          dateOfBirth: '2019-11-10',
          gender: 'FEMALE',
          status: 'ACTIVE',
          classroom: { id: '3', name: 'Préscolaire' },
          parents: [{ parent: { id: '3', firstName: 'Pierre', lastName: 'Tremblay', phone: '514-555-9012' }, relationship: 'Père' }],
          allergies: [{ allergen: 'Lait', severity: 'MODERATE' }],
        },
        {
          id: '4',
          firstName: 'Noah',
          lastName: 'Roy',
          dateOfBirth: '2020-05-30',
          gender: 'MALE',
          status: 'ACTIVE',
          classroom: { id: '2', name: 'Bambins' },
          parents: [{ parent: { id: '4', firstName: 'Sophie', lastName: 'Roy', phone: '514-555-3456' }, relationship: 'Mère' }],
          allergies: [],
        },
        {
          id: '5',
          firstName: 'Olivia',
          lastName: 'Gagnon',
          dateOfBirth: '2019-02-18',
          gender: 'FEMALE',
          status: 'ACTIVE',
          classroom: { id: '4', name: 'Maternelle' },
          parents: [{ parent: { id: '5', firstName: 'Marc', lastName: 'Gagnon', phone: '514-555-7890' }, relationship: 'Père' }],
          allergies: [{ allergen: 'Œufs', severity: 'MILD' }],
        },
      ]);
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
      return `${months + (today.getDate() < birth.getDate() ? 11 : 12)} mois`;
    }
    return `${years} an${years > 1 ? 's' : ''}`;
  };

  const filteredChildren = children.filter((child) => {
    const matchesSearch = `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClassroom = selectedClassroom === 'all' || child.classroom?.id === selectedClassroom;
    const matchesStatus = selectedStatus === 'all' || child.status === selectedStatus;
    return matchesSearch && matchesClassroom && matchesStatus;
  });

  const classrooms = [...new Set(children.map(c => c.classroom?.name).filter(Boolean))];

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
          <h1 className="text-2xl font-bold text-gray-900">Enfants</h1>
          <p className="text-gray-500">{children.length} enfants inscrits</p>
        </div>
        <Link
          href="/children/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle inscription
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un enfant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
            />
          </div>

          {/* Classroom filter */}
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Toutes les classes</option>
            {classrooms.map((classroom) => (
              <option key={classroom} value={classroom}>{classroom}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
            <option value="PENDING">En attente</option>
          </select>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChildren.map((child) => (
          <Link
            key={child.id}
            href={`/children/${child.id}`}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-blue/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                child.gender === 'FEMALE' 
                  ? 'bg-gradient-to-br from-pink-400 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-400 to-blue-500'
              }`}>
                {child.firstName.charAt(0)}{child.lastName.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {child.firstName} {child.lastName}
                  </h3>
                  {child.allergies && child.allergies.length > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {getAge(child.dateOfBirth)}
                  </span>
                  {child.classroom && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {child.classroom.name}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-blue transition-colors" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                child.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-700'
                  : child.status === 'PENDING'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {child.status === 'ACTIVE' ? 'Actif' : child.status === 'PENDING' ? 'En attente' : 'Inactif'}
              </span>
              {child.allergies?.map((allergy, index) => (
                <span
                  key={index}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    allergy.severity === 'SEVERE'
                      ? 'bg-red-100 text-red-700'
                      : allergy.severity === 'MODERATE'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  ⚠️ {allergy.allergen}
                </span>
              ))}
            </div>

            {/* Parent Contact */}
            {child.parents && child.parents[0] && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {child.parents[0].relationship}: {child.parents[0].parent.firstName} {child.parents[0].parent.lastName}
                  </span>
                  <span className="flex items-center gap-1 text-brand-blue">
                    <Phone className="w-4 h-4" />
                    {child.parents[0].parent.phone}
                  </span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredChildren.length === 0 && (
        <div className="text-center py-12">
          <Baby className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun enfant trouvé</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Essayez avec d\'autres critères de recherche' : 'Commencez par inscrire un enfant'}
          </p>
        </div>
      )}
    </div>
  );
}

