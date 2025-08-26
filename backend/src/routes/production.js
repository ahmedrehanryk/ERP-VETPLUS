import { Router } from 'express';
import { pool } from '../db.js';
const r = Router();

// Create a Work Order from a BOM
r.post('/work-orders', async (req,res)=>{
  const { bom_id, quantity, warehouse_id } = req.body;
  const [bomRows] = await pool.query('SELECT * FROM bom WHERE id=?',[bom_id]);
  if (!bomRows[0]) return res.status(400).json({error:'Invalid BOM'});
  const [wo] = await pool.query('INSERT INTO work_orders (bom_id, quantity, warehouse_id, status) VALUES (?,?,?,?)',[bom_id, quantity, warehouse_id||1, 'OPEN']);
  res.json({ id: wo.insertId });
});

// Complete a Work Order: consume inputs (negative) & produce output (positive)
r.post('/work-orders/:id/complete', async (req,res)=>{
  const woId = req.params.id;
  const [woRows] = await pool.query('SELECT * FROM work_orders WHERE id=?',[woId]);
  if (!woRows[0]) return res.status(404).json({error:'WO not found'});
  const [bomItems] = await pool.query('SELECT * FROM bom_items WHERE bom_id=?',[woRows[0].bom_id]);
  // consume inputs
  for (const bi of bomItems) {
    await pool.query('INSERT INTO inventory_movements (item_id, warehouse_id, qty, cost, reason, ref_type, ref_id) VALUES (?,?,?,?,?,?,?)',
      [bi.item_id, woRows[0].warehouse_id, -Math.abs(bi.qty * woRows[0].quantity), 0, 'Production Consume', 'WO', woId]);
  }
  // produce output
  const [bom] = await pool.query('SELECT * FROM bom WHERE id=?',[woRows[0].bom_id]);
  await pool.query('INSERT INTO inventory_movements (item_id, warehouse_id, qty, cost, reason, ref_type, ref_id) VALUES (?,?,?,?,?,?,?)',
    [bom[0].output_item_id, woRows[0].warehouse_id, Math.abs(bom[0].output_qty * woRows[0].quantity), 0, 'Production Output', 'WO', woId]);
  await pool.query('UPDATE work_orders SET status=? WHERE id=?',['COMPLETED', woId]);
  res.json({ ok: true });
});

export default r;
