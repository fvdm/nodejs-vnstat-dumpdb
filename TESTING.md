Testing
=======

## Using the Dummy Database

For testing purposes, this package includes a mock vnstat binary and dummy data that allows you to test your code without requiring vnStat to be installed or configured.

The dummy database includes:
- Two network interfaces (`eth0` and `dummy0`)
- Sample daily, monthly, and top traffic statistics
- Realistic configuration data

**Using the mock binary in tests:**

```js
// Set environment variable before running tests
NODE_APP_BIN=./fixtures/mock-vnstat npm test

// Or use it directly in your code
var vnstat = require('vnstat-dumpdb')({
  bin: './fixtures/mock-vnstat'
});

vnstat.getStats('eth0', function(err, data) {
  // Test with dummy data
  console.log(data);
});
```

**Managing the dummy database:**

```bash
# Display information about the dummy database
node generate-dummy-db.js info

# Validate the dummy data format
node generate-dummy-db.js validate

# Run the example
cd fixtures && node example.js
```

For detailed information about the dummy database and testing, see [fixtures/README.md](fixtures/README.md).
