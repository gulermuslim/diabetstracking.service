const winston = require('winston');
const winstonRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const log_dir = 'logs';
require('dotenv').config()
if (!fs.existsSync(log_dir)) {
    fs.mkdirSync(log_dir);
}

const customLevels = {
    levels: {
        Fatal: 0,                //System is unusable
        Alert: 1,                //Action must be taken immediately 
        Critical: 2,             //Critical conditions
        Error: 3,                //Error conditions
        Warning: 4,              //Warning conditions
        Notice: 5,               //Normal but significant condition
        Informational: 6,        //Informational messages
        Debug: 7,                //Debug-level messages
    },
    colors: {
        Fatal: 'red',
        Alert: 'yellow',
        Critical: 'red',
        Error: 'red',
        Warning: 'yellow',
        Notice: 'blue',
        Informational: 'green',
        Debug: 'green',
    }
};

winston.addColors(customLevels.colors);

const getLogLevelName = () => {
    let level;
    switch (process.env.LOG_LEVEL || "3") {
        case customLevels.levels.Fatal.toString():
            level = "Fatal";
            break;
        case customLevels.levels.Alert.toString():
            level = "Alert";
            break;
        case customLevels.levels.Critical.toString():
            level = "Critical";
            break;
        case customLevels.levels.Error.toString():
            level = "Error";
            break;
        case customLevels.levels.Warning.toString():
            level = "Warning";
            break;
        case customLevels.levels.Notice.toString():
            level = "Notice";
            break;
        case customLevels.levels.Informational.toString():
            level = "Informational";
            break;
        case customLevels.levels.Debug.toString():
            level = "Debug";
            break;
        default:
            level = "Error";
            break;
    }
    return level;
}

const logger = winston.createLogger({
    level: getLogLevelName(),
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(
            {
                format: winston.format.combine(
                    winston.format.splat(),
                    winston.format.colorize({ all: true }),
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                    winston.format.simple())
            }
        ),
        new winston.transports.DailyRotateFile({
            filename: path.join(log_dir, '/error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            filename: path.join(log_dir, '/combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '14d'
        })
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: path.join(log_dir, '/exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '14d'
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.colorize({ all: true }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                winston.format.simple())
        })
    ],
    exitOnError: false
});

module.exports = logger;