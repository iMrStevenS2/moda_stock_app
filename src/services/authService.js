import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index_models.js';
import { config } from '../config/config.js';

// Autentica únicamente por el campo `usuario` (nombre de usuario).
// identificador: nombre de usuario
// contrasena: texto plano
export const autenticar = async (identificador, contrasena) => {
  if (!identificador || !contrasena) throw new Error('CREDENCIALES_FALTANTES');

  const usuario = await Usuario.findOne({ where: { usuario: identificador } });
  if (!usuario) throw new Error('CREDENCIALES_INVALIDAS');

  const esValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
  if (!esValida) throw new Error('CREDENCIALES_INVALIDAS');

  const payload = {
    id: usuario.id_usuario,
    usuario: usuario.usuario,
    correo: usuario.correo,
    rol: usuario.rol
  };

  const secret = config.jwtSecret ?? process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_NO_CONFIGURADO');

  const token = jwt.sign(payload, secret, { expiresIn: config.jwtExpiresIn ?? process.env.JWT_EXPIRES_IN ?? '1h' });

  const usuarioSeguro = {
    id_usuario: usuario.id_usuario,
    usuario: usuario.usuario,
    primer_nombre: usuario.primer_nombre,
    primer_apellido: usuario.primer_apellido,
    correo: usuario.correo,
    rol: usuario.rol,
    estado: usuario.estado
  };

  return { usuario: usuarioSeguro, token };
};