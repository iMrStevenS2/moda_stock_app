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
	const requeridos = ['nombre_producto', 'tipo_producto', 'precio_unitario'];
	const faltantes = [];
	requeridos.forEach(c => {
		if (datos[c] === undefined || datos[c] === null || datos[c] === '') faltantes.push(c);
	});
	if (faltantes.length > 0) throw new Error('CAMPOS_FALTANTES');

	// Evitar duplicados por nombre+tipo+talla+color
	const existente = await ProductosCodificacion.findOne({
		where: {
			nombre_producto: datos.nombre_producto,
			tipo_producto: datos.tipo_producto,
			talla: datos.talla || null,
			color: datos.color || null
		}
	});
	if (existente) throw new Error('PRODUCTO_EXISTE');

	const creado = await ProductosCodificacion.create({
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

	// Verificar que la nueva combinación no exista en otro registro
	if (cambios.nombre_producto || cambios.tipo_producto || cambios.talla || cambios.color) {
		const nombre = cambios.nombre_producto || producto.nombre_producto;
		const tipo = cambios.tipo_producto || producto.tipo_producto;
		const talla = cambios.talla || producto.talla;
		const color = cambios.color || producto.color;

		const existe = await ProductosCodificacion.findOne({
			where: {
				nombre_producto: nombre,
				tipo_producto: tipo,
				talla,
				color,
				id_producto: { [Op.ne]: id }
			}
		});
		if (existe) throw new Error('PRODUCTO_EXISTE');
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

