'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Baby,
  DollarSign,
  Heart,
  Clock,
  Printer,
  Mail,
  FileSpreadsheet,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'attendance' | 'financial' | 'health' | 'staff' | 'children' | 'custom';
  icon: any;
  color: string;
  lastGenerated?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Rapport de présences',
    description: 'Présences quotidiennes, hebdomadaires ou mensuelles',
    category: 'attendance',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600',
    lastGenerated: '2024-12-01',
  },
  {
    id: '2',
    name: 'Rapport financier',
    description: 'Revenus, paiements, factures et subventions',
    category: 'financial',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    lastGenerated: '2024-11-30',
  },
  {
    id: '3',
    name: 'Rapport santé',
    description: 'Allergies, médicaments, incidents et vaccinations',
    category: 'health',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
  },
  {
    id: '4',
    name: 'Rapport du personnel',
    description: 'Heures travaillées, qualifications et ratios',
    category: 'staff',
    icon: Users,
    color: 'bg-amber-100 text-amber-600',
    lastGenerated: '2024-11-28',
  },
  {
    id: '5',
    name: 'Liste des enfants',
    description: 'Informations de base, contacts et allergies',
    category: 'children',
    icon: Baby,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: '6',
    name: 'Statistiques globales',
    description: 'Vue d\'ensemble des KPIs et métriques',
    category: 'custom',
    icon: BarChart3,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedReport) return;
    
    setGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerating(false);
    setGenerated(true);
    
    // Reset after 3 seconds
    setTimeout(() => setGenerated(false), 3000);
  };

  const quickStats = [
    { label: 'Rapports générés ce mois', value: 12, icon: FileText, color: 'text-blue-600' },
    { label: 'Dernier rapport', value: 'Il y a 2h', icon: Clock, color: 'text-green-600' },
    { label: 'Rapports programmés', value: 3, icon: Calendar, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-500">Générez et exportez des rapports personnalisés</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          <Calendar className="w-5 h-5" />
          Programmer un rapport
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gray-100 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Templates */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-gray-900">Modèles de rapports</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedReport(template)}
                className={`p-4 bg-white rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  selectedReport?.id === template.id
                    ? 'border-brand-blue ring-2 ring-brand-blue/20'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${template.color}`}>
                    <template.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
                    {template.lastGenerated && (
                      <p className="text-xs text-gray-400 mt-2">
                        Dernier: {new Date(template.lastGenerated).toLocaleDateString('fr-CA')}
                      </p>
                    )}
                  </div>
                  {selectedReport?.id === template.id && (
                    <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Generator */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900">Générer un rapport</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
            {/* Selected Report */}
            {selectedReport ? (
              <div className="p-3 bg-brand-blue/10 rounded-xl border border-brand-blue/20">
                <div className="flex items-center gap-2">
                  <selectedReport.icon className="w-5 h-5 text-brand-blue" />
                  <span className="font-medium text-brand-blue">{selectedReport.name}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                <p className="text-sm text-gray-500">Sélectionnez un modèle</p>
              </div>
            )}

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Du</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Au</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Quick Periods */}
            <div className="flex flex-wrap gap-2">
              {['Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Ce trimestre'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format d'export
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'pdf', label: 'PDF', icon: FileText },
                  { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
                  { value: 'csv', label: 'CSV', icon: FileText },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormat(opt.value as any)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                      format === opt.value
                        ? 'border-brand-blue bg-brand-blue/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <opt.icon className={`w-5 h-5 ${format === opt.value ? 'text-brand-blue' : 'text-gray-400'}`} />
                    <span className={`text-xs font-medium ${format === opt.value ? 'text-brand-blue' : 'text-gray-600'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleGenerateReport}
                disabled={!selectedReport || generating}
                className="w-full py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Génération en cours...
                  </>
                ) : generated ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Rapport généré!
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Générer et télécharger
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={!selectedReport}
                  className="py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
                <button
                  disabled={!selectedReport}
                  className="py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Rapports récents</h3>
            <div className="space-y-2">
              {[
                { name: 'Présences_Nov2024.pdf', date: '01/12/2024', size: '245 KB' },
                { name: 'Financier_Q3.xlsx', date: '30/11/2024', size: '1.2 MB' },
                { name: 'Personnel_Nov.pdf', date: '28/11/2024', size: '180 KB' },
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.date} • {file.size}</p>
                    </div>
                  </div>
                  <button className="p-1.5 text-gray-400 hover:text-brand-blue rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

