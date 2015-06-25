/*
 * Since this module is logging, either the /test directory must have appropriate permissions
 * by the node process, or this must be run as root.
 */

var assert = require('assert');
var controlFlow = require('./index.js');
var Logger = require('./index.js');
var fs = require('fs');

var logConfig1 = {
  'paths' : {
      'info' : '/test/info.log'
    , 'warn' : '/test/warn.log'
    , 'critical' : '/test/critical.log'
  },
  'rotate' : {
      'info' : '5m'
    , 'warn' : '1h'
    , 'critical' : '1d'
  }
};



describe('initializing loggers', function() {
  var logger = null;
  it('should create a new logger', function(done){
    logger = new Logger(logConfig1);
    done();
  });
  it('should have a test directory', function(done){
    stats = fs.lstatSync('/test');
    assert(stats.isDirectory());
    done();
  });
  it('should create a info log file', function(done){
    logger.info('test');
    //TODO: need to alter the filename (include the timestamp in the filename - fails now);
    infoFileStats = fs.lstatSync('/test/info.log');
    done();
  });

});