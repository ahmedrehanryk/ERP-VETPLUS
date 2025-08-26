import { pool } from '../db.js';

export function makeCrud(table, pk='id') {
  return {
    async list(req, res) {
      const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY ${pk} DESC LIMIT 500`);
      res.json(rows);
    },
    async get(req, res) {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${pk} = ?`, [req.params.id]);
      res.json(rows[0] || null);
    },
    async create(req, res) {
      const [r] = await pool.query(`INSERT INTO ${table} SET ?`, [req.body]);
      res.json({ [pk]: r.insertId, ...req.body });
    },
    async update(req, res) {
      await pool.query(`UPDATE ${table} SET ? WHERE ${pk} = ?`, [req.body, req.params.id]);
      res.json({ [pk]: Number(req.params.id), ...req.body });
    },
    async remove(req, res) {
      await pool.query(`DELETE FROM ${table} WHERE ${pk} = ?`, [req.params.id]);
      res.json({ ok: true });
    },
  };
}
