import { Page } from 'playwright';
import { ElementFinder } from './findElement';
import { LoginCredentials, LoginResult } from '../types/login';
import { config } from '../config/config';

export class LoginService {
  private page: Page;
  private elementFinder: ElementFinder;
  private credentials: LoginCredentials;

  constructor(page: Page) {
    this.page = page;
    this.elementFinder = new ElementFinder(page);
    this.credentials = {
      email: process.env.SHERPA_EMAIL || 'monje@sherpa.local',
      password: process.env.SHERPA_PASSWORD || 'cript@123'
    };
  }

  async performLogin(): Promise<LoginResult> {
    try {
      console.log('🔐 Iniciando ritual de entrada...');
      await this.page.goto(config.url);
      console.log('✅ Página de login cargada');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      if (!await this.findAndFillInput('email', this.credentials.email))
        return { success: false, message: 'No se pudo encontrar el campo de email', error: 'Email input not found' };

      if (!await this.findAndFillInput('password', this.credentials.password))
        return { success: false, message: 'No se pudo encontrar el campo de password', error: 'Password input not found' };

      if (!await this.findAndClickLoginButton())
        return { success: false, message: 'No se pudo encontrar el botón de login', error: 'Login button not found' };

      await this.page.waitForTimeout(3000);

      if (await this.verifyLoginSuccess()) {
        console.log('✅ Ritual de entrada completado exitosamente');
        return { success: true, message: 'Login exitoso - El monje ha entrado a la cripta' };
      } else {
        const errorMessage = await this.elementFinder.getErrorMessage();
        console.log('❌ Error en el ritual de entrada:', errorMessage);
        return { success: false, message: 'Login fallido', error: errorMessage || 'Error desconocido en el login' };
      }
    } catch (error) {
      console.error('❌ Error durante el ritual de entrada:', error);
      return { success: false, message: 'Error durante el proceso de login', error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  private async findAndFillInput(type: 'email' | 'password', value: string): Promise<boolean> {
    console.log(`📧 Buscando campo de ${type}...`);
    const input = await this.elementFinder.findInput(type, type);
    if (!input) {
      console.log(`❌ Campo de ${type} no encontrado`);
      return false;
    }
    console.log(`📧 Llenando campo de ${type}...`);
    await input.clear();
    await input.fill(value);
    console.log(`✅ ${type} ingresado`);
    return true;
  }

  private async findAndClickLoginButton(): Promise<boolean> {
    console.log('🔘 Buscando botón de login...');
    const loginButton = await this.elementFinder.findSubmitButton();
    if (!loginButton) {
      console.log('❌ Botón de login no encontrado');
      return false;
    }
    console.log('🔘 Haciendo click en botón de login...');
    await loginButton.click();
    console.log('✅ Click en botón de login realizado');
    return true;
  }

  private async verifyLoginSuccess(): Promise<boolean> {
    console.log('🔍 Verificando resultado del login...');
    if (await this.elementFinder.hasErrorMessage()) return false;
    const currentUrl = this.page.url();
    if (currentUrl !== config.url && !currentUrl.includes('login')) {
      console.log('✅ URL cambió, login exitoso');
      return true;
    }
    const successSelectors = ['.dashboard', '.welcome', '.user-info', '[data-logged-in]'];
    for (const selector of successSelectors) {
      try {
        const element = this.page.locator(selector);
        if (await element.isVisible()) {
          console.log('✅ Elemento de éxito encontrado:', selector);
          return true;
        }
      } catch { continue; }
    }
    return false;
  }
} 