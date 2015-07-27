var fs = require('fs');
var utils = require('zefti-utils');
var config = require('zefti-config');
var interval = config.logCleanerInterval || 10;

var defaultOptions = {
  "paths" : {
      'info' : '/log/info.log'
    , 'warn' : '/log/warn.log'
    , 'critical' : '/log/critical.log'
  },
  'rotate' : {
      'info' : '1h'
    , 'warn' : '1h'
    , 'critical' : '1h'
  }
};

var rotateKey = {
    m : 'minute'
  , minute : 'minute'
  , minutes : 'minute'
  , h : 'hour'
  , hour : 'hour'
  , hours : 'hour'
  , d : 'day'
  , day : 'day'
  , days : 'day'
};

var unitMap = {
    minute : {
        seconds : 60
      , format : 'yyyy_mm_dd_hh_minmin'
    }
  , hour : {
        seconds: 3600
      , format : 'yyyy_mm_dd_hh'
    }
  , day : {
        seconds : 86400
      , format : 'yyyy_mm_dd'
  }
};

var activeLogs = {};


function Logger(options){
  var self = this;
  if (!options) options = {};
  if (!options.paths) options.paths = {};
  if (!options.rotate) options.rotate = {};
  var writeInterval = options.writeInterval || 500;
  self.logTypes = {};

  for (var key in options.rotate) {
    if (!self.logTypes[key]) self.logTypes[key] = {};
    parseRotate(options.rotate[key], self.logTypes[key]);
  }

  for (var path in options.paths) {
    (function(){
      var logType = path;
      var buffers = {};
      if (!self.logTypes[path]) self.logTypes[path] = {};
      activeLogs[path] = {};
      self.logTypes[path].configPath = options.paths[path];
      self.parseFileInfo(path, self.logTypes[path]);

      setInterval(function(){
        var now = new Date();
        for(var key in buffers) {
          if (activeLogs[logType][key]) {
            activeLogs[logType][key].write(buffers[key]);
            delete buffers[key];
          } else {
            activeLogs[logType][key] = fs.createWriteStream(self.logTypes[logType].directory + '/' + key, {flags:'a'});
            activeLogs[logType][key].on('finish', function(){
              delete activeLogs[logType][key]
            });
            if (self.logTypes[logType].rotateSeconds) {
              activeLogs[logType][key].expiration = new Date(now.getTime() + (self.logTypes[logType].rotateSeconds*1000) + 10000);
            }
            activeLogs[logType][key].write(buffers[key]);
            delete buffers[key];
          }
        }
      }, writeInterval);

      Logger.prototype[logType] = function(msg){
        //return;
        var now = new Date();
        var logName = getLogName(self.logTypes[logType]);
        var errObj = null;
        //logName = 'testing.log';
        if (utils.type(msg) === 'string') {
          errObj = {msg : msg, date : now};
        } else if (utils.type(msg) === 'object') {
          errObj = msg;
          errObj.date = now;
        } else {
          throw new Error('log message must be a string or an object');
        }

        if (buffers[logName]) {
          buffers[logName] = buffers[logName] + JSON.stringify(errObj) + '\n';
        } else {
          buffers[logName] = JSON.stringify(errObj) + '\n';
        }
      }
    })();
  }

  //console.log(this.logTypes);
}

function parseRotate(str, obj){
  if (utils.type(str) !== 'string') throw new Error('rotate values must be a string');
  var numberEnd = 0;
  for (var i=0;i<str.length;i++) {
    if (!parseInt(str[i])) {
      numberEnd = i;
      break;
    }
  }
  obj.frequency = str.substring(0, numberEnd);
  obj.unit = rotateKey[str.substring(numberEnd, str.length)];
  obj.rotateSeconds = unitMap[rotateKey[obj.unit]].seconds * obj.frequency;
  obj.rotateFormat = unitMap[rotateKey[obj.unit]].format;
}


Logger.prototype.parseFileInfo = function(logName, logObj){
  if (utils.type(logObj.configPath) !== 'string') throw new Error('Paths in logger must be strings');
  if (logObj.configPath[0] !== '/' && logObj.configPath[0] !== '.' && logObj.configPath[0] !== '..') throw new Error('Paths in logger must start with a / . or ..');
  if (logObj.configPath[logObj.configPath.length - 1] === '/') {
    utils.createDirectory(logObj.configPath);
    logObj.directory = logObj.configPath;
    logObj.configFileName = '';
    logObj.fileName = logName;
    logObj.extension = 'log';
  } else {
    var x = logObj.configPath.lastIndexOf('/');
    var y = logObj.configPath.substring(0, x);
    logObj.directory = y;
    utils.createDirectory(y);
    logObj.configFileName = logObj.configPath.substring(logObj.configPath.length, x + 1);
    var fileNameArr = logObj.configFileName.split('.');
    if (fileNameArr.length > 1) {
      logObj.extension = fileNameArr[fileNameArr.length - 1];
    }
    logObj.fileName = fileNameArr[0];

  }
};

function createStream(path, rotate){
  if (!path) return null;
  if (!rotate) return fs.createWriteStream(path, {flags:'a'});
  //TODO: if rotate is set....
}

function getLogName(logObj){
  var logName = logObj.fileName;
  var rotateString = '';
  if (logObj.rotateFormat){
    var now = new Date();
    var month = now.getMonth() + 1;
    if (month.toString().length === 1) month = '0' + (month +1).toString();
    var day = now.getDate();
    if (day.toString().length === 1) day = '0' + day.toString();
    var hour = now.getHours();
    var minute = now.getMinutes();
    if (minute.toString().length === 1) minute = '0' + minute.toString();
    var dateObj = {
        yyyy : now.getFullYear()
      , mm : month
      , dd : day
      , hh : hour
      , minmin : minute
    };
    var logRotateArr = logObj.rotateFormat.split('_');
    logRotateArr.forEach(function(item){
      rotateString = rotateString + '_' + dateObj[item];
    });
  }
  logName = logName + rotateString;
  if (logObj.extension) logName = logName + '.' + logObj.extension;
  return logName;
}

function cleaner(interval){
  var x = setInterval(function(){
    var now = new Date();
    for (var logType in activeLogs) {
      for (var log in activeLogs[logType]) {
        if (activeLogs[logType] && activeLogs[logType][log] && activeLogs[logType][log] && now > activeLogs[logType][log].expiration) {
          console.log('just cleaned log: ' + log);
          activeLogs[logType][log].end();
        }
      }
    }
  }, interval*1000);
}

cleaner(interval);

module.exports = Logger;
