// ...existing code...
import bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize';
import { Usuario } from '../models/index_models.js';
import dotenv from 'dotenv';
dotenv.config();

const BATCH = 100;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

(async () => {
  try {
    console.log('Iniciando hashing de contraseñas (Sequelize)...');

    let offset = 0;
    let updated = 0;

    while (true) {
      // Buscar usuarios cuya contraseña NO empiece con el prefijo bcrypt ($2...)
      const users = await Usuario.findAll({
        where: {
          contrasena: {
            [Sequelize.Op.notLike]: '$2%' // omitir ya hasheadas
          }
        },
        attributes: ['id_usuario', 'contrasena'],
        limit: BATCH,
        offset
      });

      if (!users || users.length === 0) break;

      // Filtrar en JS por si hay valores nulos o no string
      const toUpdate = users.filter(u => {
        const pwd = typeof u.get === 'function' ? u.get('contrasena') : u.contrasena;
        if (!pwd) return false;
        return !(typeof pwd === 'string' && pwd.startsWith('$2'));
      });

      for (const u of toUpdate) {
        const plain = typeof u.get === 'function' ? u.get('contrasena') : u.contrasena;
        try {
          const hash = await bcrypt.hash(String(plain), SALT_ROUNDS);
          await Usuario.update({ contrasena: hash }, { where: { id_usuario: u.id_usuario } });
          updated++;
          console.log(`Hasheado id_usuario = ${u.id_usuario}`);
        } catch (e) {
          console.error(`ERROR hasheando id_usuario = ${u.id_usuario}:`, e.message || e);
        }
      }

      if (users.length < BATCH) break;
      offset += BATCH;
    }

    console.log(`Terminado. Contraseñas actualizadas: ${updated}`);
    process.exit(0);
  } catch (err) {
    console.error('Error general:', err);
    process.exit(1);
  }
})();