const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => { 
try {
   const [rows] = await db.query('SELECT * FROM employee');
   res.json(rows);
} catch (error) {
   res.status(500).json({error: error.message})
}
});

//GET single employee
router.get('/:id', async (req, res) => {
   try {
      const [ rows ] = await db.query('SELECT * FROM employee WHERE id =?', [req.params.id]);
      if (rows.length == 0) return res.status(404).json({ error: 'EMPLOYEE not found'});
      res.json(rows[0]);
   } catch (error) {
      res.status(500).json({error: error.message});
   }
});

//POST create employee
router.post('/', async (req, res) => {
   const { name, email, role, status } = req.body;
   try {
      const [result] = await db.query(
         'INSERT INTO employee (name, email, role, status) VALUES (?,?,?,?)', [name, email, role, status]
      );
      res.status(201).json({ id: result.insertId, name, email, role, status});
   } catch (error) {
      res.status(500).json({ error: error.message});
   }
});

//PUT update employee
router.put('/:id', async(req, res) => {
   const  {name, email, role, status } = req.body;
   try {
      const [result] = await db.query(
         'UPDATE employee SET name=?, email=?, role=?, status=? WHERE id=?', [name,email, role, status, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({error: 'Employee not found'});
      res.json({ message: 'Employee updated'});
   } catch (error) {
      res.json({ error: error.message });
   }
});

//DELETE employee
router.delete('/:id', async(req, res) => {
   try {
      const [result] = await db.query('DELETE FROM employee WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Employee not found' });
      res.json({ message: 'Employee deleted' });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;