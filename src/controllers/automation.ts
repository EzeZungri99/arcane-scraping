// Controlador de automatización
import { Request, Response } from 'express';
import { AutomationService } from '../services/automation';
import { PlaywrightService } from '../services/playwright/playwrightService';

export class AutomationController {
  private automationService: AutomationService;
  private playwrightService: PlaywrightService;

  constructor() {
    this.automationService = new AutomationService();
    this.playwrightService = new PlaywrightService();
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

  async filterByCentury(req: Request, res: Response): Promise<void> {
    try {
      const { century } = req.params;
      if (!century) {
        res.status(400).json({
          success: false,
          error: 'Siglo no especificado'
        });
        return;
      }
      
      const result = await this.playwrightService.filterByCentury(century);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async downloadPDF(req: Request, res: Response): Promise<void> {
    try {
      const { century } = req.params;
      if (!century) {
        res.status(400).json({
          success: false,
          error: 'Siglo no especificado'
        });
        return;
      }
      
      const result = await this.playwrightService.downloadPDF(century);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async unlockCentury(req: Request, res: Response): Promise<void> {
    try {
      const { code, century } = req.body;
      if (!code) {
        res.status(400).json({
          success: false,
          error: 'Código no especificado'
        });
        return;
      }
      
      if (!century) {
        res.status(400).json({
          success: false,
          error: 'Siglo no especificado'
        });
        return;
      }
      
      const result = await this.playwrightService.unlockCentury(century, code);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async extractCodeFromPDF(req: Request, res: Response): Promise<void> {
    try {
      const { century } = req.params;
      if (!century) {
        res.status(400).json({
          success: false,
          error: 'Siglo no especificado'
        });
        return;
      }
      
      const result = await this.playwrightService.extractCodeFromPDF(century);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async processSpecificCentury(req: Request, res: Response): Promise<void> {
    try {
      const { century } = req.params;
      if (!century) {
        res.status(400).json({
          success: false,
          error: 'Siglo no especificado'
        });
        return;
      }
      
      const result = await this.automationService.processSpecificCentury(century);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async runCompleteFlow(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.automationService.runCompleteFlow();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

} 