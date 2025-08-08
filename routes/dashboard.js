const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Endpoint para el resumen del dashboard (protegido)
router.get('/dashboard/resumen', authMiddleware, async (req, res) => {
  const { id_inquilino, rol } = req.user;

  try {
    const citasHoy = await pool.query(
      `SELECT COUNT(*) FROM citas WHERE id_inquilino = $1 AND DATE(dia_y_hora) = CURRENT_DATE`,
      [id_inquilino]
    );

    const citasMes = await pool.query(
      `SELECT COUNT(*) FROM citas WHERE id_inquilino = $1 AND EXTRACT(MONTH FROM dia_y_hora) = EXTRACT(MONTH FROM CURRENT_DATE)`,
      [id_inquilino]
    );

    res.status(200).json({
      citasHoy: parseInt(citasHoy.rows[0].count),
      citasMes: parseInt(citasMes.rows[0].count)
    });

  } catch (error) {
    console.error('Error al obtener el resumen del dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;