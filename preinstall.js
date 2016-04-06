var exec = require ('child_process') .exec;

console.log ('Checking vnStat requirement...');

exec ('vnstat --version', function (err, res, stderr) {
  if (err) {
    throw err;
  }

  res.replace (/^vnStat (\d+)\.(\d+) /, function (s, major, minor) {
    if (major >= 1 && minor >= 13) {
      console.log ('vnStat correct');
      return;
    }

    console.log ('Wrong vnStat version: requires >= v1.13, but v' + major + '.' + minor + ' installed');
    process.exit (1);
  });
});
