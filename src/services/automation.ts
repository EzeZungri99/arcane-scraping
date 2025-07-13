import { PlaywrightService } from './playwright/playwrightService';
import { AutomationStatus } from '../types/automation';

export class AutomationService {
  private playwrightService: PlaywrightService;
  private status: AutomationStatus;

  constructor(playwrightService?: PlaywrightService) {
    this.playwrightService = playwrightService || new PlaywrightService();
    this.status = {
      isRunning: false,
      currentStep: '',
      error: null
    };
  }

  async startAutomation(): Promise<any> {
    try {
      this.status.currentStep = 'Iniciando automatización...';
      this.status.error = null;
      
      console.log('🗝️ El monje se prepara para el ritual de entrada...');
      
      const result = await this.playwrightService.runAutomation();
      
      this.status.currentStep = 'Automatización completada';
      this.status.isRunning = false;
      
      return result;
      
    } catch (error) {
      this.status.isRunning = false;
      this.status.error = error instanceof Error ? error.message : 'Error desconocido';
      
      console.log('❌ El ritual ha fallado, el monje no pudo entrar a la cripta');
      throw error;
    }
  }

  async getStatus(): Promise<AutomationStatus> {
    return this.status;
  }

  async getBrowserStatus(): Promise<any> {
    try {
      return await this.playwrightService.getStatus();
    } catch (error) {
      throw error;
    }
  }

  async processSpecificCentury(century: string): Promise<any> {
    try {
      this.status.currentStep = `Procesando siglo ${century}...`;
      this.status.error = null;
      
      console.log(`📜 El monje se prepara para procesar el siglo ${century}...`);
      
      const result = await this.playwrightService.processSpecificCentury(century);
      
      this.status.currentStep = `Siglo ${century} procesado`;
      this.status.isRunning = false;
      
      return result;
      
    } catch (error) {
      this.status.isRunning = false;
      this.status.error = error instanceof Error ? error.message : 'Error desconocido';
      
      console.log(`❌ Error procesando el siglo ${century}`);
      throw error;
    }
  }

  async runCompleteFlow(): Promise<any> {
    try {
      this.status.currentStep = 'Ejecutando flujo completo...';
      this.status.error = null;
      
      console.log('🔄 El monje inicia el ritual completo de los primeros 3 tomos...');
      
      const result = await this.playwrightService.runCompleteFlow();
      
      this.status.currentStep = 'Flujo completo completado';
      this.status.isRunning = false;
      
      return result;
      
    } catch (error) {
      this.status.isRunning = false;
      this.status.error = error instanceof Error ? error.message : 'Error desconocido';
      
      console.log('❌ El ritual completo ha fallado');
      throw error;
    }
  }

  async navigateToPage(pageNumber: number): Promise<any> {
    try {
      console.log(`📄 Navegando a la página ${pageNumber}...`);
      
      const result = await this.playwrightService.navigateToPage(pageNumber);
      
      return result;
    } catch (error) {
      console.error('❌ Error navegando a página:', error);
      throw error;
    }
  }

  async processSpecialCentury(century: string): Promise<any> {
    try {
      console.log(`🔮 Procesando siglo especial: ${century}`);
      
      const result = await this.playwrightService.processSpecialCentury(century);
      
      return result;
    } catch (error) {
      console.error(`❌ Error procesando siglo especial ${century}:`, error);
      throw error;
    }
  }

} 