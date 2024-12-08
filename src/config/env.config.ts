export interface EnvConfig {
    port: number;
    openaiApiKey: string;
    googleType: string;
    googleCalendarId: string;
    googleProjectId: string;
    googlePrivateKeyId: string;
    googlePrivateKey: string;
    googleClientEmail: string;
    googleClientId: string;
    googleAuthUri: string;
    googleTokenUri: string;
    googleAuthProviderCertUrl: string;
    googleClientCertUrl: string;
    googleUniverseDomain: string;
  }
  
  export class EnvConfigService implements EnvConfig {
    public readonly port: number;
    public readonly openaiApiKey: string;
    public readonly googleType: string;
    public readonly googleCalendarId: string;
    public readonly googleProjectId: string;
    public readonly googlePrivateKeyId: string;
    public readonly googlePrivateKey: string;
    public readonly googleClientEmail: string;
    public readonly googleClientId: string;
    public readonly googleAuthUri: string;
    public readonly googleTokenUri: string;
    public readonly googleAuthProviderCertUrl: string;
    public readonly googleClientCertUrl: string;
    public readonly googleUniverseDomain: string;
  
    constructor() {
      const requiredEnvVars = [
        "PORT",
        "OPENAI_API_KEY",
        "GOOGLE_TYPE",
        "GOOGLE_CALENDAR_ID",
        "GOOGLE_PROJECT_ID",
        "GOOGLE_PRIVATE_KEY_ID",
        "GOOGLE_PRIVATE_KEY",
        "GOOGLE_CLIENT_EMAIL",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_AUTH_URI",
        "GOOGLE_TOKEN_URI",
        "GOOGLE_AUTH_PROVIDER_CERT_URL",
        "GOOGLE_CLIENT_CERT_URL",
        "GOOGLE_UNIVERSE_DOMAIN",
      ];
  
      // Validar que todas las variables de entorno requeridas existan
      requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
          throw new Error(`Missing environment variable: ${key}`);
        }
      });
  
      // Asignar las propiedades desde las variables de entorno
      this.port = Number(process.env.PORT);
      this.openaiApiKey = process.env.OPENAI_API_KEY!;
      this.googleType = process.env.GOOGLE_TYPE!;
      this.googleCalendarId = process.env.GOOGLE_CALENDAR_ID!;
      this.googleProjectId = process.env.GOOGLE_PROJECT_ID!;
      this.googlePrivateKeyId = process.env.GOOGLE_PRIVATE_KEY_ID!;
      this.googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY!;
      this.googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL!;
      this.googleClientId = process.env.GOOGLE_CLIENT_ID!;
      this.googleAuthUri = process.env.GOOGLE_AUTH_URI!;
      this.googleTokenUri = process.env.GOOGLE_TOKEN_URI!;
      this.googleAuthProviderCertUrl = process.env.GOOGLE_AUTH_PROVIDER_CERT_URL!;
      this.googleClientCertUrl = process.env.GOOGLE_CLIENT_CERT_URL!;
      this.googleUniverseDomain = process.env.GOOGLE_UNIVERSE_DOMAIN!;
    }
  }
  
  export default new EnvConfigService();
  