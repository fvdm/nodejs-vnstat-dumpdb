/* istanbul ignore file */
/* eslint no-console: "off" */

const { exec } = require ('child_process');

const binPath = process.env.NODE_APP_BIN || 'vnstat';

exec (`${binPath} --version`, (err, res) => {
  res.replace (/^vnStat (\d+\.\d+)/, (s, version) => {
    if (version >= 2) {
      return;
    }

    console.log (`Wrong vnStat version: requires >= v2.0, but v${version} installed`);
    console.log (`Command run: ${binPath}`);
    process.exit (1);
  });
});
