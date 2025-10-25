import { Op } from 'sequelize';
import { Proveedor } from '../models/index_models.js';

export const crear = async (datos) => {
  // Validación de campos requeridos
  const camposFaltantes = [];
  const requeridos = ['tipo_documento', 'numero_documento', 'razon_social'];
  
  requeridos.forEach(campo => {
    if (!datos[campo]) camposFaltantes.push(campo);
  });

  if (camposFaltantes.length > 0) {
    throw new Error('CAMPOS_FALTANTES');
  }

  // Verificar duplicados
  const existente = await Proveedor.findOne({
    where: {
      [Op.and]: [
        { tipo_documento: datos.tipo_documento },
        { numero_documento: datos.numero_documento }
      ]
    }
  });

  if (existente) throw new Error('PROVEEDOR_EXISTE');

  // Crear proveedor
  const creado = await Proveedor.create({
    tipo_documento: datos.tipo_documento,
    numero_documento: datos.numero_documento,
    razon_social: datos.razon_social,
    nombre_contacto: datos.nombre_contacto,
    email_contacto: datos.email_contacto,
    telefono_contacto: datos.telefono_contacto,
    direccion: datos.direccion,
    ciudad: datos.ciudad,
    departamento: datos.departamento,
    pais: datos.pais,
    estado: datos.estado || 1,
    notas: datos.notas
  });

  return creado.toJSON();
};

export const listarTodosProveedores = async () => {
  const proveedores = await Proveedor.findAll({
    order: [['fecha_registro', 'DESC']]
  });

  return proveedores.map(p => p.toJSON());
};

export const buscarPorDocumento = async (tipo_documento, numero_documento) => {
  const proveedor = await Proveedor.findOne({
    where: { tipo_documento, numero_documento }
  });
  return proveedor ? proveedor.toJSON() : null;
};

export const buscarPorRazonSocial = async (texto) => {
  if (!texto || texto.trim() === '') return null;

  const proveedores = await Proveedor.findAll({
    where: {
      [Op.or]: [
        { razon_social: { [Op.iLike]: `%${texto}%` } },
        { nombre_contacto: { [Op.iLike]: `%${texto}%` } }
      ]
    }
  });

  return proveedores.length > 0 ? proveedores.map(p => p.toJSON()) : null;
};

export const filtrarPorEstado = async (estado) => {
  if (estado !== 0 && estado !== 1) return null;

  const proveedores = await Proveedor.findAll({
    where: { estado },
    order: [['razon_social', 'ASC']]
  });

  return proveedores.length > 0 ? proveedores.map(p => p.toJSON()) : null;
};

export const obtenerPorId = async (id) => {
  const proveedor = await Proveedor.findByPk(id);
  return proveedor ? proveedor.toJSON() : null;
};

export const actualizar = async (id, cambios) => {
  const proveedor = await Proveedor.findByPk(id);
  if (!proveedor) throw new Error('PROVEEDOR_NO_ENCONTRADO');

  // Verificar duplicados si se está cambiando el documento
  if (cambios.tipo_documento || cambios.numero_documento) {
    const tipoDoc = cambios.tipo_documento || proveedor.tipo_documento;
    const numDoc = cambios.numero_documento || proveedor.numero_documento;
    
    const existente = await Proveedor.findOne({
      where: {
        [Op.and]: [
          { tipo_documento: tipoDoc },
          { numero_documento: numDoc },
          { id_proveedor: { [Op.ne]: id } } // Excluir el proveedor actual
        ]
      }
    });

    if (existente) throw new Error('PROVEEDOR_EXISTE');
  }

  await proveedor.update(cambios);
  return proveedor.toJSON();
};

export const cambiarEstado = async (id, estado) => {
  const proveedor = await Proveedor.findByPk(id);
  if (!proveedor) throw new Error('PROVEEDOR_NO_ENCONTRADO');

  const nuevoEstado = estado === 'true' || estado === '1' ? 1 : 0;
  await proveedor.update({ estado: nuevoEstado });

  return proveedor.toJSON();
};

export const eliminar = async (id) => {
  const proveedor = await Proveedor.findByPk(id);
  if (!proveedor) throw new Error('PROVEEDOR_NO_ENCONTRADO');

  await proveedor.destroy();
  return { id, message: 'Proveedor eliminado exitosamente' };
};
