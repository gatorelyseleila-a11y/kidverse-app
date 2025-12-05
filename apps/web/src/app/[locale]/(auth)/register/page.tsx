'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  Building2,
  Loader2, 
  AlertCircle,
  Check,
  X
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    centerName: '',
    centerAddress: '',
    role: 'DIRECTOR',
    acceptTerms: false,
  });

  const passwordRequirements = [
    { label: 'Au moins 8 caractères', met: formData.password.length >= 8 },
    { label: 'Une lettre majuscule', met: /[A-Z]/.test(formData.password) },
    { label: 'Une lettre minuscule', met: /[a-z]/.test(formData.password) },
    { label: 'Un chiffre', met: /[0-9]/.test(formData.password) },
    { label: 'Un caractère spécial', met: /[!@#$%^&*]/.test(formData.password) },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Redirect to login with success message
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step >= 1 ? 'bg-brand-orange text-white' : 'bg-white/20 text-white/50'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 rounded-full transition-all ${
            step >= 2 ? 'bg-brand-orange' : 'bg-white/20'
          }`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step >= 2 ? 'bg-brand-orange text-white' : 'bg-white/20 text-white/50'
          }`}>
            2
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 ? 'Créer votre compte' : 'Sécurisez votre compte'}
          </h1>
          <p className="text-white/70">
            {step === 1 
              ? 'Rejoignez KIDVERSE et transformez votre garderie' 
              : 'Choisissez un mot de passe sécurisé'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 ? (
            <>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                      placeholder="Jean"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="nom@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="+1 (514) 123-4567"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Vous êtes...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'DIRECTOR', label: 'Directeur/rice', icon: Building2 },
                    { value: 'PARENT', label: 'Parent', icon: User },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.role === option.value
                          ? 'border-brand-orange bg-brand-orange/20 text-white'
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      }`}
                    >
                      <option.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Password */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-2">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-xs ${
                      req.met ? 'text-green-400' : 'text-white/40'
                    }`}
                  >
                    {req.met ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {req.label}
                  </div>
                ))}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full bg-white/10 border rounded-xl px-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500'
                        : 'border-white/20'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-brand-orange focus:ring-brand-orange focus:ring-offset-0"
                />
                <span className="text-white/70 text-sm">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-brand-orange hover:underline">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/privacy" className="text-brand-orange hover:underline">
                    politique de confidentialité
                  </Link>
                </span>
              </label>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 border-2 border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
              >
                Retour
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-brand-orange to-orange-500 text-white font-semibold py-3.5 rounded-xl hover:from-orange-500 hover:to-brand-orange transition-all duration-300 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création...
                </>
              ) : step === 1 ? (
                'Continuer'
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-white/60 text-sm">
          Déjà inscrit?{' '}
          <Link href="/login" className="text-brand-orange hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
