/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */
"use strict";
const extend = require('extend');
const api = require('./api');
/**
 * 认证模块
 * @type {{checkLogin: module.exports.checkLogin, requireAuthentication: module.exports.requireAuthentication, apiAuthentication: module.exports.apiAuthentication, loadUser: module.exports.loadUser}}
 */
module.exports = {

    checkEndType: function (req, res, next) {
        req.session = req.session || {};
        if (!req.session.endType) {
            req.session.endType = "mobile";
        }
        next();
    },

    checkWechat: function (req, res, next) {
        if (req.query.code) {
            global.weChatUtil.getOpenId(req.query.code, function (openId, token) {
                if (openId) {
                    req.session.openId = openId;
                    req.token = token;
                    next();
                } else {
                    res.send('<html><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0"><body ontouchstart>亲，网络有些不给力哦，重新点开吧:)</body></html>');
                }
            });
        } else {
            next();
        }
    },

    checkAlipay: function (req,res,next) {
        console.log('----------------');
        console.log(req.query);
        console.log("=======================")
        if (req.query.auth_code) {
            global.tool.send({
                method: 'POST',
                uri: api.get('f46438cda25b4303951c3709fdfb227e'),
                json: {
                    properties: {
                        authCode: req.query.auth_code
                    }
                }
            }, function (error, response, body) {
                console.log(body, '----');
                if (body && body.success) {
                    req.session.userData = body.value;
                    req.aliPage = true;
                    next();
                } else {
                    let url = req.session.endType + "/wechat/register";
                    if (req.url.indexOf('/login') > -1) {
                        url = req.session.endType + "/wechat/login";
                    }
                    res.render(url, {
                        title: global.config.title,
                        data: {},
                        queryData: req.query || {},
                        session: req.session,
                        userData: body.value,
                        path: url
                    });
                }
            });
        } else {
            next();
        }
    },

    checkOpenId: function (req, res, next) {
        if (req.aliPage) {
            next();
        } else if (req.query.openId || req.session.openId) {
            let openId = req.query.openId || req.session.openId;
            global.tool.getUserInfo(openId, function (uData) {
                //正常用户
                global.weChatUtil.getUserInfo(openId, req.token, function (weData) {
                    req.session.openId = openId;
                    let userData = uData;
                    extend(true, userData, weData);
                    req.session.userData = userData;
                    req.session.userData.language = (req.session.userData.language || "en").substr(0, 2);
                    req.setLocale(req.session.userData.language);
                    if (uData.status == 0) {
                        //未找到此openid，前往注册
                        let url = req.session.endType + "/wechat/register";
                        if (req.url.indexOf('/login') > -1) {
                            url = req.session.endType + "/wechat/login";
                        }
                        res.render(url, {
                            title: global.config.title,
                            data: {},
                            queryData: req.query || {},
                            session: req.session,
                            userData: userData,
                            path: url
                        });

                    } else if (uData.status == 1) {
                        next();
                    } else {
                        res.render("/forbid", {
                            title: global.config.title,
                            data: {},
                            queryData: req.query || {},
                            session: {},
                            userData: {},
                            path: ''
                        });
                    }
                });

            });
        } else {
            res.send('<html><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0"><body ontouchstart>请首先点击公众号菜单，进入公众号</body></html>');
        }
    },

    /**
     * 安全认证的方法
     * @param req
     * @param res
     * @param next
     */
    requireAuthentication: function (req, res, next) {
        //TODO:判断用户的权限是否可以访问
        next();
    },

    /**
     * 加载用户信息
     * @param req
     * @param res
     * @param next
     */
    loadUser: function (req, res, next) {
        console.info('auth::loadUser');
        //获取用户信息，可以通过页面动态的获取
        if (req.session.userData) {
            next();
        } else {
            console.log('session user is null...............')
            let error = new Error('failed to load user');
            error.status = 401;
            next(error);
        }
    }

};