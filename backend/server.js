import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';
import { verifyEnvironment } from './src/utils/envCheck.js';
import { loggerMiddleware } from './src/middleware/logger.middleware.js';

verifyEnvironment();
const PORT = config.port;

app.use(loggerMiddleware);

connectDatabase();

app.listen(PORT, () => {
  console.log(`✅ SnapPass AI backend running on http://localhost:${PORT}`);
});