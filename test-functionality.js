// Test script to verify all functionality is working
console.log('🧪 Testing UNI Home functionality...');

// Test 1: Cities API
async function testCitiesAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/cities?q=lecce');
    const cities = await response.json();
    console.log('✅ Cities API test:', cities.length > 0 ? 'PASSED' : 'FAILED');
    console.log('   Found cities:', cities.map(c => c.nome));
  } catch (error) {
    console.error('❌ Cities API test FAILED:', error);
  }
}

// Test 2: Announcements API
async function testAnnouncementsAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/announcements');
    const data = await response.json();
    console.log('✅ Announcements API test:', data.announcements && data.announcements.length > 0 ? 'PASSED' : 'FAILED');
    console.log('   Found announcements:', data.announcements?.length || 0);
  } catch (error) {
    console.error('❌ Announcements API test FAILED:', error);
  }
}

// Test 3: Announcement Detail API
async function testAnnouncementDetailAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/announcements/1');
    const announcement = await response.json();
    console.log('✅ Announcement Detail API test:', announcement.id ? 'PASSED' : 'FAILED');
    console.log('   Announcement:', announcement.titolo);
  } catch (error) {
    console.error('❌ Announcement Detail API test FAILED:', error);
  }
}

// Test 4: University distance calculation
function testUniversityCalculation() {
  try {
    const { findNearestUniversities } = require('./frontend/src/utils/universities.js');
    const universities = findNearestUniversities('Oria', 'Puglia');
    console.log('✅ University distance test:', universities.length > 0 ? 'PASSED' : 'FAILED');
    console.log('   Nearest universities to Oria:', universities.map(u => `${u.name} (${u.distance}km)`));
  } catch (error) {
    console.error('❌ University distance test FAILED:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('\n🚀 Starting UNI Home tests...\n');
  
  await testCitiesAPI();
  console.log('');
  
  await testAnnouncementsAPI();
  console.log('');
  
  await testAnnouncementDetailAPI();
  console.log('');
  
  testUniversityCalculation();
  
  console.log('\n🏁 Tests completed!');
}

runTests();
