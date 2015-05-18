var exec = require ('child_process') .exec;
var xml2json = require ('node-xml2json');

module.exports = {
  set: {
    bin: 'vnstat',
    iface: ''
  }
};

// parse interface
function fixInterface (iface) {
  // id
  if (iface.id && iface.id [0]) {
    iface.id = iface.id [0];
  }

  // days
  if (iface.traffic.days.day [0]) {
    for (var d in iface.traffic.days.day) {
      iface.traffic.days.day [d] .rx = iface.traffic.days.rx [d] || iface.traffic.days.day [d] .rx || 0;
      iface.traffic.days.day [d] .tx = iface.traffic.days.tx [d] || iface.traffic.days.day [d] .tx || 0;
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
    for (var m in iface.traffic.months.month) {
      iface.traffic.months.month [m] .rx = iface.traffic.months.rx [m] || iface.traffic.months.month [m] .rx || 0;
      iface.traffic.months.month [m] .tx = iface.traffic.months.tx [m] || iface.traffic.months.month [m] .tx || 0;
    }
    iface.traffic.months = iface.traffic.months.month;
  } else if (iface.traffic.months.month.id) {
    var month = iface.traffic.months.month;
    month.rx = iface.traffic.months.rx || 0;
    month.tx = iface.traffic.months.tx || 0;
    iface.traffic.months = [month];
  }

  // hours
  iface.traffic.hours = iface.traffic.hour || [];

  // tops
  if (!iface.traffic.tops.top) {
    iface.traffic.tops = [];
  } else {
    iface.traffic.tops = iface.traffic.tops.top;
  }

  return iface;
}

// --dumpdb
module.exports.dumpdb = function (cb) {
  var iface = module.exports.set.iface ? ' -i '+ module.exports.set.iface : '';

  exec (module.exports.set.bin + iface +' --dumpdb --xml', function (error, xml, stderr) {
    if (error instanceof Error) {
      var err = new Error (stderr.trim ());
      cb (err);
    }

    xml = xml.trim ();
    if (xml.substr (0, 8) == '<vnstat ') {
      xml = xml2json.parser (xml);
      if (xml.vnstat === undefined) {
        cb (new Error ('invalid xml'));
      } else {
        if (xml.vnstat.interface [0]) {
          // multiple
          var ifaces = {};
          for (var i in xml.vnstat.interface) {
            iface = fixInterface (xml.vnstat.interface [i]);
            ifaces [iface.id || iface.nick] = iface;
          }
          cb (null, ifaces);
        } else {
          // just one iface
          cb (null, fixInterface (xml.vnstat.interface));
        }
      }
    } else {
      var err = new Error ('not xml');
      if (typeof xml === 'string') {
        err.details = xml;
      }
      cb (err);
    }
  });
};
