import { autenticar } from '../services/authService.js';

export const iniciarSesion = async (req, res, next) => {
  try {
    const identificador = req.body.identificador ?? req.body.usuario ?? req.body.correo;
    const contrasena = req.body.contrasena ?? req.body.password;
    if (!identificador || !contrasena) return res.status(400).json({ message: 'usuario y contrasena son requeridos' });

    const { usuario, token } = await autenticar(identificador, contrasena);
    return res.json({ usuario, token });
  } catch (err) {
    if (err.message === 'CREDENCIALES_INVALIDAS') return res.status(401).json({ message: 'Credenciales inválidas' });
    if (err.message === 'JWT_NO_CONFIGURADO') return res.status(500).json({ message: 'Error de configuración de JWT' });
    return next(err);
  }
};