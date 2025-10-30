import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import bcrypt from 'bcryptjs';
import userRoutes from './routes/user.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// 🔹 Array temporal para almacenar los usuarios registrados
const usuarios = [];
const port = process.env.PORT || 80;


app.get('/', (req, res) => {
    res.send('Hello World\nWelcome to Seenode!');
});

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    // Validar campos
    if (!usuario || !contraseña) {
      return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(u => u.usuario === usuario);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    // Guardar el usuario
    usuarios.push({
      usuario,
      contraseña: contraseñaEncriptada,
    });

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
