import * as userService from '../services/userManagerService.js';

/* Helpers local: construir identificador (id numérico o {tipo_documento, numero_documento}) */
const buildIdOrDoc = (req) => {
  const { tipo_documento, numero_documento } = req.query;
  if (tipo_documento && numero_documento) return { tipo_documento, numero_documento };
  return req.params.id;
};

/* Registrar usuario (sistema o cliente) */
export const registrarUsuario = async (req, res, next) => {
  try {
    const payload = {
      usuario: req.body.usuario,
      primer_nombre: req.body.primer_nombre,
      segundo_nombre: req.body.segundo_nombre,
      primer_apellido: req.body.primer_apellido,
      segundo_apellido: req.body.segundo_apellido,
      correo: req.body.correo,
      password: req.body.password,
      rol: req.body.rol,
      tipoUsuario: req.body.tipoUsuario ?? 'sistema',
      tipo_documento: req.body.tipo_documento,
      numero_documento: req.body.numero_documento,
      datosCliente: req.body.datosCliente ?? {}
    };

    if (payload.tipoUsuario === 'sistema') {
      if (!payload.usuario || !payload.password || !payload.primer_nombre || !payload.primer_apellido || !payload.tipo_documento || !payload.numero_documento) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para usuario de sistema' });
      }
    } else {
      // cliente: require tipo_documento+numero_documento mínimo
      // opcional: permitir crear cliente sin documento (se usará correo)
    }

    const creado = await userService.crearUsuario(payload);
    return res.status(201).json(creado);
  } catch (err) {
    if (err.message === 'USUARIO_EXISTE') return res.status(409).json({ message: 'Usuario o documento ya existe' });
    if (err.message === 'CREDENCIALES_FALTANTES') return res.status(400).json({ message: 'Credenciales faltantes' });
    next(err);
  }
};

export const obtenerUsuario = async (req, res, next) => {
  try {
    const idOrDoc = buildIdOrDoc(req);
    const resultado = await userService.obtenerUsuarioPorId(idOrDoc);
    if (!resultado) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(resultado);
  } catch (err) { next(err); }
};

export const listarTodosUsuarios = async (req, res, next) => {
  try {
    const tipo = req.query.tipo; // opcional: ?tipo=sistema|cliente
    const where = {};
    if (req.query.tipo_documento) where.tipo_documento = req.query.tipo_documento;
    if (req.query.numero_documento) where.numero_documento = req.query.numero_documento;
    const usuarios = await userService.listarUsuarios({ tipo, where: Object.keys(where).length ? where : undefined });
    return res.json({ usuarios });
  } catch (err) { next(err); }
};

export const modificarUsuario = async (req, res, next) => {
  try {
    const idOrDoc = buildIdOrDoc(req);
    const actualizado = await userService.actualizarUsuario(idOrDoc, req.body);
    return res.json(actualizado);
  } catch (err) {
    if (err.message === 'USUARIO_NO_ENCONTRADO') return res.status(404).json({ message: 'Usuario no encontrado' });
    if (err.message === 'USUARIO_EXISTE') return res.status(409).json({ message: 'Usuario ya existe' });
    next(err);
  }
};

export const activarDesactivarUsuarioController = async (req, res, next) => {
  try {
    const idOrDoc = buildIdOrDoc(req);
    const estadoDeseado = req.query.estado ?? null; // ?estado=activo|inactivo
    const actualizado = await userService.activarDesactivarUsuario(idOrDoc, estadoDeseado);
    return res.json(actualizado);
  } catch (err) {
    if (err.message === 'USUARIO_NO_ENCONTRADO') return res.status(404).json({ message: 'Usuario no encontrado' });
    next(err);
  }
};

/* Proveedores: registros y gestión */
export const registrarProveedor = async (req, res, next) => {
  try {
    const payload = {
      tipo_documento: req.body.tipo_documento,
      numero_documento: req.body.numero_documento,
      razon_social: req.body.razon_social,
      nombre_contacto: req.body.nombre_contacto,
      correo_contacto: req.body.correo_contacto,
      telefono_contacto: req.body.telefono_contacto,
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      departamento: req.body.departamento,
      pais: req.body.pais,
      estado: req.body.estado,
      notas: req.body.notas
    };

    const creado = await userService.crearProveedor(payload);
    return res.status(201).json(creado);
  } catch (err) {
    if (err.message === 'PROVEEDOR_EXISTE') return res.status(409).json({ message: 'Proveedor ya existe' });
    next(err);
  }
};

export const listarProveedoresController = async (req, res, next) => {
  try {
    const filtros = { ...req.query };
    const provs = await userService.listarProveedores(filtros);
    return res.json({ proveedores: provs });
  } catch (err) { next(err); }
};

export const obtenerProveedor = async (req, res, next) => {
  try {
    const prov = await userService.obtenerProveedorPorId(req.params.id);
    if (!prov) return res.status(404).json({ message: 'Proveedor no encontrado' });
    return res.json(prov);
  } catch (err) { next(err); }
};

export const modificarProveedor = async (req, res, next) => {
  try {
    // permite id en params o documento en query
    const idOrDoc = req.query.tipo_documento && req.query.numero_documento ? { tipo_documento: req.query.tipo_documento, numero_documento: req.query.numero_documento } : req.params.id;
    const actualizado = await userService.actualizarProveedor(idOrDoc, req.body);
    return res.json(actualizado);
  } catch (err) {
    if (err.message === 'PROVEEDOR_NO_ENCONTRADO') return res.status(404).json({ message: 'Proveedor no encontrado' });
    next(err);
  }
};

export const activarDesactivarProveedorController = async (req, res, next) => {
  try {
    const idOrDoc = req.query.tipo_documento && req.query.numero_documento ? { tipo_documento: req.query.tipo_documento, numero_documento: req.query.numero_documento } : req.params.id;
    const estadoDeseado = req.query.estado ?? 'inactivo';
    const actualizado = await userService.actualizarProveedor(idOrDoc, { estado: estadoDeseado });
    return res.json(actualizado);
  } catch (err) {
    if (err.message === 'PROVEEDOR_NO_ENCONTRADO') return res.status(404).json({ message: 'Proveedor no encontrado' });
    next(err);
  }
};