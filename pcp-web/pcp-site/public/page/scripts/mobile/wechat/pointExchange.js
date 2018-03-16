"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            this.initProduct();

            $(".btn_save").click(function () {
                let el = $(this);
                console.log(el.data());
                Dolphin.ajax({
                    url: '/api/44c41f6128d04946a1deddbfd55291a6',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        userId: el.data('user'),
                        couponType: {id: el.data('type')},
                        productId: org.breezee.context.queryData.id,
                        pointAmount: el.data('amount')
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        console.log(reData);
                        if (reData.success) {
                            alert('领取成功');
                            location.href = "coupon?status=1";
                        } else {
                            alert(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });
        },

        initProduct: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/257c08c03553d542dba0a139644e39e3@id=' + org.breezee.context.queryData.id,
                type: Dolphin.requestMethod.GET,
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.value) {
                            $("#voucherImage").attr('src', org.breezee.context.getImgSrc(reData.value.image));
                            $("#remark_coupon").html(reData.value.description);
                            $("#scope_coupon").html(reData.value.specification);
                            $("#prdName").html(reData.value.name);
                            $("#pointAmount").html("" + reData.value.buleCardPoint + " 金卡及以上所需积分 " + reData.value.goldCardPoint);
                            let levelAmount = [-1,
                                reData.value.buleCardPoint,
                                reData.value.goldCardPoint,
                                reData.value.platinumCardPoint,
                                reData.value.blackCardPoint,
                                -1,
                                -1];
                            $("#sendBtn").data('type', reData.value.typeId).data('user', org.breezee.context.userData.cardNo).data('amount', levelAmount[org.breezee.context.userData.cardLevel]);
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