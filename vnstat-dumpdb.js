/*
Name:           vnstat-dumpdb
Description:    Get vnStat data and config in Node.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-vnstat-dumpdb
Feedback:       https://github.com/fvdm/nodejs-vnstat-dumpdb/issues
License:        Unlicense (see LICENSE file)
*/

const { exec } = require ('child_process');

module.exports = class vnStat {

  /**
   * @param   {string}  [bin]    Path to vnstat binary
   * @param   {string}  [iface]  Limit to interface
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
        if (err) return reject (err);
        if (stderr) return reject (new Error (stderr));

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

    let line;
    let i;

    text = text.split ('\n');
    text = text.forEach (line => {
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
    let i;

    data = await exec (`${this._config.bin} --json`);
    data = JSON.parse (data);
    data = data.interfaces;

    if (iface) {
      data = data.filter (ifc => ifc.id === iface);
    }
  }

};
