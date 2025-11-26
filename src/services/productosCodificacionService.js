import { Op } from 'sequelize';
import { ProductosCodificacion } from '../models/index_models.js';

export const listarTodosProductos = async () => {
	const productos = await ProductosCodificacion.findAll({
		order: [['fecha_creacion', 'DESC']]
	});
	return productos.map(p => p.toJSON());
};

export const obtenerPorId = async (id) => {
	const producto = await ProductosCodificacion.findByPk(id);
	return producto ? producto.toJSON() : null;
};

export const crear = async (datos) => {
	// codigo_producto es obligatorio para la codificación de productos
	const requeridos = ['codigo_producto', 'nombre_producto', 'tipo_producto', 'precio_unitario'];
	const faltantes = [];
	requeridos.forEach(c => {
		if (datos[c] === undefined || datos[c] === null || datos[c] === '') faltantes.push(c);
	});
	if (faltantes.length > 0) throw new Error('CAMPOS_FALTANTES');

	// Nota: la unicidad se controla por `codigo_producto`.
	// Permitimos productos con mismo nombre/tipo/talla/color siempre que el código sea distinto.

	// Verificar codigo_producto provisto y no duplicado
	const porCodigo = await ProductosCodificacion.findOne({ where: { codigo_producto: datos.codigo_producto } });
	if (porCodigo) throw new Error('CODIGO_DUPLICADO');

	const creado = await ProductosCodificacion.create({
		codigo_producto: datos.codigo_producto,
		nombre_producto: datos.nombre_producto,
		tipo_producto: datos.tipo_producto,
		talla: datos.talla,
		color: datos.color,
		genero: datos.genero,
		material: datos.material,
		precio_unitario: datos.precio_unitario,
		estado: datos.estado || 'activo',
		notas: datos.notas
	});

	return creado.toJSON();
};

export const actualizar = async (id, cambios) => {
	const producto = await ProductosCodificacion.findByPk(id);
	if (!producto) throw new Error('PRODUCTO_NO_ENCONTRADO');

	// Nota: permitimos duplicar nombre/tipo/talla/color; la unicidad se controla por codigo_producto

	// Si se intenta cambiar el codigo_producto, verificar unicidad
	if (cambios.codigo_producto && cambios.codigo_producto !== producto.codigo_producto) {
		const porCodigo = await ProductosCodificacion.findOne({ where: { codigo_producto: cambios.codigo_producto, id_producto: { [Op.ne]: id } } });
		if (porCodigo) throw new Error('CODIGO_DUPLICADO');
	}

	await producto.update(cambios);
	return producto.toJSON();
};

export const cambiarEstado = async (id, nuevoEstado) => {
	const producto = await ProductosCodificacion.findByPk(id);
	if (!producto) throw new Error('PRODUCTO_NO_ENCONTRADO');

	await producto.update({ estado: nuevoEstado });
	return producto.toJSON();
};

export const eliminar = async (id) => {
	const producto = await ProductosCodificacion.findByPk(id);
	if (!producto) throw new Error('PRODUCTO_NO_ENCONTRADO');

	await producto.destroy();
	return { id, message: 'Producto eliminado exitosamente' };
};

