zefti-logger
============


##Setup
```
var Logger = require('zefti-logger');
var logger = new Logger(options);
```
##Example Usage
```
logger.info({foo:'bar'});
logger.warn({fooer:'barer'});
logger.critical({fooest:'barest'});
logger.random({random:'message'});
```

##Options

```
{
    'paths' : {
        'info' : '/path/to/info.log'
      , 'warn' : '/path/to/warn.log'
      , 'critical' : '/path/to/critical.log'
    },
    'rotate' : {
        'info' : '5m'
      , 'warn' : '1h'
      , 'critical' : '1d'
    },
    writeInterval : 500
}
```

###Option Definitions
* paths
  * In the paths object, you define any number of log paths that you would like to create.  These can be named anything.  The name is derived from the key.  The path where the log file will be stored is the value of that key.
* rotate
  * In the rotate object, you define the log rotation that you would like for that log (defined by the key).  If no rotate is provided for a log, the log will never be rotated.
* writeInterval - the frequency (in ms) that logs are written to file

###Option Details
####Paths
* Paths with a trailing / will be treated as a directory, and the name will be generated by the key in the paths object
  * Example: /my/path/ (this will store
* Paths without a trailing / will take the last segment as the file name

####Rotate
* Rotate will accept the following time increments:
  * minutes || minute || m
  * hours || hour || h
  * days || day  || d
  * months || month
* Rotate values must be strings
* Rotate string values must start with a stringified number
* Rotate values may have a space or may omit the space in the string
