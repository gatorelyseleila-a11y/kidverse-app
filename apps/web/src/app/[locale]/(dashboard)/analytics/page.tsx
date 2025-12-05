'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Baby,
  DollarSign,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';

// Custom Line Chart Component
const LineChart = ({ 
  data, 
  height = 200,
  color = '#2563EB',
  showArea = true 
}: { 
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  showArea?: boolean;
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 80 - 10;
    return { x, y, ...item };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div style={{ height }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line 
            key={y} 
            x1="0" 
            y1={y} 
            x2="100" 
            y2={y} 
            stroke="#e5e7eb" 
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Area */}
        {showArea && (
          <path
            d={areaD}
            fill={`${color}15`}
          />
        )}
        
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2"
            fill="white"
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1).map((item, i) => (
          <span key={i}>{item.label}</span>
        ))}
      </div>
    </div>
  );
};

// Horizontal Bar Chart
const HorizontalBarChart = ({ 
  data 
}: { 
  data: { label: string; value: number; color: string; max?: number }[] 
}) => {
  const maxValue = Math.max(...data.map(d => d.max || d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-sm text-gray-500">{item.value}{item.max ? `/${item.max}` : ''}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Pie/Donut Chart
const DonutChart = ({ 
  data,
  size = 180 
}: { 
  data: { label: string; value: number; color: string }[];
  size?: number;
}) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let currentAngle = -90;
  
  const segments = data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;
    
    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return {
      ...item,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: Math.round((item.value / total) * 100),
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            className="transition-all duration-300 hover:opacity-80"
          />
        ))}
        <circle cx="50" cy="50" r="25" fill="white" />
        <text x="50" y="50" textAnchor="middle" dy="0.35em" className="text-lg font-bold" fill="#111827">
          {total}
        </text>
        <text x="50" y="62" textAnchor="middle" className="text-xs" fill="#6b7280">
          Total
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-sm text-gray-600">{segment.label}</span>
            <span className="text-sm font-medium text-gray-900">{segment.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Mock data
  const attendanceData = [
    { label: '1', value: 42 },
    { label: '2', value: 45 },
    { label: '3', value: 38 },
    { label: '4', value: 44 },
    { label: '5', value: 40 },
    { label: '6', value: 35 },
    { label: '7', value: 32 },
    { label: '8', value: 44 },
    { label: '9', value: 46 },
    { label: '10', value: 42 },
    { label: '11', value: 45 },
    { label: '12', value: 48 },
    { label: '13', value: 43 },
    { label: '14', value: 41 },
    { label: '15', value: 44 },
    { label: '16', value: 46 },
    { label: '17', value: 42 },
    { label: '18', value: 45 },
    { label: '19', value: 47 },
    { label: '20', value: 44 },
  ];

  const revenueData = [
    { label: 'Jan', value: 28500 },
    { label: 'Fév', value: 31200 },
    { label: 'Mar', value: 29800 },
    { label: 'Avr', value: 32400 },
    { label: 'Mai', value: 30100 },
    { label: 'Juin', value: 28900 },
    { label: 'Juil', value: 25600 },
    { label: 'Août', value: 27800 },
    { label: 'Sep', value: 33500 },
    { label: 'Oct', value: 34200 },
    { label: 'Nov', value: 35800 },
    { label: 'Déc', value: 36500 },
  ];

  const classroomDistribution = [
    { label: 'Poupons', value: 8, color: '#EC4899' },
    { label: 'Bambins', value: 14, color: '#3B82F6' },
    { label: 'Préscolaire', value: 15, color: '#10B981' },
    { label: 'Maternelle', value: 10, color: '#8B5CF6' },
  ];

  const staffPerformance = [
    { label: 'Sophie L.', value: 98, color: '#10B981', max: 100 },
    { label: 'Julie R.', value: 95, color: '#10B981', max: 100 },
    { label: 'Marc G.', value: 92, color: '#F59E0B', max: 100 },
    { label: 'Émilie T.', value: 88, color: '#F59E0B', max: 100 },
    { label: 'Pierre D.', value: 94, color: '#10B981', max: 100 },
  ];

  const kpis = [
    {
      title: 'Taux de présence',
      value: '91.2%',
      change: '+2.4%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Revenus mensuels',
      value: '$36,500',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Nouvelles inscriptions',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Baby,
      color: 'bg-purple-500',
    },
    {
      title: 'Satisfaction parents',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Award,
      color: 'bg-amber-500',
    },
  ];

  const insights = [
    {
      type: 'success',
      title: 'Excellent taux de rétention',
      message: '98% des familles ont renouvelé leur inscription ce trimestre',
    },
    {
      type: 'warning',
      title: 'Capacité presque atteinte',
      message: 'La classe Préscolaire est à 100% de capacité',
    },
    {
      type: 'info',
      title: 'Tendance positive',
      message: 'Les revenus ont augmenté de 12% vs l\'année dernière',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Tableau de bord analytique détaillé</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors">
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 ${kpi.color} bg-opacity-10 rounded-xl`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-sm text-gray-500">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Tendance des présences</h2>
              <p className="text-sm text-gray-500">Nombre d'enfants présents par jour</p>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <LineChart data={attendanceData} height={200} color="#3B82F6" />
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Revenus mensuels</h2>
              <p className="text-sm text-gray-500">Évolution sur 12 mois</p>
            </div>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <LineChart data={revenueData} height={200} color="#10B981" />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Distribution by Class */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Répartition par classe</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <DonutChart data={classroomDistribution} />
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Performance du personnel</h2>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <HorizontalBarChart data={staffPerformance} />
        </div>

        {/* Insights */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Insights</h2>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-3 rounded-xl border ${
                  insight.type === 'success' ? 'bg-green-50 border-green-200' :
                  insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <h4 className={`text-sm font-medium ${
                  insight.type === 'success' ? 'text-green-900' :
                  insight.type === 'warning' ? 'text-amber-900' :
                  'text-blue-900'
                }`}>{insight.title}</h4>
                <p className={`text-xs mt-1 ${
                  insight.type === 'success' ? 'text-green-700' :
                  insight.type === 'warning' ? 'text-amber-700' :
                  'text-blue-700'
                }`}>{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Métriques détaillées par classe</h2>
          <button className="text-sm text-brand-blue hover:underline">Voir tout →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Classe</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Capacité</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Occupation</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Taux présence</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Revenus</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Ratio</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Tendance</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Poupons', capacity: '8/10', occupation: 80, attendance: 92, revenue: 8500, ratio: '1:4', trend: 'up' },
                { name: 'Bambins', capacity: '14/15', occupation: 93, attendance: 89, revenue: 12200, ratio: '1:7', trend: 'up' },
                { name: 'Préscolaire', capacity: '15/15', occupation: 100, attendance: 94, revenue: 11800, ratio: '1:8', trend: 'stable' },
                { name: 'Maternelle', capacity: '10/10', occupation: 100, attendance: 91, revenue: 8900, ratio: '1:10', trend: 'up' },
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.capacity}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.occupation >= 100 ? 'bg-red-100 text-red-700' :
                      row.occupation >= 80 ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {row.occupation}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.attendance}%</td>
                  <td className="py-3 px-4 text-center text-gray-600">${row.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-green-600 font-medium">{row.ratio}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />}
                    {row.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />}
                    {row.trend === 'stable' && <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

