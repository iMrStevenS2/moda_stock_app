// scripts/hash_passwords_sequelize.js
import bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize';
import { Usuario } from '../models/index_models.js'; // ajusta la ruta si es necesario
import dotenv from 'dotenv';
dotenv.config();

const BATCH = 100; // tamaño de lote, ajusta según tu memoria / cantidad de usuarios
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

(async () => {
    try {
        console.log('Iniciando hashing de contraseñas (Sequelize)...');

        let offset = 0;
        let updated = 0;

        while (true) {
            // Busca lote: filtrar contraseñas que no parezcan bcrypt ($2a$ $2b$ $2y$)
            const users = await Usuario.findAll({
                where: {
                    // Sequelize literal para filtrar por patrón: contrasena NOT LIKE '$2%'
                    // Si tu campo puede ser NULL, también lo manejamos (lo ignoramos)
                },
                attributes: ['id_usuario', 'contrasena'],
                limit: BATCH,
                offset
            });

            // Fallback: si no puedes filtrar en DB por patrón, filtra en JS
            if (!users || users.length === 0) break;

            const toUpdate = users.filter(u => {
                const pwd = u.get?.('contrasena') ?? u.contrasena;
                if (!pwd) return false; // ignorar nulos
                // si ya comienza con formato bcrypt ($2a$ $2b$ $2y$) lo ignoramos
                return !(typeof pwd === 'string' && pwd.startsWith('$2'));
            });

            for (const u of toUpdate) {
                const plain = u.get?.('contrasena') ?? u.contrasena;
                try {
                    const hash = await bcrypt.hash(String(plain), SALT_ROUNDS);
                    // Actualizamos solo la columna contrasena
                    await Usuario.update({ contrasena: hash }, { where: { id_usuario: u.id_usuario } });
                    updated++;
                    console.log(Hasheado id_usuario = ${ u.id_usuario });
                } catch (e) {
                    console.error(ERROR hasheando id_usuario = ${ u.id_usuario }:, e.message);
                }
            }

            if (users.length < BATCH) break;
            offset += BATCH;
        }

        console.log(Terminado.Contraseñas actualizadas: ${ updated });
        process.exit(0);
    } catch (err) {
        console.error('Error general:', err);
        process.exit(1);
    }
})();