// Controlador de automatización
import { Request, Response } from 'express';
import { AutomationService } from '../services/automation';

export class AutomationController {
  private automationService: AutomationService;

  constructor() {
    this.automationService = new AutomationService();
  }

  async startAutomation(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.automationService.startAutomation();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await this.automationService.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getBrowserStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await this.automationService.getBrowserStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
} 