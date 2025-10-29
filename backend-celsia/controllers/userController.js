import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';


// Registro: por defecto rol = 'user' (no aceptamos rol desde registro público)
export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) return res.status(400).json({ msg: 'Todos los campos son requeridos' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol',
      [nombre, correo, hashedPassword, 'user']
    );
    res.json({ msg: 'Usuario registrado con éxito', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') return res.status(409).json({ msg: 'El correo ya está registrado' });
    res.status(500).json({ msg: 'Error al registrar usuario', error: error.message });
  }
};

// Listar: sólo accesible para usuarios autenticados (o admin si quieres)
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, correo, rol FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
};

// Actualizar: sólo admin puede cambiar rol; self puede actualizar nombre/correo
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;

    // Si intentan cambiar rol, verificar que el actor sea admin (req.user.rol)
    if (rol && req.user?.rol !== 'admin') {
      return res.status(403).json({ msg: 'Solo admin puede cambiar roles' });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (nombre) { fields.push(`nombre = $${idx++}`); values.push(nombre); }
    if (correo) { fields.push(`correo = $${idx++}`); values.push(correo); }
    if (rol) { fields.push(`rol = $${idx++}`); values.push(rol); }

    if (fields.length === 0) return res.status(400).json({ msg: 'Nada para actualizar' });

    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, nombre, correo, rol`;
    values.push(id);

    const result = await pool.query(query, values);
    if (result.rowCount === 0) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json({ msg: 'Usuario actualizado con éxito', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') return res.status(409).json({ msg: 'El correo ya está registrado' });
    res.status(500).json({ msg: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar: sólo admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id, nombre, correo, rol', [id]);
    if (result.rowCount === 0) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario eliminado con éxito', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar usuario', error: error.message });
  }
};

