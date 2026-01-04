const dotest = require( 'dotest' );
const app = require( './' );

// Setup
// $ NODE_APP_IFACE=eth0 npm test
const config = {
  bin: process.env.NODE_APP_BIN || './testing/mock-vnstat',
  iface: process.env.NODE_APP_IFACE || 'eth0',
};

let vnstat = app( config );

dotest.add( 'Module', ( test ) => {
  test()
    .object( { config } )
    .isFunction( 'fail', 'exports', app )
    .isObject( 'fail', 'interface', vnstat )
    .isFunction( 'fail', '.getConfig', vnstat?.getConfig )
    .isFunction( 'fail', '.getStats', vnstat?.getStats )
    .done();
} );


dotest.add( 'Method .getConfig', ( test ) => {
  vnstat.getConfig( ( err, data ) => {
    test( err )
      .isObject( 'fail', 'data', data )
      .isNotEmpty( 'fail', 'data.DatabaseDir', data?.DatabaseDir )
      .isString( 'fail', 'data.UpdateInterval', data?.UpdateInterval )
      .done();
  } );
} );


dotest.add( 'Method .getStats - iface', ( test ) => {
  vnstat.getStats( config.iface, ( err, data ) => {
    const days = data?.traffic?.days || data?.traffic?.day;
    const rx = days?.[0]?.rx;
    const hasData = days && days.length > 0;

    const t = test( err )
      .isObject( 'fail', 'data', data )
      .isString( 'fail', 'data.id', data?.id || data?.name )
      .isObject( 'fail', 'data.traffic', data?.traffic )
      .isArray( 'fail', 'data.traffic.days', days );

    if ( hasData ) {
      t.isObject( 'fail', 'data.traffic.days[0]', days?.[0] )
        .isNumber( 'fail', 'data.traffic.days[0].rx', rx );
    }

    t.done();
  } );
} );


dotest.add( 'Method .getStats - all', ( test ) => {
  vnstat.getStats( false, ( err, data ) => {
    test( err )
      .isArray( 'fail', 'data', data )
      .done();
  } );
} );


dotest.add( 'Error: invalid interface', ( test ) => {
  vnstat.getStats( 'unreal-iface', ( err, data ) => {
    test()
      .isError( 'fail', 'err', err )
      .isExactly( 'fail', 'err.message', err?.message, 'invalid interface' )
      .isUndefined( 'fail', 'data', data )
      .done();
  } );
} );


dotest.add( 'Error: no config', ( test ) => {
  config.bin = '-';
  vnstat = app( config );

  vnstat.getConfig( ( err, data ) => {
    test()
      .isError( 'fail', 'err', err )
      .isExactly( 'fail', 'err.message', err?.message, 'no config' )
      .isUndefined( 'fail', 'data', data )
      .done();
  } );
} );


dotest.add( 'Error: command failed', ( test ) => {
  config.bin = '-';
  vnstat = app( config );

  vnstat.getStats( ( err, data ) => {
    test()
      .isError( 'fail', 'err', err )
      .isExactly( 'fail', 'err.message', err?.message, 'command failed' )
      .isUndefined( 'fail', 'data', data )
      .done();
  } );
} );


// Start the tests
dotest.run();
