import { InventarioProducto, ProductosCodificacion } from '../models/index_models.js';

export const listarInventarios = async () => {
	const lista = await InventarioProducto.findAll({ order: [['fecha_creacion', 'DESC']] });
	return lista.map(i => i.toJSON());
};

export const obtenerInventarioPorId = async (id) => {
	const inv = await InventarioProducto.findByPk(id);
	return inv ? inv.toJSON() : null;
};

export const crearInventario = async (datos) => {
	// validar codigo_producto
	if (!datos.codigo_producto) throw new Error('CODIGO_REQUERIDO');
	const producto = await ProductosCodificacion.findOne({ where: { codigo_producto: datos.codigo_producto } });
	if (!producto) throw new Error('CODIGO_NO_EXISTE');

	const creado = await InventarioProducto.create({
		codigo_producto: datos.codigo_producto,
		cantidad_disponible: datos.cantidad_disponible ?? 0,
		ubicacion: datos.ubicacion || null,
		fecha_entrada: datos.fecha_entrada || null,
		estado: datos.estado || 'activo',
		notas: datos.notas || null
	});
	return creado.toJSON();
};

export const actualizarInventario = async (id, cambios) => {
	const inv = await InventarioProducto.findByPk(id);
	if (!inv) throw new Error('INVENTARIO_NO_ENCONTRADO');

	if (cambios.codigo_producto) {
		const producto = await ProductosCodificacion.findOne({ where: { codigo_producto: cambios.codigo_producto } });
		if (!producto) throw new Error('CODIGO_NO_EXISTE');
	}

	await inv.update(cambios);
	return inv.toJSON();
};

export const eliminarInventario = async (id) => {
	const inv = await InventarioProducto.findByPk(id);
	if (!inv) throw new Error('INVENTARIO_NO_ENCONTRADO');
	await inv.destroy();
	return { id_inventario: id, message: 'Inventario eliminado' };
};

