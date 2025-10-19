import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Token requerido' });

  const token = auth.split(' ')[1];
  const secret = config.jwtSecret ?? process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: 'Configuración de servidor incompleta' });

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};