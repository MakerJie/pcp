'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initOrderGrid();
            Dolphin.form.parseSelect($("#storeSelect"));
            Dolphin.form.parse("#query_form")
        },
        initEvent: function () {
            let me = this;
            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                me._orderGrid.query({properties: $.extend({}, d, {})});
            });

        },
        initOrderGrid: function () {
            const me = this;
            let happenTime_gt = $("#happenTime_gt").val();
            let happenTime_le = $("#happenTime_le").val();
            this._orderGrid = new GRID({
                panel: '#dataList',
                url: '/api/6b4c345c3988f533f6188cab1837c1a7',
                ajaxType: Dolphin.requestMethod.POST,
                childrenField: 'fetchLines',
                queryParams: {
                    properties: {
                        happenTime_gt:happenTime_gt,
                        happenTime_le:happenTime_le,
                    }
                },
                titleFormatter: function (data, index) {
                    let title = '';
                    title += '<span class="titleOrderNo">' + (this.opts.pageElements + index + 1) + '.</span>';
                    title += '<span style="margin-left:20px;">单据号：' + (data.code || '待生成') + '</span>';
                    title += '<span style="margin-left:50px;">消耗类型：' + Dolphin.enum.getEnumText('fetchType', data.type) + '</span>';
                    title += '<span style="margin-left:50px;">提交人：' + (data.creator||"-") + '</span>';
                    title += '<span style="margin-left:50px;">门店：' + (data.shopName||"-") + '</span>';
                    title += '<span style="margin-left:50px;">下单日期：' + (data.happenTime!=null? data.happenTime.substr(0,10) : '-' ||"-") + '</span>';
                    return title;
                },
                operationFormatter: function (data, index) {
                    return ""
                },
                columns: [{
                    code: 'code',
                    className: 'qtnCount',
                    width: '15%',
                    formatter: function (val, obj) {
                        return val;
                    }
                },  {
                    code: 'name',
                    className: 'qtnCount',
                    width: '22%',
                    formatter: function (val, obj) {
                        let html = '';
                        html += '<div class="prt-remark unzhehang">' + obj.name + '</div>';
                        return html;
                    }
                },{
                    code: 'quantity',
                    className: 'qtnCount',
                    width: '15%',
                    formatter: function (val, obj) {
                        return val;
                    }
                }, {
                    code: 'unit',
                    width: '15%',
                    textAlign: 'center',
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                        return val;
                    }
                },{
                    code: 'reason',
                    className: 'qtnCount',
                    width: '15%',
                    formatter: function (val, obj, data, index) {
                        return Dolphin.enum.getEnumText('reason', obj.reason)||"-";
                    }
                }, {
                    code: 'attribute',
                    width: '18%',
                    textAlign: 'center',
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                        return (val||"-");
                    }
                }],

            });
        },
    };
});