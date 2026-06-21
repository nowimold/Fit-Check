import express from 'express';
import healthRouter from './routes/health.js';

function requireUserId(req, res) {
  const userId = req.get('x-user-id');
  if (!userId) {
    res.status(400).json({ error: 'Missing x-user-id header' });
    return null;
  }

  return userId;
}

export function createApp({ checklistService } = {}) {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ name: 'Fit Check API', status: 'ready' });
  });

  app.use('/health', healthRouter);

  app.get('/api/checklists/today', async (req, res, next) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) {
        return;
      }

      const result = await checklistService.getTodayChecklist(userId, req.query.date);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/encouragement', async (req, res, next) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) {
        return;
      }

      const result = await checklistService.getTodayChecklist(userId, req.query.date);
      res.json(result.encouragement);
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/checklists/items/:itemId', async (req, res, next) => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) {
        return;
      }

      const { itemId } = req.params;
      const { date, isDone, itemText } = req.body;
      const result = await checklistService.toggleChecklistItem(userId, itemId, date, Boolean(isDone), { itemText });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
  });

  return app;
}

export default createApp;
