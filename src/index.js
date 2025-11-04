import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import sequelize from './config/database.js';
import './models/index_models.js';
import authRoutes from './routes/auth.routes.js';
import publicRoutes from './routes/public.routes.js';
import userManagerRoutes from './routes/userManager.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import proveedoresRoutes from './routes/proveedores.routes.js';
import { verifyToken } from './middlewares/auth.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import { initializeDatabase } from './models/index_models.js';


const app = express();
const port = config.port ?? process.env.PORT ?? 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas públicas (sin autenticación)
app.use('/auth', authRoutes);
app.use('/public', publicRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/usersManager', userManagerRoutes);
app.use('/usuarios', verifyToken, usuariosRoutes);
app.use('/clientes', verifyToken, clientesRoutes);
app.use('/proveedores', verifyToken, proveedoresRoutes);
//router.use('/clientes', verifyToken, clientesRoutes);
//router.use('/proveedores', verifyToken, proveedoresRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Moda Stock App API',
    version: '0.0.1',
    status: 'running'
  });
});

// Control de sincronización de la BD (opcional)
const enableSync = (config.dbSync ?? process.env.DB_SYNC) === 'true';
const syncAlter = (config.dbSyncAlter ?? process.env.DB_SYNC_ALTER) === 'true';
const syncLog = (config.dbSyncLog ?? process.env.DB_SYNC_LOG) === 'true';
const seedRequested = (process.env.DB_SEED === 'true');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión BD OK');

    // Si se solicita sincronizar, hacer sync y seed en una sola operación
    if (enableSync) {
      console.log(`🔁 Running sequelize.sync() (alter=${syncAlter}) — logging: ${syncLog}`);
      await initializeDatabase({
        sync: true,
        seed: seedRequested,
        syncOptions: { alter: syncAlter, logging: syncLog ? console.log : false }
      });
      console.log('✅ Database synchronized.');
    } else if (seedRequested) {
      // solo seed sin sync
      console.log('🔁 Ejecutando seed (sin sync)');
      await initializeDatabase({ sync: false, seed: true });
      console.log('✅ Seeds aplicados.');
    } else {
      console.log('ℹ️ Database sync/seed omitidos (control externo o producción).');
    }

    app.use(errorHandler); // debe ir después de las rutas

    app.listen(port, () => {
      console.log(`🚀 Server running on port: ${port}`);
      console.log(`📍 Environment: ${config.env}`);
    });

    // Mensaje adicional para compatibilidad con logs previos
    console.log('✅ Database connection established successfully.');
  } catch (err) {
    console.error('❌ Unable to start application:', err);
    process.exit(1);
  }
}

start();