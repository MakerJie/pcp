'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.dataList();
            this.initEvent();
            Dolphin.form.parse('#query_form');
            Dolphin.form.parseSelect($("#myShop"));
        },

        /**
         * 初始化事件
         */
        initEvent: function () {
            let me = this;

            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                console.log(d);

                me._dataList.load(null, null, {
                    mo: 'com.pcp.api.pms.service.IStockService',
                    rule: 'stock',
                    endpoint: '017',
                    ZCXRQ: '2017-08-11',
                    ZPCCX: '',
                    MATNR: d.code,
                    WERKS: d.shopCode.substr(0, 4),
                    LGORT: d.shopCode.substr(4)
                });
            });
        },

        dataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                data: {total: 0, rows: []},
                columns: [{
                    code: 'stockyear',
                    title: '年',
                    width: '60px',
                }, {
                    code: 'stockmonth',
                    title: '月',
                    width: '60px',
                }, {
                    code: 'materielCode',
                    title: '物料编码',
                    width: '90px',
                }, {
                    code: 'materielName',
                    title: '物料名称'
                }, {
                    code: 'stockCode',
                    title: '门店编码',
                    width: '100px',
                }, {
                    code: 'stockName',
                    title: '门店名称',
                    width: '180px',
                }, {
                    code: 'stockAccount',
                    title: '库存量',
                    width: '90px'
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '90px'
                },{
                    code: 'price',
                    title: '参考价格',
                    width: '90px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',
                pagination: false,
                onClick: function (data) {
                },
                onUnchecked: function () {

                }
            });
        },

    };
});