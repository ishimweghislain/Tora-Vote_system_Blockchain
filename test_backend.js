// Simple test script to check backend connectivity
const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test villages endpoint
    const villagesResponse = await fetch('http://localhost:5000/api/villages');
    const villagesData = await villagesResponse.json();
    console.log('✅ Villages loaded:', villagesData.length, 'villages');
    
    console.log('🎉 Backend is working correctly!');
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('Make sure:');
    console.log('1. MongoDB is running');
    console.log('2. Backend server is started (npm run dev)');
    console.log('3. Villages are seeded (npm run seed)');
  }
};

testBackend(); 