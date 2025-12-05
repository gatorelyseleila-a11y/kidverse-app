'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Pill,
  Shield,
  FileText,
  Check,
  Camera,
  Plus,
  Trash2,
  Save
} from 'lucide-react';

interface FormData {
  // Child Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  photoUrl?: string;
  // Enrollment
  startDate: string;
  classroomId: string;
  schedule: string[];
  // Parent 1
  parent1FirstName: string;
  parent1LastName: string;
  parent1Email: string;
  parent1Phone: string;
  parent1Relationship: string;
  parent1Address: string;
  parent1City: string;
  parent1PostalCode: string;
  // Parent 2
  hasSecondParent: boolean;
  parent2FirstName: string;
  parent2LastName: string;
  parent2Email: string;
  parent2Phone: string;
  parent2Relationship: string;
  // Emergency Contacts
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  // Health
  allergies: Array<{
    allergen: string;
    severity: string;
    reactions: string;
    treatment: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
  }>;
  medicalConditions: string;
  doctorName: string;
  doctorPhone: string;
  insuranceNumber: string;
  // Authorized Pickups
  authorizedPickups: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  // Consents
  photoConsent: boolean;
  excursionConsent: boolean;
  emergencyMedicalConsent: boolean;
  dataProcessingConsent: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  startDate: '',
  classroomId: '',
  schedule: [],
  parent1FirstName: '',
  parent1LastName: '',
  parent1Email: '',
  parent1Phone: '',
  parent1Relationship: 'Mère',
  parent1Address: '',
  parent1City: '',
  parent1PostalCode: '',
  hasSecondParent: false,
  parent2FirstName: '',
  parent2LastName: '',
  parent2Email: '',
  parent2Phone: '',
  parent2Relationship: 'Père',
  emergencyContacts: [{ name: '', relationship: '', phone: '' }],
  allergies: [],
  medications: [],
  medicalConditions: '',
  doctorName: '',
  doctorPhone: '',
  insuranceNumber: '',
  authorizedPickups: [],
  photoConsent: false,
  excursionConsent: false,
  emergencyMedicalConsent: false,
  dataProcessingConsent: false,
};

const steps = [
  { id: 1, title: 'Enfant', icon: Baby },
  { id: 2, title: 'Parents', icon: User },
  { id: 3, title: 'Contacts', icon: Phone },
  { id: 4, title: 'Santé', icon: AlertTriangle },
  { id: 5, title: 'Autorisations', icon: Shield },
  { id: 6, title: 'Confirmation', icon: Check },
];

const classrooms = [
  { id: '1', name: 'Poupons', ageRange: '0-18 mois' },
  { id: '2', name: 'Bambins', ageRange: '18-36 mois' },
  { id: '3', name: 'Préscolaire', ageRange: '3-4 ans' },
  { id: '4', name: 'Maternelle', ageRange: '4-5 ans' },
];

const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

