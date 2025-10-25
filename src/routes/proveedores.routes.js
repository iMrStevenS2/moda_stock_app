import express from 'express';
import * as proveedoresController from '../controllers/proveedoresController.js';

const router = express.Router();

// Rutas sin parámetros primero
router.post('/', proveedoresController.crearProveedor);
router.get('/', proveedoresController.listarProveedores);
router.get('/buscar', proveedoresController.buscarProveedores); // Ruta de búsqueda antes de /:id

// Rutas con parámetros después
router.get('/:id', proveedoresController.obtenerProveedor);
router.put('/:id', proveedoresController.actualizarProveedor);
router.patch('/:id/estado', proveedoresController.cambiarEstadoProveedor);
router.delete('/:id', proveedoresController.eliminarProveedor);

export default router;
