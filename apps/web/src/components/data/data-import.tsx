'use client';

import { useState, useCallback } from 'react';
import {
  Upload,
  FileSpreadsheet,
  File,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Download,
  Eye,
  ChevronRight,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface ImportColumn {
  id: string;
  label: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'email' | 'phone';
}

interface ImportRow {
  data: Record<string, any>;
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

interface DataImportProps {
  title: string;
  description?: string;
  dataType: 'children' | 'staff' | 'parents' | 'attendance';
  columns: ImportColumn[];
  onImport: (data: Record<string, any>[]) => Promise<{ success: number; errors: number }>;
  isOpen: boolean;
  onClose: () => void;
}

const templateData: Record<string, string[][]> = {
  children: [
    ['Prénom', 'Nom', 'Date de naissance', 'Classe', 'Parent 1 - Nom', 'Parent 1 - Email', 'Parent 1 - Téléphone', 'Allergies'],
    ['Emma', 'Dupont', '2022-03-15', 'Poupons', 'Jean Dupont', 'jean@email.com', '514-555-0101', 'Arachides'],
    ['Lucas', 'Martin', '2021-08-20', 'Bambins', 'Marie Martin', 'marie@email.com', '514-555-0102', ''],
  ],
  staff: [
    ['Prénom', 'Nom', 'Email', 'Téléphone', 'Poste', 'Date d\'embauche', 'Qualifications'],
    ['Sophie', 'Bernard', 'sophie@garderie.ca', '514-555-0201', 'Éducatrice', '2023-01-15', 'DEC Petite enfance'],
  ],
  parents: [
    ['Prénom', 'Nom', 'Email', 'Téléphone', 'Adresse', 'Enfant associé'],
    ['Jean', 'Dupont', 'jean@email.com', '514-555-0101', '123 rue Example, Montréal', 'Emma Dupont'],
  ],
  attendance: [
    ['Date', 'Nom de l\'enfant', 'Heure d\'arrivée', 'Heure de départ', 'Accompagnateur'],
    ['2024-12-04', 'Emma Dupont', '08:15', '17:30', 'Jean Dupont'],
  ],
};

export function DataImport({
  title,
  description,
  dataType,
  columns,
  onImport,
  isOpen,
  onClose,
}: DataImportProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rawData, setRawData] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<ImportRow[]>([]);
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Simulate CSV parsing
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
      setRawData(rows);
      
      // Auto-map columns based on header names
      const headers = rows[0];
      const autoMapping: Record<string, string> = {};
      columns.forEach(col => {
        const matchIndex = headers.findIndex(h => 
          h.toLowerCase().includes(col.label.toLowerCase()) ||
          col.label.toLowerCase().includes(h.toLowerCase())
        );
        if (matchIndex !== -1) {
          autoMapping[col.id] = headers[matchIndex];
        }
      });
      setColumnMapping(autoMapping);
      setStep('mapping');
    };
    reader.readAsText(selectedFile);
  };

  const validateData = () => {
    const dataRows = rawData.slice(1); // Skip header
    const headers = rawData[0];
    
    const validated: ImportRow[] = dataRows.map(row => {
      const data: Record<string, any> = {};
      const errors: string[] = [];
      const warnings: string[] = [];

      columns.forEach(col => {
        const mappedHeader = columnMapping[col.id];
        const headerIndex = headers.indexOf(mappedHeader);
        const value = headerIndex !== -1 ? row[headerIndex] : '';

        if (col.required && !value) {
          errors.push(`${col.label} est requis`);
        }

        if (value) {
          if (col.type === 'email' && !value.includes('@')) {
            errors.push(`${col.label} n'est pas un email valide`);
          }
          if (col.type === 'date' && isNaN(Date.parse(value))) {
            errors.push(`${col.label} n'est pas une date valide`);
          }
        }

        data[col.id] = value;
      });

      return {
        data,
        errors,
        warnings,
        isValid: errors.length === 0,
      };
    });

    setPreviewData(validated);
    setStep('preview');
  };

  const executeImport = async () => {
    setStep('importing');
    
    const validData = previewData.filter(row => row.isValid).map(row => row.data);
    
    try {
      const result = await onImport(validData);
      setImportResult(result);
      setStep('complete');
    } catch (error) {
      setImportResult({ success: 0, errors: validData.length });
      setStep('complete');
    }
  };

  const downloadTemplate = () => {
    const data = templateData[dataType];
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${dataType}.csv`;
    a.click();
  };

  const resetImport = () => {
    setStep('upload');
    setFile(null);
    setRawData([]);
    setColumnMapping({});
    setPreviewData([]);
    setImportResult(null);
  };

  if (!isOpen) return null;

  const validCount = previewData.filter(r => r.isValid).length;
  const invalidCount = previewData.filter(r => !r.isValid).length;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 mt-4">
            {['upload', 'mapping', 'preview', 'complete'].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-brand-blue text-white' :
                  ['upload', 'mapping', 'preview', 'complete'].indexOf(step) > idx
                    ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {['upload', 'mapping', 'preview', 'complete'].indexOf(step) > idx ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                {idx < 3 && <ChevronRight className="w-4 h-4 text-gray-300 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-brand-blue' : 'text-gray-400'}`} />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-gray-500 mb-4">ou</p>
                <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-xl font-medium cursor-pointer hover:bg-brand-blue-dark transition-colors">
                  <FileSpreadsheet className="w-4 h-4" />
                  Sélectionner un fichier
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-400 mt-4">Formats acceptés: CSV, Excel (.xlsx)</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Besoin d'un modèle? Téléchargez notre gabarit pré-formaté.
                  </span>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le modèle
                </button>
              </div>
            </div>
          )}

          {/* Mapping Step */}
          {step === 'mapping' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>Fichier chargé:</strong> {file?.name} ({rawData.length - 1} lignes)
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Associer les colonnes</h3>
                <div className="space-y-3">
                  {columns.map((col) => (
                    <div key={col.id} className="flex items-center gap-4">
                      <div className="w-1/3">
                        <span className="text-sm font-medium text-gray-700">
                          {col.label}
                          {col.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                      <select
                        value={columnMapping[col.id] || ''}
                        onChange={(e) => setColumnMapping(prev => ({ ...prev, [col.id]: e.target.value }))}
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        <option value="">-- Sélectionner une colonne --</option>
                        {rawData[0]?.map((header, idx) => (
                          <option key={idx} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{validCount} valides</span>
                </div>
                {invalidCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">{invalidCount} avec erreurs</span>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-3 text-left font-medium text-gray-500">Statut</th>
                      {columns.slice(0, 4).map(col => (
                        <th key={col.id} className="py-2 px-3 text-left font-medium text-gray-500">
                          {col.label}
                        </th>
                      ))}
                      <th className="py-2 px-3 text-left font-medium text-gray-500">Erreurs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className={row.isValid ? '' : 'bg-red-50'}>
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </td>
                        {columns.slice(0, 4).map(col => (
                          <td key={col.id} className="py-2 px-3 text-gray-700">
                            {row.data[col.id] || '-'}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-red-600 text-xs">
                          {row.errors.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {previewData.length > 10 && (
                <p className="text-sm text-gray-500 text-center">
                  ... et {previewData.length - 10} autres lignes
                </p>
              )}
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Import en cours...</p>
              <p className="text-gray-500">Veuillez patienter</p>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && importResult && (
            <div className="text-center py-8">
              {importResult.success > 0 ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Import terminé!</h3>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{importResult.success}</p>
                  <p className="text-sm text-gray-500">Importés avec succès</p>
                </div>
                {importResult.errors > 0 && (
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{importResult.errors}</p>
                    <p className="text-sm text-gray-500">Erreurs</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between">
            {step !== 'upload' && step !== 'complete' && step !== 'importing' && (
              <button
                onClick={() => setStep(step === 'mapping' ? 'upload' : 'mapping')}
                className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Retour
              </button>
            )}
            {step === 'complete' && (
              <button
                onClick={resetImport}
                className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Nouvel import
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {step === 'complete' ? 'Fermer' : 'Annuler'}
              </button>
              {step === 'mapping' && (
                <button
                  onClick={validateData}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
                >
                  Valider
                </button>
              )}
              {step === 'preview' && (
                <button
                  onClick={executeImport}
                  disabled={validCount === 0}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
                >
                  Importer {validCount} ligne{validCount > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
