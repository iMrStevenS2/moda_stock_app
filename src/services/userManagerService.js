import bcrypt from 'bcrypt';
import { Usuario, Cliente, Proveedor } from '../models/index_models.js';

/* Helpers */
const buscarPorDocumento = async (tipo_documento, numero_documento) => {
  if (!tipo_documento || !numero_documento) return null;
  const cliente = await Cliente.findOne({ where: { tipo_documento, numero_documento } });
  if (cliente) return { tipo: 'cliente', registro: cliente };
  const usuario = await Usuario.findOne({ where: { tipo_documento, numero_documento } });
  if (usuario) return { tipo: 'sistema', registro: usuario };
  const proveedor = await Proveedor.findOne({ where: { tipo_documento, numero_documento } });
  if (proveedor) return { tipo: 'proveedor', registro: proveedor };
  return null;
};

const buscarPorCorreo = async (correo) => {
  if (!correo) return null;
  const usu = await Usuario.findOne({ where: { correo } });
  if (usu) return { tipo: 'sistema', registro: usu };
  const cli = await Cliente.findOne({ where: { correo } });
  if (cli) return { tipo: 'cliente', registro: cli };
  // Proveedor puede usar correo_contacto
  const prov = await Proveedor.findOne({ where: { correo_contacto: correo } });
  if (prov) return { tipo: 'proveedor', registro: prov };
  return null;
};

const buscarPorUsuario = async (username) => {
  if (!username) return null;
  const usu = await Usuario.findOne({ where: { usuario: username } });
  return usu ? { tipo: 'sistema', registro: usu } : null;
};

const resolverIdentificador = async (identificador) => {
  // si viene object con documento
  if (identificador && typeof identificador === 'object' && identificador.tipo_documento && identificador.numero_documento) {
    return buscarPorDocumento(identificador.tipo_documento, identificador.numero_documento);
  }
  // si viene id numeric/string
  if (identificador !== undefined && identificador !== null) {
    const usuario = await Usuario.findByPk(identificador);
    if (usuario) return { tipo: 'sistema', registro: usuario };
    const cliente = await Cliente.findByPk(identificador);
    if (cliente) return { tipo: 'cliente', registro: cliente };
    const proveedor = await Proveedor.findByPk(identificador);
    if (proveedor) return { tipo: 'proveedor', registro: proveedor };
  }
  return null;
};

/* Crear usuario (sistema | cliente) */
export const crearUsuario = async ({
  usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
  correo, password, rol = 'usuario', tipoUsuario = 'sistema',
  tipo_documento = null, numero_documento = null, datosCliente = {}
}) => {
  // normalizar documento
  const tipoDoc = tipo_documento ?? datosCliente.tipo_documento ?? null;
  const numDoc = numero_documento ?? datosCliente.numero_documento ?? null;

  // duplicados por documento
  if (tipoDoc && numDoc) {
    const existeDoc = await buscarPorDocumento(tipoDoc, numDoc);
    if (existeDoc) throw new Error('USUARIO_EXISTE');
  }

  // duplicado por correo
  if (correo) {
    const existeCorreo = await buscarPorCorreo(correo);
    if (existeCorreo) throw new Error('USUARIO_EXISTE');
  }

  // duplicado por username
  if (usuario) {
    const existeUsuario = await buscarPorUsuario(usuario);
    if (existeUsuario) throw new Error('USUARIO_EXISTE');
  }

  if (tipoUsuario === 'sistema') {
    if (!usuario || !password || !primer_nombre || !primer_apellido || !tipoDoc || !numDoc) {
      // exigir datos mínimos para usuarios del sistema
      throw new Error('CREDENCIALES_FALTANTES');
    }

    const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
    const hash = await bcrypt.hash(password, rounds);

    const creado = await Usuario.create({
      usuario,
      primer_nombre,
      segundo_nombre: segundo_nombre ?? null,
      primer_apellido,
      segundo_apellido: segundo_apellido ?? null,
      tipo_documento: tipoDoc,
      numero_documento: numDoc,
      correo,
      contrasena_hash: hash,
      rol,
      estado: 'activo'
    });

    const out = creado.toJSON();
    delete out.contrasena_hash;
    return { tipo: 'sistema', usuario: out };
  }

  // tipoUsuario === 'cliente'
const clientePayload = {
    tipo_documento: tipoDoc ?? datosCliente.tipo_documento ?? 'N/A',
    numero_documento: numDoc ?? datosCliente.numero_documento ?? correo ?? `C${Date.now()}`,
    nombre: (datosCliente.nombre ?? `${primer_nombre ?? ''} ${primer_apellido ?? ''}`.trim()) || 'Sin nombre',
    correo,
    telefono: datosCliente.telefono ?? '',
    direccion: datosCliente.direccion ?? '',
    ciudad: datosCliente.ciudad ?? '',
    departamento: datosCliente.departamento ?? '',
    pais: datosCliente.pais ?? '',
    estado: datosCliente.estado ?? 'activo',
    notas: datosCliente.notas ?? ''
  };

  const creadoCli = await Cliente.create(clientePayload);
  return { tipo: 'cliente', usuario: creadoCli.toJSON() };
};

