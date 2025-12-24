var exec = require( 'child_process' ).exec;

var bin = process.env.NODE_APP_BIN || 'vnstat';

exec( `${bin} --version`, function ( err, res ) {
  if ( err ) {
    console.warn( 'Warning: vnstat not found. This package requires vnStat >= v1.13 to be installed.' );
    console.warn( 'Install vnStat from: https://github.com/vergoh/vnstat' );
    return;
  }

  res.replace( /^vnStat (\d+)\.(\d+) /, function ( s, major, minor ) {
    major = parseInt( major, 10 );
    minor = parseInt( minor, 10 );

    if ( major > 1 || ( major === 1 && minor >= 13 ) ) {
      return;
    }

    console.warn( `Warning: Wrong vnStat version: requires >= v1.13, but v${major}.${minor} installed` );
    console.warn( `Command run: ${bin}` );
  } );
} );
