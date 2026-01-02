#!/usr/bin/env node

/*
 * Example: Using the dummy vnStat database for testing
 * 
 * This script demonstrates how to use the mock vnstat binary
 * to test your application without requiring vnStat to be installed.
 */

const vnstat = require('../vnstat-dumpdb.js')({
  bin: './mock-vnstat'
});

console.log('=== vnstat-dumpdb Example with Dummy Database ===\n');

// Example 1: Get stats for a specific interface
console.log('1. Getting stats for eth0 interface:');
vnstat.getStats('eth0', function(err, data) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('   Interface:', data.id);
  console.log('   Total RX:', (data.traffic.total.rx / 1024 / 1024).toFixed(2), 'MB');
  console.log('   Total TX:', (data.traffic.total.tx / 1024 / 1024).toFixed(2), 'MB');
  console.log('   Days tracked:', data.traffic.days.length);
  console.log('   Months tracked:', data.traffic.months.length);
  console.log('   Top traffic days:', data.traffic.tops.length);
  console.log('');
  
  // Example 2: Get stats for all interfaces
  console.log('2. Getting stats for all interfaces:');
  vnstat.getStats(function(err, interfaces) {
    if (err) {
      console.error('Error:', err);
      return;
    }
    
    console.log('   Total interfaces:', interfaces.length);
    interfaces.forEach(function(iface) {
      const totalMB = (iface.traffic.total.rx + iface.traffic.total.tx) / 1024 / 1024;
      console.log('   - ' + iface.id + ': ' + totalMB.toFixed(2) + ' MB total');
    });
    console.log('');
    
    // Example 3: Get vnStat configuration
    console.log('3. Getting vnStat configuration:');
    vnstat.getConfig(function(err, config) {
      if (err) {
        console.error('Error:', err);
        return;
      }
      
      console.log('   Update interval:', config.UpdateInterval, 'seconds');
      console.log('   Database directory:', config.DatabaseDir);
      console.log('   Daemon user:', config.DaemonUser);
      console.log('   Daemon group:', config.DaemonGroup);
      console.log('');
      
      console.log('✓ All examples completed successfully!');
    });
  });
});
