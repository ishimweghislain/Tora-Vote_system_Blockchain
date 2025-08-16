console.log('🔍 Simple Backend Test...\n');

// Test 1: Check if we can reach localhost:5000
console.log('1️⃣ Testing if backend port 5000 is accessible...');

// Simple fetch test
fetch('http://localhost:5000/api/health')
  .then(response => {
    console.log('   ✅ Backend is accessible!');
    console.log('   Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('   Data:', data);
  })
  .catch(error => {
    console.log('   ❌ Backend not accessible:', error.message);
    console.log('\n🔧 Solutions:');
    console.log('1. Make sure MongoDB is running: mongod');
    console.log('2. Start backend: cd backend && npm run dev');
    console.log('3. Check if port 5000 is free');
  });

console.log('\n2️⃣ Testing if we can reach the API endpoints...');

// Test villages endpoint
fetch('http://localhost:5000/api/villages')
  .then(response => {
    console.log('   ✅ Villages endpoint accessible');
    return response.json();
  })
  .then(data => {
    console.log('   Found', data.length, 'villages');
  })
  .catch(error => {
    console.log('   ❌ Villages endpoint error:', error.message);
  });

// Test voters endpoint
fetch('http://localhost:5000/api/voters')
  .then(response => {
    console.log('   ✅ Voters endpoint accessible');
    return response.json();
  })
  .then(data => {
    console.log('   Found', data.length, 'voters');
  })
  .catch(error => {
    console.log('   ❌ Voters endpoint error:', error.message);
  });
