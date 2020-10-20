/*
Name:           vnstat-dumpdb
Description:    Get vnStat data and config in Node.js
Author:         Franklin (https://fvdm.com)
Source & docs:  https://github.com/fvdm/nodejs-vnstat-dumpdb
Feedback:       https://github.com/fvdm/nodejs-vnstat-dumpdb/issues
License:        Unlicense (see LICENSE file)
*/

const { exec } = require ('child_process');

module.exports = class vnStat {

  /**
   * @param   {string}  [bin]    Path to vnstat binary
   * @param   {string}  [iface]         Limit to interface
   */

  constructor ({
    bin = 'vnstat',

    iface = null,

  } = {}) {

    this._config = {
      bin,
      iface,
    };

  }


  /**
   * Run CLI command async
   * correctly mapping stdErr to Promise reject
   *
   * @param   {string}  command  CLI command to execute
   *
   * @return  {Promise<string>}
   */

  _cmd (command) {
    return new Promise ((resolve, reject) => {
      exec (command, (err, stdout, stderr) => {
        if (err) {
          reject (err);
          return;
        }

        if (stderr) {
          reject (new Error (stderr));
          return;
        }

        resolve (stdout);
      });
    });
  }


  /**
   * Get vnStat config
   *
   * @return  {Promise<object>}
   */

  async getConfig () {
    const text = await this._cmd (`${this._config.bin} --showconfig`);
    const config = {};

    text = text.split ('\n');

    text.forEach (line => {
      line = line.trim();

      line.replace (/^([^#]\w+)\s+(")?(.+)\2/, (s, key, q, val) => {
        config[key] = val;
      });
    });

    return config;
  }


  /**
   * Get stats database
   *
   * @param   {string}  [iface]  Limit data to one interface
   *
   * @return  {Promise<array>}
   */

  async getStats ({

    iface = this._config.iface,

  } = {}) {

    let data;
    let ifaces;

    iface = iface ? `-i ${iface}` : '';

    data = await this._cmd ({ args: `${iface} --json` });
    data = JSON.parse (data);
    ifaces = data.interfaces;

    // Convert interfaces to jsonversion 2
    if (data.jsonversion === '1') {
      ifaces.forEach ((itm, key) => {
        ifaces[key].name = itm.id;
        ifaces[key].traffic.hour = itm.traffic.hours;
        ifaces[key].traffic.day = itm.traffic.days;
        ifaces[key].traffic.month = itm.traffic.months;
        ifaces[key].traffic.top = itm.traffic.tops;

        delete ifaces[key].traffic.hours;
        delete ifaces[key].traffic.days;
        delete ifaces[key].traffic.months;
        delete ifaces[key].traffic.tops;
      });
    }

    if (iface) {
      data = data.filter (ifc => ifc.id === iface);
    }

    return ifaces;

  }

};
