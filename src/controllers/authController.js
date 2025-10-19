import * as authService from '../services/authService.js';

// Body esperado: { identificador: "usuario|correo", contrasena: "..." }
export const iniciarSesion = async (req, res, next) => {
  try {
    const { identificador, contrasena } = req.body;
    if (!identificador || !contrasena) return res.status(400).json({ message: 'Identificador y contraseña requeridos' });

    const { usuario, token } = await authService.autenticar(identificador, contrasena);
    return res.json({ usuario, token });
  } catch (err) {
    if (err.message === 'CREDENCIALES_FALTANTES') return res.status(400).json({ message: 'Credenciales faltantes' });
    if (err.message === 'CREDENCIALES_INVALIDAS') return res.status(401).json({ message: 'Identificador o contraseña inválidos' });
    if (err.message === 'JWT_NO_CONFIGURADO') return res.status(500).json({ message: 'Configuración JWT faltante' });
    next(err);
  }
};

// Alias export para compatibilidad si otras rutas importan login
export const login = iniciarSesion;