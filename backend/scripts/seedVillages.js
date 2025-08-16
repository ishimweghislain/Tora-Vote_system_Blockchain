const mongoose = require('mongoose');
const Village = require('../models/Village');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rwanda_voting', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const villages = [
  {
    name: 'Kigali City',
    district: 'Kigali',
    province: 'Kigali',
    code: 'KG001'
  },
  {
    name: 'Butare',
    district: 'Huye',
    province: 'Southern',
    code: 'BT001'
  },
  {
    name: 'Gisenyi',
    district: 'Rubavu',
    province: 'Western',
    code: 'GS001'
  },
  {
    name: 'Kibuye',
    district: 'Karongi',
    province: 'Western',
    code: 'KB001'
  },
  {
    name: 'Ruhengeri',
    district: 'Musanze',
    province: 'Northern',
    code: 'RH001'
  },
  {
    name: 'Kibungo',
    district: 'Ngoma',
    province: 'Eastern',
    code: 'KB002'
  },
  {
    name: 'Byumba',
    district: 'Gicumbi',
    province: 'Northern',
    code: 'BY001'
  },
  {
    name: 'Cyangugu',
    district: 'Rusizi',
    province: 'Western',
    code: 'CY001'
  },
  {
    name: 'Nyanza',
    district: 'Nyanza',
    province: 'Southern',
    code: 'NY001'
  },
  {
    name: 'Ruhango',
    district: 'Muhanga',
    province: 'Southern',
    code: 'RH002'
  }
];

const seedVillages = async () => {
  try {
    // Clear existing villages
    await Village.deleteMany({});
    
    // Insert new villages
    const createdVillages = await Village.insertMany(villages);
    console.log('Villages seeded successfully:', createdVillages.length);
    
    // Create some real voters
    const Voter = require('../models/Voter');
    await Voter.deleteMany({});
    
    const realVoters = [
      {
        rwandanId: '1234567890123456',
        fullName: 'MUKAMUSONI Marie',
        gender: 'Female',
        village: createdVillages[0]._id
      },
      {
        rwandanId: '2345678901234567',
        fullName: 'HABIMANA Jean',
        gender: 'Male',
        village: createdVillages[1]._id
      },
      {
        rwandanId: '3456789012345678',
        fullName: 'UWIMANA Alice',
        gender: 'Female',
        village: createdVillages[2]._id
      },
      {
        rwandanId: '4567890123456789',
        fullName: 'NDAYISABA Pierre',
        gender: 'Male',
        village: createdVillages[3]._id
      },
      {
        rwandanId: '5678901234567890',
        fullName: 'MUKANZABIGWI Claudine',
        gender: 'Female',
        village: createdVillages[4]._id
      }
    ];
    
    const createdVoters = await Voter.insertMany(realVoters);
    console.log('Voters seeded successfully:', createdVoters.length);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedVillages(); 