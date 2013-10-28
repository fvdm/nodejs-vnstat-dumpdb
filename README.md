vnstat-dumpdb
=============


Wrapper for vnStat --dumpdb, with error handling and the same output structure on each system


Installation
------------

### From NPM registry

The NPM release is always the recent *stable* version.

	npm install vnstat-dumpdb


### From Github

The code on Github is the most recent version, but may be untested.

	npm install git+https://github.com/fvdm/nodejs-vnstat-dumpdb


Config
------

You can change a few parameters to reflect your system. Defaults:

	vnstat.set.bin   = 'vnstat'  // set to your vnstat path
	vnstat.set.iface = ''        // empty: all interfaces, or eth0, en1, etc


dumpdb
------

This method executes `vnstat --dumpdb --xml` and processes the output. It takes only a `callback` function. When everything seems alright `err` is null, otherwise `err` will be `instanceof Error` for tracing.

```js
function( err, data ) {
	if( err instanceof Error ) {
		console.log( err )
	} else {
		console.log( data )
	}
}
```


### Properties:

	err.message   : the error message
	err.stack     : stack trace
	err.details   : other information when available


### Example:

```js
var vnstat = require('vnstat-dumpdb')

// get the stats
vnstat.dumpdb( function( err, data ) {
	if( err ) {
		console.log( err.message, err.stack )
	} else {
		console.log( require('util').inspect( data, false, 10 ) )
	}
})
```

```js
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


Unlicense / Public Domain
-------------------------

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
