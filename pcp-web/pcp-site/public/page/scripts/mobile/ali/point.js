"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            this.initCoupon();
            this.initPoint();
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
                        status: 1
                    }
                }),
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.rows && reData.rows.length > 0) {
                            let html = [];
                            for (let i = 0; i < reData.rows.length; i++) {
                                if (reData.rows[i].pointType == '5') {
                                    html.push('<div class="pizza-form-group point-detail">' +
                                        '<div><strong>' + reData.rows[i].remark + '</strong>' +
                                        '<strong class="pull-right">' + reData.rows[i].amount + '</strong>' +
                                        '</div>' +
                                        '<div><small>' + reData.rows[i].createTime + '兑换</small></div></div>');
                                } else {
                                    html.push('<div class="pizza-form-group point-detail">' +
                                        '<div><strong>' + reData.rows[i].remark + '</strong>' +
                                        '<strong class="pull-right">' + reData.rows[i].amount + '</strong>' +
                                        '</div>' +
                                        '<div><small>' + reData.rows[i].endTime + '过期</small></div></div>');
                                }
                                $("#pointData").html(html.join(''));
                            }
                        }
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },
        initPoint: function () {
            let me = this;
            if (org.breezee.context.userData.cardLevel < 3) {
                Dolphin.ajax({
                    url: '/api/c2c9953a2ebd4df48fa8f8501a725b31',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        properties: {
                            cardLevel: (org.breezee.context.userData.cardLevel + 1)
                        }
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        console.log(reData);
                        if (reData.success) {
                            if (reData.rows && reData.rows.length > 0) {
                                $("#needPoint").text(Number(reData.rows[0].quota || 0) - Number(org.breezee.context.userData.salePoint || 0));
                            }
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            } else {
                $("#needPoint").text(0);
            }

        },
    }
});