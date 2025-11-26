import express from 'express';
import { iniciarSesion } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', iniciarSesion);

export default router;