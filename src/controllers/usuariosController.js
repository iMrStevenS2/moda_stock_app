import * as usuariosService from '../services/usuariosService.js';

export const crearUsuario = async (req, res, next) => {
  try {
    const usuario = await usuariosService.crear(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    if (err.message === 'CREDENCIALES_FALTANTES') {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }
    if (err.message === 'USUARIO_EXISTE') {
      return res.status(409).json({ message: 'Usuario ya existe' });
    }
    next(err);
  }
};

export const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuariosService.listarTodosUsuarios();
    
    res.json({
      total: usuarios.length,
      usuarios: usuarios
    });
  } catch (err) {
    next(err);
  }
};

export const buscarUsuarios = async (req, res, next) => {
  try {
    const { tipo_documento, numero_documento, nombre, estado } = req.query;
    let resultado = null;

    // Búsqueda por documento
    if (tipo_documento && numero_documento) {
      resultado = await usuariosService.buscarPorDocumento(tipo_documento, numero_documento);
      if (resultado) {
        return res.json({
          total: 1,
          criterio: 'documento',
          usuarios: [resultado]
        });
      }
    }

    // Búsqueda por nombre/apellido
    if (nombre) {
      resultado = await usuariosService.buscarPorNombre(nombre);
      if (resultado) {
        return res.json({
          total: resultado.length,
          criterio: 'nombre',
          usuarios: resultado
        });
      }
    }

    // Filtro por estado
    if (estado !== undefined) {
      const estadoNum = parseInt(estado, 10);
      if (estadoNum === 0 || estadoNum === 1) {
        resultado = await usuariosService.filtrarPorEstado(estadoNum);
        if (resultado) {
          return res.json({
            total: resultado.length,
            criterio: 'estado',
            usuarios: resultado
          });
        }
      } else {
        return res.status(400).json({
          message: 'El estado debe ser 0 (inactivo) o 1 (activo)'
        });
      }
    }

    // Si no hay criterios válidos o no se encontraron resultados
    res.status(404).json({
      message: 'No se encontraron usuarios con los criterios especificados',
      criterios_proporcionados: { tipo_documento, numero_documento, nombre, estado }
    });

  } catch (err) {
    next(err);
  }
};

export const obtenerUsuario = async (req, res, next) => {
  try {
    let identificador = req.params.id;

    // Si vienen parámetros de documento en query
    if (req.query.tipo_documento && req.query.numero_documento) {
      identificador = {
        tipo_documento: req.query.tipo_documento,
        numero_documento: req.query.numero_documento
      };
    }
    // Si viene correo en query
    else if (req.query.email) {
      identificador = req.query.email;
    }

    const usuario = await usuariosService.obtenerPorId(identificador);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    next(err);
  }
};

export const actualizarUsuario = async (req, res, next) => {
  try {
    const actualizado = await usuariosService.actualizar(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'USUARIO_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    next(err);
  }
};

export const cambiarEstado = async (req, res, next) => {
  try {
    const actualizado = await usuariosService.cambiarEstado(req.params.id, req.query.estado);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'USUARIO_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    next(err);
  }
};