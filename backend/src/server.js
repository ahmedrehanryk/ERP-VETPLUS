import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import vendorRoutes from './routes/vendors.js';
import customerRoutes from './routes/customers.js';
import purchaseRoutes from './routes/purchase.js';
import salesRoutes from './routes/sales.js';
import recipeRoutes from './routes/recipes.js';
import productionRoutes from './routes/production.js';
import qcRoutes from './routes/qc.js';
import reportRoutes from './routes/reports.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/qc', qcRoutes);
app.use('/api/reports', reportRoutes);

// Serve frontend (built) if present
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(distPath, 'index.html'));
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('API running on :' + port));
