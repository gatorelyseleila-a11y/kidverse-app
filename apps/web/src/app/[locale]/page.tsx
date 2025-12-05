import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  Building2, 
  Heart, 
  GraduationCap, 
  Calculator, 
  Users, 
  Shield,
  Rocket,
  PlayCircle,
  Check,
  Fingerprint,
  FileText,
  QrCode,
  Star
} from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();

  const modules = [
    {
      icon: Building2,
      title: 'Gestion des Centres',
      description: 'Gérez plusieurs centres avec licences, inspections et maintenance',
      features: ['Licences et conformité', 'Inspections réglementaires', 'Maintenance préventive'],
      color: 'bg-brand-blue',
    },
    {
      icon: Heart,
      title: 'Santé & Sécurité',
      description: 'Suivi médical complet avec allergies, médicaments et profils santé',
      features: ['Carnet vaccination digital', 'Gestion des allergies', 'Triage santé quotidien'],
      color: 'bg-success',
    },
    {
      icon: GraduationCap,
      title: 'Pédagogie',
      description: 'Curriculum, observations et portfolio d\'apprentissage',
      features: ['Activités pédagogiques', 'Observations structurées', 'Suivi des milestones'],
      color: 'bg-brand-orange',
    },
    {
      icon: Calculator,
      title: 'Finances',
      description: 'Facturation automatisée avec subventions et paiements',
      features: ['Facturation intelligente', 'Gestion subventions', 'Paiements blockchain'],
      color: 'bg-purple-600',
    },
    {
      icon: Users,
      title: 'Ressources Humaines',
      description: 'Gestion du personnel, qualifications et planning',
      features: ['Qualifications staff', 'Planning équipes', 'Contrôle ratios temps réel'],
      color: 'bg-warning',
    },
    {
      icon: Shield,
      title: 'Sécurité & Accès',
      description: 'Contrôle d\'accès, monitoring et personnes autorisées',
      features: ['Check-in/out sécurisé', 'Personnes autorisées', 'Audit trail complet'],
      color: 'bg-danger',
    },
  ];

  const blockchainFeatures = [
    {
      icon: Fingerprint,
      title: 'Identité Numérique',
      description: 'Portefeuille blockchain unique pour chaque enfant avec consentements granularisés',
    },
    {
      icon: Shield,
      title: 'Données Immuables',
      description: 'Transactions sécurisées et journal d\'audit infalsifiable sur blockchain Polygon',
    },
    {
      icon: FileText,
      title: 'Contrats Intelligents',
      description: 'Facturation automatique et gestion des subventions via smart contracts',
    },
    {
      icon: QrCode,
      title: 'Vérification Instantanée',
      description: 'Scan QR pour vérifier certifications, consentements et transactions',
    },
  ];

  const pricingPlans = [
    {
      name: 'Essentiel',
      description: 'Pour petites garderies',
      price: 199,
      features: [
        "Jusqu'à 25 enfants",
        'Gestion de base',
        'Messagerie parents',
        'Facturation simple',
        'Support email',
      ],
      featured: false,
    },
    {
      name: 'Professionnel',
      description: 'Pour garderies établies',
      price: 399,
      features: [
        "Jusqu'à 100 enfants",
        'Tous les modules',
        'Blockchain incluse',
        'Multi-centres',
        'Support prioritaire',
        'Formation intégrée',
      ],
      featured: true,
    },
    {
      name: 'Entreprise',
      description: 'Pour réseaux de garderies',
      price: 899,
      features: [
        'Enfants illimités',
        'API complète',
        'White-label',
        'Analytics avancés',
        'Gestionnaire dédié',
        'Intégrations sur mesure',
      ],
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-lg flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <span className="text-xl font-bold text-brand-blue">
                KID<span className="text-brand-orange">VERSE</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#modules" className="text-gray-600 hover:text-brand-blue transition-colors">
                Modules
              </Link>
              <Link href="#blockchain" className="text-gray-600 hover:text-brand-blue transition-colors">
                Blockchain
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-brand-blue transition-colors">
                Tarifs
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="hidden md:inline-flex px-4 py-2 text-brand-blue border-2 border-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
              >
                Se connecter
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors"
              >
                Démarrer l'essai
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-brand-blue to-brand-blue-light text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            L'univers intelligent qui grandit avec vos enfants
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
            La première plateforme SaaS complète de gestion de garderies, combinant pédagogie moderne, 
            blockchain et intelligence artificielle pour transformer l'expérience des parents, 
            éducateurs et directeurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-lg text-lg font-semibold hover:bg-brand-orange-dark transition-colors"
            >
              <Rocket className="w-5 h-5" />
              Démarrer l'essai gratuit
            </Link>
            <Link 
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-blue mb-4">
            Modules Intégrés
          </h2>
          <p className="text-center text-gray-600 mb-12">
            38 tables de données unifiées dans une seule plateforme intuitive
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${module.color} rounded-xl flex items-center justify-center mb-4`}>
                  <module.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Section */}
      <section id="blockchain" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Blockchain & Sécurité
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Identité numérique sécurisée et données immuables
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blockchainFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-brand-orange mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-blue mb-4">
            Plans Tarifaires
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Choisissez le plan adapté à vos besoins
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                  plan.featured 
                    ? 'border-brand-orange shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-brand-blue hover:shadow-lg'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 right-6 bg-brand-orange text-white text-xs font-semibold px-3 py-1 rounded-full">
                    POPULAIRE
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-blue">${plan.price}</span>
                  <span className="text-gray-500">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                      : 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white'
                  }`}
                >
                  {plan.featured && <Star className="w-4 h-4 inline mr-2" />}
                  {plan.featured ? 'Choisir ce plan' : 'Commencer'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  K
                </div>
                <span className="text-xl font-bold">
                  KID<span className="text-brand-orange">VERSE</span>
                </span>
              </Link>
              <p className="text-gray-400">
                L'univers intelligent qui grandit avec vos enfants.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Modules</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Gestion Centres</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Santé & Sécurité</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pédagogie</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Finances</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Webinaires</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Carrières</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Partenaires</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 KIDVERSE. Tous droits réservés.</p>
            <p className="mt-1">Solution développée par GALYLÉ Technologies Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


