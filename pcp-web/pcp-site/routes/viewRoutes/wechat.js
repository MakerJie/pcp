"use strict";
const sha1 = require('sha1');
const api = require('../../utils/api');

const SERVER_URL = "sdxtest.fafa.com.cn";

module.exports = {

    home: function (req, res, cb) {
        let scene = req.query.scene_str;
        if (req.query.key == '5') {
            //TODO:针对已经遗留的二维码，在此实现活动绑定
        }
        if (scene) {
            let ss = req.query.scene_str.split('|');
            console.log(ss, '+++++++++++++++++++');
            global.tool.send({
                method: 'POST',
                uri: api.get('93f7ed8710d140618f4f9493c3970fb6'),
                json: {
                    code: ss[0],
                    params: ss.length > 1 ? ss[1] : '',
                    openId: req.session.openId
                }
            }, function (error, response, body) {
                console.log(body, '----')
            });
        }
        cb({});
    },

    /**
     * 金玉良言页面
     * @param req
     * @param res
     * @param cb
     */
    message: function (req, res, cb) {
        let url = "url=http://" + SERVER_URL + global.config.contextPath + global.config.viewPrefix + "/wechat/message"
            , timestamp = Date.parse(new Date()), t = timestamp / 1000;
        if (req.query.code) {
            url = url + "?code=" + req.query.code;
        }
        if (req.query.state) {
            url = url + "&state=" + req.query.state;
        }
        console.log(url, '-------wechat.js message');
        global.weChatUtil.getTicket(function (ticket) {
            let key = [];
            key.push("jsapi_ticket=" + ticket);
            key.push("noncestr=a" + t);
            key.push("timestamp=" + t);
            key.push(url);
            let str = sha1(key.join("&"));
            cb({
                appId: global.weChatUtil.config.appid,
                timestamp: t,
                nonceStr: "a" + t,
                signature: str
            });
        });
    },

    couponDetail: function (req, res, cb) {
        let url = "url=http://" + SERVER_URL + global.config.contextPath + global.config.viewPrefix + "/wechat/couponDetail?id=" + req.query.id
            , timestamp = Date.parse(new Date()), t = timestamp / 1000;
        if (req.query.openId) {
            url = url + "&openId=" + req.query.openId;
        }
        global.weChatUtil.getTicket(function (ticket) {
            let key = [];
            key.push("jsapi_ticket=" + ticket);
            key.push("noncestr=a" + t);
            key.push("timestamp=" + t);
            key.push(url);
            let str = sha1(key.join("&"));
            console.log(key.join("&"), '------', str);
            cb({
                appId: global.weChatUtil.config.appid,
                timestamp: t,
                nonceStr: "a" + t,
                signature: str,
                serverUrl: "http://" + SERVER_URL
            });
        });
    }
};