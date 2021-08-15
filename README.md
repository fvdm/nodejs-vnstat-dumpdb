vnstat-dumpdb
=============

Get network traffic statistics from [vnStat](https://github.com/vergoh/vnstat). All methods return promises.

[![npm](https://img.shields.io/npm/v/vnstat-dumpdb.svg?maxAge=3600)](https://github.com/fvdm/nodejs-vnstat-dumpdb/blob/master/CHANGELOG.md)
[![Build Status](https://github.com/fvdm/nodejs-vnstat-dumpdb/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/fvdm/nodejs-vnstat-dumpdb/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/fvdm/nodejs-vnstat-dumpdb/badge.svg?branch=master)](https://coveralls.io/github/fvdm/nodejs-vnstat-dumpdb?branch=master)


Example
-------

```js
const vnStatDumpDb = require ('vnstat-dumpdb');
const vnstat = new vnStatDumpDb();

// Get traffic per day
vnstat.getStats ({ iface: 'eth0' })
.then (data => console.log (data.traffic.days))
.catch (console.error);

// Read config setting
vnstat.getConfig()
.then (config => {
  console.log (`Interfaces updating every ${config.updateInterval} minutes`);
})
.catch (console.error);
```


Installation
------------

Make sure you have **vnStat v1.13** or later.

`npm install vnstat-dumpdb`


Configuration
-------------

The module loads as a function, where you can override
the defaults:

setting      | type   | default  | description
:------------|:-------|:---------|:-----------
[binPath]    | string | 'vnstat' | Path to vnstat binary
[iface]      | string | null     | Limit to interface: `eth0`
[configFile] | string |          | vnStat config file path
[timeout]    | number | 2000     | Wait ms for command result

The setting `binPath` can be anything you run on a shell.
For example, you can access vnstat on a remote server using a SSH tunnel:

```js
const vnStatDumpDB = require ('vnstat-dumpdb')(
const vnstat = new vnStatDumpDB ({
  binPath: 'ssh user@server vnstat',
  timeout: 4000,
});
```


getStats ({ [iface] })
--------

Get statistics for one, multiple or all interfaces.

When using an old vnStat v1 the data is converted
to match the v2 structure for consistency.
* One: `vnstat.getStats ({ iface: 'eth0' })`
* All: `vnstat.getStats ()`


```js
// Get traffic for interface en1
const data = await vnstat.getStats ({ iface: 'en1' });

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


getConfig ()
---------

Get vnStat configuration.

```js
const config = await vnstat.getConfig();

console.log (`Interfaces updating every ${config.UpdateInterval} seconds`);
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

For more information, please refer to <https://unlicense.org>


Author
------

[Franklin](https://fvdm.com)
| [Buy me a coffee](https://fvdm.com/donating)
