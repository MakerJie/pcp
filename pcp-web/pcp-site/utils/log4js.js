/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */

module.exports = {
    appenders: [{
        type: 'console'
    },{
        "type": "file",
        "filename": "log/api/site_api_log.log",
        "maxLogSize": 409600,
        "backups": 3,
        "category": "data"
    },{
        "type": "file",
        "filename": "log/ali/ali_log.log",
        "maxLogSize": 409600,
        "backups": 3,
        "category": "ali"
    },{
        "type": "file",
        "filename": "log/login/site_login_data.log",
        "maxLogSize": 409600,
        "backups": 3,
        "category": "login",
        "layout":{
            "type":"pattern",
            "pattern": "%d|%m|%x{pid}%n",
            "tokens": {
                "pid" : function() { return process.pid; }
            }
        }
    }],
    levels: {              //日志级别
        default: 'info',
        http: 'info',
        data: 'warn',
        login: 'warn'
    }
};