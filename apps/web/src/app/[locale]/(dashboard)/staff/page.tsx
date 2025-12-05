'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Users,
  Phone,
  Mail,
  Calendar,
  Clock,
  Award,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Filter,
  Building2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Staff {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  position: string;
  department?: string;
  hireDate: string;
  status: string;
  employmentType: string;
  classrooms?: Array<{ classroom: { id: string; name: string } }>;
  qualifications?: Array<{
    id: string;
    name: string;
    expiryDate?: string;
    isVerified: boolean;
  }>;
  isOnDuty?: boolean;
}

export default function StaffPage() {
  const { data: session } = useSession();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch(
        `/api/v1/staff`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      // Demo data
      setStaff([
        {
          id: '1',
          user: { id: '1', firstName: 'Marie', lastName: 'Tremblay', email: 'directeur@petitsexplorateurs.com', phone: '514-555-0001' },
          position: 'DIRECTOR',
          department: 'Administration',
          hireDate: '2018-01-15',
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          isOnDuty: true,
          qualifications: [
            { id: '1', name: 'DEC en Éducation à l\'enfance', isVerified: true },
            { id: '2', name: 'Premiers soins', expiryDate: '2025-06-15', isVerified: true },
          ],
        },
        {
          id: '2',
          user: { id: '2', firstName: 'Sophie', lastName: 'Lavoie', email: 'sophie@petitsexplorateurs.com', phone: '514-555-0002' },
          position: 'EDUCATOR',
          department: 'Pédagogie',
          hireDate: '2020-08-20',
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          classrooms: [{ classroom: { id: '1', name: 'Poupons' } }],
          isOnDuty: true,
          qualifications: [
            { id: '3', name: 'AEC en Éducation à l\'enfance', isVerified: true },
            { id: '4', name: 'Premiers soins', expiryDate: '2024-12-20', isVerified: true },
          ],
        },
        {
          id: '3',
          user: { id: '3', firstName: 'Julie', lastName: 'Roy', email: 'julie@petitsexplorateurs.com', phone: '514-555-0003' },
          position: 'EDUCATOR',
          department: 'Pédagogie',
          hireDate: '2021-03-10',
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          classrooms: [{ classroom: { id: '2', name: 'Bambins' } }],
          isOnDuty: true,
          qualifications: [
            { id: '5', name: 'DEC en Éducation à l\'enfance', isVerified: true },
            { id: '6', name: 'Premiers soins', expiryDate: '2025-03-10', isVerified: true },
          ],
        },
        {
          id: '4',
          user: { id: '4', firstName: 'Marc', lastName: 'Gagnon', email: 'marc@petitsexplorateurs.com', phone: '514-555-0004' },
          position: 'EDUCATOR',
          department: 'Pédagogie',
          hireDate: '2022-09-01',
          status: 'ACTIVE',
          employmentType: 'PART_TIME',
          classrooms: [{ classroom: { id: '3', name: 'Préscolaire' } }],
          isOnDuty: false,
          qualifications: [
            { id: '7', name: 'AEC en Éducation à l\'enfance', isVerified: true },
            { id: '8', name: 'Premiers soins', expiryDate: '2024-09-01', isVerified: false },
          ],
        },
        {
          id: '5',
          user: { id: '5', firstName: 'Isabelle', lastName: 'Côté', email: 'isabelle@petitsexplorateurs.com', phone: '514-555-0005' },
          position: 'ASSISTANT',
          department: 'Pédagogie',
          hireDate: '2023-01-15',
          status: 'ACTIVE',
          employmentType: 'PART_TIME',
          classrooms: [{ classroom: { id: '4', name: 'Maternelle' } }],
          isOnDuty: true,
          qualifications: [
            { id: '9', name: 'Formation en petite enfance', isVerified: true },
          ],
        },
        {
          id: '6',
          user: { id: '6', firstName: 'Pierre', lastName: 'Martin', email: 'pierre@petitsexplorateurs.com', phone: '514-555-0006' },
          position: 'COOK',
          department: 'Services',
          hireDate: '2019-05-01',
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          isOnDuty: true,
          qualifications: [
            { id: '10', name: 'Manipulation des aliments', expiryDate: '2025-05-01', isVerified: true },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getPositionLabel = (position: string) => {
    const positions: Record<string, string> = {
      DIRECTOR: 'Directeur/rice',
      EDUCATOR: 'Éducateur/rice',
      ASSISTANT: 'Assistant(e)',
      COOK: 'Cuisinier/ère',
      ADMIN: 'Administration',
    };
    return positions[position] || position;
  };

  const filteredStaff = staff.filter((s) => {
    const matchesSearch = `${s.user.firstName} ${s.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || s.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];
  
  const stats = {
    total: staff.length,
    onDuty: staff.filter(s => s.isOnDuty).length,
    fullTime: staff.filter(s => s.employmentType === 'FULL_TIME').length,
    partTime: staff.filter(s => s.employmentType === 'PART_TIME').length,
    expiringQualifications: staff.filter(s => 
      s.qualifications?.some(q => {
        if (!q.expiryDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(q.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30;
      })
    ).length,
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
          <h1 className="text-2xl font-bold text-gray-900">Personnel</h1>
          <p className="text-gray-500">{staff.length} membres du personnel</p>
        </div>
        <Link
          href="/staff/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un employé
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.onDuty}</p>
              <p className="text-sm text-gray-500">En service</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.fullTime}</p>
              <p className="text-sm text-gray-500">Temps plein</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.partTime}</p>
              <p className="text-sm text-gray-500">Temps partiel</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringQualifications}</p>
              <p className="text-sm text-gray-500">Qualif. à renouveler</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous les départements</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="all">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
            <option value="ON_LEAVE">En congé</option>
          </select>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Qualifications
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                        {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{getPositionLabel(member.position)}</span>
                    <p className="text-sm text-gray-500">{member.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    {member.classrooms && member.classrooms.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {member.classrooms.map((c) => (
                          <span key={c.classroom.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                            {c.classroom.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {member.qualifications?.filter(q => q.isVerified).length || 0} vérifiée(s)
                      </span>
                      {member.qualifications?.some(q => {
                        if (!q.expiryDate) return false;
                        const daysUntilExpiry = Math.ceil((new Date(q.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        return daysUntilExpiry <= 30;
                      }) && (
                        <span className="w-2 h-2 bg-amber-500 rounded-full" title="Qualification expire bientôt" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.isOnDuty 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.isOnDuty ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {member.isOnDuty ? 'En service' : 'Absent'}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs ${
                        member.employmentType === 'FULL_TIME' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {member.employmentType === 'FULL_TIME' ? 'TP' : 'Partiel'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/staff/${member.id}`}
                      className="inline-flex items-center gap-1 text-brand-blue hover:underline text-sm font-medium"
                    >
                      Voir profil
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun employé trouvé</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Essayez avec d\'autres critères de recherche' : 'Commencez par ajouter un employé'}
          </p>
        </div>
      )}
    </div>
  );
}

