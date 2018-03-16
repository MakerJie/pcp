'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            this.initOrderList();
            this.lineData();
            this.initPromotionList();
            this.summaryLineData();
            this.paymentData();
            this.summaryDis();
            this.summaryPays();
            Dolphin.form.parse("#data_form");
            this.curId = null;
        },

        initEvent: function () {
            let me = this;
            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams:{},
                columns: [{
                    code: 'ZID',
                    title: '编码',
                    width: '110px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'ORDER_CLTMIE',
                    title: '交易日期',
                    width: '150px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'SHOP_CODE',
                    title: '门店信息',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val ? val : '门店编码' + row.shopCode + '不存在';
                    }
                }, {
                    code: 'CHANNEL',
                    title: '销售渠道',
                    className: "hide_el",
                    width: '100px',
                    formatter: function (val, row) {
                        return val && Dolphin.enum.getEnumText('', val);
                    }
                }, {
                    code: 'BRAND',
                    title: '品牌',
                    className: "hide_el",
                    width: '100px',
                    formatter: function (val, row) {
                        return val && Dolphin.enum.getEnumText("brandName", val);
                    }
                }, {
                    code: 'METHOD',
                    title: '销售方式',
                    className: "hide_el",
                    width: '110px',
                    formatter: function (val, row) {
                        return val && Dolphin.enum.getEnumText('saleMethod', val);
                    }
                }, {
                    code: 'TOTALAMOUNT',
                    title: '金额￥',
                    width: '170px'
                }, {
                    code: 'id',
                    title: '操作',
                    className: "hide_el",
                    textAlign: 'center',
                    width: '90px',
                    formatter: function (val, row, index) {
                        return '<a class="dark viewBtn" ' +
                            'data-id="'+row.id+'" data-code="'+row.code+'" ' +
                            'href="javascript:;"><i class="fa fa-share"></i></a>';
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/1fa9378234614eebb05aab15a6e5574d',
                pagination: true,
                onLoadSuccess: function (data) {
                    $(".viewBtn").click(function () {
                        me.curId = $(this).data('id');
                        me._summaryLineList.load(null, {
                            summary_id_obj_ae: me.curId
                        });
                        me._detailOrderList.load(null, {
                            summaryId: me.curId
                        });
                        me._summaryDis.load(null, {
                            summary_id_obj_ae: me.curId
                        });
                        me._summaryPays.load(null, {
                            summary_id_obj_ae: me.curId
                        });
                        $("#dataModal").modal({
                            show: true,
                            backdrop: 'static'
                        })
                    });
                }
            });
        },

        initOrderList: function () {
            let me = this;
            me._detailOrderList = new Dolphin.LIST({
                panel: "#detailOrderList",
                idField: 'id',
                hover: false,
                queryParams:{},
                columns: [{
                    code: 'happenTime',
                    title: '交易时间',
                    width: '150px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'name',
                    title: '门店信息',
                    width: '100px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val ? val : '门店编码' + row.shopCode + '不存在';
                    }
                }, {
                    code: 'code',
                    title: '订单号',
                    className: "hide_el",
                    width: '130px',
                    formatter: function (val, row) {
                        return val + ' - <span style="font-size: 85%;">' + row.billNo + '</span>';
                    }
                }, {
                    code: 'userName',
                    title: '会员名称',
                    className: "hide_el",
                    width: '100px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'period',
                    title: '餐段',
                    className: "hide_el",
                    width: '70px',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText('posPeriod', val);
                    }
                }, {
                    code: 'brand',
                    title: '品牌',
                    className: "hide_el",
                    width: '70px',
                    formatter: function (val, row) {
                        return val && Dolphin.enum.getEnumText("brandName", val);
                    }
                }, {
                    code: 'method',
                    title: '销售方式',
                    className: "hide_el",
                    width: '90px',
                    formatter: function (val, row) {
                        return val && Dolphin.enum.getEnumText('saleMethod', val);
                    }
                }, {
                    code: 'totalAmount',
                    title: '金额￥',
                    width: '270px',
                    formatter: function (val, row) {
                        let html = [];
                        html.push('<span>总金额: ');
                        html.push(row.totalAmount);
                        html.push('元</span><span>， 优惠额: ');
                        html.push(row.disAmount || 0);
                        html.push('元</span>');
                        html.push('<span>， 扣减额: ');
                        html.push(row.deductAmount);
                        html.push('元</span>');

                        html.push('<br/><span> 实收: ');
                        html.push(row.subAmount);
                        html.push('元</span>');

                        return html.join('');
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/7b5e3f88ed474fe4a9b356bd7c681626',
                data: {rows: []},
                pagination: true,
                onLoadSuccess: function (data) {

                }
            });
        },

        summaryDis: function () {
            let me = this;
            me._summaryDis = new Dolphin.LIST({
                panel: "#summaryOrderDiscountList",
                idField: 'id',
                hover: false,
                queryParams:{},
                pageSizeOption: [10, 20, 50, 100,500],
                columns: [{
                    code: 'DIS_TYPE',
                    title: '类型编码',
                    width: '150px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'DIS_CODE',
                    title: '折扣编码',
                    className: "hide_el",
                    width: '130px'
                }, {
                    code: 'DISAMOUNT',
                    title: '折扣金额',
                    className: "hide_el",
                    width: '110px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'DIVAMOUNT',
                    title: '分摊金额',
                    className: "hide_el",
                    width: '110px'
                }, {
                    code:'ROW_NUM',
                    title:'行号',
                    width:'75px'
                },{
                    code: 'orderGroup',
                    title: '&nbsp;',
                    className: "hide_el",
                    textAlign: 'center',
                    width: '110px',
                    formatter: function (val, row, index) {
                        return '<a class="btn btn-outline btn-sm green viewOrderDisDetail" ' +
                            ' data-order-group="' + (val+row.lineCode) + '" ' +
                            ' data-type-code="' + row.DIS_TYPE + '" ' +
                            ' data-dis-code="' + row.DIS_CODE + '" ' +
                            'href="javascript:void(0);"><i class="fa fa-share"></i>明细折扣行</a>';
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/026badc4963244469389220caf4dc31a',
                data: {rows: []},
                pagination: true,
                onLoadSuccess: function (data) {
                    $(".viewOrderDisDetail").click(function () {
                        me._detailOrderDiscountList.load(null, $(this).data());
                        $("#dataModal4").modal('show');
                    });
                }
            });
        },

        initPromotionList: function () {
            let me = this;
            me._detailOrderDiscountList = new Dolphin.LIST({
                panel: "#detailOrderDiscountList",
                idField: 'id',
                hover: false,
                queryParams:{},
                columns: [{
                    code: 'orderCode',
                    title: '订单号',
                    width: '150px'
                }, {
                    code: 'typeCode',
                    title: '类型编码',
                    width: '150px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'typeName',
                    title: '类型名称',
                    className: "hide_el"
                }, {
                    code: 'disCode',
                    title: '折扣编码',
                    className: "hide_el",
                    width: '130px'
                }, {
                    code: 'disAmount',
                    title: '折扣金额',
                    className: "hide_el",
                    width: '110px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'divAmount',
                    title: '分摊金额',
                    className: "hide_el",
                    width: '110px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/c9389184f310427eafa72d4470cd465b',
                data: {rows: []},
                pagination: true,
                onLoadSuccess: function (data) {

                }
            });
        },

        summaryPays: function () {
            let me = this;
            me._summaryPays = new Dolphin.LIST({
                panel: "#summaryOrderPaymentList",
                idField: 'id',
                hover: false,
                queryParams:{},
                columns: [{
                    code: 'PAY_METHOD',
                    title: '支付方式',
                    width: '180px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'PAYAMOUNT',
                    title: '支付金额',
                    width: '130px',
                    textAlign: 'right',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val && val.toFixed(2);
                    }
                }, {
                    code: 'ZXFJE',
                    title: '小费',
                    width: '130px',
                    textAlign: 'right',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val && val.toFixed(2);
                    }
                },{
                    code: 'ZBTJE',
                    title: '补贴金额',
                    width: '130px',
                    textAlign: 'right',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val && val.toFixed(2);
                    }
                },{
                    code: 'PAY_CUSTOM',
                    title: '承担客户',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'orderGroup',
                    title: '&nbsp;',
                    className: "hide_el",
                    textAlign: 'center',
                    width: '110px',
                    formatter: function (val, row, index) {
                        return '<a class="btn btn-outline btn-sm purple viewOrderPayDetail" ' +
                            ' data-order-group="' + val + '" ' +
                            ' data-corp-code="' + row.PAY_CUSTOM + '" ' +
                            ' data-pay-code="' + row.PAY_METHOD + '" ' +
                            'href="javascript:void(0);"><i class="fa fa-share"></i>明细折扣行</a>';
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/5defd347d0634c18ac6d8466ce74cb03',
                data: {rows: []},
                pagination: true,
                onLoadSuccess: function (data) {
                    $(".viewOrderPayDetail").click(function () {
                        me._detailOrderPaymentList.load(null, $(this).data());
                        $("#dataModal5").modal('show');
                    });
                }
            });
        },

        paymentData: function () {
            this._detailOrderPaymentList = new Dolphin.LIST({
                panel: "#detailOrderPaymentList",
                idField: 'id',
                hover: false,
                queryParams:{},
                columns: [{
                    code: 'orderCode',
                    title: '订单号',
                    width: '150px'
                }, {
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
                    width: '75px'
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
                url: '/api/88c151a9bee646f98c2ed0bdec235868',
                data: {rows: []},
                ajaxType: Dolphin.requestMethod.POST,
                pagination: true,

            });
        },

        summaryLineData: function () {
            const me = this;
            this._summaryLineList = new Dolphin.LIST({
                panel: "#detailOrderLineList",
                idField: 'id',
                hover: false,
                pageSizeOption: [10, 20, 50, 100,500],
                queryParams:{},
                columns: [{
                    code:'id',
                    hidden:'true'
                },{
                    code: 'SALE_TYPW',
                    title: '业务类型',
                    width: '90px',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText('orderLineType', val);
                    }
                }, {
                    code: 'ZZPOS_MAT',
                    title: '菜品编码'
                }, {
                    code: 'COMBO_TYPE',
                    title: '套餐标识',
                    width: '130px',
                    className: "hide_el",
                    textAlign: 'center',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText("comboType", val);
                    }
                }, {
                    code: 'COMBO_CODE',
                    title: '套餐编码',
                    width: '100px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'QUANTITY',
                    title: '数量',
                    className: "hide_el",
                    width: '75px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'SALE_PRICE',
                    title: '单价',
                    className: "hide_el",
                    width: '75px',
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'TOTALAMOUNT',
                    title: '合计',
                    className: "hide_el",
                    width: '100px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'SUBAMOUNT',
                    title: '小计',
                    className: "hide_el",
                    width: '120px'
                }, {
                    code: 'DISAMOUNT',
                    title: '折扣',
                    className: "hide_el",
                    width: '120px'
                }, {
                    code: 'DIVAMOUNT',
                    title: '补贴分摊',
                    className: "hide_el",
                    width: '90px',
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'NETAMOUNT',
                    title: '净额',
                    width: '75px'
                }, {
                    code:'ROW_NUM',
                    title:'行号',
                    width:'75px'
                },{
                    code: 'orderGroup',
                    title: '&nbsp;',
                    className: "hide_el",
                    textAlign: 'center',
                    width: '110px',
                    formatter: function (val, row, index) {
                        return '<a class="btn btn-outline btn-sm yellow viewOrderLineDetail" ' +
                            ' data-order-group="' + val + '" ' +
                            ' data-product-code="' + row.ZZPOS_MAT + '" ' +
                            ' data-period="' + row.PERIOD + '" ' +
                            ' data-type="' + row.SALE_TYPW + '" ' +
                            ' data-return-line-id="0" ' +
                            ' data-combo-code="' + row.COMBO_CODE + '" ' +
                            ' data-combo-type="' + row.COMBO_TYPE + '" ' +
                            'href="javascript:void(0);"><i class="fa fa-share"></i>订单明细行</a>';
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                url: '/api/40e8c36d3ff6428899772e8bfd6e4233',
                data: {rows: []},
                ajaxType: Dolphin.requestMethod.POST,
                pagination: true,
                onLoadSuccess: function (data) {
                    $(".viewOrderLineDetail").click(function () {
                        me._orderLineList.load(null, $(this).data());
                        $("#dataModal3").modal('show');
                    });
                }
            });
        },

        lineData: function () {
            this._orderLineList = new Dolphin.LIST({
                panel: "#lineListSelect",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'orderCode',
                    title: '订单号',
                    width: '150px'
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
                        return val || '-';
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
                        return val ? val : row.subAmount;
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                url: '/api/2e98fa18378a45a1a776e15dc904fe3d',
                data: {rows: []},
                ajaxType: Dolphin.requestMethod.POST,
                pagination: true
            });
        }
    };
});
