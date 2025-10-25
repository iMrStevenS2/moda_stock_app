import * as clientesService from '../services/clientesService.js';

export const crearCliente = async (req, res, next) => {
  try {
    const cliente = await clientesService.crear(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    if (err.message === 'CAMPOS_FALTANTES') {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }
    if (err.message === 'CLIENTE_EXISTE') {
      return res.status(409).json({ message: 'Cliente ya existe' });
    }
    next(err);
  }
};

export const listarClientes = async (req, res, next) => {
  try {
    const clientes = await clientesService.listarTodosClientes();
    
    res.json({
      total: clientes.length,
      clientes: clientes
    });
  } catch (err) {
    next(err);
  }
};

export const buscarClientes = async (req, res, next) => {
  try {
    const { tipo_documento, numero_documento, nombre, estado } = req.query;
    let resultado = null;

    // Búsqueda por documento
    if (tipo_documento && numero_documento) {
      resultado = await clientesService.buscarPorDocumento(tipo_documento, numero_documento);
      if (resultado) {
        return res.json({
          total: 1,
          criterio: 'documento',
          clientes: [resultado]
        });
      }
    }

    // Búsqueda por nombre
    if (nombre) {
      resultado = await clientesService.buscarPorNombre(nombre);
      if (resultado) {
        return res.json({
          total: resultado.length,
          criterio: 'nombre',
          clientes: resultado
        });
      }
    }

    // Filtro por estado
    if (estado !== undefined) {
      const estadoNum = parseInt(estado, 10);
      if (estadoNum === 0 || estadoNum === 1) {
        resultado = await clientesService.filtrarPorEstado(estadoNum);
        if (resultado) {
          return res.json({
            total: resultado.length,
            criterio: 'estado',
            clientes: resultado
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
      message: 'No se encontraron clientes con los criterios especificados',
      criterios_proporcionados: { tipo_documento, numero_documento, nombre, estado }
    });

  } catch (err) {
    next(err);
  }
};

export const obtenerCliente = async (req, res, next) => {
  try {
    let identificador = req.params.id;

    // Si vienen parámetros de documento en query
    if (req.query.tipo_documento && req.query.numero_documento) {
      identificador = {
        tipo_documento: req.query.tipo_documento,
        numero_documento: req.query.numero_documento
      };
    }

    const cliente = await clientesService.obtenerPorId(identificador);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (err) {
    next(err);
  }
};

export const actualizarCliente = async (req, res, next) => {
  try {
    const actualizado = await clientesService.actualizar(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'CLIENTE_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    if (err.message === 'CLIENTE_EXISTE') {
      return res.status(409).json({ message: 'Cliente ya existe' });
    }
    next(err);
  }
};

export const cambiarEstadoCliente = async (req, res, next) => {
  try {
    const actualizado = await clientesService.cambiarEstado(req.params.id, req.query.estado);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'CLIENTE_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    next(err);
  }
};

export const eliminarCliente = async (req, res, next) => {
  try {
    const resultado = await clientesService.eliminar(req.params.id);
    res.json(resultado);
  } catch (err) {
    if (err.message === 'CLIENTE_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    next(err);
  }
};
