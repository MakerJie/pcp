/**
 * Created by wang,junjie on 2017/8/19.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            Dolphin.form.parseSelect($("#purchaseShop"));
            Dolphin.form.parse("#query_form");

            this.initEvent();
            this.initDataList();
            this._aList = this.aList('#aList');
            this._cList = this.aList('#cList');
            this._dList = this.aList('#dList');
            this._eList = this.aList('#eList');
            this._fList = this.tList('#fList');
            $(".btn_query").click();

            $("#purchaseShop").multipleSelect();
        },

        initEvent: function () {
            let me = this;
          $(".btn_query").click(function () {
                me.queryCondition = Dolphin.form.getValue('#query_form');
                me.queryItems = null;
                if(me.queryCondition.stockRoom){
                    let items=[],lo=[];
                    $.each(me.queryCondition.stockRoom,function () {
                        items.push({
                            SIGN: 'I',
                            OPTION: 'EQ',
                            LOW: this.substr(4),
                            HIGH: ''
                        });
                    });
                    me._dataList.load(null, null, {
                        mo: 'com.pcp.api.pms.service.IStockDifferentService',
                        rule: 'stockDifferent',
                        filter: 'WERKS=' + me.queryCondition.stockRoom[0].substr(0, 4),
                        endpoint: '029',
                        WERKS: '1001',
                        YEARWEEK: '',
                        ITEM: items,
                        ITEM1: [{
                            SIGN: 'I',
                            OPTION: 'BT',
                            LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                            HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                        }]
                    });
                    me.queryItems = items;
                }

            });
            $(".btn_export").click(function () {
                me.queryCondition = Dolphin.form.getValue('#query_form');
                if(me.queryCondition.stockRoom) {
                    let items = [];
                    $.each(me.queryCondition.stockRoom, function () {
                        items.push({
                            SIGN: 'I',
                            OPTION: 'EQ',
                            LOW: this.substr(4),
                            HIGH: ''
                        });
                    });

                    let dd = {
                        _module: "sap",
                        _menuCode: "stockDifferent",
                        _userId: org.breezee.context.userData.userCode,
                        _callbackName: 'stockDiffExportCallback',
                        _className: 'com.pcp.export.dto.StockDiffExcelDTO',
                        _sheetName: '库存分差报表',
                        _title: '库存分差报表',
                        mo: 'com.pcp.api.pms.service.IStockDifferentService',
                        rule: 'stockDifferent',
                        filter: 'WERKS=' + me.queryCondition.stockRoom[0].substr(0, 4),
                        endpoint: '029',
                        WERKS: '1001',
                        YEARWEEK: '',
                        ITEM: items,
                        ITEM1: [{
                            SIGN: 'I',
                            OPTION: 'BT',
                            LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                            HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                        }]
                    };

                    let url = (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + '/api/e6381042cfb97c0cd0a49b578f4b6adc';
                    let form = $("<form />");
                    form.attr({"style": "display: none", "target": '_blank', "method": "post", "action": url});
                    $('body').append(form);
                    let input = $("<input>");
                    input.attr({"name": "content", "value": Dolphin.json2string(dd), "type": "hidden"});
                    form.append(input);
                    form.submit();
                    form.remove();

                }else{
                    Dolphin.alert("库存地点为空,无法获取数据！")
                }
            });

        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                queryParams: {},
                hover: false,
                tableClass: 'diff-table',
                data: {total: 0, rows: []},
                columns: [{
                    code: 'name',
                    title: '物料名称',
                    formatter: function (val, row) {
                        return row.code + val;
                    }
                }, {
                    code: 'cate',
                    title: '物料分类',
                    width: '110px',
                    formatter: function (val, row) {
                        return val||"-";
                    }
                }, {
                    code: 'stockUnit',
                    title: '库存单位',
                    width: '110px',
                    className: "hide_el",
                }, {
                    code: 'openStock',
                    title: '期初库存',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'purchaseQuantity',
                    title: '订购数量',
                    width: '110px',
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return '<a href="javascript:void(0);" class="pq" data-product="' + row.code + '"><u>' + val + '</u></a>';
                        return '-'
                    }
                }, {
                    code: 'allot',
                    title: '调拨',
                    width: '75px',
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return '<a href="javascript:void(0);" class="transfer" data-product="' + row.code + '"><u>' + val + '</u></a>';
                        return '-'
                    }
                }, {
                    code: 'loss',
                    title: '损耗',
                    width: '75px',
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return '<a href="javascript:void(0);" class="destroy" data-product="' + row.code + '"><u>' + val + '</u></a>';
                        return '-'
                    }
                }, {
                    code: 'use',
                    title: '领用',
                    width: '75px',
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return '<a href="javascript:void(0);" class="fetch" data-product="' + row.code + '"><u>' + val + '</u></a>';
                        return '-'
                    }
                }, {
                    code: 'returnGoods',
                    title: '退货',
                    width: '75px',
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return '<a href="javascript:void(0);" class="retGood" data-product="' + row.code + '"><u>' + val + '</u></a>';
                        return '-'
                    }
                }, {
                    code: 'endStock',
                    title: '期末库存',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'unitCost',
                    title: '单位成本',
                    width: '110px',
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'factUseQuantity',
                    title: '实际使用',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'theoryUseQuantity',
                    title: '理论使用',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return '<a href="javascript:void(0);" class="theory" data-product="' + row.code + '"><u>' + val + '</u></a>';
                        return '-'
                    }
                }, {
                    code: 'quantityDiff',
                    title: '差异',
                    width: '75px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'factUseMoney',
                    title: '实际金额',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'theoryUseMoney',
                    title: '理论金额',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'moneyDiff',
                    title: '差异金额',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (val && Number(val) != 0)
                            return val;
                        return '-'
                    }
                }, {
                    code: 'percent',
                    title: '用量差异',
                    width: '110px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',
                pagination: false,
                onLoadSuccess: function (data) {
                    $(".pq").click(function () {
                        let s = $(this).data('product');
                        $(".purchaseQua").html(s);
                        me._aList.load(null, null, {
                            mo: 'com.pcp.api.pms.service.IStockDifferentService',
                            rule: 'stockDifferent',
                            endpoint: '029',
                            WERKS: '1001',
                            itemNode: 'ITEM1',
                            filter: 'ZZSPU=' + s + ',WERKS=1001',
                            YEARWEEK: me.queryCondition.week,
                            ITEM: me.queryItems,
                            ITEM1: [{
                                SIGN: 'I',
                                OPTION: 'BT',
                                LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                                HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                            }],
                            ITEM2: [{
                                SIGN: 'I',
                                OPTION: 'EQ',
                                LOW: s,
                                HIGH: ''
                            }]
                        });
                        $('#dataModal2').modal('show');
                    });

                    $(".fetch").click(function () {
                        let s = $(this).data('product');
                        $(".purchaseQua").html(s);
                        me._bList.load(null, null, {
                            mo: 'com.pcp.api.pms.service.IStockDifferentService',
                            rule: 'stockDifferent',
                            endpoint: '029',
                            WERKS: '1001',
                            itemNode: 'ITEM5',
                            filter: 'ZZSPU=' + s + ',WERKS=1001',
                            YEARWEEK: me.queryCondition.week,
                            ITEM: me.queryItems,
                            ITEM1: [{
                                SIGN: 'I',
                                OPTION: 'BT',
                                LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                                HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                            }],
                            ITEM2: [{
                                SIGN: 'I',
                                OPTION: 'EQ',
                                LOW: s,
                                HIGH: ''
                            }]
                        });
                        $('#dataModal3').modal('show');
                    });

                    $(".transfer").click(function () {
                        let s = $(this).data('product');
                        $(".purchaseQua").html(s);
                        me._cList.load(null, null, {
                            mo: 'com.pcp.api.pms.service.IStockDifferentService',
                            rule: 'stockDifferent',
                            endpoint: '029',
                            WERKS: '1001',
                            itemNode: 'ITEM6',
                            filter: 'ZZSPU=' + s + ',WERKS=1001',
                            YEARWEEK: me.queryCondition.week,
                            ITEM: me.queryItems,
                            ITEM1: [{
                                SIGN: 'I',
                                OPTION: 'BT',
                                LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                                HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                            }],
                            ITEM2: [{
                                SIGN: 'I',
                                OPTION: 'EQ',
                                LOW: s,
                                HIGH: ''
                            }]
                        });
                        $('#dataModal4').modal('show');
                    });

                    $(".retGood").click(function () {
                        let s = $(this).data('product');
                        $(".purchaseQua").html(s);
                        me._dList.load(null, null, {
                            mo: 'com.pcp.api.pms.service.IStockDifferentService',
                            rule: 'stockDifferent',
                            endpoint: '029',
                            WERKS: '1001',
                            itemNode: 'ITEM4',
                            filter: 'ZZSPU=' + s + ',WERKS=1001',
                            YEARWEEK: me.queryCondition.week,
                            ITEM: me.queryItems,
                            ITEM1: [{
                                SIGN: 'I',
                                OPTION: 'BT',
                                LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                                HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                            }],
                            ITEM2: [{
                                SIGN: 'I',
                                OPTION: 'EQ',
                                LOW: s,
                                HIGH: ''
                            }]
                        });
                        $('#dataModal5').modal('show');
                    });

                    $(".destroy").click(function () {
                        let s = $(this).data('product');
                        $(".purchaseQua").html(s);
                        me._eList.load(null, null, {
                            mo: 'com.pcp.api.pms.service.IStockDifferentService',
                            rule: 'stockDifferent',
                            endpoint: '029',
                            WERKS: '1001',
                            itemNode: 'ITEM2',
                            filter: 'ZZSPU=' + s + ',WERKS=1001,LGORT=1001',
                            YEARWEEK: me.queryCondition.week,
                            ITEM: me.queryItems,
                            ITEM1: [{
                                SIGN: 'I',
                                OPTION: 'BT',
                                LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                                HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                            }],
                            ITEM2: [{
                                SIGN: 'I',
                                OPTION: 'EQ',
                                LOW: s,
                                HIGH: ''
                            }]
                        });
                        $('#dataModal6').modal('show');
                    });

                    $(".theory").click(function () {
                        let s = $(this).data('product');
                        $(".purchaseQua").html(s);
                        me._fList.load(null, null, {
                            mo: 'com.pcp.api.pms.service.IStockDifferentService',
                            rule: 'stockDifferent',
                            endpoint: '029',
                            WERKS: '1001',
                            itemNode: 'ITEM3',
                            filter: 'ZZSPU=' + s + ',WERKS=1001',
                            YEARWEEK: me.queryCondition.week,
                            ITEM: me.queryItems,
                            ITEM1: [{
                                SIGN: 'I',
                                OPTION: 'BT',
                                LOW: me.queryCondition.startDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd'),
                                HIGH: me.queryCondition.endDate || Dolphin.date2string(new Date(), 'yyyy-MM-dd')
                            }],
                            ITEM2: [{
                                SIGN: 'I',
                                OPTION: 'EQ',
                                LOW: s,
                                HIGH: ''
                            }]
                        });
                        $('#dataModal7').modal('show');
                    });
                    for (let k in data.value) {
                        $("#" + k).html(Number(data.value[k]).toFixed(2));
                    }
                }
            });

            me._bList = new Dolphin.LIST({
                panel: "#bList",
                idField: 'id',
                hover: false,
                queryParams: {},
                data: {total: 0, rows: []},
                columns: [{
                    code: 'name',
                    title: '原料',
                    formatter: function (val, row) {
                        return row.code + (val || '');
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '75px',
                    className: "hide_el",
                }, {
                    code: 'price',
                    title: '价格',
                    width: '75px',
                    className: "hide_el"
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '75px',
                    className: "hide_el"
                }, {
                    code: 'amount',
                    title: '总金额',
                    width: '90px'
                }, {
                    code: 'dn',
                    title: '单号',
                    width: '130px'
                }, {
                    code: 'diffType',
                    title: '类型',
                    width: '150px'
                }, {
                    code: 'remark',
                    title: '领用门店',
                    width: '180px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',
                pagination: false
            });
        },

        aList: function (panel) {
            return new Dolphin.LIST({
                panel: panel,
                idField: 'id',
                hover: false,
                queryParams: {},
                data: {total: 0, rows: []},
                columns: [{
                    code: 'name',
                    title: '原料',
                    formatter: function (val, row) {
                        return row.code + (val || '');
                    }
                }, {
                    code: 'happenDate',
                    title: '过账日期',
                    width: '130px',
                    className: "hide_el",
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '75px',
                    className: "hide_el",
                }, {
                    code: 'price',
                    title: '价格',
                    width: '75px',
                    className: "hide_el"
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '75px',
                    className: "hide_el"
                }, {
                    code: 'amount',
                    title: '总金额',
                    width: '90px'
                }, {
                    code: 'dn',
                    title: '单号',
                    width: '130px'
                }, {
                    code: 'diffType',
                    title: '类型',
                    width: '150px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',
                pagination: false
            });
        },
        tList: function (panel) {
            return new Dolphin.LIST({
                panel: panel,
                idField: 'id',
                hover: false,
                queryParams: {},
                data: {total: 0, rows: []},
                columns: [{
                    code: 'name',
                    title: '原料',
                    width: '200px',
                    formatter: function (val, row) {
                        return row.code + (val || '');
                    }
                }, {
                    code: 'product',
                    title: '菜品描述'
                }, {
                    code: 'productQuantity',
                    width: '90px',
                    title: '菜品数量',
                    textAlign:'right',
                    formatter: function (val, row) {
                        return val + (row.productUnit || '');
                    }
                }, {
                    code: 'happenDate',
                    title: '过账日期',
                    width: '130px',
                    className: "hide_el",
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '90px',
                    className: "hide_el",
                    formatter:function (val,row) {
                        return val + (row.unit || '');
                    }
                }, {
                    code: 'price',
                    title: '价格',
                    width: '75px',
                    className: "hide_el"
                }, {
                    code: 'amount',
                    title: '总金额',
                    width: '80px'
                }, {
                    code: 'dn',
                    title: '单号',
                    width: '120px'
                }, {
                    code: 'diffType',
                    title: '类型',
                    width: '200px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',
                pagination: false
            });
        }
    };
});

