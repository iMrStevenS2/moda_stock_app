import express from 'express';
import * as clientesController from '../controllers/clientesController.js';

const router = express.Router();

// Rutas sin parámetros primero
router.post('/crear', clientesController.crearCliente);
router.get('/listar', clientesController.listarClientes);
router.get('/buscarCliente', clientesController.buscarClientes);

// Rutas con parámetros después id para indicar lo que se busca
router.get('/obtenerPorID/:id', clientesController.obtenerClientePorID);
router.put('/actualizar/:id', clientesController.actualizarCliente);
router.patch('/:id/cambiarEstado', clientesController.cambiarEstadoCliente);
router.delete('/:id', clientesController.eliminarCliente);// no se implementara aun

export default router;