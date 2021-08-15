const dotest = require ('dotest');
const app = require ('./');

// Setup
// $ NODE_APP_IFACE=eth0 npm test
let config = {
  binPath: process.env.NODE_APP_BINPATH || null,
};

let testOld = process.env.NODE_APP_TESTOLD || null;
let iface = process.env.NODE_APP_IFACE || 'eth0';

let vnstat = new app (config);


dotest.add ('Module', test => {
  test()
    .info (`Config binPath: ${config.binPath}`)
    .info (`Config iface:   ${iface}`)
    .isClass ('fail', 'app', app)
    .isInstanceOf ('fail', 'app', app, 'vnStat')
    .isObject ('fail', 'interface', vnstat)
    .isFunction ('fail', '.getVersion', vnstat && vnstat.getVersion)
    .isFunction ('fail', '.getConfig', vnstat && vnstat.getConfig)
    .isFunction ('fail', '.getStats', vnstat && vnstat.getStats)
    .done()
  ;
});


dotest.add ('Method .getConfig', async test => {
  let error;
  let data;

  try {
    data = await vnstat.getConfig();
  }

  catch (err) {
    error = err;
  }

  test (error)
    .isObject ('fail', 'data', data)
    .isNotEmpty ('fail', 'data.DatabaseDir', data && data.DatabaseDir)
    .isNotEmpty ('fail', 'data.Interface', data && data.Interface)
    .done()
  ;
});


dotest.add ('Method .getStats - iface', async test => {
  let error;
  let data;
  let day;
  let rx;

  try {
    data = await vnstat.getStats ({ iface });
    day = data && data.traffic && data.traffic.day;
    rx = day && day[0] && day[0].rx;
  }

  catch (err) {
    error = err;
  }

  test (error)
    .isObject ('fail', 'data', data)
    .isString ('fail', 'data.name', data && data.name)
    .isObject ('fail', 'data.traffic', data && data.traffic)
    .isArray ('fail', 'data.traffic.hour', data && data.traffic.hour)
    .isArray ('fail', 'data.traffic.day', data && data.traffic.day)
    .isArray ('fail', 'data.traffic.month', data && data.traffic.month)
    .isArray ('fail', 'data.traffic.top', data && data.traffic.top)
    .isObject ('fail', 'data.traffic.day[0]', day && day[0])
    .isNumber ('fail', 'data.traffic.day[0].rx', rx)
    .done()
  ;
});


dotest.add ('Method .getStats - all', async test => {
  let error;
  let data;
  let itm;

  try {
    data = await vnstat.getStats();
    itm = Array.isArray (data) && data[0];
  }

  catch (err) {
    error = err;
  }

  test (error)
    .isArray ('fail', 'data', data)
    .isObject ('fail', 'data[0]', itm)
    .isString ('fail', 'data[0].name', itm && itm.name)
    .isObject ('fail', 'data[0].traffic', itm && itm.traffic)
    .isArray ('fail', 'data[0].traffic.hour', itm && itm.traffic.hour)
    .isArray ('fail', 'data[0].traffic.day', itm && itm.traffic.day)
    .isArray ('fail', 'data[0].traffic.month', itm && itm.traffic.month)
    .isArray ('fail', 'data[0].traffic.top', itm && itm.traffic.top)
    .done()
  ;
});


dotest.add ('Error: invalid interface', async test => {
  let error;
  let data;

  try {
    data = await vnstat.getStats ({
      iface: 'unreal-iface',
    });
  }

  catch (err) {
    error = err;
  }

  test()
    .isError ('fail', 'err', error)
    .isRegexpMatch ('fail', 'err.message', error && error.message, /(Interface .+ not found in database|Unable to read database)/)
    .isUndefined ('fail', 'data', data)
    .done()
  ;
});


dotest.add ('Error: no config', async test => {
  let error;
  let data;
  let conf = { ...config, configFile: 'not-vnstat' };
  let vn = new app (conf);

  try {
    data = await vn.getConfig();
  }

  catch (err) {
    error = err;
  }

  test()
    .isError ('fail', 'err', error)
    .isRegexpMatch ('fail', 'err.message', error && error.message, /Unable to open given config file/)
    .isUndefined ('fail', 'data', data)
    .done()
  ;
});


dotest.add ('Error: command failed', async test => {
  let error;
  let data;
  let conf = { ...config, binPath: 'not-vnstat' };
  let vn = new app (conf);

  try {
    data = await vn.getStats();
  }

  catch (err) {
    error = err;
  }

  test()
    .isError ('fail', 'err', error)
    .isExactly ('fail', 'err.killed', error && error.killed, false)
    .isNumber ('fail', 'err.code', error && error.code)
    .isNotEmpty ('fail', 'err.cmd', error && error.cmd)
    .isUndefined ('fail', 'data', data)
    .done()
  ;
});


dotest.add ('Method .getVersion', async test => {
  let error;
  let data;

  try {
    data = await vnstat.getVersion();
  }

  catch (err) {
    error = err;
  }

  test (error)
    .isObject ('fail', 'data', data)
    .isNumber ('fail', 'data.version', data && data.version)
    .isNumber ('fail', 'data.major', data && data.major)
    .isNumber ('fail', 'data.minor', data && data.minor)
    .done()
  ;
});


// Start the tests
dotest.run();
