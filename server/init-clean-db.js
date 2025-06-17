const db = require('./config/db');
const User = require('./models/user');
const Announcement = require('./models/announcement');
const bcrypt = require('bcryptjs');

async function initializeCleanDatabase() {
    try {
        console.log('🗄️ Initializing clean database...');
        
        // Force sync - this will drop and recreate all tables
        await db.sync({ force: true });
        console.log('✅ Database tables created successfully');
        
        // Create test user with proper password hash
        const passwordHash = await bcrypt.hash('password123', 10);
        const testUser = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password_hash: passwordHash,
            nome: 'Test',
            cognome: 'User'
        });
        console.log('✅ Test user created:', testUser.email);
        
        // Create another user for variety
        const passwordHash2 = await bcrypt.hash('mario123', 10);
        const user2 = await User.create({
            username: 'mario.rossi',
            email: 'mario@example.com',
            password_hash: passwordHash2,
            nome: 'Mario',
            cognome: 'Rossi'
        });
        console.log('✅ Second user created:', user2.email);
        
        console.log('🎉 Database initialization completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

initializeCleanDatabase();
