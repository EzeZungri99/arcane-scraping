// Tipos para automatización
export interface AutomationStatus {
  isRunning: boolean;
  currentStep: string;
  error: string | null;
}

export interface AutomationResult {
  success: boolean;
  message: string;
  data?: any;
} 