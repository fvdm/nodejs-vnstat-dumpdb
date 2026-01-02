# vnStat Dummy Database for Testing

This directory contains a lightweight and importable dummy database for vnStat that can be used during tests to avoid waiting for real data propagation.

## Contents

- `mock-vnstat` - Mock vnstat binary script that simulates vnstat command
- `dummy-vnstat-data.json` - Dummy network statistics in vnStat JSON format
- `dummy-vnstat-config.txt` - Dummy vnStat configuration

## Usage

### Using the Mock vnstat Binary

The mock vnstat binary is a Node.js script that simulates the behavior of the real vnstat command. It returns dummy data instead of requiring actual network monitoring.

#### Method 1: Set NODE_APP_BIN environment variable

```bash
# Run tests with the mock binary
NODE_APP_BIN=./fixtures/mock-vnstat npm test

# Or set it for a single command
NODE_APP_BIN=./fixtures/mock-vnstat node your-script.js
```

#### Method 2: Pass bin option when requiring the module

```javascript
const vnstat = require('vnstat-dumpdb')({
  bin: './fixtures/mock-vnstat'
});

vnstat.getStats('eth0', function(err, data) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

### Supported Interfaces

The dummy database includes two network interfaces:

1. **eth0** - Primary interface with comprehensive test data
   - Total traffic: 1 GB RX, 512 MB TX
   - 3 days of statistics
   - 3 months of statistics
   - 3 top traffic days
   - Hourly statistics

2. **dummy0** - Secondary interface with minimal test data
   - Total traffic: 500 MB RX, 250 MB TX
   - 2 days of statistics
   - 2 months of statistics
   - 1 top traffic day

### Example: Testing Your Application

```javascript
// Initialize with mock binary
const vnstat = require('vnstat-dumpdb')({
  bin: './fixtures/mock-vnstat'
});

// Get stats for eth0 interface
vnstat.getStats('eth0', function(err, data) {
  if (err) {
    console.error(err);
    return;
  }
  
  console.log('Interface:', data.id);
  console.log('Total RX:', data.traffic.total.rx);
  console.log('Total TX:', data.traffic.total.tx);
  console.log('Last 3 days:', data.traffic.days);
});

// Get all interfaces
vnstat.getStats(function(err, interfaces) {
  if (err) {
    console.error(err);
    return;
  }
  
  console.log('Total interfaces:', interfaces.length);
  interfaces.forEach(function(iface) {
    console.log('- ' + iface.id);
  });
});

// Get vnStat configuration
vnstat.getConfig(function(err, config) {
  if (err) {
    console.error(err);
    return;
  }
  
  console.log('Update interval:', config.UpdateInterval, 'seconds');
  console.log('Database directory:', config.DatabaseDir);
});
```

### Data Format

The dummy data complies with vnStat v2.9 JSON format and includes:

- **vnstatversion**: Version identifier (2.9)
- **jsonversion**: JSON format version (2)
- **interfaces**: Array of interface objects, each containing:
  - **id/name**: Interface identifier (e.g., "eth0")
  - **created/updated**: Timestamps with date and time objects
  - **traffic**: Object containing:
    - **total**: Overall RX/TX bytes
    - **days**: Array of daily statistics with date, rx, tx values
    - **months**: Array of monthly statistics
    - **tops**: Array of top traffic days with date, time, rx, tx
    - **hours**: Array of hourly statistics (optional)

### Customizing the Dummy Data

You can customize the dummy data by editing the JSON and config files:

1. **dummy-vnstat-data.json** - Modify interface names, traffic values, dates
2. **dummy-vnstat-config.txt** - Adjust vnStat configuration settings

After making changes, the mock binary will automatically use the updated data.

## Benefits

- **No Installation Required**: No need to install and configure vnStat
- **Consistent Data**: Predictable test data for reliable testing
- **Fast Tests**: Instant response without waiting for data collection
- **Offline Testing**: Works without network interfaces or root access
- **CI/CD Friendly**: Perfect for automated testing pipelines

## Notes

- The mock binary requires Node.js to run (already a dependency of this package)
- The mock binary simulates vnstat v2.9 behavior
- All traffic values are in bytes
- Dates use the format: `{ year: YYYY, month: MM, day: DD }`
- Times use the format: `{ hour: HH, minute: MM }`
