import { chromium, Browser, Page } from 'playwright';
import { config } from '../../config/config';
import { LoginService } from '../../utils/doLogin';
import { LoginResult } from '../../types/login';

export class PlaywrightService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private loginService: LoginService | null = null;
  private isLoggedIn: boolean = false;

  async runAutomation(): Promise<any> {
    try {
      console.log('🚀 Iniciando automatización con Playwright...');
      
      await this.initializeBrowser();
      
      const loginResult = await this.performLoginStep();
      
      if (!loginResult.success) {
        throw new Error(`Login fallido: ${loginResult.error}`);
      }
      
      this.isLoggedIn = true;
      console.log('✅ PASO 1 completado: El monje ha entrado a la cripta');
      console.log('🌐 Navegador mantenido abierto para próximos pasos...');
      
      return {
        success: true,
        message: 'PASO 1 completado - Login exitoso. Navegador listo para próximos pasos.',
        data: {
          step: 'PASO 1: EL RITUAL DE ENTRADA',
          status: 'COMPLETADO',
          loginResult,
          browserOpen: true,
          readyForNextStep: true
        }
      };
      
    } catch (error) {
      console.error('❌ Error en automatización:', error);
      throw error;
    }
  }

  private async initializeBrowser(): Promise<void> {
    console.log('🌐 Inicializando navegador...');
    
    this.browser = await chromium.launch({
      headless: config.browser.headless,
      slowMo: config.browser.slowMo
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    if (this.page) {
      this.loginService = new LoginService(this.page);
    }
    
    console.log('✅ Navegador inicializado');
  }

  private async performLoginStep(): Promise<LoginResult> {
    if (!this.page || !this.loginService) {
      throw new Error('Servicios no inicializados');
    }

    try {
      console.log('🗝️ PASO 1: EL RITUAL DE ENTRADA');
      console.log('🚪 Abriendo la Cueva Sagrada...');
      
      await this.page.goto(config.url);
      await this.page.waitForLoadState('networkidle');
      
      const loginResult = await this.loginService.performLogin();
      
      if (loginResult.success) {
        console.log('✅ Login exitoso - El monje ha entrado a la cripta');
      } else {
        console.log('❌ Login fallido:', loginResult.error);
      }
      
      return loginResult;
      
    } catch (error) {
      console.error('❌ Error durante el ritual de entrada:', error);
      
      return {
        success: false,
        message: 'Error durante el ritual de entrada',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  getStatus(): any {
    return {
      browserRunning: this.browser !== null,
      pageOpen: this.page !== null,
      servicesInitialized: this.loginService !== null,
      isLoggedIn: this.isLoggedIn,
      readyForNextStep: this.isLoggedIn && this.browser !== null && this.page !== null
    };
  }

  getCurrentPage(): Page | null {
    return this.page;
  }

  getCurrentBrowser(): Browser | null {
    return this.browser;
  }
} 