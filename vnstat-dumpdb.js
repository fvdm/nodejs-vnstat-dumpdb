/*
Name:           vnstat-dumpdb
Description:    Get vnStat data and config in Node.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-vnstat-dumpdb
Feedback:       https://github.com/fvdm/nodejs-vnstat-dumpdb/issues
License:        Unlicense (see LICENSE file)
*/

var exec = require ('child_process') .exec;

var set = {
  bin: 'vnstat',
  iface: null,
  config: {}
};


/**
 * Make and callback an error
 *
 * @callback callback
 * @param message {string} - Error.message
 * @param err {Error, null} - Error.error
 * @param details {mixed} - Error.details
 * @param callback {function} - `function (err) {}`
 * @returns {void}
 */

function doError (message, err, details, callback) {
  var error = new Error (message);

  error.error = err;
  error.details = details;
  callback (error);
}


/**
 * Get vnStat config
 *
 * @callback callback
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function getConfig (callback) {
  exec (set.bin + ' --showconfig', function (err, text) {
    var error = null;
    var config = {};
    var line;
    var i;

    if (err) {
      doError ('no config', err, text, callback);
      return;
    }

    text = text.split ('\n');

    for (i = 0; i < text.length; i++) {
      line = text [i] .trim ();

      if (line.substr (0, 1) !== '#') {
        line.replace (/(\w+)\s+(.+)/, function (s, key, val) {
          config [key] = val.slice (0, 1) === '"' ? val.slice (1, -1) : val;
        });
      }
    }

    callback (null, config);
  });
}


/**
 * Get stats database
 *
 * @callback callback
 * @param [iface] {string} - Limit data to one interface
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function getStats (iface, callback) {
  var i;

  if (typeof iface === 'function') {
    callback = iface;
    iface = set.iface;
  }

  exec (set.bin + ' --json', function (err, json, stderr) {
    var error = null;

    if (err instanceof Error) {
      doError (stderr.trim (), err, json, callback);
      return;
    }

    try {
      json = JSON.parse (json);
    } catch (e) {
      doError ('invalid data', e, json, callback);
      return;
    }

    if (iface) {
      for (i = 0; i < json.interfaces.length; i++) {
        if (json.interfaces [i] .id === iface) {
          callback (null, json.interfaces [i]);
          return;
        }
      }

      callback (new Error ('invalid interface'));
      return;
    }

    callback (null, json.interfaces);
  });
}


/**
 * Configuration
 *
 * @param [setup] {object}
 * @param [setup.bin] {string=vnstat} - Command of or path to vnstat binary
 * @param [setup.iface] {string} - Select interface, defaults to all (null)
 * @returns {object} - Module interface methods
 */

module.exports = function (setup) {
  if (setup instanceof Object) {
    set.bin = setup.bin || set.bin;
    set.iface = setup.iface || set.iface;
  }

  return {
    getStats: getStats,
    getConfig: getConfig,
    set: set
  };
};
