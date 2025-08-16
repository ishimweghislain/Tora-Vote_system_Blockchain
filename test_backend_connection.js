const fetch = require('node-fetch');

console.log('🔍 Testing Backend Connection...\n');

async function testBackendConnection() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Health check passed:', healthData.status);
    } else {
      console.log('   ❌ Health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message);
  }

  try {
    // Test 2: Villages endpoint
    console.log('\n2️⃣ Testing villages endpoint...');
    const villagesResponse = await fetch(`${baseUrl}/api/villages`);
    if (villagesResponse.ok) {
      const villagesData = await villagesResponse.json();
      console.log('   ✅ Villages endpoint working:', villagesData.length, 'villages found');
    } else {
      console.log('   ❌ Villages endpoint failed:', villagesResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Villages endpoint error:', error.message);
  }

  try {
    // Test 3: Voters endpoint
    console.log('\n3️⃣ Testing voters endpoint...');
    const votersResponse = await fetch(`${baseUrl}/api/voters`);
    if (votersResponse.ok) {
      const votersData = await votersResponse.json();
      console.log('   ✅ Voters endpoint working:', votersData.length, 'voters found');
    } else {
      console.log('   ❌ Voters endpoint failed:', votersResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Voters endpoint error:', error.message);
  }

  try {
    // Test 4: Votes endpoint
    console.log('\n4️⃣ Testing votes endpoint...');
    const votesResponse = await fetch(`${baseUrl}/api/votes/results`);
    if (votesResponse.ok) {
      const votesData = await votesResponse.json();
      console.log('   ✅ Votes endpoint working:', votesData.candidates.length, 'candidates found');
    } else {
      console.log('   ❌ Votes endpoint failed:', votesResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Votes endpoint error:', error.message);
  }

  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure MongoDB is running: mongod');
  console.log('2. Make sure backend is running: cd backend && npm run dev');
  console.log('3. Check if backend is on port 5000');
  console.log('4. Run seed script: cd backend && npm run seed');
}

testBackendConnection();
