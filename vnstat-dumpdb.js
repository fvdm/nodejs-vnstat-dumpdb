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
 * @returns {Error}
 */

function doError (message, err, details, callback) {
  var error = new Error (message);

  error.error = err;
  error.details = details;
  callback (error);
  return error;
}


/**
 * Get vnStat config
 *
 * @callback callback
 * @param callback {function} - `function (err, data) {}`
 * @returns {Error, object}
 */

function getConfig (callback) {
  exec (set.bin + ' --showconfig', function (err, text) {
    var config = {};
    var line;
    var i;

    if (err) {
      return doError ('no config', err, text, callback);
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
    return config;
  });
}


/**
 * Get stats database
 *
 * @callback callback
 * @param [iface] {string} - Limit data to one interface
 * @param callback {function} - `function (err, data) {}`
 * @returns {Error, object, array}
 */

function getStats (iface, callback) {
  var i;

  if (typeof iface === 'function') {
    callback = iface;
    iface = set.iface;
  }

  exec (set.bin + ' --json', function (err, json, stderr) {
    if (err) {
      err.stderr = stderr;
      return doError ('command failed', err, json, callback);
    }

    try {
      json = JSON.parse (json);
    } catch (e) {
      return doError ('invalid data', e, json, callback);
    }

    if (iface) {
      for (i = 0; i < json.interfaces.length; i++) {
        if (json.interfaces [i] .id === iface) {
          callback (null, json.interfaces [i]);
          return json.interfaces [i];
        }
      }

      return doError ('invalid interface', { iface }, json, callback);
    }

    callback (null, json.interfaces);
    return json.interfaces;
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
