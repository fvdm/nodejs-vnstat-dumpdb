const { exec } = require ('child_process');

const binPath = process.env.NODE_APP_BIN || 'vnstat';

exec (`${binPath} --version`, (err, res) => {
  res.replace (/^vnStat (\d+\.\d+)/, (s, version) => {
    if (version >= 1.13) {
      return;
    }

    console.log (`Wrong vnStat version: requires >= v1.13, but v${version} installed`);
    console.log (`Command run: ${binPath}`);
    process.exit (1);
  });
});
