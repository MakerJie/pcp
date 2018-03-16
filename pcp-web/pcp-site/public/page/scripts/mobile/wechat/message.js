/**
 * Created by wang,junjie on 2017/10/23.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            $("#city-picker").cityPicker({
                title: "请选择您的城市",
                showDistrict: false
            });
            $("#date-input1").select({
                title: "意见类型",
                items: [
                    '意见', '咨询', '表扬', '投诉'
                ]
            });
            this.initEvent();
            this.initProduct();
            this.initWechat();
        },

        initProduct: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/ac843b67de424221a24e9962e7e281b33@id=' + org.breezee.context.userData.id,
                type: Dolphin.requestMethod.GET,
                loading: true,
                success: function (reData, textStatus) {
                    if (reData.success) {
                        Dolphin.form.setValue(reData.value, '#data_form');
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },

        initEvent: function () {
            let me = this;

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                if (data.email == "" || data.viewRemark == "" || data.viewType == "") {
                    Dolphin.alert("请完善信息后提交");
                    return;
                }
                if (data.createTime) {
                    data.createTime = data.createTime.split(" ").join("-");
                    data.createTime = data.createTime + " 00:00:00";
                }
                data.city = data.address;
                data.userName = data.name;
                data.userOpenId = data.openid;
                Dolphin.ajax({
                    url: '/api/b898531754d26e3402308568e6744dbb',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            location.href = "home";
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                })
            });
        },

        initWechat: function () {
            let weData = $("#pageData").data();
            wx.config({
                debug: false,
                appId: weData.appid, // 必填，公众号的唯一标识
                timestamp: weData.timestamp,
                nonceStr: weData.noncestr,
                signature: weData.signature,
                jsApiList: [  // 必填，需要使用的JS接口列表
                    "chooseImage",
                    "previewImage",
                    "uploadImage",
                    "downloadImage",
                    "scanQRCode"
                ]
            });

            wx.ready(function () {

                $('#uploaderInput').click(function () {
                    let panel = $('#weui_uploader_files');
                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            if (localIds && localIds.length > 0) {
                                localIds.forEach(function (localId) {
                                    wx.uploadImage({
                                        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                                        isShowProgressTips: 1, // 默认为1，显示进度提示
                                        success: function (res) {
                                            let serverId = res.serverId; // 返回图片的服务器端ID
                                            if (serverId) {
                                                Dolphin.ajax({
                                                    url: (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + '/file/downloadImage?mediaId=' + serverId,
                                                    type: Dolphin.requestMethod.GET,
                                                    onSuccess: function (reData) {
                                                        $('#media_ids_input').val(serverId);
                                                        //http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=?&media_id=?
                                                        if (window.__wxjs_is_wkwebview) {
                                                            wx.getLocalImgData({
                                                                localId: localId, // 图片的localID
                                                                success: function (res) {
                                                                    let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                                                    localData = localData.replace('jgp', 'jpeg');
                                                                    panel.empty();
                                                                    $('<li>')
                                                                        .addClass('weui-uploader__file')
                                                                        .attr('imgSrc', localId)
                                                                        .css('background-image', 'url(' + localData + ')')
                                                                        //.attr('src','data:image/jpeg;base64,'+localData)
                                                                        //.css('background-image', 'url(' + localId + ')')
                                                                        .appendTo(panel);
                                                                }
                                                            });
                                                        } else {
                                                            panel.empty();
                                                            $('<li>')
                                                                .addClass('weui-uploader__file')
                                                                .attr('imgSrc', localId)
                                                                .css('background-image', 'url(' + localId + ')')
                                                                .appendTo(panel);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                })
                            }
                        },
                        fail: function (res) {
                            alert("上传出错");
                        }
                    });
                });
            });
            wx.error(function (res) {
                alert("微信配置出错了");
            });
        }
    };
});