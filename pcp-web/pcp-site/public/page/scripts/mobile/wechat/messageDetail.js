/**
 * Created by wang,junjie on 2017/10/23.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initProduct();
        },

        initProduct: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/f27269c42dc19f07132397c943098617@id=' + org.breezee.context.queryData.id,
                type: Dolphin.requestMethod.GET,
                loading: true,
                success: function (reData, textStatus) {
                    if (reData.success) {
                        $("#fImage").attr("src", org.breezee.context.getImgSrc(reData.value.image + '.jpg'));
                        Dolphin.form.setValue(reData.value, '#data_form');
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },

    };
});