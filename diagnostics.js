/**
 * Vehicle Management System Diagnostics Tool
 * 
 * This script helps check if the vehicle data storage system is working properly.
 * It verifies file existence, tests saving and loading, and can add a test vehicle.
 */

const fs = require('fs');
const path = require('path');
const Vehicle = require('./models/Vehicle');

console.log('======= FLEET MANAGEMENT SYSTEM DIAGNOSTICS =======');

// Check if data directory exists
const dataDir = path.join(__dirname, 'data');
console.log(`\n1. Checking if data directory exists at: ${dataDir}`);

if (fs.existsSync(dataDir)) {
  console.log('✅ Data directory exists');
} else {
  console.log('❌ Data directory does not exist');
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Data directory created');
}

// Check if vehicle data file exists
const dataFilePath = path.join(dataDir, 'vehicles.json');
console.log(`\n2. Checking if vehicle data file exists at: ${dataFilePath}`);

if (fs.existsSync(dataFilePath)) {
  console.log('✅ Vehicle data file exists');
  
  // Check file contents
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    if (!fileData.trim()) {
      console.log('⚠️ File exists but is empty');
    } else {
      const vehicles = JSON.parse(fileData);
      console.log(`✅ File contains ${vehicles.length} vehicles`);
      
      // List first 3 vehicles
      console.log('\nFirst few vehicles:');
      vehicles.slice(0, 3).forEach(v => {
        console.log(`- ID ${v.id}: ${v.vehicleNo} (${v.vehicleType})`);
      });
    }
  } catch (error) {
    console.log('❌ Error reading or parsing vehicle data file:', error.message);
  }
} else {
  console.log('❌ Vehicle data file does not exist');
}

// Get current vehicles from the model
console.log('\n3. Checking Vehicle model in-memory data');
const allVehicles = Vehicle.getAllVehicles();
console.log(`Currently ${allVehicles.length} vehicles in memory`);

// Add a test vehicle
console.log('\n4. Adding a test vehicle');
const testVehicle = {
  vehicleNo: `TEST-DIAG-${Date.now()}`,
  vehicleType: 'Test Vehicle',
  driverName: 'Diagnostic Test',
  contactNo: '000-TEST',
  capacity: 'Test Capacity',
  status: 'active'
};

console.log(`Adding vehicle with number: ${testVehicle.vehicleNo}`);
const added = Vehicle.addVehicle(testVehicle);

if (added) {
  console.log('✅ Test vehicle added successfully with ID:', added.id);
} else {
  console.log('❌ Failed to add test vehicle');
}

// Force reload to test file loading
console.log('\n5. Testing data reload from file');
const reloaded = Vehicle._forceReload();
console.log('Reload result:', reloaded ? 'Success' : 'Failed');

if (reloaded) {
  const reloadedVehicles = Vehicle.getAllVehicles();
  console.log(`After reload: ${reloadedVehicles.length} vehicles in memory`);
  
  // Check if test vehicle was saved and loaded
  const found = reloadedVehicles.some(v => v.vehicleNo === testVehicle.vehicleNo);
  console.log(`Test vehicle found after reload: ${found ? 'Yes' : 'No'}`);
}

console.log('\n======= DIAGNOSTICS COMPLETE =======');
console.log('If you see any failures above, check the Vehicle.js file implementation');
console.log('To run the application normally, use: node index.js'); 