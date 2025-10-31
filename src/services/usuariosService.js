import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Usuario, Roles } from '../models/index_models.js';

const hashearPassword = async (password) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);
  return await bcrypt.hash(password, rounds);
};



export const buscarUsuarios = async (criterios) => {
  const where = {};
  const include = [{
    // Asegúrate de que Roles y el alias 'rol' sean correctos según tu configuración de Sequelize
    model: Roles,
    as: 'rol',
    attributes: ['id_rol', 'nombre', 'descripcion']
  }];

  // 1. Búsqueda por documento (tipo_documento y numero_documento)
  if (criterios.tipo_documento && criterios.numero_documento) {
    where.tipo_documento = criterios.tipo_documento;
    where.numero_documento = criterios.numero_documento;
  }

  // 2. Búsqueda por nombre (ILIKE en varios campos)
  if (criterios.nombre_apellido) {
    const busqueda = `%${criterios.nombre_apellido}%`;

    // Cláusula OR para buscar coincidencias en cualquiera de los campos de nombre
    where[Op.or] = [
      { primer_nombre: { [Op.iLike]: busqueda } },
      { segundo_nombre: { [Op.iLike]: busqueda } },
      { primer_apellido: { [Op.iLike]: busqueda } },
      { segundo_apellido: { [Op.iLike]: busqueda } }
    ];
  }

  // 3. Filtro por estado (Si se proporciona)
  if (criterios.estado !== undefined) {
    where.estado = criterios.estado;
  }

  // Si no hay criterios de búsqueda válidos, devolvemos un array vacío
  if (Object.keys(where).length === 0) {
    return [];
  }

  // Ejecuta la consulta
  const usuarios = await Usuario.findAll({
    where: where,
    attributes: { exclude: ['contrasena'] },
    include: include,
    order: [['primer_apellido', 'ASC']]
  });

  return usuarios.map(u => u.toJSON());
};


export const crear = async (datos) => {
  // Validación de campos requeridos
  const camposFaltantes = [];
  const requeridos = ['usuario', 'password', 'primer_nombre', 'primer_apellido',
    'tipo_documento', 'numero_documento', 'email', 'id_rol'];

  requeridos.forEach(campo => {
    if (!datos[campo]) camposFaltantes.push(campo);
  });

  if (camposFaltantes.length > 0) {
    throw new Error('CREDENCIALES_FALTANTES');
  }

  // Verificar duplicados
  const existente = await Usuario.findOne({
    where: {
      [Op.or]: [
        { usuario: datos.usuario },
        { correo: datos.email },
        {
          [Op.and]: [
            { tipo_documento: datos.tipo_documento },
            { numero_documento: datos.numero_documento }
          ]
        }
      ]
    }
  });

  if (existente) throw new Error('USUARIO_EXISTE');

  // Crear usuario
  const hash = await hashearPassword(datos.password);

  const creado = await Usuario.create({
    usuario: datos.usuario,
    primer_nombre: datos.primer_nombre,
    segundo_nombre: datos.segundo_nombre,
    primer_apellido: datos.primer_apellido,
    segundo_apellido: datos.segundo_apellido,
    tipo_documento: datos.tipo_documento,
    numero_documento: datos.numero_documento,
    correo: datos.email,
    contrasena: hash,
    id_rol: datos.id_rol,
    estado: 1
  });

  const response = creado.toJSON();
  delete response.contrasena;
  return response;
};

export const listarTodosUsuarios = async () => {
  const usuarios = await Usuario.findAll({
    attributes: { exclude: ['contrasena'] },
    include: [{
      model: Roles,
      as: 'rol',
      attributes: ['id_rol', 'nombre', 'descripcion']
    }],
    order: [['fecha_creacion', 'DESC']] // Ordenados por fecha de creación
  });

  return usuarios.map(u => u.toJSON());
};

export const buscarPorDocumento = async (tipo_documento, numero_documento) => {
  const usuario = await Usuario.findOne({
    where: { tipo_documento, numero_documento },
    attributes: { exclude: ['contrasena'] },
    include: [{
      model: Roles,
      as: 'rol',
      attributes: ['id_rol', 'nombre', 'descripcion']
    }]
  });
  return usuario ? usuario.toJSON() : null;
};

export const buscarPorNombre = async (texto) => {
  if (!texto || texto.trim() === '') return null;

  const usuarios = await Usuario.findAll({
    where: {
      [Op.or]: [
        { primer_nombre: { [Op.iLike]: `%${texto}%` } },
        { segundo_nombre: { [Op.iLike]: `%${texto}%` } },
        { primer_apellido: { [Op.iLike]: `%${texto}%` } },
        { segundo_apellido: { [Op.iLike]: `%${texto}%` } }
      ]
    },
    attributes: { exclude: ['contrasena'] },
    include: [{
      model: Roles,
      as: 'rol',
      attributes: ['id_rol', 'nombre', 'descripcion']
    }]
  });

  return usuarios.length > 0 ? usuarios.map(u => u.toJSON()) : null;
};

export const filtrarPorEstado = async (estado) => {
  if (estado !== 0 && estado !== 1) return null;

  const usuarios = await Usuario.findAll({
    where: { estado },
    attributes: { exclude: ['contrasena'] },
    include: [{
      model: Roles,
      as: 'rol',
      attributes: ['id_rol', 'nombre', 'descripcion']
    }],
    order: [['primer_nombre', 'ASC'], ['primer_apellido', 'ASC']]
  });

  return usuarios.length > 0 ? usuarios.map(u => u.toJSON()) : null;
};

export const obtenerPorId = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    attributes: { exclude: ['contrasena'] },
    include: [{
      model: Roles,
      as: 'rol',
      attributes: ['id_rol', 'nombre', 'descripcion']
    }]
  });
  return usuario ? usuario.toJSON() : null;
};

export const actualizar = async (id, cambios) => {
  const usuario = await Usuario.findByPk(id, {
    include: [{
      model: Roles,
      as: 'rol',
      attributes: ['id_rol', 'nombre', 'descripcion']
    }]
  });
  if (!usuario) throw new Error('USUARIO_NO_ENCONTRADO');

  if (cambios.password) {
    // Usar la misma función centralizada
    cambios.contrasena = await hashearPassword(cambios.password);
    delete cambios.password;
  }

  if (cambios.email) cambios.correo = cambios.email;

  await usuario.update(cambios);
  const response = usuario.toJSON();
  delete response.contrasena;
  return response;
};

export const cambiarEstado = async (id, estado) => {
  const usuario = await Usuario.findByPk(id, {
    include: [{
      model: Roles,
      as: 'rol',
      attributes: ['id_rol', 'nombre', 'descripcion']
    }]
  });
  if (!usuario) throw new Error('USUARIO_NO_ENCONTRADO');

  const nuevoEstado = estado === 'true' || estado === '1' ? 1 : 0;
  await usuario.update({ estado: nuevoEstado });

  const response = usuario.toJSON();
  delete response.contrasena;
  return response;
};