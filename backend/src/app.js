import express from 'express';
import activityLogMiddleware from './middleware/activityLog.middleware.js';
import apiRouter from './routes/index.js';

const app = express();
app.use(express.json());
app.use(activityLogMiddleware);
app.use('/api', apiRouter);

export default app;
