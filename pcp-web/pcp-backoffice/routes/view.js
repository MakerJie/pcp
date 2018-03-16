/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */
"use strict";
const extend = require('extend');
const router = require('express').Router();
const security = require('../utils/auth');
const _route = {
    index: require('./viewRoutes/index')
    , task: require('./viewRoutes/task')
    , system: require('./viewRoutes/system')
    , news: require('./viewRoutes/news')
};

router.all('*', security.checkLogin, security.requireAuthentication, security.loadUser);

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    console.log('view::' + req.path, Date.now());
    next();
});

router.get('/logout', function (req, res, next) {
    console.log("用户退出结果：", delete req.session.userData);
    global.log4js.getLogger('http').info('logout...');
    req.session.destroy(function (err) {
        if (err) {
            res.json({ret_code: 2, ret_msg: '退出登录失败'});
            return;
        }
        res.clearCookie("breezee.backoffice.sid");
        res.redirect(global.config.contextPath + global.config.viewPrefix + '/index');
    });
});

/**
 * 实现路由转发
 */
router.use('/', function (req, res, next) {
    let url = req.session.endType + (req.path.endsWith('/') ? req.path + "index" : req.path)
        , routes = req.path.split("/")
        , skip = true
        , renderParam = {
        path: url,
        userData: req.session.userData || {},
        queryData: req.query || {},
        session: req.session || {},
        cookie: req.cookies || {},
        data: {redirect: req.url === '/login' ? '' : req.url},
        title: global.config.title,
        routes:routes
    };
    if (routes.length === 3) { //目前我们支持二层的url结构
        try {
            let fun = _route[routes[1]] && _route[routes[1]][routes[2]];
            if (fun && fun !== null) {
                skip = false;
                fun(req, res, function (data, err) {
                    if (err) {
                        next(err);
                    } else {
                        renderParam.data = data;
                        res.render(url, renderParam);
                    }
                });
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    if (skip) {
        res.render(url, renderParam);
    }
});

module.exports = router;
