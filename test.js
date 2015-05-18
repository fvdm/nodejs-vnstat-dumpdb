var util = require ('util');

// Setup
// $ NODE_APP_IFACE=eth0 npm test
var app = require ('./') ();


// handle exits
var errors = 0;
process.on ('exit', function () {
  if (errors === 0) {
    console.log ('\n\033[1mDONE, no errors.\033[0m\n');
    process.exit (0);
  } else {
    console.log ('\n\033[1mFAIL, '+ errors +' error'+ (errors > 1 ? 's' : '') +' occurred!\033[0m\n');
    process.exit (1);
  }
});

// prevent errors from killing the process
process.on ('uncaughtException', function (err) {
  console.log ();
  console.error (err.stack);
  console.log ();
  errors++;
});

// Queue to prevent flooding
var queue = [];
var next = 0;

function doNext () {
  next++;
  if (queue [next]) {
    queue [next] ();
  }
}

// doTest( passErr, 'methods', [
//   ['feeds', typeof feeds === 'object']
// ])
function doTest (err, label, tests) {
  if (err instanceof Error) {
    console.error (label +': \033[1m\033[31mERROR\033[0m\n');
    console.error (util.inspect (err, {depth: 10, colors: true}));
    console.log ();
    console.error (err.stack);
    console.log ();
    errors++;
  } else {
    var testErrors = [];
    for (var i = 0; i < tests.length; i++) {
      if (tests [i] [1] !== true) {
        testErrors.push (tests [i] [0]);
        errors++;
      }
    }

    if (testErrors.length === 0) {
      console.log (label +': \033[1m\033[32mok\033[0m');
    } else {
      console.error (label +': \033[1m\033[31mfailed\033[0m ('+ testErrors.join (', ') +')');
    }
  }

  doNext ();
}

queue.push (function () {
  app.getConfig (function (err, data) {
    doTest (err, 'getConfig', [
      ['DatabaseDir', !!data.DatabaseDir],
      ['Interface', !!data.Interface]
    ]);
  })
});

queue.push (function () {
  app.getStats (process.env.NODE_APP_IFACE || 'eth0', function (err, data) {
    doTest (err, 'getStats iface', [
      ['data type', typeof data === 'object'],
      ['id', typeof data.id === 'string'],
      ['days type', data.traffic.days && data.traffic.days instanceof Array],
      ['days item', data.traffic.days && typeof data.traffic.days [0] .rx === 'number']
    ]);
  });
});

queue.push (function () {
  app.getStats (function (err, data) {
    doTest (err, 'getStats all', [
      ['data type', typeof data === 'object' && data instanceof Array]
    ]);
  });
});

queue.push (function () {
  app.getStats ('unreal-iface', function (err) {
    doTest (null, 'getStats error', [
      ['type', err instanceof Error],
      ['message', err.message === 'invalid interface']
    ]);
  });
});


// Start the tests
console.log ('Running tests...\n');
queue [0] ();
