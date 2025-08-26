import { Router } from 'express';
import { pool } from '../db.js';
const r = Router();

r.post('/tests', async (req,res)=>{
  const { name, parameter, unit, min_value, max_value } = req.body;
  const [ret] = await pool.query('INSERT INTO qc_tests (name, parameter, unit, min_value, max_value) VALUES (?,?,?,?,?)',[name, parameter, unit, min_value, max_value]);
  res.json({ id: ret.insertId });
});

r.post('/results', async (req,res)=>{
  const { item_id, batch_no, qc_test_id, value, tested_at, passed } = req.body;
  const [ret] = await pool.query('INSERT INTO qc_results (item_id,batch_no,qc_test_id,value,tested_at,passed) VALUES (?,?,?,?,?,?)',[item_id, batch_no, qc_test_id, value, tested_at, passed?1:0]);
  res.json({ id: ret.insertId });
});

r.get('/results', async (req,res)=>{
  const [rows] = await pool.query('SELECT * FROM qc_results ORDER BY id DESC LIMIT 200');
  res.json(rows);
});

export default r;
