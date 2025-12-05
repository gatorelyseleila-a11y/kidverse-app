// KIDVERSE - Navigation Component
const navigationHTML = `
<aside id="sidebar" class="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
  <div class="p-4 border-b border-gray-100">
    <a href="../index.html" class="flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">K</div>
      <span class="text-xl font-bold text-gray-900">KIDVERSE</span>
    </a>
  </div>
  <nav class="p-4 overflow-y-auto h-[calc(100vh-80px)]">
    <ul class="space-y-1">
      <li class="nav-section">Dashboard</li>
      <li><a href="dashboard.html" class="nav-link" data-page="dashboard"><i class="fas fa-home w-5"></i>Tableau de bord</a></li>
      <li><a href="analytics.html" class="nav-link" data-page="analytics"><i class="fas fa-chart-line w-5"></i>Analytics</a></li>
      
      <li class="nav-section">Enfants</li>
      <li><a href="children.html" class="nav-link" data-page="children"><i class="fas fa-baby w-5"></i>Enfants</a></li>
      <li><a href="waitlist.html" class="nav-link" data-page="waitlist"><i class="fas fa-list w-5"></i>Liste d'attente</a></li>
      <li><a href="classrooms.html" class="nav-link" data-page="classrooms"><i class="fas fa-school w-5"></i>Classes</a></li>
      
      <li class="nav-section">Présences</li>
      <li><a href="attendance.html" class="nav-link" data-page="attendance"><i class="fas fa-calendar-check w-5"></i>Présences</a></li>
      <li><a href="visitors.html" class="nav-link" data-page="visitors"><i class="fas fa-user-check w-5"></i>Visiteurs</a></li>
      <li><a href="daily-report.html" class="nav-link" data-page="daily-report"><i class="fas fa-file-alt w-5"></i>Rapport journalier</a></li>
      <li><a href="incidents.html" class="nav-link" data-page="incidents"><i class="fas fa-exclamation-triangle w-5"></i>Incidents</a></li>
      
      <li class="nav-section">Services</li>
      <li><a href="meals.html" class="nav-link" data-page="meals"><i class="fas fa-utensils w-5"></i>Repas</a></li>
      <li><a href="inventory.html" class="nav-link" data-page="inventory"><i class="fas fa-box w-5"></i>Inventaire</a></li>
      
      <li class="nav-section">Personnel</li>
      <li><a href="staff.html" class="nav-link" data-page="staff"><i class="fas fa-users w-5"></i>Personnel</a></li>
      <li><a href="staff-schedule.html" class="nav-link" data-page="staff-schedule"><i class="fas fa-calendar-alt w-5"></i>Planning</a></li>
      <li><a href="staff-evaluations.html" class="nav-link" data-page="staff-evaluations"><i class="fas fa-star w-5"></i>Évaluations</a></li>
      
      <li class="nav-section">Santé</li>
      <li><a href="health.html" class="nav-link" data-page="health"><i class="fas fa-heart w-5"></i>Santé</a></li>
      <li><a href="pedagogy.html" class="nav-link" data-page="pedagogy"><i class="fas fa-graduation-cap w-5"></i>Pédagogie</a></li>
      
      <li class="nav-section">Communication</li>
      <li><a href="messages.html" class="nav-link" data-page="messages"><i class="fas fa-comments w-5"></i>Messages</a></li>
      <li><a href="calendar.html" class="nav-link" data-page="calendar"><i class="fas fa-calendar w-5"></i>Calendrier</a></li>
      <li><a href="documents.html" class="nav-link" data-page="documents"><i class="fas fa-folder w-5"></i>Documents</a></li>
      
      <li class="nav-section">Finances</li>
      <li><a href="finance.html" class="nav-link" data-page="finance"><i class="fas fa-dollar-sign w-5"></i>Finances</a></li>
      <li><a href="invoices.html" class="nav-link" data-page="invoices"><i class="fas fa-file-invoice w-5"></i>Factures</a></li>
      
      <li class="nav-section">Admin</li>
      <li><a href="reports.html" class="nav-link" data-page="reports"><i class="fas fa-chart-bar w-5"></i>Rapports</a></li>
      <li><a href="audit.html" class="nav-link" data-page="audit"><i class="fas fa-history w-5"></i>Audit</a></li>
      <li><a href="centers.html" class="nav-link" data-page="centers"><i class="fas fa-building w-5"></i>Centres</a></li>
      <li><a href="settings.html" class="nav-link" data-page="settings"><i class="fas fa-cog w-5"></i>Paramètres</a></li>
    </ul>
  </nav>
</aside>
`;

const headerHTML = `
<header class="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-sm z-40 flex items-center justify-between px-6">
  <div class="flex items-center gap-4">
    <button id="menu-toggle" class="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
      <i class="fas fa-bars text-gray-600"></i>
    </button>
    <h1 id="page-title" class="text-xl font-semibold text-gray-900"></h1>
  </div>
  <div class="flex items-center gap-4">
    <button class="p-2 hover:bg-gray-100 rounded-lg relative">
      <i class="fas fa-bell text-gray-600"></i>
      <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-sm font-medium">JD</div>
      <span class="text-sm text-gray-700 hidden md:block">Jean Dupont</span>
    </div>
  </div>
</header>
`;

// Initialize navigation
function initNavigation(currentPage, pageTitle, category) {
  // Insert navigation
  document.body.insertAdjacentHTML('afterbegin', navigationHTML + headerHTML);
  
  // Set page title
  document.getElementById('page-title').textContent = pageTitle;
  document.title = `${pageTitle} | KIDVERSE`;
  
  // Highlight current page
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });
  
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
  });
  
  // Close sidebar on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  });
}

// CSS Styles
const styles = `
<style>
  .nav-section {
    font-size: 0.75rem;
    font-weight: 600;
    color: #9CA3AF;
    text-transform: uppercase;
    padding: 1rem 0 0.5rem 0;
    margin-top: 0.5rem;
  }
  .nav-section:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: 0.5rem;
    color: #4B5563;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
  .nav-link:hover {
    background-color: #F3F4F6;
    color: #2563EB;
  }
  .nav-link.active {
    background-color: #EFF6FF;
    color: #2563EB;
    font-weight: 500;
  }
  main {
    margin-left: 0;
    padding-top: 4rem;
    min-height: 100vh;
  }
  @media (min-width: 1024px) {
    main {
      margin-left: 16rem;
    }
  }
</style>
`;
document.head.insertAdjacentHTML('beforeend', styles);

