// Importa las dependencias necesarias con la sintaxis de módulos ES6
import express from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Configura la conexión a tu base de datos PostgreSQL
// **¡IMPORTANTE! Reemplaza los placeholders con tus datos reales.**
const pool = new Pool({
  user: 'BushiA', 
  host: 'localhost',
  database: 'dashboard_db',
  password: 'Est43sl4cl4v3', 
  port: 5432,
});

// Middleware para verificar el token de autenticación
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó el token de autenticación.' });
  }

  try {
    const decoded = jwt.verify(token, 'WLii0VYe2ulKTqjAUk32CXpGXyeFE4DV'); // Reemplaza con tu clave secreta de JWT
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// Endpoint GET para obtener todas las citas
// Esta parte ha sido modificada para incluir el nombre del paciente
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        citas.id, 
        pacientes.nombre_paciente, 
        pacientes.apellido_paciente, 
        citas.dia_y_hora, 
        citas.estado 
      FROM citas 
      JOIN pacientes ON citas.id_paciente = pacientes.id;
    `);

    // Combina el nombre y el apellido para una mejor visualización en el frontend
    const citasConNombreCompleto = result.rows.map(cita => ({
      ...cita,
      paciente_nombre: `${cita.nombre_paciente} ${cita.apellido_paciente}`
    }));

    res.status(200).json(citasConNombreCompleto);
  } catch (error) {
    console.error('Error al obtener las citas:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Endpoint POST para crear una nueva cita
// Este endpoint inserta el 'id_paciente', no el nombre.
router.post('/', verifyToken, async (req, res) => {
  const { id_inquilino, id_paciente, dia_y_hora, estado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO citas (id_inquilino, id_paciente, dia_y_hora, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_inquilino, id_paciente, dia_y_hora, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear la cita:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

export default router;
