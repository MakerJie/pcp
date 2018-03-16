const router = require('express').Router();
const request = require('request');
const fs = require('fs');

/**
 * 从微信下载上传之后的图片到本地
 */
router.get('/downloadImage', function (req, res, next) {
    console.log('downloadImage', req.query.mediaId);
    global.weChatUtil.getToken(function (token) {
        let url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=" + token + "&media_id=" + req.query.mediaId;
        request(url).pipe(fs.createWriteStream(global.config.uploadPath + "/" + req.query.mediaId + ".jpg"));
        res.send({success: true});
    });
});

module.exports = router;
