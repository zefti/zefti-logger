/*
 * Since this module is logging, either the /test directory must have appropriate permissions
 * by the node process, or this must be run as root.
 */

var assert = require('assert');
var controlFlow = require('../index.js');
var Logger = require('../index.js');
var fs = require('fs');
var utils = require('zefti-utils');

var logInfoDir = './infotest/';
var logInfoName = 'info';
var logInfoExtension = 'log';
var logInfoFullName = logInfoName + '.' + logInfoExtension;
var logInfoPath = logInfoDir + logInfoFullName;
var logInfoMsg = 'test';

var logRandomDir = './randomtest/';
var logRandomName = 'random';
var logRandomExtension = 'log';
var logRandomFullName = logRandomName + '.' + logRandomExtension;
var logRandomPath = logRandomDir + logRandomFullName;
var logRandomMsg = 'this is a random test';

var logWarnDir = './warntest/';
var logWarnName = 'warn';
var logWarnExtension = 'log';
var logWarnFullName = logWarnName + '.' + logWarnExtension;
var logWarnPath = logWarnDir + logWarnFullName;
var logWarnMsg = 'this is a warn test message';

//TODO: add testing for loggging object (as well as string);


var logConfigInfo5Minute = {
  'paths' : {
    'info' : logInfoPath
  },
  'rotate' : {
    'info' : '5m'
  },
  'writeInterval' : 1
};

var logConfigInfo1Hour = {
  'paths' : {
    'info' : logInfoPath
  },
  'rotate' : {
    'info' : '1h'
  },
  'writeInterval' : 1
};

var logConfigInfo1Day = {
  'paths' : {
    'info' : logInfoPath
  },
  'rotate' : {
    'info' : '1d'
  },
  'writeInterval' : 1
};

var logConfigRandom5Minute = {
  'paths' : {
    'random' : logRandomPath
  },
  'rotate' : {
    'random' : '5m'
  },
  'writeInterval' : 1
};

var logConfigWarnNoRotate = {
  'paths' : {
    'warn' : logWarnPath
  },
  'writeInterval' : 1
};



describe('info log 5 minute timeout', function() {
  var logger = null;
  var config = logConfigInfo5Minute;
  var now = new Date();
  var expectedFileName = 'info' + '_' + now.getFullYear() + '_' + getMonth(now) + '_' + getDay(now) + '_' + getHour(now) + '_' + getMinute(now) + '.log';
  var parsedLogLines = [];
  utils.deleteFolderRecursive(logInfoDir);

  it('should create a new logger', function(done){
    logger = new Logger(config);
    done();
  });

  it('directory should be created', function(done){
    stats = fs.lstatSync(logInfoDir);
    assert(stats.isDirectory());
    done();
  });

  it('should create a info log file with the minute timestamp', function(done){
    logger.info(logInfoMsg);
    setTimeout(function(){
      var files = fs.readdirSync(logInfoDir);
      assert.equal(files.length, 1);
      assert.equal(files[0], expectedFileName);
      done();
    }, 5);

  });

  it('should have a single log line in the info log', function(done){
    var path = logInfoDir + expectedFileName;
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) throw err;
      var logLines = data.split('\n');
      logLines.forEach(function(logLine){
        if (logLine) {
          parsedLogLines.push(JSON.parse(logLine));
        }
      });
      assert.equal(parsedLogLines.length, 1);
      done();
    });
  });

  it('should have a timestamp', function(done){
    assert(parsedLogLines[0].st);
    done();
  });

  it('timestamp should be between beginning of test and now', function(done){
    var ts = new Date(parsedLogLines[0].st);
    var current = new Date();
    assert.equal(true, ts <= current);
    assert.equal(true, ts >= now);
    done();
  });

  it('message should be recorded equally', function(done){
    assert.equal(parsedLogLines[0].msg, logInfoMsg);
    done();
  });

  it('should cleanup', function(done){
    utils.deleteFolderRecursive(logInfoDir);
    done();
  })

});



