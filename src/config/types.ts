export interface ConfigType {
  cors: {
    origin: string[];
    methods: string[];
    optionsSuccessStatus: number;
  };
  securityHeaders: Record<string, string>;
  dataProtection: {
    healthcare: {
      encryptionEnabled: boolean;
      encryptionKey?: string;
      accessControl: {
        roles: string[];
        permissions: string[];
      };
    };
  };
}
