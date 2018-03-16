"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            this.initCoupon();
        },

        initCoupon: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/95b457acbebe4fbf90499c614ad444fc',
                type: Dolphin.requestMethod.POST,
                data: Dolphin.json2string({
                    properties: {
                        pageSize: 1000,
                        user_id_obj_ae: org.breezee.context.userData.id,
                        status: 1,
                        pointType: '2'
                    }
                }),
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.rows && reData.rows.length > 0) {
                            let html = [];
                            for (let i = 0; i < reData.rows.length; i++) {
                                html.push('<div class="coupon-block block5"><p><span class="shop-name">' + reData.rows[i].name + '</span>' +
                                    '<span class="pull-right">' + reData.rows[i].happenTime + '</span></p>' +
                                    '<dl class="dl-horizontal"><dt>实付金额：</dt><dd>' + (reData.rows[i].payAmount || reData.rows[i].amount) + '元</dd>' +
                                    '<dt>积分奖励：</dt><dd><div>消费积分 ' + reData.rows[i].amount + '</div><div>权益积分 ' + (reData.rows[i].rightAmount || 0) + '</div><div>活动积分 ' + (reData.rows[i].activiAmount || 0) + '</div></dd></dl></div>');
                                $("#orderDetailData").html(html.join(''));
                            }
                        }
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        }
    }
});