/* Proveedores */
export const crearProveedor = async (payload) => {
  const { tipo_documento, numero_documento, correo_contacto } = payload;

  if (tipo_documento && numero_documento) {
    const existeDoc = await buscarPorDocumento(tipo_documento, numero_documento);
    if (existeDoc) throw new Error('PROVEEDOR_EXISTE');
  }
  if (correo_contacto) {
    const existeCorreo = await buscarPorCorreo(correo_contacto);
    if (existeCorreo) throw new Error('PROVEEDOR_EXISTE');
  }

  const creado = await Proveedor.create({
    tipo_documento: tipo_documento ?? 'N/A',
    numero_documento: numero_documento ?? Date.now().toString().slice(-6),
    razon_social: payload.razon_social ?? 'Sin razón social',
    nombre_contacto: payload.nombre_contacto ?? 'Contacto',
    correo_contacto: correo_contacto ?? '',
    telefono_contacto: payload.telefono_contacto ?? '',
    direccion: payload.direccion ?? '',
    ciudad: payload.ciudad ?? '',
    departamento: payload.departamento ?? '',
    pais: payload.pais ?? '',
    estado: payload.estado ?? 'activo',
    notas: payload.notas ?? ''
  });

  return creado.toJSON();
};

/* Obtener por documento / id */
export const obtenerUsuarioPorDocumento = async (tipo_documento, numero_documento) => {
  return buscarPorDocumento(tipo_documento, numero_documento);
};

export const obtenerUsuarioPorId = async (id) => {
  const user = await resolverIdentificador(id);
  if (!user) return null;
  // si es sistema, ocultar hash
  const registro = user.registro.toJSON();
  if (user.tipo === 'sistema' && registro.contrasena_hash) delete registro.contrasena_hash;
  return { tipo: user.tipo, usuario: registro };
};

/* Listar usuarios (sistema + cliente) */
export const listarUsuarios = async ({ tipo, where } = {}) => {
  if (where && where.tipo_documento && where.numero_documento) {
    const encontrado = await buscarPorDocumento(where.tipo_documento, where.numero_documento);
    return encontrado ? [ { tipo: encontrado.tipo, usuario: encontrado.registro.toJSON() } ] : [];
  }

  if (tipo === 'sistema') {
    const usuarios = await Usuario.findAll({ where: where ?? {}, attributes: { exclude: ['contrasena_hash'] } });
    return usuarios.map(u => ({ tipo: 'sistema', usuario: u.toJSON() }));
  }
  if (tipo === 'cliente') {
    const clientes = await Cliente.findAll({ where: where ?? {} });
    return clientes.map(c => ({ tipo: 'cliente', usuario: c.toJSON() }));
  }

  const usuarios = await Usuario.findAll({ attributes: { exclude: ['contrasena_hash'] } });
  const clientes = await Cliente.findAll();
  return [
    ...usuarios.map(u => ({ tipo: 'sistema', usuario: u.toJSON() })),
    ...clientes.map(c => ({ tipo: 'cliente', usuario: c.toJSON() }))
  ];
};

/* actualizarUsuario (id o documento) */
export const actualizarUsuario = async (idOrDoc, cambios = {}) => {
  const res = await resolverIdentificador(idOrDoc);
  if (!res) throw new Error('USUARIO_NO_ENCONTRADO');

  if (res.tipo === 'sistema') {
    const usuarioRegistro = res.registro;
    if (cambios.password) {
      const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
      cambios.contrasena_hash = await bcrypt.hash(cambios.password, rounds);
      delete cambios.password;
    }
    // evitar sobreescribir username/campo PK sin validación
    if (cambios.usuario) {
      const existe = await buscarPorUsuario(cambios.usuario);
      if (existe && existe.registro.id_usuario !== usuarioRegistro.id_usuario) throw new Error('USUARIO_EXISTE');
    }
    await usuarioRegistro.update(cambios);
    const out = usuarioRegistro.toJSON(); delete out.contrasena_hash;
    return { tipo: 'sistema', usuario: out };
  }

  if (res.tipo === 'cliente') {
    const cliente = res.registro;
    await cliente.update(cambios);
    return { tipo: 'cliente', usuario: cliente.toJSON() };
  }

  if (res.tipo === 'proveedor') {
    const proveedor = res.registro;
    await proveedor.update(cambios);
    return { tipo: 'proveedor', usuario: proveedor.toJSON() };
  }

  throw new Error('USUARIO_NO_ENCONTRADO');
};

/* activar/desactivar (id o documento) */
export const activarDesactivarUsuario = async (idOrDoc, estadoDeseado = null) => {
  const res = await resolverIdentificador(idOrDoc);
  if (!res) throw new Error('USUARIO_NO_ENCONTRADO');

  const registro = res.registro;
  const actual = registro.estado ?? 'activo';
  const nuevo = estadoDeseado ? estadoDeseado : (actual === 'activo' ? 'inactivo' : 'activo');
  registro.estado = nuevo;
  await registro.save();

  const out = registro.toJSON();
  if (res.tipo === 'sistema' && out.contrasena_hash) delete out.contrasena_hash;
  return { tipo: res.tipo, usuario: out };
};

/* eliminar (id o documento) */
export const eliminarUsuario = async (idOrDoc) => {
  const res = await resolverIdentificador(idOrDoc);
  if (!res) throw new Error('USUARIO_NO_ENCONTRADO');
  await res.registro.destroy();
  return true;
};