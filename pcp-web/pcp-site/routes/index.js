var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.use('/test/*', function(req, res, next) {
    var options, queryData, bodyData;

    options = global.config.service;
    options.path = req.originalUrl;
    options.method = req.method;

    queryData = req.query;
    bodyData = req.body;

    console.log('===================== index ====================');
    console.log(options);
    console.log(queryData);
    console.log(bodyData);
    console.log('===================== index ====================');

    res.send({
        queryData : queryData,
        bodyData : bodyData,
        method : req.method
    });
});


module.exports = router;
