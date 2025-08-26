import { Router } from 'express';
import { pool } from '../db.js';
const r = Router();

r.get('/stock', async (req,res)=>{
  // current stock per item (sum of movements)
  const [rows] = await pool.query('SELECT i.id, i.name, COALESCE(SUM(m.qty),0) as stock FROM items i LEFT JOIN inventory_movements m ON m.item_id=i.id GROUP BY i.id, i.name ORDER BY i.name');
  res.json(rows);
});

r.get('/sales-by-city', async (req,res)=>{
  const [rows] = await pool.query('SELECT city, SUM(total) as sales FROM sales_invoices GROUP BY city ORDER BY sales DESC');
  res.json(rows);
});

r.get('/profit-loss', async (req,res)=>{
  // Simplified P&L: sales - purchases - expenses (not GAAP)
  const [[{sales}]] = await pool.query('SELECT COALESCE(SUM(total),0) as sales FROM sales_invoices');
  const [[{purchases}]] = await pool.query('SELECT COALESCE(SUM(qty*price),0) as purchases FROM purchase_order_items');
  const [[{expenses}]] = await pool.query('SELECT COALESCE(SUM(amount),0) as expenses FROM expenses');
  res.json({ sales, purchases, expenses, profit: sales - purchases - expenses });
});

export default r;
