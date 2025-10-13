const Database = require('./database');
const { R } = require('redbean-node');

async function addUser() {
    try {
        console.log('Adding new user...');
        
        // Initialize database
        Database.initDataDir({});
        await Database.connect(false, true, true);
        
        const username = 'testuser';
        const email = 'test@example.com';
        
        // Use the same password hash as the NSJBI user
        const existingPasswordHash = '$2a$10$XRJgM/QtMi6xFpSvC5/Nz.sKz14YMjqy4zBj1yc4Bv.PCpa0EJIMG';
        
        console.log(`Creating user: ${username}`);
        
        // Create user bean
        const user = R.dispense('user');
        user.username = username;
        user.password = existingPasswordHash;
        user.email = email;
        
        // Save to database
        await R.store(user);
        
        console.log('✅ User created successfully!');
        console.log(`Username: ${username}`);
        console.log(`Password: (same as your NSJBI user)`);
        console.log(`Email: ${email}`);
        
        // Show all users
        const users = await R.getAll('SELECT id, username, email FROM user');
        console.log('\n📋 All users in system:');
        users.forEach(user => {
            console.log(`- ${user.username} (${user.email})`);
        });
        
        await Database.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addUser();