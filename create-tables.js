import { initializeDatabase } from './src/models/index_models.js';

async function createTables() {
  try {
    console.log('🚀 Starting database table creation...');
    
    // Create tables with alter option (modifies existing tables if they exist)
    await initializeDatabase({
      sync: true,           // Enable sync
      seed: true,          // Enable seed data
      syncOptions: {
        alter: true,       // Modify existing tables
        logging: true      // Show SQL queries
      }
    });
    
    console.log('✅ Tables created successfully!');
    console.log('📊 Default data seeded!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    process.exit(0);
  }
}

createTables();
