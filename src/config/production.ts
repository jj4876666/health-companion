import { ConfigType } from './types';

const productionConfig: ConfigType = {
    cors: {
        origin: ['https://trusted-site.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        optionsSuccessStatus: 200,
    },
    securityHeaders: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self';",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
    },
    dataProtection: {
        healthcare: {
            encryptionEnabled: true,
            encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || 'default-key',
            accessControl: {
                roles: ['admin', 'staff'],
                permissions: ['read', 'write', 'delete'],
            },
        },
    },
};

export default productionConfig;
