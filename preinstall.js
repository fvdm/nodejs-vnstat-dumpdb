const { exec } = require ('child_process');

const bin = process.env.NODE_APP_BIN || 'vnstat';

exec (`${bin} --version`, (err, res) => {
  res.replace (/^vnStat (\d+\.\d+)/, (s, version) => {
    if (version >= 1.13) return;

    console.log (`Wrong vnStat version: requires >= v1.13, but v${major}.${minor} installed`);
    console.log (`Command run: ${bin}`);
    process.exit (1);
  });
});