export default function NewChildPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', relationship: '', phone: '' }],
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const addAllergy = () => {
    setFormData(prev => ({
      ...prev,
      allergies: [...prev.allergies, { allergen: '', severity: 'MODERATE', reactions: '', treatment: '' }],
    }));
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const addAuthorizedPickup = () => {
    setFormData(prev => ({
      ...prev,
      authorizedPickups: [...prev.authorizedPickups, { name: '', relationship: '', phone: '' }],
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    router.push('/children');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender;
      case 2:
        return formData.parent1FirstName && formData.parent1LastName && formData.parent1Email && formData.parent1Phone;
      case 3:
        return formData.emergencyContacts.length > 0 && formData.emergencyContacts[0].name;
      case 5:
        return formData.emergencyMedicalConsent && formData.dataProcessingConsent;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle inscription</h1>
          <p className="text-gray-500">Inscrivez un nouvel enfant à la garderie</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  currentStep >= step.id ? 'text-brand-blue' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 rounded ${
                  currentStep > step.id ? 'bg-brand-blue' : 'bg-gray-100'
                }`} style={{ minWidth: '40px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Step 1: Child Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Informations de l'enfant</h2>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                Ajouter une photo
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="MALE">Garçon</option>
                  <option value="FEMALE">Fille</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
                <select
                  value={formData.classroomId}
                  onChange={(e) => updateFormData('classroomId', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">Sélectionner</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.ageRange})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jours de garde</label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const newSchedule = formData.schedule.includes(day)
                        ? formData.schedule.filter(d => d !== day)
                        : [...formData.schedule, day];
                      updateFormData('schedule', newSchedule);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      formData.schedule.includes(day)
                        ? 'bg-brand-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Parents */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Informations des parents</h2>
            
            {/* Parent 1 */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <h3 className="font-medium text-gray-900">Parent/Tuteur principal</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={formData.parent1FirstName}
                    onChange={(e) => updateFormData('parent1FirstName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.parent1LastName}
                    onChange={(e) => updateFormData('parent1LastName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.parent1Email}
                    onChange={(e) => updateFormData('parent1Email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={formData.parent1Phone}
                    onChange={(e) => updateFormData('parent1Phone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lien avec l'enfant</label>
                  <select
                    value={formData.parent1Relationship}
                    onChange={(e) => updateFormData('parent1Relationship', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="Mère">Mère</option>
                    <option value="Père">Père</option>
                    <option value="Tuteur">Tuteur légal</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={formData.parent1Address}
                    onChange={(e) => updateFormData('parent1Address', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
              </div>
            </div>

            {/* Add Second Parent */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.hasSecondParent}
                onChange={(e) => updateFormData('hasSecondParent', e.target.checked)}
                className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
              />
              <label className="text-sm text-gray-700">Ajouter un deuxième parent/tuteur</label>
            </div>

            {/* Parent 2 */}
            {formData.hasSecondParent && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                <h3 className="font-medium text-gray-900">Deuxième parent/tuteur</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={formData.parent2FirstName}
                      onChange={(e) => updateFormData('parent2FirstName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.parent2LastName}
                      onChange={(e) => updateFormData('parent2LastName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.parent2Email}
                      onChange={(e) => updateFormData('parent2Email', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.parent2Phone}
                      onChange={(e) => updateFormData('parent2Phone', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Emergency Contacts */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Contacts d'urgence</h2>
            <p className="text-gray-500 text-sm">Ajoutez au moins un contact d'urgence en plus des parents.</p>
            
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Contact #{index + 1}</h3>
                  {index > 0 && (
                    <button
                      onClick={() => removeEmergencyContact(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => {
                        const newContacts = [...formData.emergencyContacts];
                        newContacts[index].name = e.target.value;
                        updateFormData('emergencyContacts', newContacts);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lien avec l'enfant</label>
                    <input
                      type="text"
                      value={contact.relationship}
                      onChange={(e) => {
                        const newContacts = [...formData.emergencyContacts];
                        newContacts[index].relationship = e.target.value;
                        updateFormData('emergencyContacts', newContacts);
                      }}
                      placeholder="Ex: Grand-mère"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => {
                        const newContacts = [...formData.emergencyContacts];
                        newContacts[index].phone = e.target.value;
                        updateFormData('emergencyContacts', newContacts);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEmergencyContact}
              className="flex items-center gap-2 text-brand-blue hover:underline text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Ajouter un contact d'urgence
            </button>
          </div>
        )}

        {/* Step 4: Health Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Informations de santé</h2>

            {/* Allergies */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Allergies</h3>
                <button
                  onClick={addAllergy}
                  className="flex items-center gap-1 text-brand-blue hover:underline text-sm"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
              {formData.allergies.length > 0 ? (
                <div className="space-y-3">
                  {formData.allergies.map((allergy, index) => (
                    <div key={index} className="p-4 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-start justify-between mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <button
                          onClick={() => removeAllergy(index)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Allergène"
                          value={allergy.allergen}
                          onChange={(e) => {
                            const newAllergies = [...formData.allergies];
                            newAllergies[index].allergen = e.target.value;
                            updateFormData('allergies', newAllergies);
                          }}
                          className="px-3 py-2 bg-white border border-red-200 rounded-lg text-sm"
                        />
                        <select
                          value={allergy.severity}
                          onChange={(e) => {
                            const newAllergies = [...formData.allergies];
                            newAllergies[index].severity = e.target.value;
                            updateFormData('allergies', newAllergies);
                          }}
                          className="px-3 py-2 bg-white border border-red-200 rounded-lg text-sm"
                        >
                          <option value="MILD">Légère</option>
                          <option value="MODERATE">Modérée</option>
                          <option value="SEVERE">Sévère</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Réactions"
                          value={allergy.reactions}
                          onChange={(e) => {
                            const newAllergies = [...formData.allergies];
                            newAllergies[index].reactions = e.target.value;
                            updateFormData('allergies', newAllergies);
                          }}
                          className="px-3 py-2 bg-white border border-red-200 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Traitement"
                          value={allergy.treatment}
                          onChange={(e) => {
                            const newAllergies = [...formData.allergies];
                            newAllergies[index].treatment = e.target.value;
                            updateFormData('allergies', newAllergies);
                          }}
                          className="px-3 py-2 bg-white border border-red-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-xl">Aucune allergie déclarée</p>
              )}
            </div>

            {/* Medical Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du médecin</label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => updateFormData('doctorName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone du médecin</label>
                <input
                  type="tel"
                  value={formData.doctorPhone}
                  onChange={(e) => updateFormData('doctorPhone', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro d'assurance maladie</label>
                <input
                  type="text"
                  value={formData.insuranceNumber}
                  onChange={(e) => updateFormData('insuranceNumber', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Conditions médicales particulières</label>
                <textarea
                  value={formData.medicalConditions}
                  onChange={(e) => updateFormData('medicalConditions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Asthme, eczéma, etc."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Authorizations */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Autorisations et consentements</h2>

            <div className="space-y-4">
              {[
                { key: 'emergencyMedicalConsent', label: 'Autorisation de soins médicaux d\'urgence', required: true, desc: 'En cas d\'urgence médicale, j\'autorise le personnel à administrer les premiers soins et à contacter les services d\'urgence.' },
                { key: 'photoConsent', label: 'Autorisation de prise de photos/vidéos', required: false, desc: 'J\'autorise la prise de photos et vidéos de mon enfant dans le cadre des activités de la garderie.' },
                { key: 'excursionConsent', label: 'Autorisation de sorties', required: false, desc: 'J\'autorise mon enfant à participer aux sorties éducatives organisées par la garderie.' },
                { key: 'dataProcessingConsent', label: 'Traitement des données personnelles', required: true, desc: 'J\'accepte que les données personnelles de mon enfant soient traitées conformément à la politique de confidentialité.' },
              ].map((consent) => (
                <div key={consent.key} className="p-4 bg-gray-50 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[consent.key as keyof FormData] as boolean}
                      onChange={(e) => updateFormData(consent.key as keyof FormData, e.target.checked)}
                      className="mt-1 w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                    />
                    <div>
                      <span className="font-medium text-gray-900">
                        {consent.label}
                        {consent.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{consent.desc}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Confirmation */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Prêt à soumettre!</h2>
              <p className="text-gray-500">Vérifiez les informations et soumettez l'inscription.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-medium text-gray-900">Résumé</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Enfant:</span>
                  <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date de naissance:</span>
                  <span className="ml-2 font-medium">{formData.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-gray-500">Parent principal:</span>
                  <span className="ml-2 font-medium">{formData.parent1FirstName} {formData.parent1LastName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Allergies:</span>
                  <span className="ml-2 font-medium">{formData.allergies.length > 0 ? formData.allergies.map(a => a.allergen).join(', ') : 'Aucune'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>

          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Soumettre l'inscription
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

