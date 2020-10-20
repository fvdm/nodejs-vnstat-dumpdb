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
   * @param   {string}  [binPath]       Path to vnstat binary
   * @param   {string}  [iface]         Limit to interface
   * @param   {string}  [configFile]    Override default config file path
   * @param   {number}  [timeout=2000]  Wait time in ms for vnstat response
   */

  constructor ({

    binPath = 'vnstat',
    iface = null,
    configFile = null,
    timeout = 2000,

  } = {}) {

    this._config = {
      binPath,
      iface,
      configFile,
      timeout,
    };

  }


  /**
   * Run CLI command async
   * correctly mapping stdErr to Promise reject
   *
   * @param   {string}  args          Arguments for vnStat command
   *
   * @return  {Promise<string>}
   */

  _cmd ({

    args,

  }) {

    const options = {
      timeout: this._config.timeout,
    };

    let command = `${this._config.binPath} ${args}`;

    if (this._config.configFile) {
      command += ` --config ${this._config.configFile}`;
    }

    return new Promise ((resolve, reject) => {
      exec (command, options, (err, stdout, stderr) => {
        let cmdError = stdout && stdout.match (/^Error: (.+)/);
        let error;

        if (cmdError) {
          error = new Error (cmdError[1]);
        }

        if (stderr) {
          error = new Error (stderr);
        }

        if (err && error) {
          err.message = error.message;
          reject (err);
          return;
        }

        if (err) {
          reject (err);
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
    let config = {};
    let text = await this._cmd ({ args: '--showconfig' });

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
