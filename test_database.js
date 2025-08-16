const mongoose = require('mongoose');
const Voter = require('./backend/models/Voter');
const Village = require('./backend/models/Village');

// Test database connection and voter registration
async function testDatabase() {
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/rwanda_voting', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test 1: Check if villages exist
    const villages = await Village.find();
    console.log(`✅ Found ${villages.length} villages in database`);
    if (villages.length > 0) {
      console.log('   Sample villages:');
      villages.slice(0, 5).forEach(village => {
        console.log(`     - ${village.name}, ${village.district}, ${village.province}`);
      });
      if (villages.length > 5) {
        console.log(`     ... and ${villages.length - 5} more`);
      }
    }
    
    // Verify we have at least 10 villages
    if (villages.length < 10) {
      console.log('   ⚠️  Expected at least 10 villages, found only', villages.length);
      console.log('   Run: cd backend && npm run seed');
    }
    
    // Test 2: Check if voters exist
    const voters = await Voter.find().populate('village');
    console.log(`✅ Found ${voters.length} voters in database`);
    if (voters.length > 0) {
      console.log('   Sample voter:', voters[0].fullName, 'from', voters[0].village?.name);
    }
    
    // Test 3: Try to register a test voter
    console.log('\n🧪 Testing Voter Registration...');
    
    // Check if test voter already exists
    const existingVoter = await Voter.findOne({ rwandanId: '9999999999999999' });
    if (existingVoter) {
      console.log('   Test voter already exists, skipping registration test');
    } else {
      // Get first village for testing
      const testVillage = villages[0];
      if (!testVillage) {
        console.log('   ❌ No villages found, cannot test voter registration');
      } else {
        // Create test voter
        const testVoter = new Voter({
          rwandanId: '9999999999999999',
          fullName: 'TEST VOTER',
          gender: 'Male',
          village: testVillage._id
        });
        
        await testVoter.save();
        console.log('   ✅ Test voter registered successfully!');
        
        // Clean up test voter
        await Voter.findOneAndDelete({ rwandanId: '9999999999999999' });
        console.log('   🧹 Test voter cleaned up');
      }
    }
    
    console.log('\n🎉 Database test completed successfully!');
    console.log('\nTo test the full system:');
    console.log('1. Start backend: cd backend && npm run dev');
    console.log('2. Start frontend: cd frontend && npm run dev');
    console.log('3. Login as admin (admin/123)');
    console.log('4. Register new voters - they will now be saved to database!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running: mongod');
    console.log('2. Check if database exists: voting_system');
    console.log('3. Run seed script: cd backend && npm run seed');
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

testDatabase();
