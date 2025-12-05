'use client';

import { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Keyboard,
  CheckCircle,
  XCircle,
  Clock,
  Baby,
  User,
  ArrowLeft,
  Search,
  LogIn,
  LogOut,
  AlertTriangle,
  Shield,
  Camera
} from 'lucide-react';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  classroom: string;
  status: 'present' | 'absent';
  lastAction?: { type: 'in' | 'out'; time: string; by: string };
}

const mockChildren: Child[] = [
  { id: '1', firstName: 'Emma', lastName: 'Dupont', classroom: 'Poupons', status: 'absent' },
  { id: '2', firstName: 'Lucas', lastName: 'Martin', classroom: 'Bambins', status: 'present', lastAction: { type: 'in', time: '08:15', by: 'Marie Martin' } },
  { id: '3', firstName: 'Léa', lastName: 'Tremblay', classroom: 'Préscolaire', status: 'present', lastAction: { type: 'in', time: '08:22', by: 'Pierre Tremblay' } },
  { id: '4', firstName: 'Thomas', lastName: 'Roy', classroom: 'Bambins', status: 'absent' },
  { id: '5', firstName: 'Sophie', lastName: 'Bernard', classroom: 'Maternelle', status: 'absent' },
  { id: '6', firstName: 'Nathan', lastName: 'Gagnon', classroom: 'Préscolaire', status: 'present', lastAction: { type: 'in', time: '07:45', by: 'Anne Gagnon' } },
  { id: '7', firstName: 'Chloé', lastName: 'Lavoie', classroom: 'Poupons', status: 'absent' },
  { id: '8', firstName: 'Gabriel', lastName: 'Côté', classroom: 'Bambins', status: 'present', lastAction: { type: 'in', time: '08:30', by: 'Jean Côté' } },
];

type Mode = 'home' | 'search' | 'pin' | 'qr' | 'confirm' | 'success' | 'error';

