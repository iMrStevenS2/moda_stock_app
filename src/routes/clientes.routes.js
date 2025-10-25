import express from 'express';
import * as clientesController from '../controllers/clientesController.js';

const router = express.Router();

// Rutas sin parámetros primero
router.post('/', clientesController.crearCliente);
router.get('/', clientesController.listarClientes);
router.get('/buscar', clientesController.buscarClientes); // Ruta de búsqueda antes de /:id

// Rutas con parámetros después
router.get('/:id', clientesController.obtenerCliente);
router.put('/:id', clientesController.actualizarCliente);
router.patch('/:id/estado', clientesController.cambiarEstadoCliente);
router.delete('/:id', clientesController.eliminarCliente);

export default router;