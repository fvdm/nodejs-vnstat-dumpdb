var exec = require ('child_process') .exec;

var bin = process.env.NODE_APP_BIN || 'vnstat';

exec (bin + ' --version', function (err, res) {
  if (err) {
    throw err;
  }

  res.replace (/^vnStat (\d+)\.(\d+) /, function (s, major, minor) {
    if (major >= 1 && minor >= 13) {
      return;
    }

    console.log ('Wrong vnStat version: requires >= v1.13, but v' + major + '.' + minor + ' installed');
    console.log ('Command run: ' + bin);
    process.exit (1);
  });
});
