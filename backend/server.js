import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';
import { verifyEnvironment } from './src/utils/envCheck.js';

verifyEnvironment();

const PORT = config.port;

connectDatabase()
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    console.error('Please ensure MongoDB is running and MONGO_URI is correct.');
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`SnapPass AI backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base: http://localhost:${PORT}/api`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
