'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Users,
  Baby,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Calendar,
  TrendingUp,
  Building2
} from 'lucide-react';

interface Classroom {
  id: string;
  name: string;
  ageRange: string;
  minAge: number;
  maxAge: number;
  capacity: number;
  currentCount: number;
  staffCount: number;
  requiredRatio: string;
  currentRatio: string;
  ratioCompliant: boolean;
  color: string;
  schedule: string;
  educators: { id: string; name: string; photo?: string }[];
}

const mockClassrooms: Classroom[] = [
  {
    id: '1',
    name: 'Poupons',
    ageRange: '0-18 mois',
    minAge: 0,
    maxAge: 18,
    capacity: 10,
    currentCount: 8,
    staffCount: 2,
    requiredRatio: '1:5',
    currentRatio: '1:4',
    ratioCompliant: true,
    color: 'bg-pink-500',
    schedule: '7h00 - 18h00',
    educators: [
      { id: 'e1', name: 'Sophie L.' },
      { id: 'e2', name: 'Julie R.' },
    ],
  },
  {
    id: '2',
    name: 'Bambins',
    ageRange: '18-36 mois',
    minAge: 18,
    maxAge: 36,
    capacity: 15,
    currentCount: 14,
    staffCount: 2,
    requiredRatio: '1:8',
    currentRatio: '1:7',
    ratioCompliant: true,
    color: 'bg-blue-500',
    schedule: '7h00 - 18h00',
    educators: [
      { id: 'e3', name: 'Marc G.' },
      { id: 'e4', name: 'Émilie T.' },
    ],
  },
  {
    id: '3',
    name: 'Préscolaire',
    ageRange: '3-4 ans',
    minAge: 36,
    maxAge: 48,
    capacity: 15,
    currentCount: 15,
    staffCount: 2,
    requiredRatio: '1:8',
    currentRatio: '1:7.5',
    ratioCompliant: true,
    color: 'bg-green-500',
    schedule: '7h00 - 18h00',
    educators: [
      { id: 'e5', name: 'Pierre D.' },
      { id: 'e6', name: 'Anne B.' },
    ],
  },
  {
    id: '4',
    name: 'Maternelle',
    ageRange: '4-5 ans',
    minAge: 48,
    maxAge: 60,
    capacity: 10,
    currentCount: 10,
    staffCount: 1,
    requiredRatio: '1:10',
    currentRatio: '1:10',
    ratioCompliant: true,
    color: 'bg-purple-500',
    schedule: '7h00 - 18h00',
    educators: [
      { id: 'e7', name: 'Marie T.' },
    ],
  },
];

export default function ClassroomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const totalCapacity = mockClassrooms.reduce((acc, c) => acc + c.capacity, 0);
  const totalChildren = mockClassrooms.reduce((acc, c) => acc + c.currentCount, 0);
  const totalStaff = mockClassrooms.reduce((acc, c) => acc + c.staffCount, 0);
  const occupancyRate = Math.round((totalChildren / totalCapacity) * 100);

  const filteredClassrooms = mockClassrooms.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des classes</h1>
          <p className="text-gray-500">Gérez les groupes d'âge et les ratios</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
          <Plus className="w-5 h-5" />
          Nouvelle classe
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockClassrooms.length}</p>
              <p className="text-xs text-gray-500">Classes actives</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Baby className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalChildren}/{totalCapacity}</p>
              <p className="text-xs text-gray-500">Enfants inscrits</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
              <p className="text-xs text-gray-500">Éducateurs assignés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
              <p className="text-xs text-gray-500">Taux d'occupation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une classe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      {/* Classrooms Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredClassrooms.map((classroom) => {
          const occupancy = (classroom.currentCount / classroom.capacity) * 100;
          const isFull = occupancy >= 100;
          const isNearFull = occupancy >= 80;

          return (
            <div
              key={classroom.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className={`p-4 ${classroom.color} bg-opacity-10 border-b border-gray-100`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${classroom.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                      {classroom.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{classroom.name}</h3>
                      <p className="text-sm text-gray-500">{classroom.ageRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Occupancy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Occupation</span>
                    <span className={`text-sm font-medium ${
                      isFull ? 'text-red-600' : isNearFull ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {classroom.currentCount}/{classroom.capacity} places
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-red-500' : isNearFull ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(occupancy, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Ratio */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Ratio éducateur/enfants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      classroom.ratioCompliant ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {classroom.currentRatio}
                    </span>
                    {classroom.ratioCompliant ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Horaire: {classroom.schedule}</span>
                </div>

                {/* Educators */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Éducateurs assignés:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {classroom.educators.map((educator) => (
                        <div
                          key={educator.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white text-xs font-bold ring-2 ring-white"
                          title={educator.name}
                        >
                          {educator.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                    </div>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                      <UserPlus className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Link
                    href={`/children?classroom=${classroom.id}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                  >
                    Voir les enfants
                  </Link>
                  <Link
                    href={`/staff/schedule?classroom=${classroom.id}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"
                  >
                    Voir le planning
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ratio Guidelines */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Ratios réglementaires (Québec)</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { age: '0-18 mois', ratio: '1:5', color: 'bg-pink-100 text-pink-700' },
            { age: '18-36 mois', ratio: '1:8', color: 'bg-blue-100 text-blue-700' },
            { age: '3-4 ans', ratio: '1:8', color: 'bg-green-100 text-green-700' },
            { age: '4-5 ans', ratio: '1:10', color: 'bg-purple-100 text-purple-700' },
          ].map((item, index) => (
            <div key={index} className={`p-4 rounded-xl ${item.color}`}>
              <p className="font-medium">{item.age}</p>
              <p className="text-2xl font-bold mt-1">{item.ratio}</p>
              <p className="text-sm opacity-75">éducateur/enfants</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

