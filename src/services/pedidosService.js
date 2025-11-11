import sequelize from '../config/database.js';
import { Pedido, DetallePedido, ProductosCodificacion } from '../models/index_models.js';

export const crearPedido = async (datos) => {
  const { id_cliente, id_cliente_final = null, creado_por = null, detalles = [], notas = null } = datos;

  if (!id_cliente) throw new Error('ID_CLIENTE_REQUERIDO');
  if (!Array.isArray(detalles) || detalles.length === 0) throw new Error('DETALLES_REQUERIDOS');

  return await sequelize.transaction(async (t) => {
    // calcular subtotales y total
    let totalEstimado = 0;
    const detallesParaCrear = detalles.map(d => {
      const cantidad = Number(d.cantidad || 0);
      const precio = Number(d.precio_unitario || 0);
      const subtotal = Number((cantidad * precio).toFixed(2));
      totalEstimado += subtotal;
      return {
        id_producto: d.id_producto,
        cantidad,
        precio_unitario: precio,
        subtotal,
        notas: d.notas || null
      };
    });

    // Validar que los productos referenciados existan
    const productIds = [...new Set(detallesParaCrear.map(d => d.id_producto).filter(Boolean))];
    if (productIds.length === 0) {
      throw new Error('PRODUCTOS_NO_PROVIDED');
    }
    const productosExistentes = await ProductosCodificacion.findAll({ where: { id_producto: productIds }, transaction: t });
    const existIds = productosExistentes.map(p => p.id_producto);
    const missing = productIds.filter(id => !existIds.includes(id));
    if (missing.length > 0) {
      throw new Error(`PRODUCTOS_NO_ENCONTRADOS: ${missing.join(',')}`);
    }

    const pedido = await Pedido.create({
      id_cliente,
      id_cliente_final,
      creado_por,
      notas,
      total_estimado: totalEstimado
    }, { transaction: t });

    // asociar id_pedido a cada detalle y crear en lote
    const detallesConPedido = detallesParaCrear.map(d => ({ ...d, id_pedido: pedido.id_pedido }));
    await DetallePedido.bulkCreate(detallesConPedido, { transaction: t });

    // devolver pedido con detalles recien creados
    const pedidoConDetalles = await Pedido.findByPk(pedido.id_pedido, {
      include: [{ model: DetallePedido, as: 'detalles' }],
      transaction: t
    });
    return pedidoConDetalles;
  });
};

export const listarTodosPedidos = async () => {
  const rows = await Pedido.findAll({
    order: [['fecha_creacion', 'DESC']],
    include: [{ model: DetallePedido, as: 'detalles' }]
  });
  return rows.map(r => r.toJSON());
};

export const obtenerPorId = async (id) => {
  const pedido = await Pedido.findByPk(id, { include: [{ model: DetallePedido, as: 'detalles' }] });
  return pedido ? pedido.toJSON() : null;
};

export const actualizarEstado = async (id, nuevoEstado) => {
  const p = await Pedido.findByPk(id);
  if (!p) throw new Error('PEDIDO_NO_ENCONTRADO');
  p.estado = nuevoEstado;
  await p.save();
  return p.toJSON();
};
