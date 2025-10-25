import express from 'express';
import * as usuariosController from '../controllers/usuariosController.js';

const router = express.Router();

// Rutas públicas para usuarios (sin autenticación)
router.post('/register', usuariosController.crearUsuario);

export default router;
