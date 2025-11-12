import * as inventariosService from '../services/inventariosProductos.js';

export const listar = async (req, res, next) => {
	try {
		const lista = await inventariosService.listarInventarios();
		res.json({ total: lista.length, inventarios: lista });
	} catch (err) {
		next(err);
	}
};

export const obtener = async (req, res, next) => {
	try {
		const inv = await inventariosService.obtenerInventarioPorId(req.params.id);
		if (!inv) return res.status(404).json({ message: 'Inventario no encontrado' });
		res.json(inv);
	} catch (err) {
		next(err);
	}
};

export const crear = async (req, res, next) => {
	try {
		const creado = await inventariosService.crearInventario(req.body);
		res.status(201).json(creado);
	} catch (err) {
		if (err.message === 'CODIGO_REQUERIDO') return res.status(400).json({ message: 'Se requiere codigo_producto' });
		if (err.message === 'CODIGO_NO_EXISTE') return res.status(400).json({ message: 'El codigo_producto no existe' });
		next(err);
	}
};

export const actualizar = async (req, res, next) => {
	try {
		const actualizado = await inventariosService.actualizarInventario(req.params.id, req.body);
		res.json(actualizado);
	} catch (err) {
		if (err.message === 'INVENTARIO_NO_ENCONTRADO') return res.status(404).json({ message: 'Inventario no encontrado' });
		if (err.message === 'CODIGO_NO_EXISTE') return res.status(400).json({ message: 'El codigo_producto no existe' });
		next(err);
	}
};

export const eliminar = async (req, res, next) => {
	try {
		const resu = await inventariosService.eliminarInventario(req.params.id);
		res.json(resu);
	} catch (err) {
		if (err.message === 'INVENTARIO_NO_ENCONTRADO') return res.status(404).json({ message: 'Inventario no encontrado' });
		next(err);
	}
};

