// logger production
// loggger test
// logger development
// http://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
// https://github.com/winstonjs/winston
// Features completar:
// Logger para cpu, admin, para leer los datos de la pc
// Separar cada logger por archivo y que no se combinen


var winston = require('winston')
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const error_file = new winston.transports.File({ filename: 'error.log', level: 'error'});
const info_file = new winston.transports.File({ filename: 'debug.log', level: 'info'});

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
  
    error_file,
    /*info_file*/
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' })
  ]
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'testing') {
  logger.add(new winston.transports.Console({
    format: combine(
    timestamp(),
    myFormat
  )
  }));
}

module.exports = logger

// logger = new winston.Logger({
//         emitErrs: true,
//         transports: [
//             new winston.transports.Console({
//                 level:'debug',
//                 name: 'console',
//                 handleExceptions: true,
//                 prettyPrint: true,
//                 silent:false,
//                 timestamp: true,
//                 colorize: true,
//                 json: false
//             }),
//             new winston.transports.DailyRotateFile({
//                 level:'info',
//                 name: 'info',
//                 filename: accessLogsPath,
//                 handleExceptions: true,
//                 prettyPrint: true,
//                 silent:false,
//                 timestamp: true,
//                 json: true,
//                 colorize: true,
//                 maxsize: 20000,
//                 tailable: true
//             }),
//             new winston.transports.DailyRotateFile({
//                 level:'error',
//                 name: 'error',
//                 filename: errorLogsPath,
//                 handleExceptions: true,
//                 prettyPrint: true,
//                 silent: false,
//                 timestamp: true,
//                 json: true,
//                 colorize: false,
//                 maxsize: 20000,
//                 tailable: true
//             })
//         ],
//         exitOnError: false 
//     });


// module.exports = {
//     errorLog: new winston.Logger({
//         levels: levels,
//         colors: colors,
//         exceptionHandlers: [
//             new winston.transports.File({filename: 'logs/exceptions.log'})
//         ],
//         transports: [

//             new winston.transports.File({
//                 name: 'error-file',
//                 level: 'error',
//                 filename: 'logs/error-logs.log',
//                 json: true,
//                 maxsize: 5242880, //5MB
//                 maxFiles: 5,
//                 colorize: false
//             })
//         ],
//         exitOnError: false
//     }),
//     requestLog: new winston.Logger({
//             levels: levels,
//             colors: colors,
//             exceptionHandlers: [
//                 new winston.transports.File({filename: 'logs/exceptions.log'})
//             ],
//             transports: [
//                 new winston.transports.File({
//                     name: 'request-file',
//                     level: 'request',
//                     filename: 'logs/requests.log',
//                     json: true,
//                     maxsize: 5242880, //5MB
//                     maxFiles: 5,
//                     colorize: false
//                 })
//             ],
//             exitOnError: false
//         }
//     ),

//     infoLog: new winston.Logger({
//         levels: levels,
//         colors: colors,
//         exceptionHandlers: [
//             new winston.transports.File({filename: 'logs/exceptions.log'})
//         ],
//         transports: [
//             new winston.transports.File({
//                 name: 'info-file',
//                 level: 'info',
//                 filename: 'logs/all-logs.log',
//                 json: true,
//                 maxsize: 5242880, //5MB
//                 maxFiles: 5,
//                 colorize: false
//             })
//         ],
//         exitOnError: false
//     })
// };
// And then you could use it like this:

// var logger = require(/path/to/file);

// logger.errorLog('This is an error!');
// logger.infoLog('This is info!');
// logger.request('request', req.method, req.url, ip);
// Alternatively you can use Morgan for request logging pretty easily:

// infoLogger.stream = {
//     write: function(message, encoding){
//         logger.info(message);
//     }
// };
// app.use(require("morgan")("combined", { "stream":  infoLogger.stream }));
// I hope that helps!




/*
Hey guys, here is my solution for the problem (also in gist: winston-logger.js)

const winston = require('winston');
const path = require('path');

const getLogger = (module, type) => {
    const modulePath = module.filename.split('/').slice(-2).join('/');
    const logger = new winston.Logger({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                level: (process.env.NODE_ENV === 'development') ? 'debug' : 'error',
                label: modulePath
            })
        ]
    });

    switch (type) {
        case 'error':
            logger.add(winston.transports.File, {
                name: 'error-file',
                filename: path.join(__dirname, '../../logs/error_default.log'),
                level: 'error'
            });
            return logger;
        case 'info':
            logger.add(winston.transports.File, {
                name: 'info-file',
                filename: path.join(__dirname, '../../logs/info_default.log'),
                level: 'info'
            });
            return logger;
        default:
            return logger;
    }
};

module.exports = module => ({
    error(err) {
        getLogger(module, 'error').error(err);
    },
    info(err) {
        getLogger(module, 'info').info(err);
    },
    debug(err) {
        getLogger(module, 'default').debug(err);
    }
});
Usage:

const logger = require('path/to/logger')(module);
logger.info('Logging with winston');
*/