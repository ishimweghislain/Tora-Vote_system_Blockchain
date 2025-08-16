const { exec } = require('child_process');
const path = require('path');

console.log('🌱 Running seed script to create villages and voters...\n');

// Run the seed script
exec('cd backend && npm run seed', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error running seed script:', error.message);
    return;
  }
  
  if (stderr) {
    console.error('⚠️  Seed script warnings:', stderr);
  }
  
  console.log('✅ Seed script output:');
  console.log(stdout);
  
  console.log('\n🎉 Seed script completed!');
  console.log('\nNow you can:');
  console.log('1. Start backend: cd backend && npm run dev');
  console.log('2. Start frontend: cd frontend && npm run dev');
  console.log('3. Test database: node test_database.js');
  console.log('4. Login as admin and register voters with the new villages!');
});

console.log('Running seed command...');
