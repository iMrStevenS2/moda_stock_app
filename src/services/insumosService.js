import { InsumosCatalogo } from '../models/index_models.js';

export const listarCatalogo = async () => {
  const rows = await InsumosCatalogo.findAll({ order: [['fecha_creacion', 'DESC']] });
  return rows.map(r => r.toJSON());
};

export const obtenerInsumoPorId = async (id) => {
  const insumo = await InsumosCatalogo.findByPk(id);
  return insumo ? insumo.toJSON() : null;
};

export const crearInsumo = async (datos) => {
  const requeridos = ['codigo_insumo', 'nombre_insumo', 'tipo_insumo', 'unidad_medida'];
  const faltantes = [];
  requeridos.forEach(c => {
    if (datos[c] === undefined || datos[c] === null || datos[c] === '') faltantes.push(c);
  });
  if (faltantes.length > 0) throw new Error('CAMPOS_FALTANTES');

  // Evitar duplicado por codigo
  const existente = await InsumosCatalogo.findOne({ where: { codigo_insumo: datos.codigo_insumo } });
  if (existente) throw new Error('INSUMO_EXISTE');

  const creado = await InsumosCatalogo.create({
    codigo_insumo: datos.codigo_insumo,
    nombre_insumo: datos.nombre_insumo,
    tipo_insumo: datos.tipo_insumo,
    unidad_medida: datos.unidad_medida,
    descripcion: datos.descripcion,
    estado: datos.estado || 'activo',
    notas: datos.notas
  });

  return creado.toJSON();
};

export const actualizarInsumo = async (id, cambios) => {
  const insumo = await InsumosCatalogo.findByPk(id);
  if (!insumo) throw new Error('INSUMO_NO_ENCONTRADO');

  if (cambios.codigo_insumo && cambios.codigo_insumo !== insumo.codigo_insumo) {
    const exist = await InsumosCatalogo.findOne({ where: { codigo_insumo: cambios.codigo_insumo } });
    if (exist) throw new Error('INSUMO_EXISTE');
  }

  await insumo.update(cambios);
  return insumo.toJSON();
};

export const cambiarEstadoInsumo = async (id, nuevoEstado) => {
  const insumo = await InsumosCatalogo.findByPk(id);
  if (!insumo) throw new Error('INSUMO_NO_ENCONTRADO');
  await insumo.update({ estado: nuevoEstado });
  return insumo.toJSON();
};

export const eliminarInsumo = async (id) => {
  const insumo = await InsumosCatalogo.findByPk(id);
  if (!insumo) throw new Error('INSUMO_NO_ENCONTRADO');
  await insumo.destroy();
  return { id, message: 'Insumo eliminado exitosamente' };
};
