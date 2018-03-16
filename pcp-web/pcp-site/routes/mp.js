"use strict";

const router = require('express').Router();
const logger = global.log4js.getLogger('http');
const sha1 = require('sha1');

router.get('/token',function (req,res,next) {
    global.weChatUtil.getToken(function (token) {
        res.json({"access_token":token});
    });
});

/* mp.weixin.qq.com verify. */
router.use('/', function (req, res, next) {
    let data = req.query, body = req.body,
        xml, oa;

    let signature = data.signature,
        timestamp = data.timestamp,
        nonce = data.nonce,
        echostr = "success",
        token = "weixinAuth";
    /*  加密/校验流程： */
    let array = [token, timestamp, nonce].sort().join('');
    let sha = sha1(array);

    console.log(req.method, '++++++++++++++');
    logger.info("body", body);
    logger.info("query", data);

    if (req.method == 'GET') {
        echostr = data.echostr;
        res.send(echostr);
    } else if (req.method == 'POST') {
        echostr = "success";
        xml = body.xml;
        if (xml) {
            switch (xml.msgtype[0]) {
                case "event":
                    logger.info("------ event massage ------");
                    switch (xml.event[0]) {
                        case "subscribe":
                            subscribe(xml, oa);
                            subscribeReply(xml, oa).then(str => {
                                if (str) {
                                    echostr = str;
                                }
                                res.send(echostr);
                            });
                            break;
                        case "unsubscribe":
                            unsubscribe(xml, oa);
                            res.send(echostr);
                            break;
                        case "SCAN":
                            scan(xml, oa);
                            res.send(echostr);
                            break;
                        case "CLICK":
                            eventReply(xml, oa).then(str => {
                                if (str) {
                                    echostr = str;
                                }
                                res.send(echostr);
                            });
                            break;
                        default :
                            logger.warn("no support event type.");
                            res.send(echostr);
                    }
                    break;
                case 'text':
                    autoReply(xml, oa).then(str => {
                        if (str) {
                            echostr = str;
                        }
                        res.send(echostr);
                    });
                    break;
                default :
                    logger.warn("no support msg type.");
                    res.send(echostr);
            }
            //callback customer event
            logger.info("------ customer event ------");
        }
    } else {
        echostr = "error";
        res.send(echostr);
    }
});

//关注、重新关注
function subscribe(xml, oa) {
}

//取消关注
function unsubscribe(xml, oa) {

}

//扫码
function scan(xml, oa) {
    //获取二维码的信息，传入openId和二维码信息，然后在后台进行计算。根据发券和发积分的规则，发送模板消息
    global.tool.send({
        method: 'post',
        uri: api.get('93f7ed8710d140618f4f9493c3970fb6'),
        json: {
            openId: xml.fromusername[0],
            eventkey: xml.eventkey[0] || ''
        }
    }, function (error, response, body) {

    });
}

//自动回复
function autoReply(xml, oa) {
    let replyType = 'replyType_keyword', echostr;

    return new Promise((resolve, reject) => {
        resolve(echostr);
    });
}
function subscribeReply(xml, oa) {
    let replyType = 'replyType_subscribe', echostr;

    return new Promise((resolve, reject) => {
        resolve(echostr);
    });
}
function eventReply(xml, oa) {
    let replyType = 'replyType_event', echostr;

    return new Promise((resolve, reject) => {
        resolve("");
    });
}


module.exports = router;
