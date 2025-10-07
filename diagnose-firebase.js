#!/usr/bin/env node

// Firebase Connection Diagnostic Script
// Run this script to check your Firebase setup

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔍 Firebase Connection Diagnostic Tool');
console.log('=====================================\n');

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
    console.log('1. Checking Firebase CLI installation...');
    
    const { exec } = require('child_process');
    exec('firebase --version', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ Firebase CLI not installed');
            console.log('   Solution: Run "npm install -g firebase-tools"');
            console.log('   Then run "firebase login"\n');
        } else {
            console.log('✅ Firebase CLI installed:', stdout.trim());
        }
    });
}

// Check Firebase configuration files
function checkFirebaseConfig() {
    console.log('\n2. Checking Firebase configuration files...');
    
    const configFiles = [
        'src/firebase.js',
        'admin-panel/src/firebase.js'
    ];
    
    configFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ Found: ${file}`);
            
            // Check if file contains valid config
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('firebaseConfig') && content.includes('projectId')) {
                console.log(`   ✅ Contains Firebase configuration`);
            } else {
                console.log(`   ❌ Missing Firebase configuration`);
            }
        } else {
            console.log(`❌ Missing: ${file}`);
        }
    });
}

// Check if Firestore rules exist
function checkFirestoreRules() {
    console.log('\n3. Checking Firestore rules...');
    
    const rulesFile = 'firestore.rules';
    if (fs.existsSync(rulesFile)) {
        console.log(`✅ Found: ${rulesFile}`);
        
        const content = fs.readFileSync(rulesFile, 'utf8');
        if (content.includes('properties') && content.includes('allow read')) {
            console.log('   ✅ Rules appear to be configured for properties collection');
        } else {
            console.log('   ⚠️  Rules may need configuration');
        }
    } else {
        console.log(`❌ Missing: ${rulesFile}`);
        console.log('   Solution: Create firestore.rules file with proper rules');
    }
}

// Check package.json for Firebase dependencies
function checkDependencies() {
    console.log('\n4. Checking Firebase dependencies...');
    
    const packageFiles = ['package.json', 'admin-panel/package.json'];
    
    packageFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ Found: ${file}`);
            
            try {
                const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
                const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                
                const firebaseDeps = Object.keys(deps).filter(dep => dep.includes('firebase'));
                if (firebaseDeps.length > 0) {
                    console.log(`   ✅ Firebase dependencies found: ${firebaseDeps.join(', ')}`);
                } else {
                    console.log(`   ❌ No Firebase dependencies found`);
                    console.log('   Solution: Run "npm install firebase"');
                }
            } catch (error) {
                console.log(`   ❌ Error reading ${file}`);
            }
        }
    });
}

// Test Firebase project connectivity
function testFirebaseProject() {
    console.log('\n5. Testing Firebase project connectivity...');
    
    const projectId = 'real-estate-5b606';
    const url = `https://${projectId}.firebaseapp.com`;
    
    console.log(`Testing connection to: ${url}`);
    
    const req = https.get(url, (res) => {
        if (res.statusCode === 200) {
            console.log('✅ Firebase project is accessible');
        } else {
            console.log(`⚠️  Firebase project returned status: ${res.statusCode}`);
        }
    });
    
    req.on('error', (error) => {
        console.log('❌ Cannot connect to Firebase project');
        console.log(`   Error: ${error.message}`);
        console.log('   Possible solutions:');
        console.log('   - Check if project exists in Firebase Console');
        console.log('   - Verify project ID is correct');
        console.log('   - Check internet connection');
    });
    
    req.setTimeout(5000, () => {
        console.log('❌ Connection timeout');
        req.destroy();
    });
}

// Generate recommendations
function generateRecommendations() {
    console.log('\n📋 Recommendations:');
    console.log('===================');
    
    console.log('\n1. Install Firebase CLI:');
    console.log('   npm install -g firebase-tools');
    console.log('   firebase login');
    
    console.log('\n2. Initialize Firebase in your project:');
    console.log('   firebase init firestore');
    
    console.log('\n3. Deploy Firestore rules:');
    console.log('   firebase deploy --only firestore:rules');
    
    console.log('\n4. Test the connection:');
    console.log('   Open test-firestore-connection.html in your browser');
    
    console.log('\n5. Check Firebase Console:');
    console.log('   Go to https://console.firebase.google.com/');
    console.log('   Verify your project exists and Firestore is enabled');
    
    console.log('\n6. Alternative: Create new Firebase project:');
    console.log('   - Go to Firebase Console');
    console.log('   - Create new project');
    console.log('   - Enable Firestore');
    console.log('   - Update configuration in firebase.js files');
}

// Run all checks
function runDiagnostic() {
    checkFirebaseCLI();
    checkFirebaseConfig();
    checkFirestoreRules();
    checkDependencies();
    testFirebaseProject();
    
    setTimeout(() => {
        generateRecommendations();
    }, 2000);
}

// Run the diagnostic
runDiagnostic();

