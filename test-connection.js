// Simple Firestore Connection Test
// Run this with: node test-connection.js

const https = require('https');

console.log('🔥 Testing Firestore Connection');
console.log('===============================\n');

// Test Firebase project accessibility
function testFirebaseProject() {
    return new Promise((resolve, reject) => {
        const projectId = 'real-estate-5b606';
        const url = `https://${projectId}.firebaseapp.com`;
        
        console.log(`Testing Firebase project: ${url}`);
        
        const req = https.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Firebase project is accessible');
                resolve(true);
            } else {
                console.log(`⚠️  Firebase project returned status: ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', (error) => {
            console.log('❌ Cannot connect to Firebase project');
            console.log(`   Error: ${error.message}`);
            reject(error);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Connection timeout');
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Test Firestore API endpoint
function testFirestoreAPI() {
    return new Promise((resolve, reject) => {
        const projectId = 'real-estate-5b606';
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
        
        console.log(`Testing Firestore API: ${url}`);
        
        const req = https.get(url, (res) => {
            if (res.statusCode === 200 || res.statusCode === 401) {
                console.log('✅ Firestore API is accessible');
                resolve(true);
            } else {
                console.log(`⚠️  Firestore API returned status: ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', (error) => {
            console.log('❌ Cannot connect to Firestore API');
            console.log(`   Error: ${error.message}`);
            reject(error);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Firestore API timeout');
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Check if Firestore is enabled
function checkFirestoreEnabled() {
    return new Promise((resolve, reject) => {
        const projectId = 'real-estate-5b606';
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/properties`;
        
        console.log(`Checking Firestore properties collection: ${url}`);
        
        const req = https.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Firestore is enabled and accessible');
                resolve(true);
            } else if (res.statusCode === 404) {
                console.log('⚠️  Firestore may not be enabled or properties collection not found');
                resolve(false);
            } else {
                console.log(`⚠️  Firestore returned status: ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', (error) => {
            console.log('❌ Cannot connect to Firestore');
            console.log(`   Error: ${error.message}`);
            reject(error);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Firestore timeout');
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Main test function
async function runTests() {
    try {
        console.log('1. Testing Firebase project accessibility...');
        await testFirebaseProject();
        
        console.log('\n2. Testing Firestore API...');
        await testFirestoreAPI();
        
        console.log('\n3. Checking Firestore status...');
        await checkFirestoreEnabled();
        
        console.log('\n📋 Next Steps:');
        console.log('==============');
        console.log('1. Go to https://console.firebase.google.com/');
        console.log('2. Check if project "real-estate-5b606" exists');
        console.log('3. If not, create a new project');
        console.log('4. Enable Firestore Database');
        console.log('5. Set up Firestore rules');
        console.log('6. Test with test-firestore-connection.html');
        
    } catch (error) {
        console.log('\n❌ Tests failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check internet connection');
        console.log('2. Verify Firebase project exists');
        console.log('3. Enable Firestore in Firebase Console');
        console.log('4. Set up proper Firestore rules');
    }
}

// Run the tests
runTests();




