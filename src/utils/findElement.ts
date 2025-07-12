import { Page, Locator } from 'playwright';
import { loginSelectors } from './selectors';

export class ElementFinder {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  async findElement(selectors: string[]): Promise<Locator | null> {
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector);
        if (await element.isVisible()) {
          return element;
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }


  async findInput(type: 'email' | 'password', name?: string): Promise<Locator | null> {
    const selectors = [
      `input[type="${type}"]`,
      `input[name="${name}"]`,
      `#${name}`,
      `input[placeholder*="${type}"]`
    ].filter(Boolean); 
    
    return this.findElement(selectors);
  }


  async findSubmitButton(): Promise<Locator | null> {
    const selectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      '.login-button',
      '#login-button',
      'button:has-text("Login")',
      'button:has-text("Iniciar sesión")'
    ];
    
    return this.findElement(selectors);
  }


  async hasErrorMessage(): Promise<boolean> {
    const element = await this.findElement([
      '.error-message',
      '.alert-error', 
      '.login-error',
      '.error',
      '.alert'
    ]);
    return element !== null;
  }


  async getErrorMessage(): Promise<string | null> {
    const element = await this.findElement([
      '.error-message',
      '.alert-error',
      '.login-error', 
      '.error',
      '.alert'
    ]);
    return element ? await element.textContent() : null;
  }
}