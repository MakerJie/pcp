/**
 * Created by wangshuyi on 2016/12/28.
 */

'use strict';
const extend = require('extend');
const router = require('express').Router();
const WechatUtil = require('../utils/WechatUtil');
const wechat = new WechatUtil();
const QRCode = require('qrcode');
const defaultData = {
    success: true,
    value: 0,
    rows: [],
    total: 0,
    message: "操作成功。",
    errorCode: 0
};

const SERVER_URL = "sdxtest.fafa.com.cn";

//二维码
router.use('/qrcode', (req, res, next) => {
    if (req.query.type == 'snsapi_base') {
        wechat.generateQrcode(req.body.scene_str, req.query.expire_seconds).then(result => {
            res.json(extend({}, defaultData, {value: result}));
        }, function (err) {
            res.json(extend({}, defaultData, {value: "系统错误", success: false}));
        });
    } else if (req.query.type == 'snsapi_userinfo') {
        // let qrStr = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaa9345f2ccaaf19e&redirect_uri=http://"
        //     + global.config.domain + global.config.contextPath + global.config.viewPrefix
        //     + "/wechat/home?scene_str=" + req.body.scene_str + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        let qrStr = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaa9345f2ccaaf19e&" +
            "redirect_uri=http://" + SERVER_URL + global.config.contextPath + global.config.viewPrefix + "/wechat/home?scene_str=" + req.body.scene_str + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        QRCode.toDataURL(qrStr, function (err, url) {
            res.json({success: true, value: {ticket: url, code: qrStr}});
        });
    }
});

module.exports = router;
