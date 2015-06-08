zefti-logger
============


##Setup
var Logger = require('zefti-logger');
var logger = new Logger(options);

##Example Usage
logger.warn({foo:'bar'});


##Options

```
{
    "paths" : {
        'info' : '/path/to/info.log'
      , 'warn' : '/path/to/warn.log'
      , 'critical' : '/path/to/critical.log'
    },
    'rotate' : {
        'info' : '5m'
      , 'warn' : '1h'
      , 'critical' : '1d'
    }
}
```

##Option Definitions
infoPath: Path for info logging
warnPath: Path for warn logging
criticalPath: Path for critical logging
infoRotate: Time to rotate logs
warnRotate: Time to rotate warn logs
criticalRotate: Time to rotate warn logs
