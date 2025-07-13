import { Router } from 'express';
import { AutomationController } from '../controllers/automation';

const router: Router = Router();
const automationController = new AutomationController();

router.post('/start', (req, res) => automationController.startAutomation(req, res));
router.get('/status', (req, res) => automationController.getStatus(req, res));
router.get('/browser-status', (req, res) => automationController.getBrowserStatus(req, res));

export { router as automationRoutes }; 