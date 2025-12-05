'use client';

import { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  LayoutDashboard,
  Baby,
  Users,
  CalendarCheck,
  MessageCircle,
  FileText,
  Settings,
  Rocket
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  highlight?: string; // CSS selector to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur KIDVERSE! 🎉',
    description: 'Découvrez les fonctionnalités de votre nouvelle plateforme de gestion de garderie. Ce tour rapide vous guidera à travers les principales sections.',
    icon: Sparkles,
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Tableau de bord',
    description: 'Votre vue d\'ensemble quotidienne. Consultez les présences, les alertes, les revenus et l\'activité récente en un coup d\'œil.',
    icon: LayoutDashboard,
    position: 'center',
  },
  {
    id: 'children',
    title: 'Gestion des enfants',
    description: 'Inscrivez de nouveaux enfants, consultez leurs profils complets avec informations de santé, contacts d\'urgence et historique.',
    icon: Baby,
    position: 'center',
  },
  {
    id: 'attendance',
    title: 'Présences',
    description: 'Enregistrez les arrivées et départs facilement. Utilisez le mode kiosque sur tablette pour un check-in rapide à l\'entrée.',
    icon: CalendarCheck,
    position: 'center',
  },
  {
    id: 'staff',
    title: 'Gestion du personnel',
    description: 'Planifiez les horaires, suivez les qualifications et assurez-vous que les ratios réglementaires sont respectés.',
    icon: Users,
    position: 'center',
  },
  {
    id: 'messages',
    title: 'Communication',
    description: 'Échangez des messages avec les parents et votre équipe. Envoyez des photos et des mises à jour quotidiennes.',
    icon: MessageCircle,
    position: 'center',
  },
  {
    id: 'reports',
    title: 'Rapports',
    description: 'Générez des rapports personnalisés: présences, finances, santé. Exportez en PDF, Excel ou CSV.',
    icon: FileText,
    position: 'center',
  },
  {
    id: 'settings',
    title: 'Paramètres',
    description: 'Personnalisez votre profil, vos préférences de notification et l\'apparence de l\'application.',
    icon: Settings,
    position: 'center',
  },
  {
    id: 'complete',
    title: 'Vous êtes prêt! 🚀',
    description: 'Explorez KIDVERSE à votre rythme. Utilisez Ctrl+K pour la recherche rapide. Notre équipe de support est disponible si vous avez des questions.',
    icon: Rocket,
    position: 'center',
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const goToNextStep = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const goToPrevStep = () => {
    if (!isFirstStep) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    // Save to localStorage
    localStorage.setItem('kidverse_onboarding_complete', 'true');
  };

  const handleSkip = () => {
    onClose();
    localStorage.setItem('kidverse_onboarding_complete', 'true');
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-brand-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className={`p-8 transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                isLastStep 
                  ? 'bg-gradient-to-br from-green-400 to-green-600' 
                  : 'bg-gradient-to-br from-brand-blue to-brand-orange'
              }`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              {step.title}
            </h2>
            <p className="text-gray-600 text-center leading-relaxed">
              {step.description}
            </p>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 my-8">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-brand-blue'
                      : index < currentStep
                      ? 'bg-brand-blue/50'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevStep}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  isFirstStep
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <button
                onClick={goToNextStep}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                  isLastStep
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                }`}
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    Commencer
                  </>
                ) : (
                  <>
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Skip link */}
            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Passer le tour
              </button>
            )}
          </div>

          {/* Tips */}
          {!isFirstStep && !isLastStep && (
            <div className="px-8 pb-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  <strong>💡 Astuce:</strong> Utilisez <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">Ctrl+K</kbd> pour rechercher rapidement n'importe quoi dans KIDVERSE.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('kidverse_onboarding_complete');
    setHasCompletedOnboarding(completed === 'true');
    
    // Show onboarding for new users after a short delay
    if (!completed) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, []);

  const startOnboarding = () => setShowOnboarding(true);
  const closeOnboarding = () => setShowOnboarding(false);
  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
  };
  const resetOnboarding = () => {
    localStorage.removeItem('kidverse_onboarding_complete');
    setHasCompletedOnboarding(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    hasCompletedOnboarding,
    startOnboarding,
    closeOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}

