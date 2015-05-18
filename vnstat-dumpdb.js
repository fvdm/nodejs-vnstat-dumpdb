var exec = require ('child_process') .exec;
var xml2json = require ('node-xml2json');

var set = {
  bin: 'vnstat',
  iface: null,
  config: {}
};

// Load config
function getConfig (callback) {
  exec (set.bin +' --showconfig', function (err, text, stderr) {
    if (err) {
      var error = new Error ('no config');
      error.details = text;
      error.error = err;
      callback (error);
    }

    var config = {};
    var i;

    text = text.split ('\n');
    for (i = 0; i < text.length; i++) {
      var line = text [i] .trim ();
      if (line.substr (0,1) != '#') {
        line.replace (/(\w+)\s+(.+)/, function (s, key, val) {
          config [key] = val.slice (0, 1) === '"' ? val.slice (1, -1) : val;
        });
      }
    }
    callback (null, config);
  });
}

// parse interface
function fixInterface (iface) {
  var i;

  // id
  if (iface.id && iface.id [0]) {
    iface.id = iface.id [0];
  }

  // days
  if (iface.traffic.days.day [0]) {
    for (i = 0; i < iface.traffic.days.day.length; i++) {
      iface.traffic.days.day [i] .rx = iface.traffic.days.rx [i] || iface.traffic.days.day [i] .rx || 0;
      iface.traffic.days.day [i] .tx = iface.traffic.days.tx [i] || iface.traffic.days.day [i] .tx || 0;
    }
    iface.traffic.days = iface.traffic.days.day;
  } else if (iface.traffic.days.day.id) {
    var day = iface.traffic.days.day;
    day.rx = iface.traffic.days.rx || iface.traffic.days.day.rx || 0;
    day.tx = iface.traffic.days.tx || iface.traffic.days.day.tx || 0;
    iface.traffic.days = [day];
  }

  // months
  if (iface.traffic.months.month [0]) {
    for (i = 0; i < iface.traffic.months.month.length; i++) {
      iface.traffic.months.month [i] .rx = iface.traffic.months.rx [i] || iface.traffic.months.month [i] .rx || 0;
      iface.traffic.months.month [i] .tx = iface.traffic.months.tx [i] || iface.traffic.months.month [i] .tx || 0;
    }
    iface.traffic.months = iface.traffic.months.month;
  } else if (iface.traffic.months.month.id) {
    var month = iface.traffic.months.month;
    month.rx = iface.traffic.months.rx || 0;
    month.tx = iface.traffic.months.tx || 0;
    iface.traffic.months = [month];
  }

  // hours
  if (iface.traffic.hours.hour instanceof Array) {
    iface.traffic.hours = iface.traffic.hours.hour;
  } else {
    iface.traffic.hours = [iface.traffic.hours.hour];
  }

  // tops
  if (!iface.traffic.tops.top) {
    iface.traffic.tops = [];
  } else {
    iface.traffic.tops = iface.traffic.tops.top;
  }

  return iface;
}

// Get database
function getDatabase (iface, callback) {
  exec (set.bin +' -i '+ iface +' --dumpdb --xml', function (err, xml, stderr) {
    var error = null;
    if (err instanceof Error) {
      error = new Error (stderr.trim ());
      callback (error);
    }

    try {
      xml = xml2json.parser (xml.trim ());
      if (!xml.vnstat) {
        error = new Error ('invalid xml');
        error.details = xml;
      } else {
        if (xml.vnstat.interface [0]) {
          // multiple
          var ifaces = {};
          var i;
          for (i = 0; i < xml.vnstat.interface.length; i++) {
            iface = fixInterface (xml.vnstat.interface [i]);
            ifaces [iface.id || iface.nick] = iface;
          }
          xml = ifaces;
        } else {
          // just one iface
          xml = fixInterface (xml.vnstat.interface);
        }
      }
    }
    catch (e) {
      error = new Error ('can not process');
      error.details = xml || '';
      error.error = e;
      xml = null;
    }
    finally {
      callback (error, xml);
    }
  });
}

// --dumpdb
function getStats (iface, callback) {
  if (typeof iface === 'function') {
    callback = iface;
    iface = set.iface;
  }

  iface = iface || set.config.Interface || null;

  if (!iface) {
    getConfig (function (err, data) {
      if (!err) {
        set.config = data;
        iface = data.Interface;
        getDatabase (iface, callback);
      }
    });
  } else {
    getDatabase (iface, callback);
  }
}

// Setup
module.exports = function (setup) {
  if (setup instanceof Object) {
    for (var key in setup) {
      set [key] = setup [key];
    }
  }

  return {
    getStats: getStats,
    getConfig: getConfig,
    set: set
  };
};
