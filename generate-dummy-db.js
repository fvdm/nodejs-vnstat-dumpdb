#!/usr/bin/env node

/*
 * Generate Dummy vnStat Database Script
 * 
 * This script helps you work with the dummy vnStat database for testing.
 * 
 * Usage:
 *   node generate-dummy-db.js [command]
 * 
 * Commands:
 *   validate  - Validate the dummy data JSON format
 *   info      - Display information about the dummy database
 *   help      - Show this help message
 */

const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, 'fixtures');
const dataFile = path.join(fixturesDir, 'dummy-vnstat-data.json');
const configFile = path.join(fixturesDir, 'dummy-vnstat-config.txt');

function validateData() {
  console.log('Validating dummy vnStat data...\n');
  
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    // Check required fields
    const errors = [];
    const warnings = [];
    
    if (!data.vnstatversion) {
      errors.push('Missing vnstatversion field');
    }
    
    if (!data.jsonversion) {
      errors.push('Missing jsonversion field');
    }
    
    if (!data.interfaces || !Array.isArray(data.interfaces)) {
      errors.push('Missing or invalid interfaces array');
    } else {
      if (data.interfaces.length === 0) {
        warnings.push('No interfaces defined');
      }
      
      data.interfaces.forEach((iface, idx) => {
        if (!iface.id) {
          errors.push(`Interface ${idx}: missing id field`);
        }
        
        if (!iface.traffic) {
          errors.push(`Interface ${iface.id || idx}: missing traffic field`);
        } else {
          if (!iface.traffic.total) {
            errors.push(`Interface ${iface.id || idx}: missing traffic.total`);
          }
          
          if (!iface.traffic.days || !Array.isArray(iface.traffic.days)) {
            warnings.push(`Interface ${iface.id || idx}: missing or invalid traffic.days`);
          }
          
          if (!iface.traffic.months || !Array.isArray(iface.traffic.months)) {
            warnings.push(`Interface ${iface.id || idx}: missing or invalid traffic.months`);
          }
          
          if (!iface.traffic.tops || !Array.isArray(iface.traffic.tops)) {
            warnings.push(`Interface ${iface.id || idx}: missing or invalid traffic.tops`);
          }
        }
      });
    }
    
    if (errors.length > 0) {
      console.log('❌ Validation failed with errors:\n');
      errors.forEach(err => console.log('  - ' + err));
      console.log('');
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  Warnings:\n');
      warnings.forEach(warn => console.log('  - ' + warn));
      console.log('');
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✓ Validation successful! No errors or warnings.\n');
    } else if (errors.length === 0) {
      console.log('✓ Validation successful with warnings.\n');
    }
    
    return errors.length === 0;
  } catch (err) {
    console.error('❌ Error parsing JSON:', err.message);
    return false;
  }
}

function showInfo() {
  console.log('Dummy vnStat Database Information\n');
  console.log('==================================\n');
  
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    console.log('vnStat Version:', data.vnstatversion);
    console.log('JSON Version:', data.jsonversion);
    console.log('Interfaces:', data.interfaces.length);
    console.log('');
    
    data.interfaces.forEach((iface) => {
      console.log('Interface:', iface.id);
      console.log('  Total RX:', (iface.traffic.total.rx / 1024 / 1024).toFixed(2), 'MB');
      console.log('  Total TX:', (iface.traffic.total.tx / 1024 / 1024).toFixed(2), 'MB');
      console.log('  Days:', iface.traffic.days.length);
      console.log('  Months:', iface.traffic.months.length);
      console.log('  Tops:', iface.traffic.tops.length);
      console.log('  Hours:', iface.traffic.hours.length);
      console.log('');
    });
    
    console.log('Files:');
    console.log('  Data:', dataFile);
    console.log('  Config:', configFile);
    console.log('  Mock binary:', path.join(fixturesDir, 'mock-vnstat'));
    console.log('');
  } catch (err) {
    console.error('Error reading data:', err.message);
  }
}

function showHelp() {
  console.log('Generate Dummy vnStat Database Script\n');
  console.log('Usage: node generate-dummy-db.js [command]\n');
  console.log('Commands:');
  console.log('  validate  - Validate the dummy data JSON format');
  console.log('  info      - Display information about the dummy database');
  console.log('  help      - Show this help message\n');
  console.log('Examples:');
  console.log('  node generate-dummy-db.js validate');
  console.log('  node generate-dummy-db.js info\n');
  console.log('For testing, use the mock vnstat binary:');
  console.log('  NODE_APP_BIN=./fixtures/mock-vnstat npm test\n');
}

// Parse command line arguments
const command = process.argv[2] || 'help';

switch (command) {
  case 'validate':
    process.exit(validateData() ? 0 : 1);
    break;
  
  case 'info':
    showInfo();
    break;
  
  case 'help':
  default:
    showHelp();
    break;
}
