import { Router } from 'express';
import { pool } from '../db.js';
const r = Router();

r.post('/invoice', async (req,res)=>{
  const { customer_id, city, invoice_date, items } = req.body; // items: [{item_id, qty, price}]
  const [inv] = await pool.query('INSERT INTO sales_invoices (customer_id, city, invoice_date) VALUES (?,?,?)',[customer_id, city || '', invoice_date]);
  const invoiceId = inv.insertId;
  let total = 0;
  for (const it of (items||[])) {
    total += (it.qty * it.price);
    await pool.query('INSERT INTO sales_invoice_items (sales_invoice_id,item_id,qty,price) VALUES (?,?,?,?)',
      [invoiceId, it.item_id, it.qty, it.price]);
    await pool.query('INSERT INTO inventory_movements (item_id, warehouse_id, qty, cost, reason, ref_type, ref_id) VALUES (?,?,?,?,?,?,?)',
      [it.item_id, it.warehouse_id || 1, -Math.abs(it.qty), it.price, 'Sale', 'INV', invoiceId]);
  }
  await pool.query('UPDATE sales_invoices SET total = ? WHERE id=?',[total, invoiceId]);
  res.json({ id: invoiceId, total });
});

r.get('/invoices', async (req,res)=>{
  const [rows] = await pool.query('SELECT * FROM sales_invoices ORDER BY id DESC LIMIT 500');
  res.json(rows);
});

export default r;
