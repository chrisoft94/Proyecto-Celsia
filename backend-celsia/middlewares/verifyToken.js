import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(403).json({ msg: 'Token requerido' });

  const token = header.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Token inválido o expirado' });
    req.user = decoded;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') return res.status(403).json({ msg: 'Requiere rol admin' });
  next();
};

// Permite acción si es admin o si el id en token coincide con el id objetivo
export const isSelfOrAdmin = (req, res, next) => {
  const targetId = Number(req.params.id);
  if (req.user?.rol === 'admin' || req.user?.id === targetId) return next();
  return res.status(403).json({ msg: 'No autorizado' });
};