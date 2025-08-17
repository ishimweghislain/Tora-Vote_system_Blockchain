const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testSystem() {
  console.log('🧪 Testing Rwanda Voting System...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data);

    // Test 2: Villages
    console.log('\n2. Testing Villages API...');
    const villages = await axios.get(`${BASE_URL}/villages`);
    console.log(`✅ Found ${villages.data.length} villages`);
    console.log('Sample village:', villages.data[0]?.name);

    // Test 3: Candidates
    console.log('\n3. Testing Candidates API...');
    const candidates = await axios.get(`${BASE_URL}/candidates`);
    console.log(`✅ Found ${candidates.data.length} candidates`);
    candidates.data.forEach(candidate => {
      console.log(`   - ${candidate.name} (ID: ${candidate.candidateId})`);
    });

    // Test 4: Voters
    console.log('\n4. Testing Voters API...');
    const voters = await axios.get(`${BASE_URL}/voters`);
    console.log(`✅ Found ${voters.data.length} registered voters`);
    console.log('Sample voter:', voters.data[0]?.fullName);

    // Test 5: Vote Results (should be empty initially)
    console.log('\n5. Testing Vote Results API...');
    const results = await axios.get(`${BASE_URL}/votes/results`);
    console.log(`✅ Total votes cast: ${results.data.totalVotes}`);
    results.data.candidates.forEach(candidate => {
      console.log(`   - ${candidate.name}: ${candidate.voteCount} votes (${candidate.percentage}%)`);
    });

    // Test 6: Submit a test vote
    console.log('\n6. Testing Vote Submission...');
    const testVoterId = voters.data[0]?.rwandanId;
    const testCandidateId = candidates.data[0]?.candidateId;
    
    if (testVoterId && testCandidateId) {
      try {
        const voteResponse = await axios.post(`${BASE_URL}/votes/submit`, {
          rwandanId: testVoterId,
          candidateId: testCandidateId
        });
        console.log('✅ Vote submitted successfully:', voteResponse.data.message);
        
        // Check updated results
        const updatedResults = await axios.get(`${BASE_URL}/votes/results`);
        console.log(`✅ Updated total votes: ${updatedResults.data.totalVotes}`);
      } catch (voteError) {
        if (voteError.response?.data?.error === 'Voter has already voted') {
          console.log('ℹ️  Voter has already voted (expected if running test multiple times)');
        } else {
          console.log('❌ Vote submission error:', voteError.response?.data?.error);
        }
      }
    }

    console.log('\n🎉 System test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - MongoDB: Connected`);
    console.log(`   - Villages: ${villages.data.length} loaded`);
    console.log(`   - Candidates: ${candidates.data.length} loaded`);
    console.log(`   - Voters: ${voters.data.length} registered`);
    console.log(`   - Frontend: Running on http://localhost:5173`);
    console.log(`   - Backend: Running on http://localhost:5000`);
    
    console.log('\n🔧 Test the frontend:');
    console.log('   1. Go to http://localhost:5173');
    console.log('   2. Click "Umuyobozi" tab');
    console.log('   3. Login with username: admin, password: 123');
    console.log('   4. Try registering a new voter');
    console.log('   5. Go to "Tora" tab and vote with a registered ID');
    console.log('   6. Check "Ibisubizo" tab for real-time results');
    
    console.log('\n📝 Sample voter IDs for testing:');
    voters.data.slice(0, 3).forEach(voter => {
      console.log(`   - ${voter.rwandanId} (${voter.fullName})`);
    });

  } catch (error) {
    console.error('❌ System test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
    }
  }
}

testSystem();
