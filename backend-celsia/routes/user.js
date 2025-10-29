import express from 'express';
import { registerUser, getUsers,updateUser,deleteUser } from '../controllers/userController.js';
import { verifyToken, isAdmin, isSelfOrAdmin } from '../middlewares/verifyToken.js';


const router = express.Router();

router.post('/register', registerUser);
router.get('/list', getUsers);

// Actualizar: requiere ser admin o ser el mismo usuario
router.put('/:id', verifyToken, isSelfOrAdmin, updateUser);

// Eliminar: sólo admin
router.delete('/:id', verifyToken, isAdmin, deleteUser);
export default router;
