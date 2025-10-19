import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import sequelize from './config/database.js';
import './models/index_models.js'; // inicializa modelos (no debe llamar a sync si vas a controlarlo aquí)
import authRoutes from './routes/auth.routes.js';
import userManagerRoutes from './routes/userManager.routes.js';
import errorHandler from './middlewares/error.middleware.js'; // crea si no existe

const app = express();
const port = config.port ?? process.env.PORT ?? 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userManagerRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Moda Stock App API',
    version: '0.0.1',
    status: 'running'
  });
});

// Control de sincronización de la BD (opcional)
// Variables: DB_SYNC=true|false, DB_SYNC_ALTER=true|false, DB_SYNC_LOG=true|false
const enableSync = (config.dbSync ?? process.env.DB_SYNC) === 'true';
const syncAlter = (config.dbSyncAlter ?? process.env.DB_SYNC_ALTER) === 'true';
const syncLog = (config.dbSyncLog ?? process.env.DB_SYNC_LOG) === 'true';

app.use(errorHandler); // debe ir después de las rutas

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    if (enableSync) {
      console.log(`🔁 Running sequelize.sync() (alter=${syncAlter}) — logging: ${syncLog}`);
      await sequelize.sync({ alter: syncAlter, logging: syncLog ? console.log : false });
      console.log('✅ Database synchronized.');
    } else {
      console.log('ℹ️ Database sync disabled (DB_SYNC=false).');
    }

    console.log(`🚀 Server running on port: ${port}`);
    console.log(`📍 Environment: ${config.env}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
});