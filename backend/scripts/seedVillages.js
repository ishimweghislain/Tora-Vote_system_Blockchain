const mongoose = require('mongoose');
const Village = require('../models/Village');
require('dotenv').config();

// Sample Rwandan villages data
const villages = [
  // Kigali Province
  { name: 'Kigali City', district: 'Kigali City', province: 'Kigali', code: 'KG001' },
  { name: 'Gasabo', district: 'Gasabo', province: 'Kigali', code: 'KG002' },
  { name: 'Kicukiro', district: 'Kicukiro', province: 'Kigali', code: 'KG003' },
  { name: 'Nyarugenge', district: 'Nyarugenge', province: 'Kigali', code: 'KG004' },
  
  // Northern Province
  { name: 'Musanze', district: 'Musanze', province: 'Northern', code: 'NP001' },
  { name: 'Burera', district: 'Burera', province: 'Northern', code: 'NP002' },
  { name: 'Gicumbi', district: 'Gicumbi', province: 'Northern', code: 'NP003' },
  { name: 'Rulindo', district: 'Rulindo', province: 'Northern', code: 'NP004' },
  { name: 'Gakenke', district: 'Gakenke', province: 'Northern', code: 'NP005' },
  
  // Southern Province
  { name: 'Huye', district: 'Huye', province: 'Southern', code: 'SP001' },
  { name: 'Muhanga', district: 'Muhanga', province: 'Southern', code: 'SP002' },
  { name: 'Kamonyi', district: 'Kamonyi', province: 'Southern', code: 'SP003' },
  { name: 'Karongi', district: 'Karongi', province: 'Southern', code: 'SP004' },
  { name: 'Rutsiro', district: 'Rutsiro', province: 'Southern', code: 'SP005' },
  { name: 'Rubavu', district: 'Rubavu', province: 'Southern', code: 'SP006' },
  { name: 'Nyamasheke', district: 'Nyamasheke', province: 'Southern', code: 'SP007' },
  { name: 'Rusizi', district: 'Rusizi', province: 'Southern', code: 'SP008' },
  { name: 'Nyamagabe', district: 'Nyamagabe', province: 'Southern', code: 'SP009' },
  { name: 'Nyanza', district: 'Nyanza', province: 'Southern', code: 'SP010' },
  { name: 'Gisagara', district: 'Gisagara', province: 'Southern', code: 'SP011' },
  { name: 'Nyaruguru', district: 'Nyaruguru', province: 'Southern', code: 'SP012' },
  
  // Eastern Province
  { name: 'Rwamagana', district: 'Rwamagana', province: 'Eastern', code: 'EP001' },
  { name: 'Kayonza', district: 'Kayonza', province: 'Eastern', code: 'EP002' },
  { name: 'Kirehe', district: 'Kirehe', province: 'Eastern', code: 'EP003' },
  { name: 'Ngoma', district: 'Ngoma', province: 'Eastern', code: 'EP004' },
  { name: 'Bugesera', district: 'Bugesera', province: 'Eastern', code: 'EP005' },
  { name: 'Gatsibo', district: 'Gatsibo', province: 'Eastern', code: 'EP006' },
  { name: 'Nyagatare', district: 'Nyagatare', province: 'Eastern', code: 'EP007' },
  
  // Western Province
  { name: 'Rubavu', district: 'Rubavu', province: 'Western', code: 'WP001' },
  { name: 'Nyabihu', district: 'Nyabihu', province: 'Western', code: 'WP002' },
  { name: 'Ngororero', district: 'Ngororero', province: 'Western', code: 'WP003' },
  { name: 'Karongi', district: 'Karongi', province: 'Western', code: 'WP004' },
  { name: 'Rutsiro', district: 'Rutsiro', province: 'Western', code: 'WP005' }
];

async function seedVillages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rwanda_voting', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing villages
    await Village.deleteMany({});
    console.log('Cleared existing villages');
    
    // Insert new villages
    const insertedVillages = await Village.insertMany(villages);
    console.log(`Successfully seeded ${insertedVillages.length} villages`);
    
    // Display some sample villages
    console.log('\nSample villages:');
    insertedVillages.slice(0, 5).forEach(village => {
      console.log(`- ${village.name}, ${village.district}, ${village.province}`);
    });
    
    console.log('\nVillage seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding villages:', error);
    process.exit(1);
  }
}

seedVillages(); 