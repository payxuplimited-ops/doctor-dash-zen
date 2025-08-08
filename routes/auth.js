const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario en la base de datos por email
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 2. Comparar la contraseña encriptada
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Generar un JWT si las credenciales son correctas
    const token = jwt.sign(
      { id: user.id, rol: user.rol, id_inquilino: user.id_inquilino },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // 4. Devolver el token como respuesta
    res.status(200).json({ token, user: { id: user.id, rol: user.rol, id_inquilino: user.id_inquilino, email: user.email } });

  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
