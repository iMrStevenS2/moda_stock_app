import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import sequelize from './config/database.js';

const app = express();
const port = config.port;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Moda Stock App API',
    version: '0.0.1',
    status: 'running'
  });
});

// Routes will be added here later
// routerApi(app);

// Error handlers will be added here later

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    console.log(`🚀 Server running on port: ${port}`);
    console.log(`📍 Environment: ${config.env}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});
