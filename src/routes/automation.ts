import { Router } from 'express';
import { AutomationController } from '../controllers/automation';

const router: Router = Router();
const automationController = new AutomationController();

router.post('/login', (req, res) => automationController.startAutomation(req, res));
router.get('/status', (req, res) => automationController.getStatus(req, res));
router.get('/browser-status', (req, res) => automationController.getBrowserStatus(req, res));
router.post('/filter/:century', (req, res) => automationController.filterByCentury(req, res));
router.post('/download/:century', (req, res) => automationController.downloadPDF(req, res));
router.post('/unlock/:century', (req, res) => automationController.unlockCentury(req, res));
router.post('/extract-code/:century', (req, res) => automationController.extractCodeFromPDF(req, res));
router.post('/process-century/:century', (req, res) => automationController.processSpecificCentury(req, res));
router.post('/run-full-automation', (req, res) => automationController.runCompleteFlow(req, res));

export { router as automationRoutes }; 