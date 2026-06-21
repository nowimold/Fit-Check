import express from 'express';
import healthRouter from './routes/health.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'Fit Check API', status: 'ready' });
});

app.use('/health', healthRouter);

export default app;
