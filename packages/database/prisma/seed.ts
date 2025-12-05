// ==============================================
// KIDVERSE - Database Seed
// Données initiales pour le développement
// ==============================================

import { PrismaClient, UserRole, Gender, ChildStatus, AllergySeverity } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ===========================================
  // 1. CRÉER LES UTILISATEURS
  // ===========================================
  console.log('👤 Creating users...');

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kidverse.com' },
    update: {},
    create: {
      email: 'admin@kidverse.com',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1 514 555 0001',
      role: UserRole.ADMIN,
      preferredLanguage: 'fr',
    },
  });
  console.log(`  ✓ Admin: ${admin.email}`);

  // ===========================================
  // 2. CRÉER LE CENTRE
  // ===========================================
  console.log('\n🏫 Creating center...');

  const center = await prisma.center.upsert({
    where: { id: 'center-demo-001' },
    update: {},
    create: {
      id: 'center-demo-001',
      name: 'Les Petits Explorateurs',
      address: '123 Rue des Enfants',
      city: 'Montréal',
      province: 'Québec',
      postalCode: 'H2X 1Y4',
      country: 'Canada',
      phone: '+1 514 555 1234',
      email: 'contact@petitsexplorateurs.com',
      website: 'https://petitsexplorateurs.com',
      capacity: 60,
      openingTime: '07:00',
      closingTime: '18:00',
    },
  });
  console.log(`  ✓ Center: ${center.name}`);

  // ===========================================
  // 3. CRÉER LES SALLES DE CLASSE
  // ===========================================
  console.log('\n🏠 Creating classrooms...');

  const classrooms = await Promise.all([
    prisma.classroom.upsert({
      where: { id: 'classroom-poupons' },
      update: {},
      create: {
        id: 'classroom-poupons',
        name: 'Poupons',
        ageGroupMin: 0,
        ageGroupMax: 18,
        capacity: 10,
        description: 'Groupe pour les bébés de 0 à 18 mois',
        color: '#FFB6C1',
        centerId: center.id,
      },
    }),
    prisma.classroom.upsert({
      where: { id: 'classroom-bambins' },
      update: {},
      create: {
        id: 'classroom-bambins',
        name: 'Bambins',
        ageGroupMin: 18,
        ageGroupMax: 36,
        capacity: 15,
        description: 'Groupe pour les enfants de 18 mois à 3 ans',
        color: '#87CEEB',
        centerId: center.id,
      },
    }),
    prisma.classroom.upsert({
      where: { id: 'classroom-explorateurs' },
      update: {},
      create: {
        id: 'classroom-explorateurs',
        name: 'Explorateurs',
        ageGroupMin: 36,
        ageGroupMax: 48,
        capacity: 15,
        description: 'Groupe pour les enfants de 3 à 4 ans',
        color: '#98FB98',
        centerId: center.id,
      },
    }),
    prisma.classroom.upsert({
      where: { id: 'classroom-prescolaire' },
      update: {},
      create: {
        id: 'classroom-prescolaire',
        name: 'Préscolaire',
        ageGroupMin: 48,
        ageGroupMax: 60,
        capacity: 20,
        description: 'Groupe préscolaire pour les 4-5 ans',
        color: '#DDA0DD',
        centerId: center.id,
      },
    }),
  ]);
  console.log(`  ✓ Created ${classrooms.length} classrooms`);

  // ===========================================
  // 4. CRÉER LE DIRECTEUR
  // ===========================================
  console.log('\n👔 Creating director...');

  const director = await prisma.user.upsert({
    where: { email: 'directeur@petitsexplorateurs.com' },
    update: {},
    create: {
      email: 'directeur@petitsexplorateurs.com',
      passwordHash,
      firstName: 'Marie',
      lastName: 'Tremblay',
      phone: '+1 514 555 0002',
      role: UserRole.DIRECTOR,
      preferredLanguage: 'fr',
      centerId: center.id,
    },
  });
  console.log(`  ✓ Director: ${director.firstName} ${director.lastName}`);

  // ===========================================
  // 5. CRÉER LES ÉDUCATEURS
  // ===========================================
  console.log('\n👩‍🏫 Creating educators...');

  const educators = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sophie@petitsexplorateurs.com' },
      update: {},
      create: {
        email: 'sophie@petitsexplorateurs.com',
        passwordHash,
        firstName: 'Sophie',
        lastName: 'Lavoie',
        phone: '+1 514 555 0010',
        role: UserRole.EDUCATOR,
        preferredLanguage: 'fr',
        centerId: center.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'julie@petitsexplorateurs.com' },
      update: {},
      create: {
        email: 'julie@petitsexplorateurs.com',
        passwordHash,
        firstName: 'Julie',
        lastName: 'Martin',
        phone: '+1 514 555 0011',
        role: UserRole.EDUCATOR,
        preferredLanguage: 'fr',
        centerId: center.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'patrick@petitsexplorateurs.com' },
      update: {},
      create: {
        email: 'patrick@petitsexplorateurs.com',
        passwordHash,
        firstName: 'Patrick',
        lastName: 'Roy',
        phone: '+1 514 555 0012',
        role: UserRole.EDUCATOR,
        preferredLanguage: 'fr',
        centerId: center.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'emma@petitsexplorateurs.com' },
      update: {},
      create: {
        email: 'emma@petitsexplorateurs.com',
        passwordHash,
        firstName: 'Emma',
        lastName: 'Gagnon',
        phone: '+1 514 555 0013',
        role: UserRole.EDUCATOR,
        preferredLanguage: 'en',
        centerId: center.id,
      },
    }),
  ]);
  console.log(`  ✓ Created ${educators.length} educators`);

  // Créer les profils Staff pour les éducateurs
  for (let i = 0; i < educators.length; i++) {
    await prisma.staff.upsert({
      where: { userId: educators[i].id },
      update: {},
      create: {
        userId: educators[i].id,
        centerId: center.id,
        employeeNumber: `EMP-${String(i + 1).padStart(4, '0')}`,
        position: 'Éducateur(trice)',
        hireDate: new Date(2023, 0, 15 + i * 30),
        hourlyRate: 22.50 + i * 0.5,
      },
    });
  }

  // ===========================================
  // 6. CRÉER LES PARENTS
  // ===========================================
  console.log('\n👨‍👩‍👧 Creating parents...');

  const parents = await Promise.all([
    prisma.user.upsert({
      where: { email: 'jean.dupont@email.com' },
      update: {},
      create: {
        email: 'jean.dupont@email.com',
        passwordHash,
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '+1 514 555 1001',
        role: UserRole.PARENT,
        preferredLanguage: 'fr',
      },
    }),
    prisma.user.upsert({
      where: { email: 'marie.dupont@email.com' },
      update: {},
      create: {
        email: 'marie.dupont@email.com',
        passwordHash,
        firstName: 'Marie',
        lastName: 'Dupont',
        phone: '+1 514 555 1002',
        role: UserRole.PARENT,
        preferredLanguage: 'fr',
      },
    }),
    prisma.user.upsert({
      where: { email: 'pierre.martin@email.com' },
      update: {},
      create: {
        email: 'pierre.martin@email.com',
        passwordHash,
        firstName: 'Pierre',
        lastName: 'Martin',
        phone: '+1 514 555 1003',
        role: UserRole.PARENT,
        preferredLanguage: 'fr',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.johnson@email.com' },
      update: {},
      create: {
        email: 'sarah.johnson@email.com',
        passwordHash,
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+1 514 555 1004',
        role: UserRole.PARENT,
        preferredLanguage: 'en',
      },
    }),
  ]);
  console.log(`  ✓ Created ${parents.length} parents`);

  // ===========================================
  // 7. CRÉER LES ENFANTS
  // ===========================================
  console.log('\n👶 Creating children...');

  const children = await Promise.all([
    // Enfant 1 - Lucas Dupont (Bambins)
    prisma.child.upsert({
      where: { id: 'child-lucas-001' },
      update: {},
      create: {
        id: 'child-lucas-001',
        firstName: 'Lucas',
        lastName: 'Dupont',
        dateOfBirth: new Date(2021, 5, 15),
        gender: Gender.MALE,
        status: ChildStatus.ACTIVE,
        enrollmentDate: new Date(2023, 8, 1),
        centerId: center.id,
        classroomId: 'classroom-bambins',
        notes: 'Aime beaucoup les activités de peinture',
      },
    }),
    // Enfant 2 - Emma Dupont (Explorateurs)
    prisma.child.upsert({
      where: { id: 'child-emma-001' },
      update: {},
      create: {
        id: 'child-emma-001',
        firstName: 'Emma',
        lastName: 'Dupont',
        dateOfBirth: new Date(2020, 2, 22),
        gender: Gender.FEMALE,
        status: ChildStatus.ACTIVE,
        enrollmentDate: new Date(2022, 8, 1),
        centerId: center.id,
        classroomId: 'classroom-explorateurs',
      },
    }),
    // Enfant 3 - Noah Martin (Poupons)
    prisma.child.upsert({
      where: { id: 'child-noah-001' },
      update: {},
      create: {
        id: 'child-noah-001',
        firstName: 'Noah',
        lastName: 'Martin',
        dateOfBirth: new Date(2023, 1, 10),
        gender: Gender.MALE,
        status: ChildStatus.ACTIVE,
        enrollmentDate: new Date(2023, 10, 1),
        centerId: center.id,
        classroomId: 'classroom-poupons',
      },
    }),
    // Enfant 4 - Olivia Johnson (Préscolaire)
    prisma.child.upsert({
      where: { id: 'child-olivia-001' },
      update: {},
      create: {
        id: 'child-olivia-001',
        firstName: 'Olivia',
        lastName: 'Johnson',
        dateOfBirth: new Date(2019, 8, 5),
        gender: Gender.FEMALE,
        status: ChildStatus.ACTIVE,
        enrollmentDate: new Date(2022, 1, 15),
        centerId: center.id,
        classroomId: 'classroom-prescolaire',
      },
    }),
    // Enfant 5 - William Martin (Bambins)
    prisma.child.upsert({
      where: { id: 'child-william-001' },
      update: {},
      create: {
        id: 'child-william-001',
        firstName: 'William',
        lastName: 'Martin',
        dateOfBirth: new Date(2022, 0, 18),
        gender: Gender.MALE,
        status: ChildStatus.ACTIVE,
        enrollmentDate: new Date(2023, 8, 1),
        centerId: center.id,
        classroomId: 'classroom-bambins',
      },
    }),
  ]);
  console.log(`  ✓ Created ${children.length} children`);

  // ===========================================
  // 8. LIER PARENTS ET ENFANTS
  // ===========================================
  console.log('\n🔗 Linking parents to children...');

  await Promise.all([
    // Lucas et Emma Dupont -> Jean et Marie Dupont
    prisma.childParent.upsert({
      where: { childId_parentId: { childId: 'child-lucas-001', parentId: parents[0].id } },
      update: {},
      create: { childId: 'child-lucas-001', parentId: parents[0].id, relationship: 'Père', isPrimary: true },
    }),
    prisma.childParent.upsert({
      where: { childId_parentId: { childId: 'child-lucas-001', parentId: parents[1].id } },
      update: {},
      create: { childId: 'child-lucas-001', parentId: parents[1].id, relationship: 'Mère', isPrimary: false },
    }),
    prisma.childParent.upsert({
      where: { childId_parentId: { childId: 'child-emma-001', parentId: parents[0].id } },
      update: {},
      create: { childId: 'child-emma-001', parentId: parents[0].id, relationship: 'Père', isPrimary: true },
    }),
    prisma.childParent.upsert({
      where: { childId_parentId: { childId: 'child-emma-001', parentId: parents[1].id } },
      update: {},
      create: { childId: 'child-emma-001', parentId: parents[1].id, relationship: 'Mère', isPrimary: false },
    }),
    // Noah et William Martin -> Pierre Martin
    prisma.childParent.upsert({
      where: { childId_parentId: { childId: 'child-noah-001', parentId: parents[2].id } },
      update: {},
      create: { childId: 'child-noah-001', parentId: parents[2].id, relationship: 'Père', isPrimary: true },
    }),
    prisma.childParent.upsert({
      where: { childId_parentId: { childId: 'child-william-001', parentId: parents[2].id } },
      update: {},
      create: { childId: 'child-william-001', parentId: parents[2].id, relationship: 'Père', isPrimary: true },
    }),
    // Olivia Johnson -> Sarah Johnson
    prisma.childParent.upsert({
      where: { childId_parentId: { childId: 'child-olivia-001', parentId: parents[3].id } },
      update: {},
      create: { childId: 'child-olivia-001', parentId: parents[3].id, relationship: 'Mère', isPrimary: true },
    }),
  ]);
  console.log('  ✓ Parents linked to children');

  // ===========================================
  // 9. CRÉER LES ALLERGIES
  // ===========================================
  console.log('\n🚨 Creating allergies...');

  await Promise.all([
    prisma.allergy.upsert({
      where: { id: 'allergy-lucas-001' },
      update: {},
      create: {
        id: 'allergy-lucas-001',
        childId: 'child-lucas-001',
        allergen: 'Arachides',
        severity: AllergySeverity.SEVERE,
        reactions: 'Urticaire, difficulté respiratoire',
        treatment: 'EpiPen disponible dans le sac',
        doctorName: 'Dr. Leblanc',
      },
    }),
    prisma.allergy.upsert({
      where: { id: 'allergy-emma-001' },
      update: {},
      create: {
        id: 'allergy-emma-001',
        childId: 'child-emma-001',
        allergen: 'Produits laitiers',
        severity: AllergySeverity.MODERATE,
        reactions: 'Maux de ventre, éruptions cutanées',
        treatment: 'Antihistaminique si nécessaire',
      },
    }),
    prisma.allergy.upsert({
      where: { id: 'allergy-olivia-001' },
      update: {},
      create: {
        id: 'allergy-olivia-001',
        childId: 'child-olivia-001',
        allergen: 'Pollen',
        severity: AllergySeverity.MILD,
        reactions: 'Éternuements, yeux qui piquent',
        treatment: 'Antihistaminique oral',
      },
    }),
  ]);
  console.log('  ✓ Allergies created');

  // ===========================================
  // 10. CRÉER LES CONTACTS D'URGENCE
  // ===========================================
  console.log('\n📞 Creating emergency contacts...');

  await Promise.all([
    prisma.emergencyContact.create({
      data: {
        childId: 'child-lucas-001',
        name: 'Grand-mère Dupont',
        relationship: 'Grand-mère',
        phone: '+1 514 555 2001',
        priority: 1,
      },
    }),
    prisma.emergencyContact.create({
      data: {
        childId: 'child-emma-001',
        name: 'Grand-père Dupont',
        relationship: 'Grand-père',
        phone: '+1 514 555 2002',
        priority: 1,
      },
    }),
    prisma.emergencyContact.create({
      data: {
        childId: 'child-olivia-001',
        name: 'Oncle Robert',
        relationship: 'Oncle',
        phone: '+1 514 555 2003',
        email: 'robert@email.com',
        priority: 1,
      },
    }),
  ]);
  console.log('  ✓ Emergency contacts created');

  // ===========================================
  // 11. CRÉER LA LICENCE
  // ===========================================
  console.log('\n📜 Creating license...');

  await prisma.license.upsert({
    where: { id: 'license-001' },
    update: {},
    create: {
      id: 'license-001',
      centerId: center.id,
      licenseNumber: 'MFA-2024-12345',
      licenseType: 'Permis de garderie',
      issuingAuthority: 'Ministère de la Famille',
      issueDate: new Date(2024, 0, 1),
      expiryDate: new Date(2027, 0, 1),
      status: 'ACTIVE',
      capacity: 60,
    },
  });
  console.log('  ✓ License created');

  // ===========================================
  // 12. CRÉER DES MILESTONES DE DÉVELOPPEMENT
  // ===========================================
  console.log('\n🎯 Creating developmental milestones...');

  const milestones = await Promise.all([
    prisma.milestone.upsert({
      where: { id: 'milestone-walk' },
      update: {},
      create: {
        id: 'milestone-walk',
        name: 'Premiers pas',
        description: 'L\'enfant peut marcher sans aide',
        learningArea: 'Physique',
        ageRangeMin: 9,
        ageRangeMax: 18,
        indicators: ['Marche sans soutien', 'Garde l\'équilibre'],
      },
    }),
    prisma.milestone.upsert({
      where: { id: 'milestone-speak' },
      update: {},
      create: {
        id: 'milestone-speak',
        name: 'Premières phrases',
        description: 'L\'enfant peut former des phrases de 2-3 mots',
        learningArea: 'Langage',
        ageRangeMin: 18,
        ageRangeMax: 30,
        indicators: ['Combine deux mots', 'Vocabulaire de 50+ mots'],
      },
    }),
    prisma.milestone.upsert({
      where: { id: 'milestone-potty' },
      update: {},
      create: {
        id: 'milestone-potty',
        name: 'Propreté',
        description: 'L\'enfant utilise le pot de façon autonome',
        learningArea: 'Social',
        ageRangeMin: 24,
        ageRangeMax: 42,
        indicators: ['Reconnaît le besoin', 'Utilise le pot seul'],
      },
    }),
    prisma.milestone.upsert({
      where: { id: 'milestone-colors' },
      update: {},
      create: {
        id: 'milestone-colors',
        name: 'Reconnaissance des couleurs',
        description: 'L\'enfant peut identifier les couleurs de base',
        learningArea: 'Cognitif',
        ageRangeMin: 24,
        ageRangeMax: 48,
        indicators: ['Nomme les couleurs primaires', 'Associe couleur et objet'],
      },
    }),
    prisma.milestone.upsert({
      where: { id: 'milestone-share' },
      update: {},
      create: {
        id: 'milestone-share',
        name: 'Partage',
        description: 'L\'enfant partage volontairement avec ses pairs',
        learningArea: 'Social',
        ageRangeMin: 30,
        ageRangeMax: 48,
        indicators: ['Partage jouets', 'Attend son tour'],
      },
    }),
  ]);
  console.log(`  ✓ Created ${milestones.length} milestones`);

  // ===========================================
  // 13. CRÉER DES ACTIVITÉS MODÈLES
  // ===========================================
  console.log('\n🎨 Creating activity templates...');

  await Promise.all([
    prisma.activity.create({
      data: {
        name: 'Peinture aux doigts',
        description: 'Activité de peinture libre avec les doigts',
        learningArea: 'Créatif',
        ageGroupMin: 12,
        ageGroupMax: 48,
        duration: 30,
        materials: 'Peinture non-toxique, papier épais, tabliers',
        objectives: 'Développer la motricité fine et l\'expression artistique',
        isTemplate: true,
      },
    }),
    prisma.activity.create({
      data: {
        name: 'Cercle de lecture',
        description: 'Lecture interactive d\'un livre illustré',
        learningArea: 'Langage',
        ageGroupMin: 18,
        ageGroupMax: 60,
        duration: 20,
        materials: 'Livre illustré adapté à l\'âge',
        objectives: 'Développer le vocabulaire et l\'écoute',
        isTemplate: true,
      },
    }),
    prisma.activity.create({
      data: {
        name: 'Jeu de blocs',
        description: 'Construction libre avec des blocs',
        learningArea: 'Cognitif',
        ageGroupMin: 12,
        ageGroupMax: 60,
        duration: 45,
        materials: 'Blocs de construction variés',
        objectives: 'Développer la logique spatiale et la créativité',
        isTemplate: true,
      },
    }),
    prisma.activity.create({
      data: {
        name: 'Parcours moteur',
        description: 'Parcours d\'obstacles adaptés',
        learningArea: 'Physique',
        ageGroupMin: 18,
        ageGroupMax: 60,
        duration: 30,
        materials: 'Cônes, cerceaux, tunnels, matelas',
        objectives: 'Développer la motricité globale et l\'équilibre',
        isTemplate: true,
      },
    }),
    prisma.activity.create({
      data: {
        name: 'Comptines et chansons',
        description: 'Session de chansons et comptines avec gestes',
        learningArea: 'Langage',
        ageGroupMin: 0,
        ageGroupMax: 48,
        duration: 15,
        materials: 'Instruments de musique simples (optionnel)',
        objectives: 'Développer le langage et la mémoire',
        isTemplate: true,
      },
    }),
  ]);
  console.log('  ✓ Activity templates created');

  // ===========================================
  // 14. CRÉER UN PROGRAMME DE SUBVENTION
  // ===========================================
  console.log('\n💰 Creating subsidy program...');

  await prisma.subsidyProgram.upsert({
    where: { id: 'subsidy-qc-001' },
    update: {},
    create: {
      id: 'subsidy-qc-001',
      name: 'Programme de places à contribution réduite',
      description: 'Subvention gouvernementale pour les places en garderie à 8,85$/jour',
      governmentBody: 'Ministère de la Famille du Québec',
      maxAmount: 50.00,
      eligibilityCriteria: 'Résidence au Québec, enfant de moins de 5 ans',
      documentationRequired: 'Preuve de résidence, acte de naissance',
    },
  });
  console.log('  ✓ Subsidy program created');

  // ===========================================
  // RÉSUMÉ
  // ===========================================
  console.log('\n' + '='.repeat(50));
  console.log('✅ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   • 1 Admin user`);
  console.log(`   • 1 Center`);
  console.log(`   • 4 Classrooms`);
  console.log(`   • 1 Director`);
  console.log(`   • ${educators.length} Educators`);
  console.log(`   • ${parents.length} Parents`);
  console.log(`   • ${children.length} Children`);
  console.log(`   • 3 Allergies`);
  console.log(`   • 3 Emergency contacts`);
  console.log(`   • ${milestones.length} Milestones`);
  console.log(`   • 5 Activity templates`);
  console.log(`   • 1 License`);
  console.log(`   • 1 Subsidy program`);
  console.log('\n🔑 Test Credentials:');
  console.log('   Admin:    admin@kidverse.com / Password123!');
  console.log('   Director: directeur@petitsexplorateurs.com / Password123!');
  console.log('   Educator: sophie@petitsexplorateurs.com / Password123!');
  console.log('   Parent:   jean.dupont@email.com / Password123!');
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


