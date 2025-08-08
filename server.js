require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const pacientesRoutes = require('./routes/pacientes');
const citasRoutes = require('./routes/citas');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
  res.send('Backend del Dashboard funcionando!');
});
app.use('/api', dashboardRoutes);
app.use('/api', authRoutes);
app.use('/api', pacientesRoutes);
app.use('/api', citasRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
