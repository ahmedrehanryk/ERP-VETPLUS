import { Router } from 'express';
import { pool } from '../db.js';
const r = Router();

// Purchase Orders
r.get('/orders', async (req,res)=>{
  const [rows] = await pool.query(`SELECT * FROM purchase_orders ORDER BY id DESC LIMIT 500`);
  res.json(rows);
});
r.post('/orders', async (req,res)=>{
  const { vendor_id, order_date, notes, items } = req.body; // items: [{item_id, qty, price}]
  const [r1] = await pool.query('INSERT INTO purchase_orders (vendor_id, order_date, notes, status) VALUES (?,?,?,?)',[vendor_id, order_date, notes || '', 'OPEN']);
  const poId = r1.insertId;
  for (const it of (items||[])) {
    await pool.query('INSERT INTO purchase_order_items (purchase_order_id,item_id,qty,price) VALUES (?,?,?,?)',[poId, it.item_id, it.qty, it.price]);
  }
  res.json({ id: poId });
});

// Goods Receipt - stock in
r.post('/grn', async (req,res)=>{
  const { purchase_order_id, received_date, items } = req.body;
  const [r1] = await pool.query('INSERT INTO goods_receipts (purchase_order_id, received_date) VALUES (?,?)',[purchase_order_id, received_date]);
  const grnId = r1.insertId;
  for (const it of (items||[])) {
    await pool.query('INSERT INTO inventory_movements (item_id, warehouse_id, qty, cost, reason, ref_type, ref_id) VALUES (?,?,?,?,?,?,?)',
      [it.item_id, it.warehouse_id || 1, it.qty, it.cost || it.price || 0, 'PO Receipt', 'GRN', grnId]);
  }
  await pool.query('UPDATE purchase_orders SET status=? WHERE id=?',['RECEIVED', purchase_order_id]);
  res.json({ id: grnId });
});

export default r;
