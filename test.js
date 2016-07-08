var dotest = require ('dotest');
var app = require ('./');

// Setup
// $ NODE_APP_IFACE=eth0 npm test
var config = {
  bin: process.env.NODE_APP_BIN || null
};

var iface = process.env.NODE_APP_IFACE || 'eth0';

var vnstat = app (config);


dotest.add ('Module', function (test) {
  test ()
    .isFunction ('fail', 'exports', app)
    .isObject ('fail', 'interface', vnstat)
    .isFunction ('fail', '.getConfig', vnstat && vnstat.getConfig)
    .isFunction ('fail', '.getStats', vnstat && vnstat.getStats)
    .done ();
});

dotest.add ('Method .getConfig', function (test) {
  var result = vnstat.getConfig (function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isNotEmpty ('fail', 'data.DatabaseDir', data && data.DatabaseDir)
      .isNotEmpty ('fail', 'data.Interface', data && data.Interface)
      .isObject ('fail', 'return', result)
      .done ();
  });
});

dotest.add ('Method .getStats - iface', function (test) {
  var result = vnstat.getStats (iface, function (err, data) {
    var days = data && data.traffic && data.traffic.days;
    var rx = days && days [0] && days [0] .rx;

    test (err)
      .isObject ('fail', 'data', data)
      .isString ('fail', 'data.id', data && data.id)
      .isObject ('fail', 'data.traffic', data && data.traffic)
      .isArray ('fail', 'data.traffic.days', days)
      .isObject ('fail', 'data.traffic.days[0]', days && days [0])
      .isNumber ('fail', 'data.traffic.days[0].rx', rx)
      .isObject ('fail', 'return', result)
      .done ();
  });
});

dotest.add ('Method .getStats - all', function (test) {
  var result = vnstat.getStats (function (err, data) {
    test (err)
      .isArray ('fail', 'data', data)
      .isArray ('fail', 'return', result)
      .done ();
  });
});

dotest.add ('Error: invalid interface', function (test) {
  var result = vnstat.getStats ('unreal-iface', function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'invalid interface')
      .isUndefined ('fail', 'data', data)
      .isError ('fail', 'return', result)
      .done ();
  });
});

dotest.add ('Error: no config', function (test) {
  var result;

  config.bin = '-';
  vnstat = app (config);

  result = vnstat.getConfig (function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'no config')
      .isUndefined ('fail', 'data', data)
      .isError ('fail', 'return', result)
      .done ();
  });
});

dotest.add ('Error: command failed', function (test) {
  var result;

  config.bin = '-';
  vnstat = app (config);

  result = vnstat.getStats (function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'command failed')
      .isUndefined ('fail', 'data', data)
      .isError ('fail', 'return', result)
      .done ();
  });
});


// Start the tests
dotest.run ();
