import express from 'express';
import * as proveedoresController from '../controllers/proveedoresController.js';

const router = express.Router();

// Rutas sin parámetros primero
router.post('/crear', proveedoresController.crearProveedor);
router.get('/listar', proveedoresController.listarProveedores);
router.get('/buscarProveedor', proveedoresController.buscarProveedores); // Ruta de búsqueda antes de /:id

// Rutas con parámetros después
router.get('/obtenerPorID/:id', proveedoresController.obtenerProveedor);
router.put('/actualizar/:id', proveedoresController.actualizarProveedor);
router.patch('/cambiarEstado/:id', proveedoresController.cambiarEstadoProveedor);
router.delete('/eliminar/:id', proveedoresController.eliminarProveedor);

export default router;
