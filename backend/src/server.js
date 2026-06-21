import { createApp } from './app.js';
import { createChecklistService } from './services/checklist-service.js';
import { createPostgresChecklistRepository } from './repositories/postgres-checklist-repository.js';

const port = Number(process.env.PORT || 3000);
const repository = createPostgresChecklistRepository();
const checklistService = createChecklistService(repository);
const app = createApp({ checklistService });

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
