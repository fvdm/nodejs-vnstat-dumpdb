vnstat-dumpdb
=============

Get network traffic statistics from [vnStat](https://github.com/vergoh/vnstat).

[![npm](https://img.shields.io/npm/v/vnstat-dumpdb.svg?maxAge=3600)](https://github.com/fvdm/nodejs-vnstat-dumpdb/blob/master/CHANGELOG.md)
[![Build Status](https://travis-ci.org/fvdm/nodejs-vnstat-dumpdb.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-vnstat-dumpdb)
[![Dependency Status](https://gemnasium.com/badges/github.com/fvdm/nodejs-vnstat-dumpdb.svg)](https://gemnasium.com/github.com/fvdm/nodejs-vnstat-dumpdb#runtime-dependencies)
[![Coverage Status](https://coveralls.io/repos/github/fvdm/nodejs-vnstat-dumpdb/badge.svg?branch=master)](https://coveralls.io/github/fvdm/nodejs-vnstat-dumpdb?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/fvdm/nodejs-vnstat-dumpdb.svg)](https://greenkeeper.io/)


Example
-------

```js
const vnstat = require( 'vnstat-dumpdb' )();

// Get traffic per day
vnstat.getStats( 'eth0', ( err, data ) => {
  if ( err ) {
    console.log( err );
    return;
  }

  console.log( data.traffic.days );
} );

// Read config setting
vnstat.getConfig( ( err, config ) => {
  if ( err ) {
    console.log( err );
    return;
  }

  console.log( `Interfaces updating every ${config.UpdateInterval} minutes` );
} );
```


Installation
------------

Make sure you have **vnStat v1.13** or later.

`npm install vnstat-dumpdb`


Configuration
-------------

The module loads as a function to override the defaults:

setting | type   | required | default | description
--------|--------|----------|---------|----------------------
bin     | string | no       | vnstat  | Path to vnstat binary
iface   | string | no       |         | i.e. `eth0` or `false` to list all


Callback & errors
-----------------

Each method below takes a callback _function_ which gets two arguments:

* `err` - Instance of `Error` or `null`
* `data` - Result `object` or not set when error

```js
const myCallback = ( err, data ) => {
  if ( err ) {
    console.log( err );
    console.log( err.stack );
    return;
  }

  console.log( data );
};
```


#### Errors

message           | description                       | additional
------------------|-----------------------------------|---------------------------
no config         | Can't load config for `getConfig` | `err.details`, `err.error`
invalid data      | Can't read stats for `getStats`   | `err.details`
invalid interface | `iface` is invalid or not set up  |



getStats ( [iface], callback )
--------

Get statistics for one, multiple or all interfaces.

* One: `vnstat.getStats( 'eth0', callback )`
* All: `vnstat.getStats( false, callback )`


```js
// Get traffic for interface en1
vnstat.getStats( 'en1', console.log );

// Output
{ id: 'en1',
  nick: 'en1',
  created: { date: { year: 2012, month: 11, day: 21 } },
  updated:
   { date: { year: 2013, month: 10, day: 28 },
     time: { hour: 3, minute: 25 } },
  traffic:
   { total: { rx: 593576855, tx: 63746811 },
     days:
      [ { id: 0,
          date: { year: 2013, month: 10, day: 28 },
          rx: 4083261,
          tx: 119674 },
        { id: 1,
          date: { year: 2013, month: 10, day: 27 },
          rx: 2206367,
          tx: 52314 },
        ...
      ],
     months:
      [ { id: 0,
          date: { year: 2013, month: 10 },
          rx: 158176326,
          tx: 7740561 },
        { id: 1,
          date: { year: 2013, month: 9 },
          rx: 119230002,
          tx: 3394278 },
        ...
      ],
     tops:
      [ { id: 0,
          date: { year: 2013, month: 10, day: 5 },
          time: { hour: 0, minute: 10 },
          rx: 22445455,
          tx: 601967 },
        { id: 1,
          date: { year: 2013, month: 9, day: 23 },
          time: { hour: 0, minute: 0 },
          rx: 20201102,
          tx: 461492 },
        ...
      ],
      hours: []
  }
}
```


getConfig ( callback )
---------

Get vnStat configuration.

```js
vnstat.getConfig( ( err, config ) => {
  if ( err ) {
    console.log( err );
    return;
  }

  console.log( `Interfaces updating every ${config.UpdateInterval} seconds` );
} );
```


Unlicense
---------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>


Author
------

[Franklin van de Meent](https://frankl.in)

[![Buy me a coffee](https://frankl.in/u/kofi/kofi-readme.png)](https://ko-fi.com/franklin)
