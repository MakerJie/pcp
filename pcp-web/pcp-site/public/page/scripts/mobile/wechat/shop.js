'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            let me = this;
            $("#city").select({
                title: "请选择城市",
                items: ["上海市", "北京市", "南京市", "广州市", "杭州市", "武汉市", "深圳市"],
                onChange: function (a, b, c) {
                    me.loadShop(a.values);
                }
            });

            this.loadShop('');
        },

        loadShop: function (city) {
            Dolphin.ajax({
                url: '/api/445a2ba90204414387ba30a336f016b6',
                type: Dolphin.requestMethod.POST,
                data: Dolphin.json2string({
                    properties: {
                        type: '1',
                        status: 1,
                        pageSize: 1000,
                        city: city
                    }
                }),
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.rows && reData.rows.length > 0) {
                            let html = [];
                            for (let i = 0; i < reData.rows.length; i++) {
                                html.push('<div class="weui-media-box weui-media-box_text">');
                                html.push('<h4 class="weui-media-box__title">' + reData.rows[i].name + '</h4>');
                                html.push('<p class="weui-media-box__desc">' + reData.rows[i].remark + '</p>');
                                html.push('</div>');
                            }
                            if (html.length > 0) {
                                $("#shopData").empty().html(html.join(''));
                            }
                        } else {
                            $("#shopData").empty().html('<div class="text-center descr">暂无结果数据</div>');
                        }
                    } else {
                        $("#shopData").empty().html('<div class="text-center descr">' + reData.msg + '</div>');
                    }
                },
                onError: function () {
                    $("#shopData").html('系统出错，请联系管理员');
                }
            });
        }
    };
});