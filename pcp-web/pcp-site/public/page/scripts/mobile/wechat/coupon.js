"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            this.initCoupon();
        },

        initCoupon: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/0036e34aceb04f5297a5f9b4171b2d65',
                type: Dolphin.requestMethod.POST,
                data: Dolphin.json2string({
                    properties: {
                        user_id_obj_ae: org.breezee.context.userData.id,
                        user_cardLevel__obj_not_ae: 5,
                        status: org.breezee.context.queryData.status,
                        pageSize: 1000
                    }
                }),
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.rows && reData.rows.length > 0) {
                            let html = [];
                            for (let i = 0; i < reData.rows.length; i++) {
                                html.push('<div data-id="' + reData.rows[i].id + '" class="coupon-block couponDetail ' + (org.breezee.context.queryData.status == '1' ? 'block5' : 'block3') + '">');
                                html.push('<img class="coupon-img" src="' + org.breezee.context.getImgSrc(reData.rows[i].couponType['smallImage']) + '" />');
                                html.push('<h5><b>' + reData.rows[i].name + '</b></h5>');
                                html.push('<p><small>使用期限<br/>');
                                html.push(reData.rows[i].activeDate.substr(0, 10));
                                html.push(' &sim; ');
                                html.push(reData.rows[i].expireDate.substr(0, 10));
                                html.push('</small></p><p>优惠券状态：' + reData.rows[i].statusName + '</p></div>');
                            }
                            if (html.length > 0) {
                                $("#couponData").empty().html(html.join(''));
                            }

                            $(".couponDetail").click(function () {
                                location.href = "couponDetail?id=" + $(this).data('id');
                            });
                        }else {
                            $("#couponData").empty().html('<div class="text-center descr">暂无结果数据</div>');
                        }
                    }
                },
                onError: function () {
                    $("#couponData").html('系统出错，请联系管理员');
                }
            });
        }
    }
});