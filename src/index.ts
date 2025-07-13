import express from 'express';
import { automationRoutes } from './routes/automation';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/automation', automationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api/automation`);
}); 