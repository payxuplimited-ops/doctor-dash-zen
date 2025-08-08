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

// Endpoint para obtener todos los pacientes de un inquilino
router.get('/pacientes', authMiddleware, async (req, res) => {
  const { id_inquilino } = req.user;

  try {
    const pacientes = await pool.query('SELECT * FROM pacientes WHERE id_inquilino = $1', [id_inquilino]);
    res.status(200).json(pacientes.rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Endpoint para agregar un nuevo paciente
router.post('/pacientes', authMiddleware, async (req, res) => {
  const { id_inquilino } = req.user;
  const { nombre_completo, cedula, email } = req.body;

  try {
    const nuevoPaciente = await pool.query(
      'INSERT INTO pacientes (id_inquilino, nombre_completo, cedula, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_inquilino, nombre_completo, cedula, email]
    );
    res.status(201).json(nuevoPaciente.rows[0]);
  } catch (error) {
    console.error('Error al agregar paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Endpoint para actualizar un paciente
router.put('/pacientes/:id', authMiddleware, async (req, res) => {
  const { id_inquilino } = req.user;
  const { id } = req.params;
  const { nombre_completo, cedula, email } = req.body;

  try {
    const pacienteActualizado = await pool.query(
      'UPDATE pacientes SET nombre_completo = $1, cedula = $2, email = $3 WHERE id = $4 AND id_inquilino = $5 RETURNING *',
      [nombre_completo, cedula, email, id, id_inquilino]
    );

    if (pacienteActualizado.rowCount === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado o no autorizado' });
    }
    res.status(200).json(pacienteActualizado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Endpoint para eliminar un paciente
router.delete('/pacientes/:id', authMiddleware, async (req, res) => {
  const { id_inquilino } = req.user;
  const { id } = req.params;

  try {
    // Eliminar las citas asociadas al paciente
    await pool.query('DELETE FROM citas WHERE id_paciente = $1 AND id_inquilino = $2', [id, id_inquilino]);

    const pacienteEliminado = await pool.query('DELETE FROM pacientes WHERE id = $1 AND id_inquilino = $2 RETURNING *', [id, id_inquilino]);

    if (pacienteEliminado.rowCount === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado o no autorizado' });
    }
    res.status(200).json({ message: 'Paciente y citas asociadas eliminadas con éxito' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;