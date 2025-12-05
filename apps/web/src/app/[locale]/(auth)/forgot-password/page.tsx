'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Une erreur est survenue');
      }

      setIsSuccess(true);
    } catch (err: any) {
      // We don't show specific errors for security
      setIsSuccess(true); // Always show success for security
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Email envoyé !
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Si un compte existe avec l'adresse <strong>{email}</strong>, 
            vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-info/10 border border-info/20 text-info-dark text-sm text-left">
          <p className="font-medium mb-1">N'avez-vous pas reçu l'email ?</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            <li>Vérifiez votre dossier spam</li>
            <li>Assurez-vous que l'adresse email est correcte</li>
            <li>Attendez quelques minutes</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Essayer avec une autre adresse
          </button>
          <Link 
            href={`/${params.locale}/login`}
            className="block w-full py-3 px-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors text-center"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link 
        href={`/${params.locale}/login`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la connexion
      </Link>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('forgotPassword')}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('email')}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors ${
                errors.email 
                  ? 'border-danger' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="vous@exemple.com"
              autoFocus
            />
          </div>
          {errors.email && (
            <p className="text-sm text-danger">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark focus:ring-4 focus:ring-brand-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer le lien
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Vous vous souvenez de votre mot de passe ?{' '}
        <Link 
          href={`/${params.locale}/login`}
          className="text-brand-blue hover:underline font-medium"
        >
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}


