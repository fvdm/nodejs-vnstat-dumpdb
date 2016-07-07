var dotest = require ('dotest');
var app = require ('./');

// Setup
// $ NODE_APP_IFACE=eth0 npm test
var config = {
  bin: process.env.NODE_APP_BIN || null
};

var iface = process.env.NODE_APP_BIN || 'eth0';

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
  vnstat.getConfig (function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isNotEmpty ('fail', 'data.DatabaseDir', data && data.DatabaseDir)
      .isNotEmpty ('fail', 'data.Interface', data && data.Interface)
      .done ();
  });
});

dotest.add ('Method .getStats - iface', function (test) {
  vnstat.getStats (iface, function (err, data) {
    var days = data && data.traffic && data.traffic.days;
    var rx = days && days [0] && days [0] .rx;

    test (err)
      .isObject ('fail', 'data', data)
      .isString ('fail', 'data.id', data && data.id)
      .isObject ('fail', 'data.traffic', data && data.traffic)
      .isArray ('fail', 'data.traffic.days', days)
      .isObject ('fail', 'data.traffic.days[0]', days && days [0])
      .isNumber ('fail', 'data.traffic.days[0].rx', rx)
      .done ();
  });
});

dotest.add ('Method .getStats - all', function (test) {
  vnstat.getStats (function (err, data) {
    test (err)
      .isArray ('fail', 'data', data)
      .done ();
  });
});

dotest.add ('Method .getStats - error', function (test) {
  vnstat.getStats ('unreal-iface', function (err) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'invalid interface')
      .done ();
  });
});


// Start the tests
dotest.run ();
