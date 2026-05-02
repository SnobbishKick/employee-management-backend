require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require('./config/db');
const employeeRoutes = require('./routes/employees')
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());

app.use(cors({
  origin: proccess.enev.CLIENT_URL || 'http://localhost:5173'
}))


app.use('/api/auth', authRoutes);
app.use('/api/employees', verifyToken, employeeRoutes)


app.get("/", (req, res) => {
   res.send("Server running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});