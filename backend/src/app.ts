import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import callRouter from './routes/call.routes';
import leadRouter from './routes/lead.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/call', callRouter);
app.use('/api/lead', leadRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

if (require.main === module) {
  const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
