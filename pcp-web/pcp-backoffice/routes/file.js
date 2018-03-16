/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

const express = require('express');
const router = express.Router();

const formidable = require('formidable');
const fs = require('fs');
const BufferHelper = require('bufferhelper');
const iconv = require('iconv-lite');

/* GET home page. */
router.post('/', function (req, res, next) {
    console.log('upload start');
    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = global.config.uploadPath;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    let returnData = [];

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('error')
        }
        //因为formidable自动实现了文件的重命名，所以我们这里不需要在重新指定名称了。
        let fileName = files.upfile.path;
        fileName = fileName.substring(fileName.indexOf('upload_'));
        console.log(files);
        console.log("===========================================================================");
        console.log(fields);
        res.send(fileName);
    });
});

router.post('/csv', function (req, res, next) {
    console.log('upload start');
    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = global.config.uploadPath;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('error')
        }
        //因为formidable自动实现了文件的重命名，所以我们这里不需要在重新指定名称了。
        let fileName = files.upfile.path;
        let bufferHelper = new BufferHelper();
        fs.createReadStream(fileName)
            .on('data', function (chunk) {
                bufferHelper.concat(chunk);
            })
            .on('end', function () {
                let con = iconv.decode(bufferHelper.toBuffer(), 'GBK'),
                    ret = con.split('\r\n'),
                    da = [],
                    d;
                console.log(con);
                for (let i = 1; i < ret.length; i++) {
                    d = ret[i].split(',');
                    console.log(d);
                    let o = {};
                    for (let j = 0; j < d.length; j++) {
                        if (d[j])
                            o["a" + j] = d[j];
                    }
                    if (o['a0']) {
                        da.push(o);
                    }
                }
                console.log(da);
                res.json(da);
            });
    });
});
const api = require('../utils/api');
router.post('/user/csv', function (req, res, next) {
    console.log('upload start');
    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = global.config.uploadPath;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('error')
        }
        //因为formidable自动实现了文件的重命名，所以我们这里不需要在重新指定名称了。
        let fileName = files.upfile.path;
        let bufferHelper = new BufferHelper();
        fs.createReadStream(fileName)
            .on('data', function (chunk) {
                bufferHelper.concat(chunk);
            })
            .on('end', function () {
                let con = iconv.decode(bufferHelper.toBuffer(), 'GBK'),
                    ret = con.split('\r\n'),
                    da = [],
                    d;
                for (let i = 1; i < ret.length; i++) {
                    da.push(ret[i]);
                }
                global.tool.send({
                    method: 'post',
                    uri: api.get('80072a8b4bb6419cb5a103f5c76e1393'),
                    json: {
                        mobile: da.join(',')
                    }
                }, function (error, response, body) {
                    if (body)
                        res.json(body);
                    else
                        res.json({success: false, msg: '后台服务请求出错'})
                });
            });
    });
});

router.post('/upload', function (req, res, next) {
    console.log('upload start');
    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = global.config.uploadPath;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    let returnData = [];

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('error')
        }
        //因为formidable自动实现了文件的重命名，所以我们这里不需要在重新指定名称了。
        let fileName = files.upfile.path;
        fileName = fileName.substring(fileName.indexOf('upload_'));
        console.log(files);
        console.log("===========================================================================");
        console.log(fields);
        let bufferHelper = new BufferHelper();
        fs.createReadStream(global.config.uploadPath + '/' + fileName)
            .on('data', function (chunk) {
                bufferHelper.concat(chunk);
            })
            .on('end', function () {
                let con = iconv.decode(bufferHelper.toBuffer(), 'GBK'),
                    ret = con.split('\r\n'),
                    da = [],
                    d;
                for (let i = 1; i < ret.length; i++) {
                    d = ret[i].split(',');
                    if (d[8]) {
                        da.push({
                            receiveSideCode: d[0],
                            receiveSideName: d[1],
                            partyCode: d[2],
                            partyName: d[3],
                            shopCode: d[4],
                            shopName: d[5],
                            tradeDate: d[6],
                            tradeTime: d[7],
                            tradeCode: d[8],
                            receiveAmount: d[9],
                            refundAmount: d[10],
                            plaFee: d[11],
                            plaCommission: d[12],
                            plaSubsidy: d[13]
                        });
                    }
                }

                console.log(da);
                res.json(da);
            });
    });
});

router.post('/cashUpload', function (req, res, next) {
    console.log('upload start');
    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = global.config.uploadPath;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    let returnData = [];

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('error')
        }
        //因为formidable自动实现了文件的重命名，所以我们这里不需要在重新指定名称了。
        let fileName = files.upfile.path;
        fileName = fileName.substring(fileName.indexOf('upload_'));
        console.log(files);
        console.log("===========================================================================");
        console.log(fields);
        let bufferHelper = new BufferHelper();
        fs.createReadStream(global.config.uploadPath + '/' + fileName)
            .on('data', function (chunk) {
                bufferHelper.concat(chunk);
            })
            .on('end', function () {
                let con = iconv.decode(bufferHelper.toBuffer(), 'GBK'),
                    ret = con.split('\r\n'),
                    da = [],
                    d;
                for (let i = 1; i < ret.length; i++) {
                    d = ret[i].split(',');
                    if (d[8]) {
                        da.push({
                            receiveSideCode: d[0],
                            receiveSideName: d[1],
                            bankName: d[2],
                            receiveAccount: d[3],
                            shopCode: d[4],
                            shopName: d[5],
                            arriveDate: d[6],
                            businessDate: d[7],
                            tradeCode: d[8],
                            amount: d[9],
                            fee: d[10],
                        });
                    }
                }

                console.log(da);
                res.json(da);
            });
    });
});

module.exports = router;
