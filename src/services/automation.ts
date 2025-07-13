import { PlaywrightService } from './playwright/playwrightService';
import { AutomationStatus } from '../types/automation';

export class AutomationService {
  private playwrightService: PlaywrightService;
  private status: AutomationStatus;

  constructor() {
    this.playwrightService = new PlaywrightService();
    this.status = {
      isRunning: false,
      currentStep: '',
      error: null
    };
  }

  async startAutomation(): Promise<any> {
    try {
      this.status.isRunning = true;
      this.status.currentStep = 'Iniciando automatización...';
      this.status.error = null;
      
      console.log('🗝️ El monje se prepara para el ritual de entrada...');
      
      const result = await this.playwrightService.runAutomation();
      
      this.status.isRunning = false;
      this.status.currentStep = 'Automatización completada';
      
      return result;
    } catch (error) {
      this.status.isRunning = false;
      this.status.currentStep = 'Error en automatización';
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
      const playwrightStatus = this.playwrightService.getStatus();
      return {
        success: true,
        browserStatus: playwrightStatus,
        message: playwrightStatus.readyForNextStep 
          ? 'El monje está listo para continuar su aventura en la cripta' 
          : 'El monje aún no ha entrado a la cripta'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async processSpecificCentury(century: string): Promise<any> {
    try {
      this.status.isRunning = true;
      this.status.currentStep = `Procesando siglo ${century}...`;
      this.status.error = null;
      
      console.log(`📜 El monje se prepara para procesar el siglo ${century}...`);
      
      const result = await this.playwrightService.processSpecificCentury(century);
      
      this.status.isRunning = false;
      this.status.currentStep = `Siglo ${century} procesado`;
      
      return result;
    } catch (error) {
      this.status.isRunning = false;
      this.status.currentStep = `Error procesando siglo ${century}`;
      this.status.error = error instanceof Error ? error.message : 'Error desconocido';
      
      console.log(`❌ Error procesando el siglo ${century}`);
      throw error;
    }
  }

  async runCompleteFlow(): Promise<any> {
    try {
      this.status.isRunning = true;
      this.status.currentStep = 'Ejecutando flujo completo...';
      this.status.error = null;
      
      console.log('🔄 El monje inicia el ritual completo de los primeros 3 tomos...');
      
      const result = await this.playwrightService.runCompleteFlow();
      
      this.status.isRunning = false;
      this.status.currentStep = 'Flujo completo completado';
      
      return result;
    } catch (error) {
      this.status.isRunning = false;
      this.status.currentStep = 'Error en flujo completo';
      this.status.error = error instanceof Error ? error.message : 'Error desconocido';
      
      console.log('❌ El ritual completo ha fallado');
      throw error;
    }
  }

} 