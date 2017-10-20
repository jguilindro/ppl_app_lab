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