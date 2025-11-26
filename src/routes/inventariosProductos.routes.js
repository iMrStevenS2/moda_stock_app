import express from 'express';
import * as invController from '../controllers/inventariosProductosController.js';

const router = express.Router();

router.get('/listar', invController.listar);
router.get('/obtener/:id', invController.obtener);
router.post('/crear', invController.crear);
router.put('/actualizar/:id', invController.actualizar);
router.delete('/eliminar/:id', invController.eliminar);

export default router;
