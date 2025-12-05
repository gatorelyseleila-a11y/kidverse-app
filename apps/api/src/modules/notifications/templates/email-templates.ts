// Email Templates for KIDVERSE
// These templates use a simple HTML structure that works across email clients

export interface EmailTemplateData {
  recipientName: string;
  childName?: string;
  centerName?: string;
  date?: string;
  time?: string;
  [key: string]: any;
}

// Base HTML wrapper
const baseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #2563EB 0%, #F97316 100%);
      padding: 30px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
    }
    .logo span {
      color: #FCD34D;
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 20px;
    }
    .text {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 20px;
    }
    .highlight-box {
      background-color: #EFF6FF;
      border-left: 4px solid #2563EB;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .alert-box {
      background-color: #FEF2F2;
      border-left: 4px solid #EF4444;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .success-box {
      background-color: #ECFDF5;
      border-left: 4px solid #10B981;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .button {
      display: inline-block;
      background-color: #2563EB;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #1D4ED8;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .footer a {
      color: #2563EB;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 30px 0;
    }
    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
      width: 140px;
    }
    .detail-value {
      color: #6b7280;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KID<span>VERSE</span></div>
    </div>
    ${content}
    <div class="footer">
      <p><strong>KIDVERSE</strong> - Écosystème Intelligent de Garderie</p>
      <p>
        <a href="#">Paramètres de notification</a> • 
        <a href="#">Aide</a> • 
        <a href="#">Contact</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        © 2024 GALYLÉ Technologies Inc. Tous droits réservés.<br>
        Vous recevez cet email car vous êtes inscrit sur KIDVERSE.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Welcome email template
export const welcomeEmail = (data: EmailTemplateData) => baseTemplate(`
  <div class="content">
    <h1 class="title">Bienvenue sur KIDVERSE! 🎉</h1>
    <p class="text">Bonjour ${data.recipientName},</p>
    <p class="text">
      Nous sommes ravis de vous accueillir dans la famille KIDVERSE! Votre compte a été créé avec succès
      et vous pouvez maintenant accéder à toutes les fonctionnalités de notre plateforme.
    </p>
    
    <div class="highlight-box">
      <strong>Votre centre:</strong> ${data.centerName}<br>
      <strong>Email:</strong> ${data.email}
    </div>
    
    <p class="text">
      Avec KIDVERSE, vous pourrez:
    </p>
    <ul style="color: #4b5563;">
      <li>Suivre les présences de votre enfant en temps réel</li>
      <li>Recevoir des mises à jour quotidiennes</li>
      <li>Communiquer facilement avec les éducateurs</li>
      <li>Consulter les photos et activités</li>
      <li>Gérer les paiements en ligne</li>
    </ul>
    
    <p style="text-align: center;">
      <a href="${data.loginUrl || '#'}" class="button">Accéder à mon compte</a>
    </p>
    
    <div class="divider"></div>
    
    <p class="text" style="font-size: 14px;">
      Si vous avez des questions, n'hésitez pas à contacter notre équipe de support.
    </p>
  </div>
`, 'Bienvenue sur KIDVERSE');

// Check-in notification template
export const checkInEmail = (data: EmailTemplateData) => baseTemplate(`
  <div class="content">
    <h1 class="title">✅ Arrivée enregistrée</h1>
    <p class="text">Bonjour ${data.recipientName},</p>
    <p class="text">
      Nous vous confirmons que <strong>${data.childName}</strong> est bien arrivé(e) à la garderie.
    </p>
    
    <div class="success-box">
      <table style="width: 100%;">
        <tr>
          <td style="width: 100px; font-weight: 600;">Enfant:</td>
          <td>${data.childName}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Date:</td>
          <td>${data.date}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Heure:</td>
          <td>${data.time}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Enregistré par:</td>
          <td>${data.checkedInBy}</td>
        </tr>
      </table>
    </div>
    
    <p class="text">
      Bonne journée! Nous prendrons bien soin de ${data.childName}.
    </p>
    
    <p style="text-align: center;">
      <a href="${data.dashboardUrl || '#'}" class="button">Voir le tableau de bord</a>
    </p>
  </div>
`, 'Arrivée enregistrée');

// Check-out notification template
export const checkOutEmail = (data: EmailTemplateData) => baseTemplate(`
  <div class="content">
    <h1 class="title">👋 Départ enregistré</h1>
    <p class="text">Bonjour ${data.recipientName},</p>
    <p class="text">
      <strong>${data.childName}</strong> a quitté la garderie. Nous espérons qu'il/elle a passé une excellente journée!
    </p>
    
    <div class="highlight-box">
      <table style="width: 100%;">
        <tr>
          <td style="width: 100px; font-weight: 600;">Enfant:</td>
          <td>${data.childName}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Date:</td>
          <td>${data.date}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Heure:</td>
          <td>${data.time}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Récupéré par:</td>
          <td>${data.pickedUpBy}</td>
        </tr>
      </table>
    </div>
    
    <p class="text">
      À demain! 🌟
    </p>
  </div>
`, 'Départ enregistré');

// Health alert template
export const healthAlertEmail = (data: EmailTemplateData) => baseTemplate(`
  <div class="content">
    <h1 class="title">⚠️ Alerte Santé</h1>
    <p class="text">Bonjour ${data.recipientName},</p>
    <p class="text">
      Une alerte de santé a été signalée concernant <strong>${data.childName}</strong>.
    </p>
    
    <div class="alert-box">
      <strong style="color: #991B1B;">Motif:</strong> ${data.alertReason}<br><br>
      <strong>Détails:</strong> ${data.alertDetails}<br><br>
      <strong>Signalé par:</strong> ${data.reportedBy}<br>
      <strong>Date/Heure:</strong> ${data.date} à ${data.time}
    </div>
    
    <p class="text">
      <strong>Action recommandée:</strong><br>
      ${data.recommendedAction || 'Veuillez contacter la garderie dès que possible.'}
    </p>
    
    <p style="text-align: center;">
      <a href="tel:${data.centerPhone}" class="button" style="background-color: #EF4444;">
        📞 Appeler la garderie
      </a>
    </p>
    
    <div class="divider"></div>
    
    <p class="text" style="font-size: 14px;">
      <strong>Contact d'urgence:</strong> ${data.centerPhone}<br>
      <strong>Adresse:</strong> ${data.centerAddress}
    </p>
  </div>
`, 'Alerte Santé - Action requise');

// Invoice/Payment template
export const invoiceEmail = (data: EmailTemplateData) => baseTemplate(`
  <div class="content">
    <h1 class="title">📄 Nouvelle facture disponible</h1>
    <p class="text">Bonjour ${data.recipientName},</p>
    <p class="text">
      Votre facture pour <strong>${data.childName}</strong> est maintenant disponible.
    </p>
    
    <div class="highlight-box">
      <table style="width: 100%;">
        <tr>
          <td style="font-weight: 600;">Numéro de facture:</td>
          <td>${data.invoiceNumber}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Période:</td>
          <td>${data.period}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Montant:</td>
          <td style="font-size: 20px; color: #2563EB; font-weight: bold;">${data.amount} $</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Échéance:</td>
          <td>${data.dueDate}</td>
        </tr>
      </table>
    </div>
    
    <p style="text-align: center;">
      <a href="${data.paymentUrl || '#'}" class="button">Payer maintenant</a>
    </p>
    
    <p class="text" style="font-size: 14px;">
      Vous pouvez également télécharger votre facture en PDF depuis votre espace parent.
    </p>
  </div>
`, 'Nouvelle facture');

// Payment confirmation template
export const paymentConfirmationEmail = (data: EmailTemplateData) => baseTemplate(`
  <div class="content">
    <h1 class="title">✅ Paiement confirmé</h1>
    <p class="text">Bonjour ${data.recipientName},</p>
    <p class="text">
      Nous avons bien reçu votre paiement. Merci!
    </p>
    
    <div class="success-box">
      <table style="width: 100%;">
        <tr>
          <td style="font-weight: 600;">Référence:</td>
          <td>${data.transactionId}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Montant:</td>
          <td style="font-size: 18px; color: #059669; font-weight: bold;">${data.amount} $</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Date:</td>
          <td>${data.date}</td>
        </tr>
        <tr>
          <td style="font-weight: 600;">Mode de paiement:</td>
          <td>${data.paymentMethod}</td>
        </tr>
      </table>
    </div>
    
    <p class="text">
      Un reçu détaillé est disponible dans votre espace parent.
    </p>
    
    <p style="text-align: center;">
      <a href="${data.receiptUrl || '#'}" class="button">Télécharger le reçu</a>
    </p>
  </div>
`, 'Confirmation de paiement');

// Daily summary template
export const dailySummaryEmail = (data: EmailTemplateData) => baseTemplate(`
  <div class="content">
    <h1 class="title">📝 Résumé de la journée</h1>
    <p class="text">Bonjour ${data.recipientName},</p>
    <p class="text">
      Voici le résumé de la journée de <strong>${data.childName}</strong> du ${data.date}.
    </p>
    
    <div class="highlight-box">
      <strong>🕐 Présence</strong><br>
      Arrivée: ${data.checkInTime} • Départ: ${data.checkOutTime || 'En cours'}
    </div>
    
    ${data.meals ? `
    <div style="margin: 20px 0;">
      <strong>🍽️ Repas</strong>
      <ul style="color: #4b5563; margin-top: 10px;">
        ${data.meals.map((meal: string) => `<li>${meal}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${data.naps ? `
    <div style="margin: 20px 0;">
      <strong>😴 Siestes</strong>
      <p style="color: #4b5563;">${data.naps}</p>
    </div>
    ` : ''}
    
    ${data.activities ? `
    <div style="margin: 20px 0;">
      <strong>🎨 Activités</strong>
      <ul style="color: #4b5563; margin-top: 10px;">
        ${data.activities.map((activity: string) => `<li>${activity}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${data.notes ? `
    <div style="margin: 20px 0; padding: 15px; background: #FEF3C7; border-radius: 8px;">
      <strong>📌 Notes de l'éducateur</strong>
      <p style="color: #92400E; margin-top: 10px;">${data.notes}</p>
    </div>
    ` : ''}
    
    <p style="text-align: center;">
      <a href="${data.detailsUrl || '#'}" class="button">Voir plus de détails</a>
    </p>
  </div>
`, 'Résumé de la journée');

// Export all templates
export const emailTemplates = {
  welcome: welcomeEmail,
  checkIn: checkInEmail,
  checkOut: checkOutEmail,
  healthAlert: healthAlertEmail,
  invoice: invoiceEmail,
  paymentConfirmation: paymentConfirmationEmail,
  dailySummary: dailySummaryEmail,
};

export default emailTemplates;

