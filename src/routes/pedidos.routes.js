import express from 'express';
import * as pedidosController from '../controllers/pedidosController.js';

const router = express.Router();

// Crear pedido con detalles: { id_cliente, id_cliente_final, creado_por, detalles: [ { id_producto, cantidad, precio_unitario, notas } ], notas }
router.post('/crear', pedidosController.crearPedido);
router.get('/listar', pedidosController.listarPedidos);
router.get('/obtener/:id', pedidosController.obtenerPedido);
router.patch('/:id/estado', pedidosController.cambiarEstadoPedido);

export default router;
