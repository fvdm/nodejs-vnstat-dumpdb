var dotest = require ('dotest');
var app = require ('./');

// Setup
// $ NODE_APP_IFACE=eth0 npm test
var config = {
  bin: process.env.NODE_APP_BIN || null,
};

var iface = process.env.NODE_APP_IFACE || 'eth0';

var vnstat = app (config);


dotest.add ('Module', test => {
  test()
    .isFunction ('fail', 'exports', app)
    .isObject ('fail', 'interface', vnstat)
    .isFunction ('fail', '.getConfig', vnstat && vnstat.getConfig)
    .isFunction ('fail', '.getStats', vnstat && vnstat.getStats)
    .done()
  ;
});


dotest.add ('Method .getConfig', async test => {
  try {
    const data = await vnstat.getConfig();

    test (err)
      .isObject ('fail', 'data', data)
      .isNotEmpty ('fail', 'data.DatabaseDir', data && data.DatabaseDir)
      .isNotEmpty ('fail', 'data.Interface', data && data.Interface)
      .done()
    ;
  }
  catch (err) {
    test (err).done();
  }
});


dotest.add ('Method .getStats - iface', async test => {
  try {
    const data = await vnstat.getStats ({ iface });
    const days = data && data.traffic && data.traffic.days;
    const rx = days && days[0] && days[0].rx;

    test()
      .isObject ('fail', 'data', data)
      .isString ('fail', 'data.id', data && data.id)
      .isObject ('fail', 'data.traffic', data && data.traffic)
      .isArray ('fail', 'data.traffic.days', days)
      .isObject ('fail', 'data.traffic.days[0]', days && days[0])
      .isNumber ('fail', 'data.traffic.days[0].rx', rx)
      .done()
    ;
  }
  catch (err) {
    test (err);
  }
});


dotest.add ('Method .getStats - all', async test => {
  try {
    const data = await vnstat.getStats();

    test()
      .isArray ('fail', 'data', data)
      .done()
    ;
  }
  catch (err) {
    test (err).done();
  }
});


dotest.add ('Error: invalid interface', async test => {
  try {
    const data = await vnstat.getStats ({
      iface: 'unreal-iface',
    });

    test()
      .isUndefined ('fail', 'data', data)
      .done()
    ;
  }
  catch (err) {
    test()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'invalid interface')
      .done()
    ;
  }
});


dotest.add ('Error: no config', async test => {
  config.bin = '-';
  vnstat = app (config);

  try {
    const data = async vnstat.getConfig();

    test()
      .isUndefined ('fail', 'data', data)
      .done()
    ;
  }
  catch (err) {
    test()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'no config')
      .done()
    ;
  }
});


dotest.add ('Error: command failed', async test => {
  config.bin = '-';
  vnstat = app (config);

  try {
    const data = await vnstat.getStats();

    test()
      .isUndefined ('fail', 'data', data)
      .done()
    ;
  }
  catch (err) {
    test()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'command failed')
      .done()
    ;
  }
});


// Start the tests
dotest.run();
