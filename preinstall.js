const { exec } = require( 'child_process' );

const bin = process.env.NODE_APP_BIN ?? 'vnstat';

exec( `${bin} --version`, ( err, res ) => {
  if ( err ) {
    console.warn( 'Warning: vnstat not found. This package requires vnStat >= v1.13 to be installed.' );
    console.warn( 'Install vnStat from: https://github.com/vergoh/vnstat' );
    return;
  }

  res.replace( /^vnStat (\d+)\.(\d+) /, ( s, major, minor ) => {
    const majorNum = parseInt( major, 10 );
    const minorNum = parseInt( minor, 10 );

    if ( majorNum > 1 || ( majorNum === 1 && minorNum >= 13 ) ) {
      return;
    }

    console.warn( `Warning: Wrong vnStat version: requires >= v1.13, but v${major}.${minor} installed` );
    console.warn( `Command run: ${bin}` );
  } );
} );
