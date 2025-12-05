export default () => ({
  // Application
  app: {
    port: parseInt(process.env.PORT || '4000', 10),
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:4000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Blockchain
  blockchain: {
    enabled: process.env.ENABLE_BLOCKCHAIN === 'true',
    polygonRpcUrl: process.env.POLYGON_RPC_URL,
    polygonTestnetRpcUrl: process.env.POLYGON_TESTNET_RPC_URL,
    walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
  },

  // Storage (S3/Minio)
  storage: {
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET || 'kidverse-uploads',
    region: process.env.S3_REGION || 'us-east-1',
  },

  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'KIDVERSE <noreply@kidverse.com>',
  },

  // Push Notifications
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },

  // Twilio
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  // Feature Flags
  features: {
    blockchain: process.env.ENABLE_BLOCKCHAIN === 'true',
    ai: process.env.ENABLE_AI_FEATURES === 'true',
    mobilePush: process.env.ENABLE_MOBILE_PUSH === 'true',
  },
});


