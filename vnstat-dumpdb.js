var exec = require ('child_process') .exec;

var set = {
  bin: 'vnstat',
  iface: null,
  config: {}
};

// Load config
function getConfig (callback) {
  exec (set.bin +' --showconfig', function (err, text, stderr) {
    if (err) {
      var error = new Error ('no config');
      error.details = text;
      error.error = err;
      callback (error);
    }

    var config = {};
    var i;

    text = text.split ('\n');
    for (i = 0; i < text.length; i++) {
      var line = text [i] .trim ();
      if (line.substr (0,1) != '#') {
        line.replace (/(\w+)\s+(.+)/, function (s, key, val) {
          config [key] = val.slice (0, 1) === '"' ? val.slice (1, -1) : val;
        });
      }
    }
    callback (null, config);
  });
}

// Stats database
function getStats (iface, callback) {
  var i;
  if (typeof iface === 'function') {
    callback = iface;
    iface = set.iface;
  }

  exec (set.bin +' --json', function (err, json, stderr) {
    var error = null;
    if (err instanceof Error) {
      error = new Error (stderr.trim ());
      error.details = json;
      return callback (error);
    }

    try {
      json = JSON.parse (json);
    }
    catch (e) {
      error = new Error ('invalid data');
      error.details = json;
      return callback (error);
    }

    if (iface) {
      for (i = 0; i < json.interfaces.length; i++) {
        if (json.interfaces [i] .id === iface) {
          return callback (null, json.interfaces [i]);
        }
      }
      callback (new Error ('invalid interface'));
    } else {
      callback (null, json.interfaces);
    }
  });
}

// Setup
module.exports = function (setup) {
  if (setup instanceof Object) {
    for (var key in setup) {
      set [key] = setup [key];
    }
  }

  return {
    getStats: getStats,
    getConfig: getConfig,
    set: set
  };
};
