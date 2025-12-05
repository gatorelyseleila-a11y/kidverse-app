'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Baby,
  Users,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Heart,
  DollarSign,
  Activity,
  ChevronRight,
  Bell,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Building2,
  Sparkles
} from 'lucide-react';

// Simple chart components (no external dependencies)
const BarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-t-lg ${item.color} transition-all duration-500`}
            style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '4px' }}
          />
          <span className="text-xs text-gray-500 truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ percentage, color, label }: { percentage: number; color: string; label: string }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{percentage}%</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
    </div>
  );
};

const SparkLine = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Mock data
  const stats = {
    childrenPresent: 42,
    childrenTotal: 48,
    staffPresent: 8,
    staffTotal: 10,
    attendanceRate: 87.5,
    alerts: 3,
    pendingPayments: 5,
    revenueToday: 2450,
  };

  const weeklyAttendance = [
    { label: 'Lun', value: 45, color: 'bg-brand-blue' },
    { label: 'Mar', value: 42, color: 'bg-brand-blue' },
    { label: 'Mer', value: 38, color: 'bg-brand-blue' },
    { label: 'Jeu', value: 44, color: 'bg-brand-blue' },
    { label: 'Ven', value: 42, color: 'bg-brand-blue' },
  ];

  const classroomOccupancy = [
    { name: 'Poupons', current: 8, max: 10, color: '#3B82F6' },
    { name: 'Bambins', current: 12, max: 15, color: '#10B981' },
    { name: 'Préscolaire', current: 14, max: 15, color: '#F59E0B' },
    { name: 'Maternelle', current: 8, max: 8, color: '#EF4444' },
  ];

  const recentActivity = [
    { type: 'checkin', child: 'Emma Dupont', time: '08:15', by: 'Jean Dupont' },
    { type: 'checkin', child: 'Lucas Martin', time: '08:22', by: 'Marie Martin' },
    { type: 'checkout', child: 'Léa Tremblay', time: '08:30', by: 'Pierre Tremblay' },
    { type: 'alert', message: 'Allergie signalée - Thomas Roy', time: '08:45' },
    { type: 'checkin', child: 'Sophie Bernard', time: '08:50', by: 'Anne Bernard' },
  ];

  const alerts = [
    { type: 'urgent', title: 'Ratio personnel insuffisant', message: 'Classe Bambins: 1:8 au lieu de 1:5', time: 'Il y a 10 min' },
    { type: 'warning', title: 'Vaccination à renouveler', message: '3 enfants ont des vaccins expirés', time: 'Il y a 2h' },
    { type: 'info', title: 'Nouvelle inscription', message: 'Demande de Famille Gagnon reçue', time: 'Il y a 3h' },
  ];

  const upcomingEvents = [
    { title: 'Réunion de parents', date: 'Aujourd\'hui 18:00', type: 'meeting' },
    { title: 'Sortie au parc', date: 'Demain 10:00', type: 'activity' },
    { title: 'Inspection ministère', date: 'Lundi 15 déc.', type: 'inspection' },
  ];

  const revenueData = [1800, 2200, 1950, 2100, 2450, 2300, 2450];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue! Voici un aperçu de votre garderie.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range === 'today' ? 'Aujourd\'hui' : range === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Baby className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +3
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.childrenPresent}</p>
          <p className="text-sm text-gray-500">Enfants présents / {stats.childrenTotal}</p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(stats.childrenPresent / stats.childrenTotal) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              OK
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.staffPresent}</p>
          <p className="text-sm text-gray-500">Personnel présent / {stats.staffTotal}</p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(stats.staffPresent / stats.staffTotal) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            {stats.alerts > 0 && (
              <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                <Bell className="w-4 h-4" />
                Nouveau
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.alerts}</p>
          <p className="text-sm text-gray-500">Alertes actives</p>
          <Link href="/health" className="mt-3 text-sm text-brand-blue hover:underline flex items-center gap-1">
            Voir les alertes <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.revenueToday.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Revenus aujourd'hui</p>
          <div className="mt-2">
            <SparkLine data={revenueData} color="#8B5CF6" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Présences de la semaine</h2>
              <p className="text-sm text-gray-500">Nombre d'enfants par jour</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <span className="w-3 h-3 bg-brand-blue rounded" />
                Présents
              </span>
            </div>
          </div>
          <BarChart data={weeklyAttendance} />
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taux de présence moyen</p>
              <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
            </div>
            <Link href="/attendance" className="text-sm text-brand-blue hover:underline flex items-center gap-1">
              Voir les détails <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Classroom Occupancy */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Occupation des classes</h2>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {classroomOccupancy.map((classroom) => {
              const percentage = (classroom.current / classroom.max) * 100;
              const isFull = percentage >= 100;
              return (
                <div key={classroom.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{classroom.name}</span>
                    <span className={`text-sm font-medium ${isFull ? 'text-red-600' : 'text-gray-600'}`}>
                      {classroom.current}/{classroom.max}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: classroom.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/centers" className="mt-4 block text-sm text-brand-blue hover:underline">
            Gérer les classes →
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Activité récente</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'checkin' ? 'bg-green-100' :
                  activity.type === 'checkout' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  {activity.type === 'checkin' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {activity.type === 'checkout' && <XCircle className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.type === 'alert' ? activity.message : activity.child}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.type !== 'alert' && `par ${activity.by} • `}{activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/attendance" className="mt-4 block text-sm text-brand-blue hover:underline">
            Voir tout l'historique →
          </Link>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Alertes</h2>
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
              {alerts.length} actives
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-xl border ${
                  alert.type === 'urgent' ? 'bg-red-50 border-red-200' :
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    alert.type === 'urgent' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/health" className="mt-4 block text-sm text-brand-blue hover:underline">
            Gérer les alertes →
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Prochains événements</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  event.type === 'meeting' ? 'bg-blue-100' :
                  event.type === 'activity' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {event.type === 'meeting' && <Users className="w-5 h-5 text-blue-600" />}
                  {event.type === 'activity' && <Sparkles className="w-5 h-5 text-green-600" />}
                  {event.type === 'inspection' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/calendar" className="mt-4 block text-sm text-brand-blue hover:underline">
            Voir le calendrier →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Nouvel enfant', href: '/children/new', icon: Baby },
            { label: 'Check-in', href: '/attendance', icon: CalendarCheck },
            { label: 'Nouveau message', href: '/messages', icon: Bell },
            { label: 'Générer rapport', href: '/reports', icon: BarChart3 },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
