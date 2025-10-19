import express from 'express';
import usuariosRoutes from './usuarios.routes.js';
//import clientesRoutes from './clientes.routes.js';
//import proveedoresRoutes from './proveedores.routes.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Montar sub-rutas con autenticación
router.use('/usuarios', verifyToken, usuariosRoutes);
//router.use('/clientes', verifyToken, clientesRoutes);
//router.use('/proveedores', verifyToken, proveedoresRoutes);

export default router;