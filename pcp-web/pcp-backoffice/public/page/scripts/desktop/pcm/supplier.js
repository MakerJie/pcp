'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
            this.dataList();

            Dolphin.form.parse('#query_form');
        },

        /**
         * 初始化事件
         */
        initEvent: function () {
            let me = this;

            $(".btn_query").click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            org.breezee.syncListen("确认同步供应商信息？",{
                mo: 'com.pcp.api.pms.service.ISupplierService',
                rule: 'supplier',
                endpoint: '005',
                DATE:'1900-01-01'
            });
        },

        dataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams:{
                    _count:1
                },
                columns: [{
                    code: 'code',
                    title: '编码',
                    width: '90px'
                }, {
                    code: 'name',
                    title: '名称'
                }, {
                    code: 'buGroup',
                    title: '分组',
                    width: '90px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("Bugroup", val);
                    }
                }, {
                    code: 'type',
                    title: '角色',
                    width: '90px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("supplierType", val);
                    }
                }, {
                    code: 'telephone',
                    title: '电话',
                    width: '110px'
                }, {
                    code: 'email',
                    title: '电邮',
                    width: '120px'
                }, {
                    code: '',
                    title: '订单情况',
                    width: '200px',
                    formatter:function (val,row) {
                        let html = [];
                        html.push('<div>订单总数:<span style="color: #ac2925;">');
                        html.push(row.orderCount || '-');
                        html.push('</span></div><div>订单总金额:<span style="color: orangered;">');
                        html.push(row.orderAmount || '-');
                        html.push('</span></div>');
                        return html.join('');
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/e69293fefcd54ca3b8bef8f0a7a73688',
                pagination: true,
                onClick: function (data) {
                },
                onUnchecked: function () {

                }
            });
        },

    };
});