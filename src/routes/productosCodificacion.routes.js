import express from 'express';
import * as productosController from '../controllers/productosCodificacionController.js';

const router = express.Router();

// CRUD productos codificación
router.post('/crear', productosController.crearProducto);
router.get('/listar', productosController.listarProductos);
// Obtener por id
router.get('/obtenerPorID/:id', productosController.obtenerProducto);
router.put('/actualizar/:id', productosController.actualizarProducto);
router.patch('/cambiarEstado/:id', productosController.cambiarEstadoProducto);
router.delete('/eliminar/:id', productosController.eliminarProducto);

export default router;

