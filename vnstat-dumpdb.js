/*
Name:           vnstat-dumpdb
Description:    Get vnStat data and config in Node.js
Author:         Franklin (https://frankl.in)
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
 * @param     {string}      message   Error.message
 * @param     {Error|null}  err       Error.error
 * @param     {mixed}       details   Error.details
 * @param     {functions}   callback  `(err)`
 * @returns   {void}
 * @callback  callback
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
 * @param     {function}  callback  `(err, data)`
 * @returns   {void}
 * @callback  callback
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
 * @param     {string}    [iface]   Limit data to one interface
 * @param     {function}  callback  `(err, data)`
 * @returns   {void}
 * @callback  callback
 */

function getStats ( iface, callback ) {
  let actualIface = iface;

  if ( typeof iface === 'function' ) {
    callback = iface;
    actualIface = set.iface || false;
  }

  exec( `${set.bin} --json`, ( err, json, stderr ) => {
    if ( err ) {
      err.stderr = stderr;
      doError( 'command failed', err, json, callback );
      return;
    }

    try {
      json = JSON.parse( json );
    }
    catch ( e ) {
      doError( 'invalid data', e, json, callback );
      return;
    }

    if ( actualIface ) {
      const found = json.interfaces.find( ( ifc ) => ifc.id === actualIface || ifc.name === actualIface );

      if ( found ) {
        callback( null, found );
        return;
      }

      doError( 'invalid interface', { iface: actualIface }, json, callback );
      return;
    }

    callback( null, json.interfaces );
  } );
}


/**
 * Configuration
 *
 * @param    {object}  [setup]
 * @param    {string}  [setup.bin=vnstat]  Command of or path to vnstat binary
 * @param    {string}  [setup.iface]       Select interface, defaults to all (false)
 * @returns  {object}                      Module interface methods
 */

module.exports = ( {

  bin = set.bin,
  iface = set.iface,
 
} = {} ) => {

  set.bin = bin;
  set.iface = iface;

  return {
    getStats,
    getConfig,
    set,
  };
 
};
