/**
 * Created by wangshuyi on 2017/1/4.
 */

'use strict';

const request = require('request');
const extend = require('extend');
const md5 = require('md5');
const js2xmlparser = require("js2xmlparser");
const xml2json = require('basic-xml2json');
const fs = require('fs');

const logger = require('log4js').getLogger("sys");
const util = require('./tool1');

const WechatUtil = function (param) {
    this.init(param);
};

WechatUtil.prototype = {
    constructor: WechatUtil,
    tokenTime: 7000000, //jsapi_ticket的有效期为7200秒，我们在这里提前2s
    defaultParams: {
        appID: 'wxaa9345f2ccaaf19e',
        appSecret: '22c92fe717759506ba260382f14def77',
        tokenCache: {
            tokenId: 'tokenId',
            tokenTime: 0
        },
        ticketCache: {
            ticketId: 'ticketId',
            ticketTime: 0
        }
    },

    url: (function () {
        let url = {};
        let wechatApi = 'https://api.weixin.qq.com/cgi-bin';

        url.token_url = 'http://mp.pizzaexpress.cn/site/mp/token?appid={appid}&secret={secret}';

        //menu
        url.menu_get_url = wechatApi + '/menu/get?access_token={token}';
        url.menu_update_url = wechatApi + '/menu/create?access_token={token}';
        url.menu_conditional_save = wechatApi + '/menu/addconditional?access_token={token}';
        url.menu_conditional_remove = wechatApi + '/menu/delconditional?access_token={token}';

        //tag
        url.tag_get = wechatApi + '/tags/get?access_token={token}';
        url.tag_create_url = wechatApi + '/tags/create?access_token={token}';
        url.tag_update = wechatApi + '/tags/update?access_token={token}';
        url.tag_delete = wechatApi + '/tags/delete?access_token={token}';
        url.tag_batch_url = wechatApi + '/tags/members/batchtagging?access_token={token}';
        url.tag_unbatch_url = wechatApi + '/tags/members/batchuntagging?access_token={token}';
        url.tag_get_user = 'https://api.weixin.qq.com/cgi-bin/user/tag/get?access_token={token}';
        url.tag_get_user_tags = wechatApi + '/tags/getidlist?access_token={token}';

        //group
        url.group_create = wechatApi + '/groups/create?access_token={token}';

        //material
        url.material_image_add_url = wechatApi + '/material/add_material?access_token={token}&type={type}';
        url.material_remove = wechatApi + '/material/del_material?access_token={token}';
        url.material_news_list = wechatApi + '/material/batchget_material?access_token={token}';
        url.material_news_add = wechatApi + '/material/add_news?access_token={token}';
        url.material_news_remove = wechatApi + '/material/del_material?access_token={token}';
        url.material_news_update = wechatApi + '/material/update_news?access_token={token}';
        url.material_get = wechatApi + '/material/get_material?access_token={token}';

        //message
        url.message_send = wechatApi + '/message/custom/send?access_token={token}';
        url.message_preview = wechatApi + '/message/mass/preview?access_token={token}';
        url.message_sendByList = wechatApi + '/message/mass/send?access_token={token}';
        url.message_sendByTag = wechatApi + '/message/mass/sendall?access_token={token}';
        url.template_message = wechatApi + '/message/template/send?access_token={token}';

        //customer
        url.customer_list = wechatApi + '/user/get?access_token={token}';
        url.customer_getInfo = wechatApi + '/user/info?access_token={token}&openid={openid}&lang={lang}';

        //qrcode
        url.qrcode = wechatApi + '/qrcode/create?access_token={token}';

        //auth
        url.auth = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid={APPID}&secret={SECRET}&code={CODE}&grant_type=authorization_code';

        return url;
    })(),

    init: function (param) {
        this.opts = extend(true, {}, this.defaultParams, param);
    },

    resetOptions: function (param) {
        this.opts = extend(true, {}, this.opts, param);
        this.opts.tokenCache.tokenTime = 0;
        this.opts.ticketCache.tokenTime = 0;
    },

    /**
     * 获取token
     * @return Promise resolve(token) reject('000000')
     */
    getToken: function () {
        let _this = this,
            n = new Date().getTime(),
            promise;
        return new Promise(function (resolve, reject) {
            if (n - _this.opts.tokenCache.tokenTime > _this.tokenTime) {
                _this._getToken().then(function (token) {
                    _this.opts.tokenCache.tokenTime = n;
                    _this.opts.tokenCache.tokenId = token;
                    resolve(token);
                }, function (err) {
                    reject(err);
                });
            } else {
                resolve(_this.opts.tokenCache.tokenId);
            }
        });
    },
    _getToken: function () {
        let _this = this, tokenUrl, retData;

        // tokenUrl = util.setPathData(_this.url.token_url, {
        //     appid: _this.opts.appID,
        //     secret: _this.opts.appSecret
        // });

        return new Promise(function (resolve, reject) {
            request({
                method: 'get',
                uri: tokenUrl,
                json: true,
            }, function (error, response, body) {
                if (error) {
                    logger.error("get wechat token error", error);
                    reject({errcode: 83283, errmsg: 'get Token fail'});
                } else {
                    logger.info("weChatUtil.getToken:@", body, "@");
                    if (body.access_token) {
                        resolve(body.access_token);
                    } else {
                        logger.error("fetch token error!");
                        reject({errcode: 83283, errmsg: 'get Token fail'});
                    }
                }
            });
        })
    },

    getOpenidByCode: function (code) {
        let _this = this;
        let url = util.setPathData(_this.url.auth, {
            APPID: _this.opts.appID,
            SECRET: _this.opts.appSecret,
            CODE: code,
        });

        return new Promise(function (resolve, reject) {
            request({
                method: 'get',
                uri: url,
                json: true,
            }, function (error, response, body) {
                if (error) {
                    reject({errcode: error.errcode, errmsg: error.errmsg});
                } else {
                    logger.info(body);
                    if (body.openid) {
                        resolve(body.openid);
                    } else {
                        reject({errcode: error.errcode, errmsg: error.errmsg});
                    }
                }
            });
        })
    },

    /**
     * 能用方法
     * @param data
     * @param callback(result)
     */
    commonFunc: function (url, data, callback) {
        let _this = this, api;
        _this.getToken(function (token) {
            api = util.setPathData(url, {
                token: token
            });
            request.post({
                url: api,
                json: data
            }, function (err, httpResponse, body) {
                if (err) {
                    logger.error(err);
                    callback(null);
                } else {
                    logger.info(body);
                    callback(body);
                }
            });
        });
    },

    /**
     * 通用方法
     * @param url
     * @param data
     * @param pathData
     * @param type
     * @return {Promise} resolve(body) reject(err)
     */
    common: function (url, data = {}, pathData = {}, type = 'post') {
        let _this = this, api;
        return new Promise(function (resolve, reject) {

            let cb = (token) => {
                api = util.setPathData(url, extend(pathData, {token: token}));
                request({
                    method: type,
                    uri: api,
                    json: type == 'get' ? true : data
                }, function (err, httpResponse, body) {
                    if (err) {
                        logger.error('wechat', api, err);
                        reject(err)
                    } else {
                        if (body && body.errcode && body.errcode != 0) {
                            logger.error('wechat', api, body);
                            reject(body)
                        } else {
                            logger.info('wechat request success', api);
                            resolve(body);
                        }
                    }
                })
            };

            if (pathData.token) {
                cb(pathData.token);
            } else {
                _this.getToken().then(function (token) {
                    cb(token);
                }, function (err) {
                    reject(err);
                })
            }
        });
    },

    /**
     * 获取菜单信息
     * @return {Promise} resolve(body) reject(err)
     */
    getMenu: function () {
        let _this = this, menuUrl;

        return _this.common(_this.url.menu_get_url, {}, {}, 'get');
    },

    /**
     * 创建或修改菜单信息
     * @param menuData
     * @param callback(result)
     */
    updateMenu: function (menuData) {
        let _this = this;

        return _this.common(_this.url.menu_update_url, menuData);
    },
    /**
     * 创建个性化菜单信息
     * @param menuData
     */
    saveConditionMenu: function (menuData) {
        let _this = this;

        return _this.common(_this.url.menu_conditional_save, menuData);
    },
    /**
     * 删除个性化菜单信息
     * @param menuData
     */
    removeConditionMenu: function (menuId) {
        let _this = this;

        return _this.common(_this.url.menu_conditional_remove, {
            "menuid": menuId
        });
    },

    /**
     * 获取所有标签
     * @param tagName
     */
    getTagList: function () {
        let _this = this, api, tagData;
        return _this.common(_this.url.tag_get, {}, {}, 'get');
    },

    /**
     * 创建用户标签信息
     * @param tagName
     */
    createTag: function (tagName) {
        let _this = this, api, tagData;
        tagData = {
            tag: {
                "name": tagName
            }
        };
        return _this.common(_this.url.tag_create_url, tagData);
    },

    /**
     * @param menuData
     * @param callback(result)
     */
    updateTag: function (tagId, tagName) {
        let _this = this, api, tagData;
        tagData = {
            "tag": {
                "id": tagId,
                "name": tagName
            }
        };
        return _this.common(_this.url.tag_update, tagData);
    },

    /**
     *
     * @param tagId
     * @param tagName
     * @return {*|Promise}
     */
    deleteTag: function (tagId) {
        let _this = this, tagData;
        tagData = {
            "tag": {
                "id": tagId
            }
        };
        return _this.common(_this.url.tag_delete, tagData);
    },

    /**
     * 获取用户身上的标签列表
     * @param menuData
     * @param callback(result)
     */
    getUserTags: function (openid) {
        let _this = this, api, tagData;

        return _this.common(_this.url.tag_get_user_tags, {openid: openid});
    },

    /**
     * 批量给用户添加信息
     * @param menuData
     * @param callback(result)
     */
    batchTag: function (data) {
        let _this = this, api;

        return new Promise((resolve, reject) => {
            let _recursive = () => {
                if (data.openid_list.length > 0) {
                    let _data = {
                        tagid: data.tagid,
                        openid_list: data.openid_list.splice(0, 50)
                    };
                    _this._batchTag(_data).then(result => {
                        _recursive();
                    }, err => {
                        _recursive();
                    })
                } else {
                    resolve({errcode: 0});
                }
            }
            _recursive();
        })

        // return _this.common(_this.url.tag_batch_url, data);
    },
    _batchTag: function (data) {
        let _this = this, api;
        return _this.common(_this.url.tag_batch_url, data);
    },

    /**
     * 批量给用户删除信息
     * @param menuData
     * @param callback(result)
     */
    unbatchTag: function (data) {
        let _this = this, api;

        return new Promise((resolve, reject) => {
            let _recursive = () => {
                if (data.openid_list.length > 0) {
                    let _data = {
                        tagid: data.tagid,
                        openid_list: data.openid_list.splice(0, 50)
                    };
                    _this._unbatchTag(_data).then(result => {
                        _recursive();
                    }, err => {
                        _recursive();
                    })
                } else {
                    resolve({errcode: 0});
                }
            };
            _recursive();
        })
    },
    _unbatchTag: function (data) {
        let _this = this, api, tagData;
        return _this.common(_this.url.tag_unbatch_url, data);
    },

    /**
     * 上传图片素材
     * @param data
     */
    addImage: function (data, fileData) {
        data = data || {type: 'image'};
        let _this = this, api;

        return new Promise(function (resolve, reject) {
            _this.getToken().then(function (token) {
                let formData = {
                    media: fs.createReadStream(data.file),
                }
                api = util.setPathData(_this.url.material_image_add_url, {
                    token: token,
                    type: (data.type || "image"),
                });
                if (data.type == 'video') {
                    formData.description = `{
                        "title":"${fileData.name}",
                        "introduction":"${data.file}"
                    }`
                }
                request.post({
                    url: api,
                    formData: formData,
                }, function (err, httpResponse, body) {
                    if (err) {
                        console.error('upload failed:', err);
                        reject(err);
                        return;
                    }
                    console.log('Upload successful!  Server responded with:', body);
                    //{"media_id":"JN4uNiPgawZ_XQWewhQ5_sq8PMdKKVY_H8Ntoa9bM_4","url":"https:\/\/mmbiz.qlogo.cn\/mmbiz\/gZPrxC4IV0GmFTicUxHOaUYqJ9cRnG6v0ShRgqMtmvibEsUaRKbnBicc5PiaeCukib1eJibnmGeC4D60aVNX7TeDBJ4A\/0?wx_fmt=jpeg"}

                    if (typeof body == "string") {
                        body = JSON.parse(body);
                    }
                    resolve(body);
                });
            })
        })
    },

    /**
     * 新增图文素材
     * @param data
     * @param callback(result)
     */
    addNews: function (data) {
        let _this = this, api;

        return _this.common(_this.url.material_news_add, data);
    },


    /**
     * 单发消息
     * @param data
     * @param callback(result)
     */
    sendMessage: function (data) {
        let _this = this, api;
        return _this.common(_this.url.message_send, data);
    },


    /**
     * 发送模板消息
     * @param message
     * var message = {
           touser: "opkN1t-njzuumf7t2d3Xlw8sUg2U",//openid
           template_id: "UdFYzwb7GdGH25-kx69vkbz4wOBwHuWWjocmJF34HYM",//
           url: "www.baidu.com",
           topcolor: "#FF0000"
        };
     message.data = {
           title: {value: "aa", color: "#173177"},
           keyword1: {value: "aa", color: "#173177"},
           keyword2: {value: "aa", color: "#173177"},
           remark: {value: "aa", color: "#173177"}
        }
     */
    templateMessage: function (message) {
        return this.common(this.url.template_message, message);
    },
    /**
     * 预览消息
     * @param data
     * @param callback(result)
     */
    previewMessage: function (data) {
        let _this = this, api;
        return _this.common(_this.url.message_preview, data);
    },
    /**
     * 群发消息
     * @param data
     * @param callback(result)
     */
    sendMessageByList: function (data) {
        let _this = this, api;
        return _this.common(_this.url.message_sendByList, data);
    },
    sendMessageByTag: function (data) {
        let _this = this, api;
        return _this.common(_this.url.message_sendByTag, data);
    },

    /**
     * 更新图文素材
     * @param data
     * @param callback(result)
     */
    updateNews: function (data) {
        let _this = this, api;
        return _this.common(_this.url.material_news_update, data);
    },

    /**
     * 删除素材
     * @param media_id
     */
    removeMaterial: function (media_id) {
        let _this = this, api;
        return _this.common(_this.url.material_remove, {media_id: media_id});
    },

    /**
     * 获取图文素材列表
     * @param data
     * @param callback(result)
     */
    getMaterialList: function (offset = 0, count = 20, type = 'news') {
        let _this = this, api;
        let data = {
            type: type,
            offset: offset,
            count: count
        }
        return _this.common(_this.url.material_news_list, data);
    },

    /**
     * 获取全部图文素材
     * @param data
     * @param callback(result)
     */
    getMaterialAll: function (type = 'news') {
        let _this = this, api;
        let total = 0, pageSize = 20, pageNumber = 0, allNews;

        return new Promise(function (resolve, reject) {
            function getNews() {
                _this.getMaterialList(pageNumber, pageSize, type).then(function (news) {
                    if (pageNumber == 0) {
                        allNews = news;
                    } else {
                        allNews.item = allNews.item.concat(news.item);
                    }
                    pageNumber++;
                    if (pageNumber * pageSize < news.total_count) {
                        getNews(pageNumber);
                    } else {
                        delete allNews.item_count;
                        resolve(allNews);
                    }
                }, function (err) {
                    reject(err);
                });
            }

            getNews();
        })
    },

    /**
     * 获取图片文件
     * @param data
     * @param callback(result)
     */
    getImageFile: function (media_id, filePath) {
        return new Promise((resolve, reject) => {
            let postData = {media_id: media_id};
            this.getToken().then(token => {
                let trueUrl = tool.setPathData(this.url.material_get, {token: token});
                let writeStream = fs.createWriteStream(filePath, {autoClose: true});
                request({
                    uri: trueUrl,
                    method: 'post',
                    json: postData
                }).pipe(writeStream);

                writeStream.on('finish', function () {
                    resolve({success: true});
                });
            });
        });
    },
    getVideoFile: function (media_id, filePath) {
        return new Promise((resolve, reject) => {
            let postData = {media_id: media_id};
            this.getToken().then(token => {
                let trueUrl = tool.setPathData(this.url.material_get, {token: token});
                let writeStream = fs.createWriteStream(filePath, {autoClose: true});
                request.post({
                    url: trueUrl,
                    json: postData,
                }, function (err, httpResponse, body) {
                    if (err) {
                        console.error('upload failed:', err);
                        reject(err);
                        return;
                    }
                    console.log('Upload successful!  Server responded with:', body);
                    //{"media_id":"JN4uNiPgawZ_XQWewhQ5_sq8PMdKKVY_H8Ntoa9bM_4","url":"https:\/\/mmbiz.qlogo.cn\/mmbiz\/gZPrxC4IV0GmFTicUxHOaUYqJ9cRnG6v0ShRgqMtmvibEsUaRKbnBicc5PiaeCukib1eJibnmGeC4D60aVNX7TeDBJ4A\/0?wx_fmt=jpeg"}
                    request({
                        uri: body.down_url,
                        method: 'post',
                    }).pipe(writeStream);
                    resolve(body);
                });


                // .pipe(writeStream);

                writeStream.on('finish', function () {
                    resolve({success: true});
                });
            });
        });
    },

    /**
     * 获取用户列表
     * @param callback(err, result)
     */
    getCustomerList: function () {
        let _this = this, api;

        return _this.common(_this.url.customer_list, {}, {}, 'get');
    },
    /**
     * 获取用户基本信息
     * @param data
     */
    getCustomerInfo: function (openId) {
        let _this = this, api;

        return _this.common(_this.url.customer_getInfo, {}, {
            openid: openId,
            lang: "zh_CN"
        }, 'get');
    },

    generateQrcode: function (str = '', time = null) {
        const _this = this;
        let data = {};
        if (time) {
            data.action_name = 'QR_SCENE';
            data.expire_seconds = time;
        } else {
            data.action_name = 'QR_LIMIT_STR_SCENE';
        }

        data.action_info = {
            scene: {
                scene_str: str
            }
        };

        return _this.common(_this.url.qrcode, data);
    }
};

const weChatUtil = {
    open_id_url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    user_info_url: 'https://api.weixin.qq.com/cgi-bin/user/info',
    message_url: 'https://api.weixin.qq.com/cgi-bin/message/template/send',
    preorder_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    group_url: 'https://api.weixin.qq.com/cgi-bin/groups',
    ticket_url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    config: {
        appid: 'wx31a215abc030fde8',
        mch_id: '1316675801',
        secret: 'f8b2d4a13115ec2889958423d3bf27dd',
        key: 'vc8fhbrmUaE9Z1EMuI48usyLeyNJ0201'
    },
    tokenTime: 7000000, //jsapi_ticket的有效期为7200秒，我们在这里提前2s
    tokenCache: {
        tokenId: 'tokenId',
        tokenTime: 0
    },
    ticketCache: {
        ticketId: 'ticketId',
        ticketTime: 0
    }
};


module.exports = WechatUtil;