import * as provService from '../services/insumosProveedorService.js';

export const crearVinculo = async (req, res, next) => {
  try {
    const creado = await provService.crearVinculo(req.body);
    res.status(201).json(creado);
  } catch (err) {
    if (err.message === 'CAMPOS_FALTANTES') return res.status(400).json({ message: 'Faltan campos requeridos' });
    if (err.message === 'INSUMO_NO_ENCONTRADO' || err.message === 'PROVEEDOR_NO_ENCONTRADO') return res.status(404).json({ message: err.message });
    next(err);
  }
};

export const listarVinculos = async (req, res, next) => {
  try {
    const rows = await provService.listarVinculos();
    res.json({ total: rows.length, vinculos: rows });
  } catch (err) {
    next(err);
  }
};

export const obtenerVinculo = async (req, res, next) => {
  try {
    const v = await provService.obtenerVinculoPorId(req.params.id);
    if (!v) return res.status(404).json({ message: 'Vínculo no encontrado' });
    res.json(v);
  } catch (err) {
    next(err);
  }
};

export const actualizarVinculo = async (req, res, next) => {
  try {
    const actualizado = await provService.actualizarVinculo(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'VINCULO_NO_ENCONTRADO') return res.status(404).json({ message: 'Vínculo no encontrado' });
    next(err);
  }
};

export const cambiarEstadoVinculo = async (req, res, next) => {
  try {
    const nuevoEstado = req.query.estado || req.body.estado;
    if (nuevoEstado === undefined) return res.status(400).json({ message: 'Se requiere el nuevo estado' });
    const actualizado = await provService.cambiarEstadoVinculo(req.params.id, nuevoEstado);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'VINCULO_NO_ENCONTRADO') return res.status(404).json({ message: 'Vínculo no encontrado' });
    next(err);
  }
};

export const eliminarVinculo = async (req, res, next) => {
  try {
    const resultado = await provService.eliminarVinculo(req.params.id);
    res.json(resultado);
  } catch (err) {
    if (err.message === 'VINCULO_NO_ENCONTRADO') return res.status(404).json({ message: 'Vínculo no encontrado' });
    next(err);
  }
};
