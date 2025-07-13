import { Router } from 'express';
import { AutomationController } from '../controllers/automation';

const router: Router = Router();
const automationController = new AutomationController();

router.post('/login', (req, res) => automationController.startAutomation(req, res));
router.get('/status', (req, res) => automationController.getStatus(req, res));
router.get('/browser-status', (req, res) => automationController.getBrowserStatus(req, res));
router.post('/filter/:century', (req, res) => automationController.filterByCentury(req, res));
router.post('/download/:century', (req, res) => automationController.downloadPDF(req, res));
router.post('/unlock', (req, res) => automationController.unlockCentury(req, res));
router.post('/extract/:century', (req, res) => automationController.extractCodeFromPDF(req, res));
router.post('/process-century/:century', (req, res) => automationController.processSpecificCentury(req, res));
router.post('/process-special-century', (req, res) => automationController.processSpecialCentury(req, res));
router.post('/navigate/:pageNumber', (req, res) => automationController.navigateToPage(req, res));
router.post('/start', (req, res) => automationController.runCompleteFlow(req, res));

export { router as automationRoutes }; 