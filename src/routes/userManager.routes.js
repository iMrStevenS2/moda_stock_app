import express from 'express';
import * as userController from '../controllers/UserManagerController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Crear usuario (sistema o cliente)
router.post('/', userController.registrarUsuario);

// Listar / obtener
router.get('/', verifyToken, userController.listarTodosUsuarios);
router.get('/:id', verifyToken, userController.obtenerUsuario);

// Actualizar (id en params o ?tipo_documento=&numero_documento=)
router.put('/:id', verifyToken, userController.modificarUsuario);

// Toggle activar/desactivar (acepta ?tipo_documento=&numero_documento= o id param)
router.patch('/:id/activar-desactivar', verifyToken, userController.activarDesactivarUsuarioController);

/* Proveedores */
router.post('/proveedores', verifyToken, userController.registrarProveedor);
router.get('/proveedores', verifyToken, userController.listarProveedoresController);
router.get('/proveedores/:id', verifyToken, userController.obtenerProveedor);
router.put('/proveedores/:id', verifyToken, userController.modificarProveedor);
router.patch('/proveedores/:id/activar-desactivar', verifyToken, userController.activarDesactivarProveedorController);

export default router;
