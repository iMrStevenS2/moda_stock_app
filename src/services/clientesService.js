import { Op } from 'sequelize';
import { Cliente } from '../models/index_models.js';

export const crear = async (datos) => {
  // Validación de campos requeridos
  const camposFaltantes = [];
  const requeridos = ['tipo_documento', 'numero_documento', 'nombre'];
  
  requeridos.forEach(campo => {
    if (!datos[campo]) camposFaltantes.push(campo);
  });

  if (camposFaltantes.length > 0) {
    throw new Error('CAMPOS_FALTANTES');
  }

  // Verificar duplicados
  const existente = await Cliente.findOne({
    where: {
      [Op.and]: [
        { tipo_documento: datos.tipo_documento },
        { numero_documento: datos.numero_documento }
      ]
    }
  });

  if (existente) throw new Error('CLIENTE_EXISTE');

  // Crear cliente
  const creado = await Cliente.create({
    tipo_documento: datos.tipo_documento,
    numero_documento: datos.numero_documento,
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono,
    direccion: datos.direccion,
    ciudad: datos.ciudad,
    departamento: datos.departamento,
    pais: datos.pais,
    estado: datos.estado || 1,
    notas: datos.notas
  });

  return creado.toJSON();
};

export const listarTodosClientes = async () => {
  const clientes = await Cliente.findAll({
    order: [['fecha_registro', 'DESC']]
  });

  return clientes.map(c => c.toJSON());
};

export const buscarPorDocumento = async (tipo_documento, numero_documento) => {
  const cliente = await Cliente.findOne({
    where: { tipo_documento, numero_documento }
  });
  return cliente ? cliente.toJSON() : null;
};

export const buscarPorNombre = async (texto) => {
  if (!texto || texto.trim() === '') return null;

  const clientes = await Cliente.findAll({
    where: {
      nombre: { [Op.iLike]: `%${texto}%` }
    }
  });

  return clientes.length > 0 ? clientes.map(c => c.toJSON()) : null;
};

export const filtrarPorEstado = async (estado) => {
  if (estado !== 0 && estado !== 1) return null;

  const clientes = await Cliente.findAll({
    where: { estado },
    order: [['nombre', 'ASC']]
  });

  return clientes.length > 0 ? clientes.map(c => c.toJSON()) : null;
};

export const obtenerPorId = async (id) => {
  const cliente = await Cliente.findByPk(id);
  return cliente ? cliente.toJSON() : null;
};

export const actualizar = async (id, cambios) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) throw new Error('CLIENTE_NO_ENCONTRADO');

  // Verificar duplicados si se está cambiando el documento
  if (cambios.tipo_documento || cambios.numero_documento) {
    const tipoDoc = cambios.tipo_documento || cliente.tipo_documento;
    const numDoc = cambios.numero_documento || cliente.numero_documento;
    
    const existente = await Cliente.findOne({
      where: {
        [Op.and]: [
          { tipo_documento: tipoDoc },
          { numero_documento: numDoc },
          { id_cliente: { [Op.ne]: id } } // Excluir el cliente actual
        ]
      }
    });

    if (existente) throw new Error('CLIENTE_EXISTE');
  }

  await cliente.update(cambios);
  return cliente.toJSON();
};

export const cambiarEstado = async (id, estado) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) throw new Error('CLIENTE_NO_ENCONTRADO');

  const nuevoEstado = estado === 'true' || estado === '1' ? 1 : 0;
  await cliente.update({ estado: nuevoEstado });

  return cliente.toJSON();
};

export const eliminar = async (id) => {
  const cliente = await Cliente.findByPk(id);
  if (!cliente) throw new Error('CLIENTE_NO_ENCONTRADO');

  await cliente.destroy();
  return { id, message: 'Cliente eliminado exitosamente' };
};
