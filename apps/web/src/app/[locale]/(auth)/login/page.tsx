'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const testAccounts = [
    { role: 'Admin', email: 'admin@kidverse.com' },
    { role: 'Directeur', email: 'directeur@petitsexplorateurs.com' },
    { role: 'Éducateur', email: 'sophie@petitsexplorateurs.com' },
    { role: 'Parent', email: 'jean.dupont@email.com' },
  ];

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue 👋
          </h1>
          <p className="text-white/70">
            Connectez-vous pour accéder à votre espace
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
          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                placeholder="nom@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                autoComplete="current-password"
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

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-brand-orange focus:ring-brand-orange focus:ring-offset-0"
              />
              <span className="text-white/70 text-sm">Se souvenir de moi</span>
            </label>
            <Link href="/forgot-password" className="text-brand-orange text-sm hover:underline">
              Mot de passe oublié?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-orange to-orange-500 text-white font-semibold py-3.5 rounded-xl hover:from-orange-500 hover:to-brand-orange transition-all duration-300 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-white/50">
              Pas encore inscrit?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          href="/register"
          className="block w-full text-center py-3.5 border-2 border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"
        >
          Créer un compte
        </Link>
      </div>

      {/* Test Accounts */}
      <div className="mt-6 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
        <p className="text-white/50 text-xs text-center mb-3">
          🧪 Comptes de test (mot de passe: <span className="text-brand-orange font-mono">Password123!</span>)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {testAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setEmail(account.email);
                setPassword('Password123!');
              }}
              className="text-xs px-3 py-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              {account.role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
