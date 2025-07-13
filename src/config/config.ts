// Configuración para Node.js + Express
export interface BrowserConfig {
  headless: boolean;
  slowMo: number;
}

export interface AppConfig {
  url: string;
  browser: BrowserConfig;
}

export const config: AppConfig = {
  url: 'https://pruebatecnica-sherpa-production.up.railway.app/',
  browser: {
    headless: false,
    slowMo: 1500
  }
}; 