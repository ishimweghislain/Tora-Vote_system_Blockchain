const { exec } = require('child_process');
const { spawn } = require('child_process');

console.log('🚀 Starting Rwanda Voting System...\n');

console.log('📋 Prerequisites Check:');
console.log('1. Make sure MongoDB is running (mongod)');
console.log('2. Make sure you have Node.js installed');
console.log('3. Make sure you have npm installed\n');

console.log('🔧 Step 1: Installing dependencies...');

// Install backend dependencies
exec('cd backend && npm install', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backend install failed:', error.message);
    return;
  }
  
  console.log('✅ Backend dependencies installed');
  
  // Install frontend dependencies
  exec('cd frontend && npm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Frontend install failed:', error.message);
      return;
    }
    
    console.log('✅ Frontend dependencies installed\n');
    
    console.log('🌱 Step 2: Seeding database...');
    
    // Run seed script
    exec('cd backend && npm run seed', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Seed failed:', error.message);
        return;
      }
      
      console.log('✅ Database seeded successfully\n');
      
      console.log('🚀 Step 3: Starting backend server...');
      console.log('   Backend will start on http://localhost:5000');
      
      // Start backend server
      const backend = spawn('npm', ['run', 'dev'], { 
        cwd: './backend',
        stdio: 'inherit'
      });
      
      console.log('\n⏳ Backend server starting...');
      console.log('   Wait for "Server running on port 5000" message');
      console.log('   Then open a new terminal and run: cd frontend && npm run dev');
      
      backend.on('error', (error) => {
        console.error('❌ Backend error:', error.message);
      });
      
      backend.on('close', (code) => {
        console.log(`\n🔌 Backend server stopped with code ${code}`);
      });
      
      // Handle process termination
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping backend server...');
        backend.kill('SIGINT');
        process.exit(0);
      });
      
    });
  });
});
