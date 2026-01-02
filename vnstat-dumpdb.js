/*
Name:           vnstat-dumpdb
Description:    Get vnStat data and config in Node.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-vnstat-dumpdb
Feedback:       https://github.com/fvdm/nodejs-vnstat-dumpdb/issues
License:        Unlicense (see LICENSE file)
*/

const { exec } = require( 'child_process' );

const set = {
  bin: 'vnstat',
  iface: null,
  config: {},
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

function doError ( message, err, details, callback ) {
  const error = new Error( message );

  error.error = err;
  error.details = details;
  callback( error );
}


/**
 * Get vnStat config
 *
 * @callback callback
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function getConfig ( callback ) {
  exec( `${set.bin} --showconfig`, ( err, text ) => {
    if ( err ) {
      doError( 'no config', err, text, callback );
      return;
    }

    const config = {};
    const lines = text.split( '\n' );

    for ( const line of lines ) {
      const trimmed = line.trim();

      if ( ! trimmed.startsWith( '#' ) ) {
        trimmed.replace( /(\w+)\s+(.+)/, ( s, key, val ) => {
          config[key] = val.startsWith( '"' ) ? val.slice( 1, -1 ) : val;
        } );
      }
    }

    callback( null, config );
  } );
}


/**
 * Get stats database
 *
 * @callback callback
 * @param [iface] {string} - Limit data to one interface
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function getStats ( iface, callback ) {
  if ( typeof iface === 'function' ) {
    callback = iface;
    iface = set.iface;
  }

  exec( `${set.bin} --json`, ( err, json, stderr ) => {
    if ( err ) {
      err.stderr = stderr;
      doError( 'command failed', err, json, callback );
      return;
    }

    let data;

    try {
      data = JSON.parse( json );
    }
    catch ( e ) {
      doError( 'invalid data', e, json, callback );
      return;
    }

    if ( iface ) {
      const found = data.interfaces.find( ( ifc ) => ifc.id === iface );

      if ( found ) {
        callback( null, found );
        return;
      }

      doError( 'invalid interface', { iface }, data, callback );
      return;
    }

    callback( null, data.interfaces );
  } );
}


/**
 * Configuration
 *
 * @param [setup] {object}
 * @param [setup.bin] {string=vnstat} - Command of or path to vnstat binary
 * @param [setup.iface] {string} - Select interface, defaults to all (null)
 * @returns {object} - Module interface methods
 */

module.exports = ( setup ) => {
  if ( setup instanceof Object ) {
    set.bin = setup.bin ?? set.bin;
    set.iface = setup.iface ?? set.iface;
  }

  return {
    getStats,
    getConfig,
    set,
  };
};
