/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */
"use strict";
const router = require('express').Router();
const request = require('request');
const api = require('../utils/api');
const logger = global.log4js.getLogger('data');
const loginLog = global.log4js.getLogger('login');

/**
 * 登录验证
 */
router.use('/login', function (req, res, next) {
    req.session = req.session || {};
    global.tool.send({
        method: req.method,
        uri: api.get('dd3bcbbc5b7e4a06b8118ab44395a21d'),
        json: req.body
    }, function (error, response, body) {
        if (body) {
            if (body.success) {//登录成功，设置session
                req.session.userData = {
                    userId: body.value.id,
                    userCode: body.value.code,
                    userEmail: body.value.email,
                    mobile: body.value.mobile,
                    userName: body.value.name,
                    language: req.headers["accept-language"] && req.headers["accept-language"].substr(0, 2),
                    shops: body.value.shopCodes || [],
                    roleStr: body.value.roleStr,
                    shopNameList: body.value.shopNameList || []
                };
                if (req.session.userData.shops.length > 0)
                    req.session.userData.shopCode = req.session.userData.shops[0];
                else
                    req.session.userData.shopCode = "00000000";
                req.session.roleData = body.value.permits;
                req.session.roleMap = {
                    index: true
                };
                if (req.session.roleData) {
                    for (let i = 0; i < req.session.roleData.length; i++) {
                        let tmp = req.session.roleData[i].split(':');
                        req.session.roleMap[tmp[1]] = true;
                    }
                }
            }
            if (global.config.production) {
                global.tool.send({
                    method: 'get',
                    uri: 'http://ip.taobao.com/service/getIpInfo.php?ip=' + req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip
                }, function (err, rep, retBody) {
                    let ipRet = (retBody && retBody.data) || {
                            area: '',
                            area_id: '',
                            region: '',
                            region_id: '',
                            city: '',
                            city_id: '',
                            isp: '',
                            isp_id: ''
                        }, logMs = body.success + "|" + global.tool.uuid() + "|" + req.body.code
                        + "|" + body.msg + "|" + (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip)
                        + "|" + (ipRet.area || '-') + "|" + (ipRet.area_id || '-')
                        + "|" + (ipRet.region || '-') + "|" + (ipRet.region_id || '-')
                        + "|" + (ipRet.city || '-') + "|" + (ipRet.city_id || '-')
                        + "|" + (ipRet.isp || '-') + "|" + (ipRet.isp_id || '-');
                    loginLog.info(logMs);
                    global.tool.send({
                        method: 'post',
                        uri: api.get('7bf0b20622a243b4a66dbddf7d21ec63'),
                        json: {content: logMs}
                    });
                });
            }
            res.json(body);
        } else {
            res.json({success: false, msg: '后台服务请求出错'});
        }
    });
});

router.use('/uuid', function (req, res, next) {
    res.send(global.tool.uuid());
});

router.all('*', api.apiAuthentication);

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    logger.info('data::' + req.path);
    next();
});

/**
 * 转发请求
 */
router.use('/', function (req, res, next) {
    if (req.header('mySessionCode')
        && req.header('mySessionCode') !== req.session.userData.userCode) {
        res.json({success: false, code: 417, msg: '登录用户的会话已改变，请刷新页面'});
        return;
    }
    let realUri = pathMapping(req.originalUrl);
    if (!realUri) {
        res.json({success: false, code: 404, msg: 'No api route.'});
        return;
    }
    if (realUri.indexOf('/{') > 0) {
        res.json({success: false, code: 503, msg: 'Api Route Error:存在未替换变量'});
        return;
    }
    if (req.query.__image__) {
        request(realUri).pipe(res);
        return;
    }
    logger.warn("Real Uri:" + realUri);
    /**
     * 设置发送到后台的对象的公共值
     * @type {*|void}
     */
    let bodyData = global.tool.extend(req.body, {
        creator: req.session.userData.userCode,
        updator: req.session.userData.userCode,
        language: req.session.userData.language,
        equipment: global.tool.endTypeEnum[req.session.endType]
    });
    if (req.method === 'POST') {//如果是POST请求，则把后面的?参数放到JSON中去
        if (!bodyData.properties)
            bodyData.properties = {};
        for (let k in req.query) {
            bodyData.properties[k] = req.query[k];
        }
    }
    logger.warn("Real Uri:" + realUri);
    if (realUri.indexOf('export') > 0) {
        request.post(realUri, {form: req.body}).pipe(res);
    } else {

        global.tool.send({
            method: req.method,
            uri: realUri,
            json: bodyData
        }, function (error, response, body) {
            if (response && response.headers['context-type'] == 'application/octet-stream') {
                if (body) {
                    response.pipe(res);
                } else {
                    res.json({success: false, msg: '文件生成失败'})
                }
            } else {
                if (body)
                    res.json(body);
                else
                    res.json({success: false, msg: '后台服务请求出错'})
            }
        });
    }
});

/**
 * 根据映射关系，进行地址转换
 * 发送的地址为：/api/uuid@pathv1=v1&pathv2=v2?paramv1=pv1&paramv2=pv2
 *
 * @param path
 */
function pathMapping(path) {
    let sUrl = path.match(/\/api\/([\w-]+)@*([^\?]*)\?*(.*)/),
        uuid = sUrl[1],
        pathVar = sUrl[2],
        paramVar = sUrl[3],
        realUri = api.get(uuid),
        pathVar_ = pathVar.split('&'),
        items,
        regExp;
    if (realUri) {
        for (let i = 0; i < pathVar_.length; i++) {
            items = pathVar_[i].split("=");
            regExp = new RegExp('{' + items[0] + '}');
            realUri = realUri.replace(regExp, items[1]);
        }
        if (paramVar)
            realUri += '?' + paramVar;
    }
    return realUri;
}

module.exports = router;