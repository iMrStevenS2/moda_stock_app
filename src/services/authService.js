import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Usuario } from '../models/index_models.js';

export const autenticar = async (identificador, contrasena) => {
  const user = await Usuario.findOne({
    where: { [Op.or]: [{ usuario: identificador }, { correo: identificador }] }
  });
  if (!user) throw new Error('CREDENCIALES_INVALIDAS');

  const storedHash = user.contrasena ?? user.contrasena_hash ?? user.get?.('contrasena') ?? user.get?.('contrasena_hash');
  const ok = storedHash ? await bcrypt.compare(contrasena, storedHash) : false;
  if (!ok) throw new Error('CREDENCIALES_INVALIDAS');

  const payload = {
    id_usuario: user.id_usuario ?? user.id ?? user.get?.('id_usuario') ?? user.get?.('id'),
    usuario: user.usuario,
    id_rol: user.id_rol
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_NO_CONFIGURADO');

  const token = jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN ?? '1h' });
  const safeUser = user.toJSON ? user.toJSON() : { ...user };
  delete safeUser.contrasena;
  delete safeUser.contrasena_hash;
  return { usuario: safeUser, token };
};