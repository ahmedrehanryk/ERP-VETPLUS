import { Router } from 'express';
import { pool } from '../db.js';
const r = Router();

r.post('/', async (req,res)=>{
  const { name, output_item_id, output_qty, lines } = req.body; // lines: [{item_id, qty_percent or qty}]
  const [r1] = await pool.query('INSERT INTO bom (name, output_item_id, output_qty) VALUES (?,?,?)',[name, output_item_id, output_qty]);
  const bomId = r1.insertId;
  for (const ln of (lines||[])) {
    await pool.query('INSERT INTO bom_items (bom_id, item_id, qty) VALUES (?,?,?)',[bomId, ln.item_id, ln.qty]);
  }
  res.json({ id: bomId });
});

r.get('/', async (req,res)=>{
  const [rows] = await pool.query('SELECT * FROM bom ORDER BY id DESC LIMIT 200');
  res.json(rows);
});

export default r;
