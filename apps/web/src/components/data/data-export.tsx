'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Check,
  Loader2,
  Calendar,
  Filter,
  X
} from 'lucide-react';

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
  columns?: string[];
}

interface DataExportProps {
  title: string;
  description?: string;
  dataType: 'children' | 'attendance' | 'staff' | 'finance' | 'health' | 'reports';
  availableColumns?: { id: string; label: string }[];
  onExport?: (options: ExportOptions) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

const formatConfig = {
  pdf: { icon: FileText, label: 'PDF', color: 'text-red-600 bg-red-100' },
  excel: { icon: FileSpreadsheet, label: 'Excel', color: 'text-green-600 bg-green-100' },
  csv: { icon: File, label: 'CSV', color: 'text-blue-600 bg-blue-100' },
  json: { icon: File, label: 'JSON', color: 'text-purple-600 bg-purple-100' },
};

const defaultColumns: Record<string, { id: string; label: string }[]> = {
  children: [
    { id: 'firstName', label: 'Prénom' },
    { id: 'lastName', label: 'Nom' },
    { id: 'birthDate', label: 'Date de naissance' },
    { id: 'classroom', label: 'Classe' },
    { id: 'parentName', label: 'Nom du parent' },
    { id: 'parentEmail', label: 'Courriel' },
    { id: 'parentPhone', label: 'Téléphone' },
    { id: 'allergies', label: 'Allergies' },
    { id: 'status', label: 'Statut' },
  ],
  attendance: [
    { id: 'date', label: 'Date' },
    { id: 'childName', label: 'Enfant' },
    { id: 'checkIn', label: 'Arrivée' },
    { id: 'checkOut', label: 'Départ' },
    { id: 'duration', label: 'Durée' },
    { id: 'checkedInBy', label: 'Accompagnateur' },
  ],
  staff: [
    { id: 'firstName', label: 'Prénom' },
    { id: 'lastName', label: 'Nom' },
    { id: 'email', label: 'Courriel' },
    { id: 'phone', label: 'Téléphone' },
    { id: 'role', label: 'Poste' },
    { id: 'hireDate', label: 'Date d\'embauche' },
    { id: 'qualifications', label: 'Qualifications' },
  ],
  finance: [
    { id: 'invoiceNumber', label: 'Numéro de facture' },
    { id: 'childName', label: 'Enfant' },
    { id: 'amount', label: 'Montant' },
    { id: 'dueDate', label: 'Date d\'échéance' },
    { id: 'status', label: 'Statut' },
    { id: 'paidDate', label: 'Date de paiement' },
  ],
  health: [
    { id: 'date', label: 'Date' },
    { id: 'childName', label: 'Enfant' },
    { id: 'type', label: 'Type' },
    { id: 'description', label: 'Description' },
    { id: 'action', label: 'Action prise' },
    { id: 'reportedBy', label: 'Signalé par' },
  ],
  reports: [
    { id: 'date', label: 'Date' },
    { id: 'type', label: 'Type de rapport' },
    { id: 'generatedBy', label: 'Généré par' },
    { id: 'format', label: 'Format' },
  ],
};

export function DataExport({
  title,
  description,
  dataType,
  availableColumns,
  onExport,
  isOpen,
  onClose,
}: DataExportProps) {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('excel');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    (availableColumns || defaultColumns[dataType]).map(c => c.id)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const columns = availableColumns || defaultColumns[dataType];

  const toggleColumn = (columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(columns.map(c => c.id));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (onExport) {
        await onExport({
          format,
          dateRange: dateRange.start && dateRange.end ? dateRange : undefined,
          columns: selectedColumns,
        });
      } else {
        // Simulate export
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Format d'export</label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(formatConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFormat(key as any)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    format === key
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                    <config.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Période (optionnel)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date de début</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date de fin</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4 inline mr-2" />
                Colonnes à exporter
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAllColumns}
                  className="text-xs text-brand-blue hover:underline"
                >
                  Tout sélectionner
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAllColumns}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Tout désélectionner
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {columns.map((column) => (
                <label
                  key={column.id}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedColumns.includes(column.id)
                      ? 'bg-brand-blue/10 border border-brand-blue/20'
                      : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.id)}
                    onChange={() => toggleColumn(column.id)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {selectedColumns.length} colonne{selectedColumns.length > 1 ? 's' : ''} sélectionnée{selectedColumns.length > 1 ? 's' : ''}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || selectedColumns.length === 0}
                className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Export en cours...
                  </>
                ) : exportComplete ? (
                  <>
                    <Check className="w-4 h-4" />
                    Exporté!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Exporter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for easy usage
export function useDataExport() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Partial<DataExportProps>>({});

  const openExport = (options: Partial<DataExportProps>) => {
    setConfig(options);
    setIsOpen(true);
  };

  const closeExport = () => {
    setIsOpen(false);
    setConfig({});
  };

  return {
    isOpen,
    config,
    openExport,
    closeExport,
  };
}

