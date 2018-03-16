/**
 * Created by Ning on 2017/8/19.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            this.initEvent();
            this.initDataList();
            Dolphin.form.parse('#query_form');
            Dolphin.form.parseSelect($("#myShop"));
        },

        initEvent: function () {
            let me = this;
            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                me._dataList.load(null, null, {
                    mo: 'com.pcp.api.pms.service.IStockService',
                    userId: org.breezee.context.userData.userId,
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

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams:{},
                data: {total: 0, rows: []},
                columns: [{
                    code: 'materielCode',
                    title: '物料编码',
                    width: '130px'
                }, {
                    code: 'materielName',
                    title: '物料名称',
                    width: '300px'
                }, {
                    code: 'stockAccount',
                    title: '数量',
                    width: '110px',
                    className: "hide_el"
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '100px',
                    className: "hide_el"
                },{
                    code: 'price',
                    title: '参考金额',
                    width: '75px',
                    className: "hide_el"
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',
                pagination: false,
            });
        }
    };
});