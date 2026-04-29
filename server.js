require('dotenv').config();
const express = require("express");
const db = require('./config/db');
const employeeRoutes = require('./routes/employees')

const app = express();

app.use(express.json());

app.use('/api/employees', employeeRoutes);

app.get("/", (req, res) => {
   res.send("Server running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});