import express from 'express';
import * as insumosCtrl from '../controllers/insumosCatalogoController.js';
import * as provCtrl from '../controllers/insumosProveedorController.js';

const router = express.Router();

// Catálogo de insumos
router.post('/catalogo/crear', insumosCtrl.crearInsumo);
router.get('/catalogo/listar', insumosCtrl.listarCatalogo);
router.get('/catalogo/obtener/:id', insumosCtrl.obtenerInsumo);
router.put('/catalogo/actualizar/:id', insumosCtrl.actualizarInsumo);
router.patch('/catalogo/cambiarEstado/:id', insumosCtrl.cambiarEstadoInsumo);
router.delete('/catalogo/eliminar/:id', insumosCtrl.eliminarInsumo);

// Vínculos insumo - proveedor
router.post('/proveedor/crear', provCtrl.crearVinculo);
router.get('/proveedor/listar', provCtrl.listarVinculos);
router.get('/proveedor/obtener/:id', provCtrl.obtenerVinculo);
router.put('/proveedor/actualizar/:id', provCtrl.actualizarVinculo);
router.patch('/proveedor/cambiarEstado/:id', provCtrl.cambiarEstadoVinculo);
router.delete('/proveedor/eliminar/:id', provCtrl.eliminarVinculo);

export default router;