describe('info log 1 hour timeout', function() {
  var logger = null;
  var config = logConfigInfo1Hour;
  var now = new Date();
  var expectedFileName = 'info' + '_' + now.getFullYear() + '_' + getMonth(now) + '_' + getDay(now) + '_' + getHour(now) + '.log';
  var parsedLogLines = [];
  utils.deleteFolderRecursive(logInfoDir);

  it('should create a new logger', function(done){
    logger = new Logger(config);
    done();
  });

  it('directory should be created', function(done){
    stats = fs.lstatSync(logInfoDir);
    assert(stats.isDirectory());
    done();
  });

  it('should create a info log file with the minute timestamp', function(done){
    logger.info(logInfoMsg);
    setTimeout(function(){
      var files = fs.readdirSync(logInfoDir);
      assert.equal(files.length, 1);
      assert.equal(files[0], expectedFileName);
      done();
    }, 5);
  });

  it('should have a single log line in the info log', function(done){
    var path = logInfoDir + expectedFileName;
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) throw err;
      var logLines = data.split('\n');
      logLines.forEach(function(logLine){
        if (logLine) {
          parsedLogLines.push(JSON.parse(logLine));
        }
      });
      assert.equal(parsedLogLines.length, 1);
      done();
    });
  });

  it('should have a timestamp', function(done){
    assert(parsedLogLines[0].st);
    done();
  });

  it('timestamp should be between beginning of test and now', function(done){
    var ts = new Date(parsedLogLines[0].st);
    var current = new Date();
    assert.equal(true, ts < current);
    assert.equal(true, ts > now);
    done();
  });

  it('message should be recorded equally', function(done){
    assert.equal(parsedLogLines[0].msg, logInfoMsg);
    done();
  });

  it('should cleanup', function(done){
    utils.deleteFolderRecursive(logInfoDir);
    done();
  })

});



describe('info log 1 day timeout', function() {
  var logger = null;
  var config = logConfigInfo1Day;
  var now = new Date();
  var expectedFileName = 'info' + '_' + now.getFullYear() + '_' + getMonth(now) + '_' + getDay(now) + '.log';
  var parsedLogLines = [];
  utils.deleteFolderRecursive(logInfoDir);

  it('should create a new logger', function(done){
    logger = new Logger(config);
    done();
  });

  it('directory should be created', function(done){
    stats = fs.lstatSync(logInfoDir);
    assert(stats.isDirectory());
    done();
  });

  it('should create a info log file with the minute timestamp', function(done){
    logger.info(logInfoMsg);
    setTimeout(function(){
      var files = fs.readdirSync(logInfoDir);
      assert.equal(files.length, 1);
      assert.equal(files[0], expectedFileName);
      done();
    }, 5);
  });

  it('should have a single log line in the info log', function(done){
    var path = logInfoDir + expectedFileName;
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) throw err;
      var logLines = data.split('\n');
      logLines.forEach(function(logLine){
        if (logLine) {
          parsedLogLines.push(JSON.parse(logLine));
        }
      });
      assert.equal(parsedLogLines.length, 1);
      done();
    });
  });

  it('should have a timestamp', function(done){
    assert(parsedLogLines[0].st);
    done();
  });

  it('timestamp should be between beginning of test and now', function(done){
    var ts = new Date(parsedLogLines[0].st);
    var current = new Date();
    assert.equal(true, ts < current);
    assert.equal(true, ts > now);
    done();
  });

  it('message should be recorded equally', function(done){
    assert.equal(parsedLogLines[0].msg, logInfoMsg);
    done();
  });

  it('should cleanup', function(done){
    utils.deleteFolderRecursive(logInfoDir);
    done();
  })

});


