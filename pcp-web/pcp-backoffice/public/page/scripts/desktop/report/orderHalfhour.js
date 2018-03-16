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

            $("#timeAreaSelect").select2({
                selectOnClose: false,
                allowClear: true
            });
        },
        initEvent: function () {
            let me = this;
            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                if(d.code_or) {
                    d.code_or = d.code_or.join(',');
                }
                me._dataList.query(d);
            });
        },

        initOrderGrid: function () {
            const me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'remark',
                    title: '门店'
                }, {
                    code: 'rptTime',
                    title: '日期',
                    width: '150px',
                    className: "hide_el",
                    formatter:function (val) {
                        if(val){
                            return val.substr(0,10);
                        }
                        return "-";
                    }
                }, {
                    code: 'rptTime',
                    title: '时段',
                    width: '120px',
                    className: "hide_el",
                    formatter:function (val) {
                        if(val){
                            return val.substr(11);
                        }
                        return "-";
                    }
                }, {
                    code: 'amount',
                    title: '金额',
                    width: '90px',
                    className: "hide_el"
                }, {
                    code: 'personCount',
                    title: '人数',
                    textAlign: 'right',
                    width: '90px'
                }, {
                    code: 'peronPrice',
                    title: '均价',
                    textAlign: 'right',
                    width: '90px'
                }, {
                    code: 'orderCount',
                    title: '订单数',
                    textAlign: 'right',
                    width: '90px'
                }, {
                    code: 'orderPrice',
                    title: '金额/单',
                    textAlign: 'right',
                    width: '90px'
                },],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/7a5fe158d2a644f1a33b60f7657d9410',
                pagination: true
            });

        },
    };
});