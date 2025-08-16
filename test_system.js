// Simple test script to verify the voting system
console.log('🚀 Testing Rwanda Voting System...\n');

// Test 1: Check if backend is running
async function testBackend() {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Backend is running:', data.status);
    return true;
  } catch (error) {
    console.log('❌ Backend is not running. Please start it with: cd backend && npm run dev');
    return false;
  }
}

// Test 2: Check if voters are seeded
async function testVoters() {
  try {
    const response = await fetch('http://localhost:5000/api/voters');
    const voters = await response.json();
    console.log('✅ Voters found:', voters.length);
    if (voters.length > 0) {
      console.log('   Sample voter:', voters[0].fullName);
    }
    return true;
  } catch (error) {
    console.log('❌ Could not fetch voters:', error.message);
    return false;
  }
}

// Test 3: Check if votes endpoint works
async function testVotes() {
  try {
    const response = await fetch('http://localhost:5000/api/votes/results');
    const data = await response.json();
    console.log('✅ Votes endpoint working');
    console.log('   Total votes:', data.totalVotes);
    console.log('   Candidates:', data.candidates.length);
    return true;
  } catch (error) {
    console.log('❌ Votes endpoint not working:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Running system tests...\n');
  
  const backendOk = await testBackend();
  if (!backendOk) {
    console.log('\n❌ Please start the backend first!');
    console.log('   Commands:');
    console.log('   1. cd backend');
    console.log('   2. npm install');
    console.log('   3. npm run seed');
    console.log('   4. npm run dev');
    return;
  }
  
  await testVoters();
  await testVotes();
  
  console.log('\n🎉 System test completed!');
  console.log('\nTo start the frontend:');
  console.log('  1. cd frontend');
  console.log('  2. npm install');
  console.log('  3. npm run dev');
}

runTests(); 