describe('random log 5 minute timeout', function() {
  var logger = null;
  var config = logConfigRandom5Minute;
  var now = new Date();
  var expectedFileName = logRandomName + '_' + now.getFullYear() + '_' + getMonth(now) + '_' + getDay(now) + '_' + getHour(now) + '_' + getMinute(now) + '.log';
  var parsedLogLines = [];
  utils.deleteFolderRecursive(logRandomDir);

  it('should create a new logger', function(done){
    logger = new Logger(config);
    done();
  });

  it('directory should be created', function(done){
    stats = fs.lstatSync(logRandomDir);
    assert(stats.isDirectory());
    done();
  });

  it('should create a random log file with the minute timestamp', function(done){
    logger.random(logRandomMsg);
    setTimeout(function(){
      var files = fs.readdirSync(logRandomDir);
      assert.equal(files.length, 1);
      assert.equal(files[0], expectedFileName);
      done();
    }, 5);
  });

  it('should have a single log line in the random log', function(done){
    var path = logRandomDir + expectedFileName;
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) throw err;
      var logLines = data.split('\n');
      logLines.forEach(function(logLine){
        if (logLine) {
          parsedLogLines.push(JSON.parse(logLine));
        }
      });
      assert.equal(parsedLogLines.length, 1);
      done();
    });
  });

  it('should have a timestamp', function(done){
    assert(parsedLogLines[0].st);
    done();
  });

  it('timestamp should be between beginning of test and now', function(done){
    var ts = new Date(parsedLogLines[0].st);
    var current = new Date();
    assert.equal(true, ts < current);
    assert.equal(true, ts > now);
    done();
  });

  it('message should be recorded equally', function(done){
    assert.equal(parsedLogLines[0].msg, logRandomMsg);
    done();
  });

  it('should cleanup', function(done){
    utils.deleteFolderRecursive(logRandomDir);
    done();
  })

});

describe('warn no timeout', function() {
  var logger = null;
  var config = logConfigWarnNoRotate;
  var now = new Date();
  var expectedFileName = logWarnName + '.log';
  var parsedLogLines = [];
  utils.deleteFolderRecursive(logWarnDir);

  it('should create a new logger', function(done){
    logger = new Logger(config);
    done();
  });

  it('directory should be created', function(done){
    stats = fs.lstatSync(logWarnDir);
    assert(stats.isDirectory());
    done();
  });

  it('should create a warn log file with the minute timestamp', function(done){
    logger.warn(logWarnMsg);
    setTimeout(function(){
      var files = fs.readdirSync(logWarnDir);
      assert.equal(files.length, 1);
      assert.equal(files[0], expectedFileName);
      done();
    }, 5);
  });

  it('should have a single log line in the warn log', function(done){
    var path = logWarnDir + expectedFileName;
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) throw err;
      var logLines = data.split('\n');
      logLines.forEach(function(logLine){
        if (logLine) {
          parsedLogLines.push(JSON.parse(logLine));
        }
      });
      assert.equal(parsedLogLines.length, 1);
      done();
    });
  });

  it('should have a timestamp', function(done){
    assert(parsedLogLines[0].st);
    done();
  });

  it('timestamp should be between beginning of test and now', function(done){
    var ts = new Date(parsedLogLines[0].st);
    var current = new Date();
    assert.equal(true, ts < current);
    assert.equal(true, ts > now);
    done();
  });

  it('message should be recorded equally', function(done){
    assert.equal(parsedLogLines[0].msg, logWarnMsg);
    done();
  });

  it('should cleanup', function(done){
    utils.deleteFolderRecursive(logWarnDir);
    done();
  })

});


//convenience methods
function getMonth(now){
  var month = now.getMonth() + 1;
  if (month.toString().length === 1) month = '0' + (month +1).toString();
  return month;
}

function getDay(now){
  var day = now.getDate();
  if (day.toString().length === 1) day = '0' + day.toString();
  return day;
}

function getHour(now){
  var hour = now.getHours();
  return hour;
}

function getMinute(now){
  var minute = now.getMinutes();
  if (minute.toString().length === 1) minute = '0' + minute.toString();
  return minute;
}