import * as pedidosService from '../services/pedidosService.js';

export const crearPedido = async (req, res, next) => {
  try {
    const datos = req.body;
    const pedido = await pedidosService.crearPedido(datos);
    return res.status(201).json(pedido);
  } catch (err) {
    if (err.message === 'ID_CLIENTE_REQUERIDO' || err.message === 'DETALLES_REQUERIDOS') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const listarPedidos = async (req, res, next) => {
  try {
    const pedidos = await pedidosService.listarTodosPedidos();
    res.json({ total: pedidos.length, pedidos });
  } catch (err) {
    next(err);
  }
};

export const obtenerPedido = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pedido = await pedidosService.obtenerPorId(id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    next(err);
  }
};

export const cambiarEstadoPedido = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { estado } = req.body ?? req.query ?? {};
    if (!estado) return res.status(400).json({ message: 'estado es requerido' });
    const actualizado = await pedidosService.actualizarEstado(id, estado);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'PEDIDO_NO_ENCONTRADO') return res.status(404).json({ message: 'Pedido no encontrado' });
    next(err);
  }
};
