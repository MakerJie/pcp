"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            this.initProduct();
        },

        initProduct: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/542dba0a139644e39257c08c035e33d5',
                type: Dolphin.requestMethod.POST,
                data: Dolphin.json2string({
                    properties: {
                        type: org.breezee.context.queryData.type,
                        pageSize: 100,
                        stockRemain_gt_null: 1
                    }
                }),
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.rows && reData.rows.length > 0) {
                            let html = [];
                            let dis = "";

                            for (let i = 0; i < reData.rows.length; i++) {
                                if (org.breezee.context.userData.cardLevel == 5) {
                                    dis = "disabled";
                                } else {
                                    console.log(org.breezee.context.userData.cardLevel, reData.rows[i].exchangeLevel, '-===');
                                    if (Number(org.breezee.context.userData.cardLevel) < Number(reData.rows[i].exchangeLevel)) {
                                        dis = "disabled";
                                    } else {
                                        dis = "";
                                    }
                                }

                                html.push('<div class="coupon-block block5">');
                                html.push('<img class="mall-img" src="' + org.breezee.context.getImgSrc(reData.rows[i].image) + ' "/>');
                                html.push('<h5><b class="mall-active">' + reData.rows[i].name + '</b></h5>');
                                if (org.breezee.context.userData.cardLevel > 1) {
                                    html.push('<div><strong>所需积分 <span>' + (reData.rows[i].goldCardPoint || 0) + '</span> </strong></div>');
                                } else {
                                    html.push('<div><strong>所需积分 <span>' + (reData.rows[i].buleCardPoint || reData.rows[i].goldCardPoint || 0) + '</span> </strong></div>');
                                }
                                if (org.breezee.context.userData.cardLevel == 1) {
                                    html.push('<div><small>* 金卡及以上所需积分' + reData.rows[i].goldCardPoint + '</small></div>');
                                } else {
                                    html.push('<div>&nbsp;</div>')
                                }
                                html.push('<div><div class="pull-right"><button data-id="' + reData.rows[i].id + '" class="btn btn-pizza btn_exchange" '
                                    + (dis) + ' style="padding: 6px 15px;margin-right: 10px">立即兑换</button></div></div></div>');
                            }
                            $("#productData").html(html.join(''));

                            $(".btn_exchange").click(function () {
                                location.href = "pointExchange?id=" + $(this).data('id');
                            });
                        } else {
                            $("#productData").html('<div class="text-center;" style="padding:30px;margin-top: 20px;font-weight: 700;"><p>暂无商品数据</p></div>');
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