import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ msg: 'Correo y contraseña son requeridos' });

    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ msg: 'Contraseña incorrecta' });

    // incluir rol en el token
    const payload = { id: user.id, correo: user.correo, rol: user.rol };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' });

    res.json({
      msg: 'Login exitoso',
      token,
      usuario: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el login', error: error.message });
  }
};
