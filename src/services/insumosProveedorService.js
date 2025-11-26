import { InsumosProveedor, InsumosCatalogo, Proveedor } from '../models/index_models.js';

export const listarVinculos = async () => {
  const rows = await InsumosProveedor.findAll({ order: [['fecha_registro', 'DESC']] });
  return rows.map(r => r.toJSON());
};

export const obtenerVinculoPorId = async (id) => {
  const v = await InsumosProveedor.findByPk(id);
  return v ? v.toJSON() : null;
};

export const crearVinculo = async (datos) => {
  const requeridos = ['id_insumo', 'id_proveedor', 'precio_unitario'];
  const faltantes = [];
  requeridos.forEach(c => {
    if (datos[c] === undefined || datos[c] === null || datos[c] === '') faltantes.push(c);
  });
  if (faltantes.length > 0) throw new Error('CAMPOS_FALTANTES');

  // Verificar existencia de insumo y proveedor
  const insumo = await InsumosCatalogo.findByPk(datos.id_insumo);
  if (!insumo) throw new Error('INSUMO_NO_ENCONTRADO');
  const proveedor = await Proveedor.findByPk(datos.id_proveedor);
  if (!proveedor) throw new Error('PROVEEDOR_NO_ENCONTRADO');

  const creado = await InsumosProveedor.create({
    id_insumo: datos.id_insumo,
    id_proveedor: datos.id_proveedor,
    precio_unitario: datos.precio_unitario,
    condiciones_pago: datos.condiciones_pago,
    estado: datos.estado || 'activo',
    fecha_registro: datos.fecha_registro || new Date(),
    notas: datos.notas
  });

  return creado.toJSON();
};

export const actualizarVinculo = async (id, cambios) => {
  const v = await InsumosProveedor.findByPk(id);
  if (!v) throw new Error('VINCULO_NO_ENCONTRADO');
  await v.update(cambios);
  return v.toJSON();
};

export const cambiarEstadoVinculo = async (id, nuevoEstado) => {
  const v = await InsumosProveedor.findByPk(id);
  if (!v) throw new Error('VINCULO_NO_ENCONTRADO');
  await v.update({ estado: nuevoEstado });
  return v.toJSON();
};

export const eliminarVinculo = async (id) => {
  const v = await InsumosProveedor.findByPk(id);
  if (!v) throw new Error('VINCULO_NO_ENCONTRADO');
  await v.destroy();
  return { id, message: 'Vínculo eliminado exitosamente' };
};
