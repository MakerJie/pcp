/**
 * Created by wang,junjie on 2017/11/9.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
            this.initProduct();
        },
        initProduct: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/f27269c42dc19f07132397c943098617@id=10d315afe6b84e908545f9dd6850b988',
                type: Dolphin.requestMethod.GET,
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
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
                if(data.degree){
                    data.degree=data.degree+"星";
                }
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
        }
    };
});