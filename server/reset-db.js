// Simple database reset and initialization
const fs = require('fs');
const path = require('path');

// Remove database file if it exists
const dbPath = path.join(__dirname, 'database.sqlite');
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Old database removed');
}

console.log('🗄️ Initializing fresh database...');

// Now require the models and set up the database
const db = require('./config/db');

// Import models to register them
const User = require('./models/user');
const Announcement = require('./models/announcement');

async function setupDatabase() {
    try {
        // Test database connection
        await db.authenticate();
        console.log('✅ Database connection established');
        
        // Sync database (create tables)
        await db.sync({ force: true });
        console.log('✅ Database tables created');
        
        // Create test users
        const bcrypt = require('bcryptjs');
        
        const testUser = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password_hash: await bcrypt.hash('password123', 10),
            nome: 'Test',
            cognome: 'User'
        });
        console.log('✅ Test user created:', testUser.username);
        
        const marioUser = await User.create({
            username: 'mario.rossi',
            email: 'mario@example.com',
            password_hash: await bcrypt.hash('mario123', 10),
            nome: 'Mario',
            cognome: 'Rossi'
        });
        console.log('✅ Mario user created:', marioUser.username);
        
        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    } finally {
        await db.close();
        process.exit(0);
    }
}

setupDatabase();
