'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalSearch, useGlobalSearch } from '@/components/search/global-search';
import { NotificationBell } from '@/components/notifications/notification-center';
import {
  LayoutDashboard,
  Baby,
  Users,
  CalendarCheck,
  Heart,
  GraduationCap,
  Calculator,
  Building2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
  User,
  FileText,
  Calendar,
  MessageCircle,
  FolderOpen,
  School,
  BarChart3,
  Utensils,
  ClipboardList,
  AlertTriangle,
  UserCheck,
  History,
  Package
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Enfants', href: '/children', icon: Baby },
  { name: 'Liste d\'attente', href: '/waitlist', icon: ClipboardList },
  { name: 'Classes', href: '/classrooms', icon: School },
  { name: 'Présences', href: '/attendance', icon: CalendarCheck },
  { name: 'Visiteurs', href: '/visitors', icon: UserCheck },
  { name: 'Rapport journalier', href: '/daily-report', icon: FileText },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'Repas', href: '/meals', icon: Utensils },
  { name: 'Inventaire', href: '/inventory', icon: Package },
  { name: 'Personnel', href: '/staff', icon: Users },
  { name: 'Santé', href: '/health', icon: Heart },
  { name: 'Pédagogie', href: '/pedagogy', icon: GraduationCap },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Calendrier', href: '/calendar', icon: Calendar },
  { name: 'Documents', href: '/documents', icon: FolderOpen },
  { name: 'Finances', href: '/finance', icon: Calculator },
  { name: 'Rapports', href: '/reports', icon: FileText },
  { name: 'Journal d\'audit', href: '/audit', icon: History },
  { name: 'Centres', href: '/centers', icon: Building2 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isOpen: searchOpen, openSearch, closeSearch } = useGlobalSearch();

  const user = session?.user;

  const isActive = (href: string) => {
    const currentPath = pathname.replace(/^\/(fr|en)/, '');
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-orange rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              K
            </div>
            <span className="text-xl font-bold text-gray-900">
              KID<span className="text-brand-orange">VERSE</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  active
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'ADMIN' ? 'Administrateur' :
                 user?.role === 'DIRECTOR' ? 'Directeur' :
                 user?.role === 'EDUCATOR' ? 'Éducateur' : 'Parent'}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between h-20 px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={openSearch}
                className="w-full flex items-center gap-3 pl-4 pr-3 py-2.5 bg-gray-100 rounded-xl text-left hover:bg-gray-200 transition-colors group"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-gray-400">Rechercher...</span>
                <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-gray-400 border border-gray-200">
                  <span className="text-sm">⌘</span>K
                </kbd>
              </button>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <NotificationBell />

              {/* Settings */}
              <Link
                href="/settings"
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Mon profil
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => signOut({ callbackUrl: '/login' })}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={closeSearch} />
    </div>
  );
}
