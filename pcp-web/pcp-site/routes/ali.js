"use strict";

const router = require('express').Router();
const request = require('request');
const api = require('../utils/api');
const logger = global.log4js.getLogger('ali');

router.use('/gateway', function (req, res, next) {
    console.log('======================================');
    console.log(req.body);
    console.log(req.query);
    console.log('======================================');
    global.tool.send({
        method: 'POST',
        uri: api.get('f46438cda25b4303951c3709fdfb227e'),
        json: {
            properties: {
                requestId: req.query.request_id || req.body.request_id,
                authCode: req.query.auth_code,
                templateId: req.query.template_id,
                outString: req.query.out_string
            }
        }
    }, function (error, response, body) {
        console.log(body, '----');
        if (body) {
            res.render("mobile/ali/openCard", {
                success: body.success,
                msg: body.msg,
                url: body.value && body.value.remark
            });
        } else {
            res.render("mobile/ali/openCard", {
                success: false,
                msg: "领卡失败",
                url:''
            });
        }
    });
});

router.use('/openCard', function (req, res, next) {
    res.render("mobile/ali/openCard", {
        success: false,
        msg: '',
        url:''
    });
});

router.use('/notify', function (req, res, next) {
    console.log(req.body);
    res.json({success: true});
});

router.use('/openCard', function (req, res, next) {
    res.redirect('https://memberprod.alipay.com/account/openform/activecard.htm?app_id=2017112200094025&template_id=20171202000000000670107000300807&__webview_options__=canPullDown%3dNO%26transparentTitle%3dauto&out_string=alCard&callback=http://mp.pizzaexpress.cn/site/ali/gateway')
});

module.exports = router;