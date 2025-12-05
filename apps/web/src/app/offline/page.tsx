import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
          <WifiOff className="w-12 h-12 text-gray-400" />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-orange rounded-xl flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          <span className="text-xl font-bold text-gray-900">
            KID<span className="text-brand-orange">VERSE</span>
          </span>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Vous êtes hors ligne
        </h1>
        <p className="text-gray-600 mb-8">
          Il semble que vous n'ayez pas de connexion internet. 
          Vérifiez votre connexion et réessayez.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue-dark transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </button>
          
          <Link
            href="/fr/dashboard"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil (cache)
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Mode hors-ligne</h3>
          <p className="text-sm text-gray-600">
            Certaines fonctionnalités sont disponibles hors ligne. 
            Les actions effectuées seront synchronisées automatiquement 
            lorsque vous serez reconnecté.
          </p>
        </div>

        {/* Offline capabilities */}
        <div className="mt-6 text-left">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Disponible hors-ligne :</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Consulter les profils des enfants (en cache)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Voir les messages récents
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Consulter les informations d'allergies
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Enregistrer des présences (sync ultérieur)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

