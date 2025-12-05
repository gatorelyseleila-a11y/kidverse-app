// Page Generator - Run with Node.js to generate all pages
const fs = require('fs');
const path = require('path');

const pages = [
  // Auth
  { file: 'forgot-password.html', title: 'Mot de passe oublié', icon: 'fa-key', category: 'Authentification', nav: null },
  
  // Dashboard
  { file: 'analytics.html', title: 'Analytics', icon: 'fa-chart-line', category: 'Dashboard', nav: 'analytics' },
  
  // Children
  { file: 'children-new.html', title: 'Nouvel enfant', icon: 'fa-plus', category: 'Gestion des enfants', nav: 'children' },
  { file: 'children-profile.html', title: 'Profil enfant', icon: 'fa-user', category: 'Gestion des enfants', nav: 'children' },
  { file: 'children-progress.html', title: 'Suivi développement', icon: 'fa-chart-bar', category: 'Gestion des enfants', nav: 'children' },
  { file: 'waitlist.html', title: 'Liste d\'attente', icon: 'fa-list', category: 'Gestion des enfants', nav: 'waitlist' },
  { file: 'classrooms.html', title: 'Gestion des classes', icon: 'fa-school', category: 'Gestion des enfants', nav: 'classrooms' },
  
  // Attendance
  { file: 'absences.html', title: 'Absences', icon: 'fa-calendar-times', category: 'Présences', nav: 'attendance' },
  { file: 'visitors.html', title: 'Visiteurs', icon: 'fa-user-check', category: 'Présences', nav: 'visitors' },
  { file: 'daily-report.html', title: 'Rapport journalier', icon: 'fa-file-alt', category: 'Présences', nav: 'daily-report' },
  { file: 'incidents.html', title: 'Incidents', icon: 'fa-exclamation-triangle', category: 'Présences', nav: 'incidents' },
  
  // Services
  { file: 'meals.html', title: 'Repas', icon: 'fa-utensils', category: 'Services', nav: 'meals' },
  { file: 'inventory.html', title: 'Inventaire', icon: 'fa-box', category: 'Services', nav: 'inventory' },
  
  // Staff
  { file: 'staff-schedule.html', title: 'Planning', icon: 'fa-calendar-alt', category: 'Personnel', nav: 'staff-schedule' },
  { file: 'staff-evaluations.html', title: 'Évaluations', icon: 'fa-star', category: 'Personnel', nav: 'staff-evaluations' },
  
  // Health
  { file: 'health.html', title: 'Santé', icon: 'fa-heart', category: 'Santé', nav: 'health' },
  { file: 'emergency.html', title: 'Urgences', icon: 'fa-ambulance', category: 'Santé', nav: null },
  { file: 'pedagogy.html', title: 'Pédagogie', icon: 'fa-graduation-cap', category: 'Santé', nav: 'pedagogy' },
  
  // Communication
  { file: 'messages.html', title: 'Messages', icon: 'fa-comments', category: 'Communication', nav: 'messages' },
  { file: 'calendar.html', title: 'Calendrier', icon: 'fa-calendar', category: 'Communication', nav: 'calendar' },
  { file: 'documents.html', title: 'Documents', icon: 'fa-folder', category: 'Communication', nav: 'documents' },
  
  // Finance
  { file: 'finance.html', title: 'Finances', icon: 'fa-dollar-sign', category: 'Finances', nav: 'finance' },
  { file: 'invoices.html', title: 'Factures', icon: 'fa-file-invoice', category: 'Finances', nav: 'invoices' },
  { file: 'payment.html', title: 'Paiement', icon: 'fa-credit-card', category: 'Finances', nav: null },
  
  // Admin
  { file: 'reports.html', title: 'Rapports', icon: 'fa-chart-bar', category: 'Administration', nav: 'reports' },
  { file: 'audit.html', title: 'Journal d\'audit', icon: 'fa-history', category: 'Administration', nav: 'audit' },
  { file: 'centers.html', title: 'Centres', icon: 'fa-building', category: 'Administration', nav: 'centers' },
  { file: 'center-settings.html', title: 'Paramètres centre', icon: 'fa-cogs', category: 'Administration', nav: 'centers' },
  
  // Settings
  { file: 'settings.html', title: 'Paramètres', icon: 'fa-cog', category: 'Paramètres', nav: 'settings' },
  { file: 'templates.html', title: 'Modèles', icon: 'fa-envelope', category: 'Paramètres', nav: null },
  { file: 'subscription.html', title: 'Abonnement', icon: 'fa-crown', category: 'Paramètres', nav: null },
  { file: 'profile.html', title: 'Profil', icon: 'fa-user-circle', category: 'Paramètres', nav: null },
  
  // Parent
  { file: 'parent.html', title: 'Portail parent', icon: 'fa-user-friends', category: 'Portail Parent', nav: null },
  { file: 'parent-mobile.html', title: 'Mobile parent', icon: 'fa-mobile-alt', category: 'Portail Parent', nav: null },
  
  // Special
  { file: 'kiosk.html', title: 'Kiosque', icon: 'fa-tablet-alt', category: 'Modes spéciaux', nav: null },
  { file: 'offline.html', title: 'Hors-ligne', icon: 'fa-wifi', category: 'Modes spéciaux', nav: null },
];

const template = (page) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title} | KIDVERSE</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = { theme: { extend: { colors: { 'brand-blue': '#2563EB', 'brand-blue-dark': '#1D4ED8' }}}}</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body class="bg-gray-50">
  ${page.nav ? '<script src="../js/navigation.js"></script>' : ''}
  
  <main class="${page.nav ? 'p-6' : 'min-h-screen flex items-center justify-center p-6'}">
    ${page.nav ? `
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <a href="../index.html" class="hover:text-brand-blue">Accueil</a> / 
        <span class="text-gray-900">${page.title}</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900">${page.title}</h1>
      <p class="text-gray-500">Catégorie: ${page.category}</p>
    </div>
    
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div class="text-center">
        <div class="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas ${page.icon} text-brand-blue text-3xl"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">${page.title}</h2>
        <p class="text-gray-500 mb-6">Cette page est en cours de développement.</p>
        <a href="dashboard.html" class="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-brand-blue-dark transition-colors">
          <i class="fas fa-arrow-left"></i>
          Retour au tableau de bord
        </a>
      </div>
    </div>
    ` : `
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <a href="../index.html" class="inline-flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">K</div>
          <span class="text-2xl font-bold text-gray-900">KIDVERSE</span>
        </a>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div class="w-20 h-20 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas ${page.icon} text-brand-blue text-3xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">${page.title}</h1>
        <p class="text-gray-500 mb-6">Catégorie: ${page.category}</p>
        <a href="dashboard.html" class="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-brand-blue-dark transition-colors">
          <i class="fas fa-arrow-left"></i>
          Aller au tableau de bord
        </a>
      </div>
    </div>
    `}
  </main>

  ${page.nav ? `<script>initNavigation('${page.nav}', '${page.title}', '${page.category}');</script>` : ''}
</body>
</html>`;

// Generate pages
const frDir = path.join(__dirname, '..', 'fr');
if (!fs.existsSync(frDir)) {
  fs.mkdirSync(frDir, { recursive: true });
}

pages.forEach(page => {
  const filePath = path.join(frDir, page.file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, template(page));
    console.log(`Created: ${page.file}`);
  } else {
    console.log(`Skipped (exists): ${page.file}`);
  }
});

console.log('\\nDone! All pages generated.');

