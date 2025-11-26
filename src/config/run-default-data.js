import fs from 'fs';
import path from 'path';
import sequelize from '../config/database.js';

async function runSqlFile(filepath) {
  const sql = fs.readFileSync(filepath, 'utf8');
  if (!sql.trim()) return;
  // Ejecuta el SQL en la BD. Para Postgres y la mayoría de dialectos esto funciona.
  await sequelize.query(sql);
}

export async function runDefaultData() {
  const dir = path.resolve(process.cwd(), 'src', 'config', 'defaultData');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  for (const f of files) {
    const full = path.join(dir, f);
    console.log('[defaultData] ejecutando:', f);
    await runSqlFile(full);
  }
  console.log('[defaultData] completo');
}

// Permite ejecutar como script: node src/scripts/run-default-data.js
if (import.meta.url === `file://${process.cwd()}/src/scripts/run-default-data.js`) {
  (async () => {
    try {
      await sequelize.authenticate();
      await runDefaultData();
      process.exit(0);
    } catch (err) {
      console.error('Error run-default-data:', err);
      process.exit(1);
    }
  })();
}