import * as proveedoresService from '../services/proveedoresService.js';

export const crearProveedor = async (req, res, next) => {
  try {
    const proveedor = await proveedoresService.crear(req.body);
    res.status(201).json(proveedor);
  } catch (err) {
    if (err.message === 'CAMPOS_FALTANTES') {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }
    if (err.message === 'PROVEEDOR_EXISTE') {
      return res.status(409).json({ message: 'Proveedor ya existe' });
    }
    next(err);
  }
};

export const listarProveedores = async (req, res, next) => {
  try {
    const proveedores = await proveedoresService.listarTodosProveedores();
    
    res.json({
      total: proveedores.length,
      proveedores: proveedores
    });
  } catch (err) {
    next(err);
  }
};

export const buscarProveedores = async (req, res, next) => {
  try {
    const { tipo_documento, numero_documento, razon_social, estado } = req.query;
    let resultado = null;

    // Búsqueda por documento
    if (tipo_documento && numero_documento) {
      resultado = await proveedoresService.buscarPorDocumento(tipo_documento, numero_documento);
      if (resultado) {
        return res.json({
          total: 1,
          criterio: 'documento',
          proveedores: [resultado]
        });
      }
    }

    // Búsqueda por razón social o nombre de contacto
    if (razon_social) {
      resultado = await proveedoresService.buscarPorRazonSocial(razon_social);
      if (resultado) {
        return res.json({
          total: resultado.length,
          criterio: 'razon_social',
          proveedores: resultado
        });
      }
    }

    // Filtro por estado
    if (estado !== undefined) {
      const estadoNum = parseInt(estado, 10);
      if (estadoNum === 0 || estadoNum === 1) {
        resultado = await proveedoresService.filtrarPorEstado(estadoNum);
        if (resultado) {
          return res.json({
            total: resultado.length,
            criterio: 'estado',
            proveedores: resultado
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
      message: 'No se encontraron proveedores con los criterios especificados',
      criterios_proporcionados: { tipo_documento, numero_documento, razon_social, estado }
    });

  } catch (err) {
    next(err);
  }
};

export const obtenerProveedor = async (req, res, next) => {
  try {
    let identificador = req.params.id;

    // Si vienen parámetros de documento en query
    if (req.query.tipo_documento && req.query.numero_documento) {
      identificador = {
        tipo_documento: req.query.tipo_documento,
        numero_documento: req.query.numero_documento
      };
    }

    const proveedor = await proveedoresService.obtenerPorId(identificador);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (err) {
    next(err);
  }
};

export const actualizarProveedor = async (req, res, next) => {
  try {
    const actualizado = await proveedoresService.actualizar(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'PROVEEDOR_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    if (err.message === 'PROVEEDOR_EXISTE') {
      return res.status(409).json({ message: 'Proveedor ya existe' });
    }
    next(err);
  }
};

export const cambiarEstadoProveedor = async (req, res, next) => {
  try {
    const actualizado = await proveedoresService.cambiarEstado(req.params.id, req.query.estado);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'PROVEEDOR_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    next(err);
  }
};

export const eliminarProveedor = async (req, res, next) => {
  try {
    const resultado = await proveedoresService.eliminar(req.params.id);
    res.json(resultado);
  } catch (err) {
    if (err.message === 'PROVEEDOR_NO_ENCONTRADO') {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    next(err);
  }
};
