const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
   const { username, password, role }= req.body;
   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
         'INSERT INTO users (username, password, role) VALUES ( ?, ?, ?) ',
         [username, hashedPassword, role || 'admin']
      );
      res.status(201).json({message: 'User created successfully' });
   } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
         return res.status(400).json({ error: "Username already exists" });
      }
      res.status(500).json({error: error.message });
   }
});

//LOGIN
router.post('/login', async (req, res) => {
   const {username, password} = req.body;
   try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
         return res.status(401).json({ error: 'Invalid credentials'});
      };
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ error: 'Invalid credentials'});
      };
      const token = jwt.sign(
         { id: user.id, username: user.username, role: user.role },
         process.env.JWT_SECRET,
         { expiresIn: '8h'}
      )
      res.json({ token, username: user.username, role: user.role});
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;