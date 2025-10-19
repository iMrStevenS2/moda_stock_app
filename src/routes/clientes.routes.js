import express from 'express';
import * as clientesController from '../controllers/clientesController.js';

const router = express.Router();

router.post('/', clientesController.crearCliente);
router.get('/', clientesController.listarClientes);
router.get('/:id', clientesController.obtenerCliente);
router.put('/:id', clientesController.actualizarCliente);
router.patch('/:id/estado', clientesController.cambiarEstado);

export default router;