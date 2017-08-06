var log4js = require('log4js');

log4js.configure({
    appenders: { server: { type: 'file', filename: './logs/server.log' } },
    categories: { default: { appenders: ['server'], level: 'error' } }
});


exports.loggerModule ={
    getLogger: function (nomelogger) {
        return log4js.getLogger(nomelogger);
    }
} 

