'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  X,
  Bell,
  Heart,
  Users,
  DollarSign,
  Calendar,
  ShieldAlert,
  CheckCircle,
  Clock,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';

export type AlertType = 'urgent' | 'warning' | 'info' | 'success';
export type AlertCategory = 'health' | 'ratio' | 'payment' | 'attendance' | 'security' | 'system';

export interface Alert {
  id: string;
  type: AlertType;
  category: AlertCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  autoClose?: number; // seconds
  persistent?: boolean;
}

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
  onAction?: (id: string, url: string) => void;
}

// Individual Toast Alert
function ToastAlert({ 
  alert, 
  onDismiss, 
  onAction 
}: { 
  alert: Alert; 
  onDismiss: () => void;
  onAction?: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (alert.autoClose && !alert.persistent) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onDismiss, 300);
      }, alert.autoClose * 1000);
      return () => clearTimeout(timer);
    }
  }, [alert.autoClose, alert.persistent, onDismiss]);

  const getIcon = () => {
    switch (alert.category) {
      case 'health': return <Heart className="w-5 h-5" />;
      case 'ratio': return <Users className="w-5 h-5" />;
      case 'payment': return <DollarSign className="w-5 h-5" />;
      case 'attendance': return <Calendar className="w-5 h-5" />;
      case 'security': return <ShieldAlert className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (alert.type) {
      case 'urgent':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'bg-red-100 text-red-600',
          title: 'text-red-900',
          text: 'text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'bg-amber-100 text-amber-600',
          title: 'text-amber-900',
          text: 'text-amber-700',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'bg-green-100 text-green-600',
          title: 'text-green-900',
          text: 'text-green-700',
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'bg-blue-100 text-blue-600',
          title: 'text-blue-900',
          text: 'text-blue-700',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-xl p-4 shadow-lg transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colors.icon}`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-semibold ${colors.title}`}>{alert.title}</h4>
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-black/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className={`text-sm ${colors.text} mt-1`}>{alert.message}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs opacity-60 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.timestamp.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {alert.actionUrl && (
              <button
                onClick={onAction}
                className={`text-sm font-medium ${colors.title} hover:underline flex items-center gap-1`}
              >
                {alert.actionLabel || 'Voir'} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Full Alert System Component
export function AlertSystem({ alerts, onDismiss, onMarkRead, onAction }: AlertSystemProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const urgentAlerts = alerts.filter(a => a.type === 'urgent' && !a.read);

  // Play sound for urgent alerts
  useEffect(() => {
    if (soundEnabled && urgentAlerts.length > 0) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    }
  }, [urgentAlerts.length, soundEnabled]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-40 w-96 space-y-3">
      {/* Sound Toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute -top-10 right-0 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-gray-600" />
        ) : (
          <VolumeX className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Alert Toasts */}
      {alerts.slice(0, 5).map((alert) => (
        <ToastAlert
          key={alert.id}
          alert={alert}
          onDismiss={() => onDismiss(alert.id)}
          onAction={() => {
            if (alert.actionUrl && onAction) {
              onAction(alert.id, alert.actionUrl);
            }
          }}
        />
      ))}

      {/* Show more indicator */}
      {alerts.length > 5 && (
        <div className="text-center py-2 text-sm text-gray-500">
          +{alerts.length - 5} autres alertes
        </div>
      )}
    </div>
  );
}

// Alert Banner for critical alerts
export function AlertBanner({ 
  alert, 
  onDismiss 
}: { 
  alert: Alert; 
  onDismiss: () => void;
}) {
  return (
    <div className={`w-full py-3 px-4 ${
      alert.type === 'urgent' ? 'bg-red-600' :
      alert.type === 'warning' ? 'bg-amber-500' :
      'bg-blue-600'
    } text-white`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">{alert.title}:</span>
          <span>{alert.message}</span>
        </div>
        <div className="flex items-center gap-4">
          {alert.actionUrl && (
            <a href={alert.actionUrl} className="text-sm font-medium underline">
              {alert.actionLabel || 'En savoir plus'}
            </a>
          )}
          <button onClick={onDismiss} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing alerts
export function useAlerts(initialAlerts: Alert[] = []) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, read: true } : a
    ));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    dismissAlert,
    markAsRead,
    clearAll,
  };
}

// Demo alerts for testing
export const demoAlerts: Alert[] = [
  {
    id: '1',
    type: 'urgent',
    category: 'health',
    title: 'Allergie signalée',
    message: 'Thomas Roy a été exposé à des arachides - intervention requise',
    timestamp: new Date(),
    read: false,
    actionUrl: '/health',
    actionLabel: 'Voir le protocole',
    persistent: true,
  },
  {
    id: '2',
    type: 'warning',
    category: 'ratio',
    title: 'Ratio insuffisant',
    message: 'Classe Bambins: ratio actuel 1:9, requis 1:8',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    actionUrl: '/classrooms',
    autoClose: 30,
  },
  {
    id: '3',
    type: 'info',
    category: 'attendance',
    title: 'Enfant en retard',
    message: 'Emma Dupont n\'est pas encore arrivée (09:30)',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    actionUrl: '/attendance',
    autoClose: 60,
  },
];