export default function KioskPage() {
  const [mode, setMode] = useState<Mode>('home');
  const [actionType, setActionType] = useState<'in' | 'out'>('in');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [pin, setPin] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [guardianName, setGuardianName] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mode === 'search' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mode]);

  const filteredChildren = mockChildren.filter(child =>
    `${child.firstName} ${child.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    setActionType(child.status === 'present' ? 'out' : 'in');
    setMode('confirm');
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // Verify PIN (mock)
        setTimeout(() => {
          if (newPin === '1234') {
            setGuardianName('Marie Martin');
            handleConfirmAction();
          } else {
            setMode('error');
            setTimeout(() => {
              setPin('');
              setMode('pin');
            }, 2000);
          }
        }, 500);
      }
    }
  };

  const handleConfirmAction = () => {
    setMode('success');
    setTimeout(() => {
      resetKiosk();
    }, 3000);
  };

  const resetKiosk = () => {
    setMode('home');
    setSearchQuery('');
    setSelectedChild(null);
    setPin('');
    setGuardianName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-600 to-brand-orange flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <span className="text-brand-blue font-bold text-xl">K</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">KIDVERSE</h1>
            <p className="text-white/70 text-sm">Les Petits Explorateurs</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums">
            {currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-white/70">
            {currentTime.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Home Screen */}
          {mode === 'home' && (
            <div className="space-y-8 text-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Bienvenue!</h2>
                <p className="text-xl text-white/80">Enregistrez l'arrivée ou le départ de votre enfant</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => { setActionType('in'); setMode('search'); }}
                  className="p-8 bg-white rounded-3xl shadow-2xl hover:scale-105 transition-transform"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Arrivée</h3>
                  <p className="text-gray-500 mt-1">Check-in</p>
                </button>

                <button
                  onClick={() => { setActionType('out'); setMode('search'); }}
                  className="p-8 bg-white rounded-3xl shadow-2xl hover:scale-105 transition-transform"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LogOut className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Départ</h3>
                  <p className="text-gray-500 mt-1">Check-out</p>
                </button>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMode('qr')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  Scanner QR Code
                </button>
                <button
                  onClick={() => setMode('pin')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                >
                  <Keyboard className="w-5 h-5" />
                  Entrer NIP
                </button>
              </div>
            </div>
          )}

          {/* Search Screen */}
          {mode === 'search' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <button
                onClick={resetKiosk}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {actionType === 'in' ? 'Enregistrer une arrivée' : 'Enregistrer un départ'}
              </h2>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher un enfant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 text-xl bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-blue/20"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredChildren.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-xl">
                      {child.firstName[0]}{child.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {child.firstName} {child.lastName}
                      </h3>
                      <p className="text-gray-500">{child.classroom}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      child.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {child.status === 'present' ? 'Présent' : 'Absent'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PIN Entry Screen */}
          {mode === 'pin' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <button
                onClick={resetKiosk}
                className="absolute top-4 left-4 flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-brand-blue" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Entrez votre NIP</h2>
              <p className="text-gray-500 mb-8">Code à 4 chiffres</p>

              {/* PIN Display */}
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-bold ${
                      pin.length > index
                        ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                        : 'border-gray-200 text-gray-300'
                    }`}
                  >
                    {pin.length > index ? '•' : ''}
                  </div>
                ))}
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === '⌫') {
                        setPin(pin.slice(0, -1));
                      } else if (key) {
                        handlePinInput(key);
                      }
                    }}
                    disabled={!key}
                    className={`h-16 rounded-2xl text-2xl font-semibold transition-all ${
                      key
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95'
                        : 'invisible'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QR Scanner Screen */}
          {mode === 'qr' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <button
                onClick={resetKiosk}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>

              <div className="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-brand-blue" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Scanner le QR Code</h2>
              <p className="text-gray-500 mb-8">Placez le code QR devant la caméra</p>

              {/* Camera placeholder */}
              <div className="aspect-square max-w-sm mx-auto bg-gray-900 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-8 border-2 border-white/50 rounded-2xl"></div>
                <QrCode className="w-24 h-24 text-white/30" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue animate-scan"></div>
              </div>
            </div>
          )}

          {/* Confirmation Screen */}
          {mode === 'confirm' && selectedChild && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <button
                onClick={() => setMode('search')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>

              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">
                {selectedChild.firstName[0]}{selectedChild.lastName[0]}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {selectedChild.firstName} {selectedChild.lastName}
              </h2>
              <p className="text-gray-500 mb-8">{selectedChild.classroom}</p>

              <div className={`p-6 rounded-2xl mb-8 ${
                actionType === 'in' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  actionType === 'in' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {actionType === 'in' 
                    ? <LogIn className="w-8 h-8 text-green-600" />
                    : <LogOut className="w-8 h-8 text-blue-600" />
                  }
                </div>
                <p className={`text-xl font-semibold ${
                  actionType === 'in' ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {actionType === 'in' ? 'Enregistrer l\'arrivée' : 'Enregistrer le départ'}
                </p>
                <p className="text-gray-500 mt-2">
                  {currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <button
                onClick={() => setMode('pin')}
                className="w-full py-4 bg-brand-blue text-white text-xl font-semibold rounded-2xl hover:bg-brand-blue-dark transition-colors"
              >
                Confirmer avec NIP
              </button>
            </div>
          )}

          {/* Success Screen */}
          {mode === 'success' && selectedChild && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {actionType === 'in' ? 'Arrivée enregistrée!' : 'Départ enregistré!'}
              </h2>
              <p className="text-xl text-gray-500 mb-4">
                {selectedChild.firstName} {selectedChild.lastName}
              </p>
              <p className="text-gray-400">
                {currentTime.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })} • {guardianName}
              </p>

              <div className="mt-8 text-sm text-gray-400">
                Retour automatique dans 3 secondes...
              </div>
            </div>
          )}

          {/* Error Screen */}
          {mode === 'error' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">NIP incorrect</h2>
              <p className="text-xl text-gray-500">Veuillez réessayer</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/50 text-sm">
        <p>KIDVERSE © 2024 • Mode Kiosque • Appuyez sur F11 pour plein écran</p>
      </footer>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(100% - 4px)); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

