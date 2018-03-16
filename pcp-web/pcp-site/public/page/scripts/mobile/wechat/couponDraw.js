"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            this.initProduct();
            this.couponData = {};

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
                            if (reData.value.transferUser) {
                                $("#con_draw").html("券已被领取").attr('disabled', true);
                            }
                        }
                    } else {
                        $("#con_draw").html(reData.msg).attr('disabled', true);
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });

            $("#con_draw").click(function () {
                Dolphin.ajax({
                    url: '/api/67960f5dcd6d4cd1ac8583069ac59874',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        id: org.breezee.context.queryData.id,
                        userId: org.breezee.context.userData.id,
                        status: 1
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            Dolphin.alert('领取成功', {
                                callback: function () {
                                    location.href = "coupon";
                                }
                            });
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });
        }
    }
});