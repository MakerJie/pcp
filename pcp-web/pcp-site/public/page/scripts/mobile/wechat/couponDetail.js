"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            this.initProduct();
            this.couponData = {};
            $("#con_use").click(function () {
                $("#userInfoModal").modal('show');
            });
        },

        initProduct: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/e2515f0d45c74432a2f071e7ea7e942a@code=' + org.breezee.context.queryData.id,
                type: Dolphin.requestMethod.GET,
                loading: true,
                success: function (reData, textStatus) {
                    if (reData.success) {
                        if (reData.value) {
                            $("#voucherImage").attr('src', org.breezee.context.getImgSrc(reData.value.couponType.smallImage));
                            $("#remark_coupon").html(reData.value.couponType.description);
                            $("#scope_coupon").html(reData.value.couponType.specification);
                            $(".btn_u").data('coupon', reData.value.id).data('user', org.breezee.context.userData.cardNo);
                            me.couponData = reData.value;
                            if (!me.couponData.couponType.donation) {
                                $("#transfer_use").hide();
                                me.initWechat(true);
                            } else {
                                me.initWechat(false);
                            }
                            JsBarcode("#barCode", reData.value.code, {
                                text: reData.value.code,
                                format: "CODE128",//选择要使用的条形码类型
                                displayValue: true,//是否在条形码下方显示文字
                                font: "fantasy",//设置文本的字体
                                textAlign: "center",//设置文本的水平对齐方式
                                textPosition: "top",//设置文本的垂直位置
                                textMargin: 5,//设置条形码和文本之间的间距
                                fontSize: 15,//设置文本的大小
                                background: "#fff",//设置条形码的背景
                                lineColor: "#014288",//设置条和文本的颜色。
                                margin: 10//设置条形码周围的空白边距
                            });
                        }
                    } else {
                        $("#con_use").html(reData.msg).attr('disabled', true);
                        $("#transfer_use").attr('disabled', true);
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },

        initWechat: function (hide) {
            let weData = $("#pageData").data();
            wx.config({
                debug: false,
                appId: weData.appid, // 必填，公众号的唯一标识
                timestamp: weData.timestamp,
                nonceStr: weData.noncestr,
                signature: weData.signature,
                jsApiList: [  // 必填，需要使用的JS接口列表
                    'checkJsApi',
                    'openLocation',
                    'getLocation',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });

            wx.ready(function () {
                wx.checkJsApi({
                    jsApiList: [
                        'getLocation',
                        'onMenuShareTimeline',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'onMenuShareAppMessage'
                    ],
                    success: function (res) {
                        // alert(JSON.stringify(res));
                    }
                });

                let couponData = org.breezee.page.couponData;
                let weData = $("#pageData").data();

                wx.hideAllNonBaseMenuItem();

                if (!hide) {
                    wx.showMenuItems({
                        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
                    });
                }
                function shareSuccess(couponId) {
                    Dolphin.ajax({
                        url: '/api/67960f5dcd6d4cd1ac8583069ac59874',
                        type: Dolphin.requestMethod.POST,
                        data: Dolphin.json2string({
                            id: couponId,
                            status: 11
                        }),
                        loading: true,
                        success: function (reData, textStatus) {
                            alert("优惠券分享成功");
                            location.href = "coupon?status=1";
                        }
                    });
                }
                let linkUrl = weData.surl + org.breezee.context.contextPath + org.breezee.context.viewPrefix + "/wechat/couponDraw?id=" + couponData.id;
                $("#transfer_use").click(function () {
                    wx.onMenuShareAppMessage({
                        title: couponData.name, // 分享标题
                        desc: couponData.couponType.description, // 分享描述
                        link: linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: weData.surl + org.breezee.context.publicPath + '/page/images/share.png', // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        trigger: function (res) {
                            // alert('用户点击发送给朋友');
                        },
                        success: function () {
                            shareSuccess(couponData.id);
                        },
                        complete: function () {
                            // alert('ffaaa');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('您取消了本次分享');
                        }
                    });
                    wx.onMenuShareTimeline({
                        title: couponData.name, // 分享标题
                        link: linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: weData.surl + org.breezee.context.publicPath + '/page/images/share.png', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            shareSuccess(couponData.id);
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('您取消了本次分享');
                        }
                    });
                    alert("请点击右上角，分享给朋友或者朋友圈");
                });
            });
            wx.error(function (res) {
                alert("微信配置出错了");
            });
        }
    }
});