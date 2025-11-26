import * as productosService from '../services/productosCodificacionService.js';

export const crearProducto = async (req, res, next) => {
	try {
		const creado = await productosService.crear(req.body);
		res.status(201).json(creado);
	} catch (err) {
		if (err.message === 'CAMPOS_FALTANTES') {
			return res.status(400).json({ message: 'Faltan campos requeridos' });
		}
		if (err.message === 'PRODUCTO_EXISTE') {
			return res.status(409).json({ message: 'Producto ya existe' });
		}
		if (err.message === 'CODIGO_DUPLICADO') {
			return res.status(409).json({ message: 'Código de producto ya existe' });
		}
		next(err);
	}
};

export const listarProductos = async (req, res, next) => {
	try {
		const productos = await productosService.listarTodosProductos();
		res.json({ total: productos.length, productos });
	} catch (err) {
		next(err);
	}
};

export const obtenerProducto = async (req, res, next) => {
	try {
		const producto = await productosService.obtenerPorId(req.params.id);
		if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
		res.json(producto);
	} catch (err) {
		next(err);
	}
};

export const actualizarProducto = async (req, res, next) => {
	try {
		const actualizado = await productosService.actualizar(req.params.id, req.body);
		res.json(actualizado);
	} catch (err) {
		if (err.message === 'PRODUCTO_NO_ENCONTRADO') {
			return res.status(404).json({ message: 'Producto no encontrado' });
		}
		if (err.message === 'PRODUCTO_EXISTE') {
			return res.status(409).json({ message: 'Producto con esos datos ya existe' });
		}
		next(err);
	}
};

export const cambiarEstadoProducto = async (req, res, next) => {
	try {
		const nuevoEstado = req.query.estado || req.body.estado;
		if (nuevoEstado === undefined) return res.status(400).json({ message: 'Se requiere el nuevo estado' });
		const actualizado = await productosService.cambiarEstado(req.params.id, nuevoEstado);
		res.json(actualizado);
	} catch (err) {
		if (err.message === 'PRODUCTO_NO_ENCONTRADO') {
			return res.status(404).json({ message: 'Producto no encontrado' });
		}
		next(err);
	}
};

export const eliminarProducto = async (req, res, next) => {
	try {
		const resultado = await productosService.eliminar(req.params.id);
		res.json(resultado);
	} catch (err) {
		if (err.message === 'PRODUCTO_NO_ENCONTRADO') {
			return res.status(404).json({ message: 'Producto no encontrado' });
		}
		next(err);
	}
};

