'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            this.initEvent();
            this.initOrderGrid();
            Dolphin.form.parse("#query_form");
            Dolphin.form.parseSelect($("#storeSelect"));
        },
        initEvent: function () {
            let me = this;
            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                me._orderGrid.query({properties: $.extend({}, d, {})});
            });

            $("#storeSelect").change(function () {
                $("#supplyer").empty();
                if($(this).val()) {
                    $("#supplyer").attr('optionParam', '{"endpoint":"038","WERKS":"' + $(this).val().substr(0, 4) + '","LGORT":"' + $(this).val().substr(4) + '"}')
                    Dolphin.form.parseSelect($("#supplyer"));
                }
            });
        },

        initOrderGrid: function () {
            const me = this;
            let syncDate_gt = $("#syncDate_gt").val();
            let syncDate_le = $("#syncDate_le").val();
            this._orderGrid = new GRID({
                panel: '#dataList',
                url: '/api/fbbc247ea033447b9db0883366fc7c05',
                ajaxType: Dolphin.requestMethod.POST,
                childrenField: 'purchaseLines',
                queryParams: {
                    properties:{
                        syncDate_gt:syncDate_gt,
                        syncDate_le:syncDate_le,
                        type:10,
                        status_not_equal:400,
                    }
                },
                titleFormatter: function (data, index) {
                    let title = '';
                    title += '<span>' + (this.opts.pageElements + index + 1) + '.</span>';
                    title += '<span>订单号：' + (data.code || '待生成') + '</span>';
                    title += '<span style="background-color: #FF6600;font-weight: 700;color: #fff;">' + Dolphin.enum.getEnumText('purchaseType', data.type) + '</span>';
                    title += '<span style="margin-left:20px;">门店：' + data.storeName + '</span>';
                    title += '<span style="margin-left:20px;">供应商名称：' + data.procureName + '</span>';
                    title += '<span>下单日期：' + (data.syncDate||"-") + '</span>';
                    title += '<span style="margin-left:20px;">总金额：' + (data.totalAmount ? data.totalAmount.toFixed(2) : 0) + '</span>';
                    return title;
                },
                operationFormatter: function (data, index) {
                    return ""
                },
                columns: [{
                    width: '30px',
                    formatter: function (val, obj) {
                        return "";
                    }
                },{
                    code: 'material',
                    className: 'qtnCount',
                    width: '130px',
                    formatter: function (val, obj) {
                        return val;
                    }
                },  {
                    code: 'name',
                    className: 'qtnCount',
                    width: '130px',
                    formatter: function (val, obj) {
                        let html = '';
                        html += '<div class="prt-remark unzhehang">' + obj.name + '</div>';
                        return html;
                    }
                },{
                    width: '30px',
                    formatter: function (val, obj) {
                        return "";
                    }
                },{
                    code: 'quantity',
                    className: 'qtnCount',
                    width: '130px',
                    formatter: function (val, obj) {
                      return val;
                    }
                }, {
                    code: 'unit',
                    width: '110px',
                    textAlign: 'center',
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                       return val;
                    }
                },{
                    code: 'price',
                    className: 'qtnCount',
                    width: '160px',
                    formatter: function (val, obj, data, index) {
                        return val;
                    }
                }, {
                    code: 'subTotal',
                    width: '110px',
                    textAlign: 'center',
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                        return (obj.quantity*obj.price).toFixed(2);
                    }
                }],

            });
        },
    };
});