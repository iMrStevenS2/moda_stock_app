import express from 'express';
import * as usuariosController from '../controllers/usuariosController.js';

const router = express.Router();

// Rutas sin parámetros primero
router.post('/', usuariosController.crearUsuario);
router.get('/', usuariosController.listarUsuarios);
router.get('/buscar', usuariosController.buscarUsuarios); // Ruta de búsqueda antes de /:id

// Rutas con parámetros después
router.get('/:id', usuariosController.obtenerUsuario);
router.put('/:id', usuariosController.actualizarUsuario);
router.patch('/:id/estado', usuariosController.cambiarEstado);

export default router;