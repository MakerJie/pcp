'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            this.paymentData();
            this.discountsData();
            this.lineDetailData();
            this.lineData();
            this.typeValue = 0;
            Dolphin.form.parse("#data_form");
        },

        initEvent: function () {
            let me = this;
            $('.btn_query').click(function () {
                let d = Dolphin.form.getValue('#query_form');
                if (d.happenTime_gt)
                    d.happenTime_gt = d.happenTime_gt + " 00:00:00";
                if (d.happenTime_le)
                    d.happenTime_le = d.happenTime_le + " 23:59:59";
                if (d.openDay_gt)
                    d.openDay_gt = d.openDay_gt;
                if (d.openDay_le)
                    d.openDay_le = d.openDay_le;
                if (me.typeValue === 0) {
                    d.typeCode = "";
                    d.disCode = "";
                    me._dataList.reload(null, d);
                } else if (me.typeValue === 1) {
                    d.orderEntity_code_obj_like_ae = d.code_like;
                    d.orderEntity_shopCode_obj_ae = d.shopCode;
                    d.orderEntity_billNo_obj_ae = d.billNo;
                    d.orderEntity_happenTime_obj_gt_ae = d.happenTime_gt;
                    d.orderEntity_happenTime_obj_le_ae = d.happenTime_le;
                    d.orderEntity_openDay_obj_gt_ae = d.openDay_gt;
                    d.orderEntity_openDay_obj_le_ae = d.openDay_le;

                    d.code_like = "";
                    d.shopCode = "";
                    d.billNo = "";
                    d.happenTime_gt = "";
                    d.happenTime_le = "";
                    d.openDay_gt = "";
                    d.openDay_le = "";
                    me._discountsDataList.reload(null, d);

                } else if (me.typeValue === 2) {
                    d.order_code_obj_like_ae = d.code_like;
                    d.order_shopCode_obj_ae = d.shopCode;
                    d.order_billNo_obj_ae = d.billNo;
                    d.order_happenTime_obj_gt_ae = d.happenTime_gt;
                    d.order_happenTime_obj_le_ae = d.happenTime_le;
                    d.order_openDay_obj_gt_ae = d.openDay_gt;
                    d.order_openDay_obj_le_ae = d.openDay_le;

                    d.code_like = "";
                    d.shopCode = "";
                    d.billNo = "";
                    d.happenTime_gt = "";
                    d.happenTime_le = "";
                    d.openDay_gt = "";
                    d.openDay_le = "";
                    d.typeCode = "";
                    d.disCode = "";

                    me._lineDetailData.reload(null, d);
                }
            });

            $('#tab_user1').on('shown.bs.tab', function (e) {
                me.typeValue = 0;
            });

            $('#tab_user2').on('shown.bs.tab', function (e) {
                me.typeValue = 1;
            });

            $('#tab_user3').on('shown.bs.tab', function (e) {
                me.typeValue = 2;
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                pageSizeOption: [10, 20, 50, 100, 500],
                queryParams: {
                    _calculate: true
                },
                columns: [{
                    code: 'happenTime',
                    title: '交易时间',
                    width: '130px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'shopCode',
                    title: '门店',
                    className: "hide_el"
                }, {
                    code: 'code',
                    title: '订单号',
                    className: "hide_el",
                    width: '130px',
                    formatter: function (val, row) {
                        return val + ' - <span style="font-size: 85%;">' + row.billNo + '</span>';
                    }
                }, {
                    code: 'createTime',
                    title: '传输时间',
                    className: "hide_el",
                    width: '130px'
                }, {
                    code: 'totalAmount',
                    title: '销售金额POS',
                    className: "hide_el",
                    width: '120px'
                }, {
                    code: 'saleTotalAmount',
                    title: '销售金额行',
                    className: "hide_el",
                    width: '100px'
                }, {
                    code: 'saleOriginalAmount',
                    title: '菜品原价',
                    className: "hide_el",
                    width: '90px'
                }, {
                    code: 'lineTotalDisAmount',
                    title: '订单折扣',
                    className: "hide_el",
                    width: '90px'
                }, {
                    code: 'totalNetAmount',
                    title: '菜品净额(-)',
                    className: "hide_el",
                    width: '100px'
                }, {
                    code: 'lineNetAmount',
                    title: '订单净额行',
                    className: "hide_el",
                    width: '100px'
                }, {
                    code: 'payTotalAmount',
                    title: '支付金额',
                    className: "hide_el",
                    width: '90px'
                }, {
                    code: 'id',
                    title: '操作',
                    className: "hide_el",
                    textAlign: 'center',
                    width: '70px',
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.view({
                            id: row.id
                        });
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/7b5e3f88ed474fe4a9b356bd7c681626',
                pagination: true,
                onLoadSuccess: function (data) {
                    $(".viewBtn").click(function () {
                        let id = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/979fbfff19034a978f6fc344f8d7b956@id=' + id,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (reData) {
                                reData.value.periodName = Dolphin.enum.getEnumText('posPeriod', reData.value.period);
                                reData.value.methodName = Dolphin.enum.getEnumText('saleMethod', reData.value.method);
                                reData.value.brandName = Dolphin.enum.getEnumText('brandName', reData.value.brand);
                                if (reData.value.disCode) {
                                    reData.value.disTypeName = Dolphin.enum.getEnumText('disType', reData.value.disType);
                                } else {
                                    reData.value.disTypeName = "";
                                    reData.value.disCode = "";
                                }
                                Dolphin.form.setValue(reData.value, '#order-form');
                                if (reData.value.disAmount) {
                                    $("#disAmountTr").show();
                                } else {
                                    $("#disAmountTr").hide();
                                }
                                if (reData.value.smallFee) {
                                    $("#smallFeeTr").show();
                                } else {
                                    $("#smallFeeTr").hide();
                                }
                                if (reData.value.subDisAmount) {
                                    $("#subDisAmountTr").show();
                                } else {
                                    $("#subDisAmountTr").hide();
                                }
                                if (reData.value.payDisAmount) {
                                    $("#payDisAmountTr").show();
                                } else {
                                    $("#payDisAmountTr").hide();
                                }
                                me._dataLineList.loadData({rows: reData.value.orderLines});
                                me._payementList.loadData({rows: reData.value.payments});
                                $('#dataModal').modal('show');
                            }
                        });
                    });
                    let ht = [];
                    for (let k in data.value) {
                        ht.push("<li>" + k + ":" + data.value[k] + "</li>");
                    }
                    $("#statisticValue").empty().append($(ht.join('')));
                }
            });
        },

        discountsData: function () {
            this._discountsDataList = new Dolphin.LIST({
                panel: "#discountsData",
                idField: 'id',
                hover: false,
                pageSizeOption: [10, 20, 50, 100, 500],
                queryParams: {
                    // orderLine_comboType_obj_ae: '0',
                    _summary: true
                },
                columns: [{
                    code: 'orderInfo.shopCode',
                    title: '门店编码',
                    width: '120px'
                }, {
                    code: 'orderInfo.happenTime',
                    title: '交易时间',
                    width: '150px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'orderInfo.code',
                    title: '订单号',
                    className: "hide_el",
                    width: '130px',
                    formatter: function (val, row) {
                        return val + ' - <span style="font-size: 85%;">' + (row.orderInfo && row.orderInfo.billNo) + '</span>';
                    }
                }, {
                    code: 'orderInfo.createTime',
                    title: '传输时间',
                    className: "hide_el",
                    width: '150px'
                }, {
                    code: 'comboCode',
                    title: '套餐编码',
                    width: '120px'
                }, {
                    code: 'comboType',
                    title: '套餐标识',
                    width: '160px',
                    formatter: function (val, row) {
                        return ((row.comboType && row.comboType != '0') ? Dolphin.enum.getEnumText("comboType", row.comboType) : '')
                            + '&nbsp;&nbsp;&nbsp;' + (val && (val == 1 || val == 2) ? row.productCode : '-');
                    }
                }, {
                    code: 'lineRowNum',
                    title: '订单行项目',
                    className: "hide_el",
                    width: '150px'
                }, {
                    code: 'typeName',
                    title: '折扣类型',
                    className: "hide_el",
                    width: '150px',
                    formatter:function (val,row) {
                        return row.typeCode+val;
                    }
                }, {
                    code: 'disCode',
                    title: '折扣编码',
                    className: "hide_el",
                    width: '150px'
                }, {
                    code: 'disAmount',
                    title: '折扣金额',
                    className: "hide_el",
                    width: '150px'
                }, {
                    code: 'summaryLine',
                    title: '汇总行',
                    className: "hide_el",
                    width: '160px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/c9389184f310427eafa72d4470cd465b',
                pagination: true,
            });
        },

        lineDetailData: function () {
            this._lineDetailData = new Dolphin.LIST({
                panel: "#lineDetailData",
                idField: 'id',
                hover: false,
                pageSizeOption: [10, 20, 50, 100, 500],
                queryParams: {
                    _summary: true
                },
                columns: [{
                    code: 'shopCode',
                    title: '门店编码',
                    width: '120px'
                }, {
                    code: 'orderCode',
                    title: '订单编号',
                    width: '150px',
                    formatter: function (val, row) {
                        return val + '__' + row.rowNum;
                    }
                }, {
                    code: 'type',
                    title: '业务类型',
                    width: '90px',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText('orderLineType', val);
                    }
                }, {
                    code: 'name',
                    title: '菜品描述',
                    formatter: function (val, row) {
                        return row.productCode + '-' + val + '&nbsp;&nbsp;<span style="color: orangered;">' + (row.tempLine && row.tempLine === '1' ? '临时菜' : '') + '</span>';
                    }
                }, {
                    code: 'comboType',
                    title: '套餐标识',
                    width: '130px',
                    className: "hide_el",
                    textAlign: 'center',
                    formatter: function (val, row) {
                        return ((row.comboType && row.comboType != '0') ? Dolphin.enum.getEnumText("comboType", row.comboType) : '')
                            + '&nbsp;&nbsp;&nbsp;' + (val && (val == 1 || val == 2) ? row.productCode : '-');
                    }
                }, {
                    code: 'addValue',
                    title: '加价',
                    className: "hide_el",
                    width: '75px',
                    formatter: function (val, row) {
                        return row.auxiliary || val || '-';
                    }
                }, {
                    code: 'totalAmount',
                    title: '合计',
                    className: "hide_el",
                    width: '100px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'divideAmount',
                    title: '补贴分摊',
                    className: "hide_el",
                    width: '90px',
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'netAmount',
                    title: '净额',
                    width: '75px',
                    formatter: function (val, row) {
                        return val ? val : '0';
                    }
                }, {
                    code: 'summaryLine',
                    title: '汇总行',
                    className: "hide_el",
                    width: '160px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2e98fa18378a45a1a776e15dc904fe3d',
                pagination: true,
            });
        },

        lineData: function () {
            this._dataLineList = new Dolphin.LIST({
                panel: "#lineData",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'type',
                    title: '业务类型',
                    width: '90px',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText('orderLineType', val) + '-' + (row.toppings ? "" : row.code);
                    }
                }, {
                    code: 'name',
                    title: '菜品描述',
                    formatter: function (val, row) {
                        return row.productCode + '-' + val + '&nbsp;&nbsp;<span style="color: orangered;">' + (row.tempLine && row.tempLine === '1' ? '临时菜' : '') + '</span>';
                    }
                }, {
                    code: 'comboType',
                    title: '套餐标识',
                    width: '130px',
                    className: "hide_el",
                    textAlign: 'center',
                    formatter: function (val, row) {
                        return ((row.comboType && row.comboType != '0') ? Dolphin.enum.getEnumText("comboType", row.comboType) : '')
                            + '&nbsp;&nbsp;&nbsp;' + (val && (val == 1 || val == 2) ? row.productCode : '-');
                    }
                }, {
                    code: 'comboCode',
                    title: '套餐编码',
                    width: '100px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'toppings',
                    title: '配菜所属',
                    className: "hide_el",
                    width: '80px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val ? val : '-';
                    }
                }, {
                    code: 'addValue',
                    title: '加价',
                    className: "hide_el",
                    width: '75px',
                    formatter: function (val, row) {
                        return row.auxiliary || val || '-';
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    className: "hide_el",
                    width: '75px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'salePrice',
                    title: '单价',
                    className: "hide_el",
                    width: '75px',
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'totalAmount',
                    title: '合计',
                    className: "hide_el",
                    width: '100px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'promotions',
                    title: '行折扣',
                    className: "hide_el",
                    width: '190px',
                    formatter: function (val, row) {
                        let ht = [];
                        $.each(val, function () {
                            ht.push(this.name + ": " + this.disAmount);
                        });
                        if (ht.length === 0)
                            return '-';
                        return ht.join('<br/>');
                    }
                }, {
                    code: 'divideAmount',
                    title: '补贴分摊',
                    className: "hide_el",
                    width: '90px',
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'netAmount',
                    title: '净额',
                    width: '75px',
                    formatter: function (val, row) {
                        return val ? val : '0';
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false
            });
        },

        paymentData: function () {
            this._payementList = new Dolphin.LIST({
                panel: "#paymentData",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'name',
                    title: '支付方式',
                    width: '160px',
                    formatter: function (val, row) {
                        return row.payCode + '-' + val;
                    }
                }, {
                    code: 'payAmount',
                    title: '支付金额',
                    width: '100px',
                    textAlign: 'right',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val && val.toFixed(2);
                    }
                }, {
                    code: 'tipFee',
                    title: '小费',
                    className: "hide_el",
                    textAlign: 'center',
                    width: '75px',
                    formatter: function (val, row) {
                        return row.hasTipFee ? val : '';
                    }
                }, {
                    code: 'couponId',
                    title: '券编码',
                    className: "hide_el",
                    width: '130px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'salePrice',
                    title: '支付机构',
                    className: "hide_el",
                    width: '120px',
                    formatter: function (val, row) {
                        return val || '散客';
                    }
                }, {
                    code: 'totalAmount',
                    title: '承担客户',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val;
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: true,

            });
        }
    };
});
