import * as insumosService from '../services/insumosCatalogoService.js';

export const crearInsumo = async (req, res, next) => {
  try {
    const creado = await insumosService.crearInsumo(req.body);
    res.status(201).json(creado);
  } catch (err) {
    if (err.message === 'CAMPOS_FALTANTES') return res.status(400).json({ message: 'Faltan campos requeridos' });
    if (err.message === 'INSUMO_EXISTE') return res.status(409).json({ message: 'Código de insumo ya existe' });
    next(err);
  }
};

export const listarCatalogo = async (req, res, next) => {
  try {
    const rows = await insumosService.listarCatalogo();
    res.json({ total: rows.length, insumos: rows });
  } catch (err) {
    next(err);
  }
};

export const obtenerInsumo = async (req, res, next) => {
  try {
    const insumo = await insumosService.obtenerInsumoPorId(req.params.id);
    if (!insumo) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.json(insumo);
  } catch (err) {
    next(err);
  }
};

export const actualizarInsumo = async (req, res, next) => {
  try {
    const actualizado = await insumosService.actualizarInsumo(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'INSUMO_NO_ENCONTRADO') return res.status(404).json({ message: 'Insumo no encontrado' });
    if (err.message === 'INSUMO_EXISTE') return res.status(409).json({ message: 'Código de insumo ya existe' });
    next(err);
  }
};

export const cambiarEstadoInsumo = async (req, res, next) => {
  try {
    const nuevoEstado = req.query.estado || req.body.estado;
    if (nuevoEstado === undefined) return res.status(400).json({ message: 'Se requiere el nuevo estado' });
    const actualizado = await insumosService.cambiarEstadoInsumo(req.params.id, nuevoEstado);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'INSUMO_NO_ENCONTRADO') return res.status(404).json({ message: 'Insumo no encontrado' });
    next(err);
  }
};

export const eliminarInsumo = async (req, res, next) => {
  try {
    const resultado = await insumosService.eliminarInsumo(req.params.id);
    res.json(resultado);
  } catch (err) {
    if (err.message === 'INSUMO_NO_ENCONTRADO') return res.status(404).json({ message: 'Insumo no encontrado' });
    next(err);
  }
};
