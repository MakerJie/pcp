'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            this.lineData();
            this.paymentData();
            console.log('load the materielList.js....');

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
                me._dataList.load(null, d);
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                console.log("materiel", data);
                data.dayCheck = !!data.dayCheck;
                data.weekCheck = !!data.weekCheck;
                data.monthCheck = !!data.monthCheck;
                Dolphin.ajax({
                    url: '/api/f4cd29f771044f2d8d90d33b238fd371',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('.btn_query').click();
                            $('#dataModal').modal('hide');
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            //4be6d131db0448a18fe0fe9e99771b4b
            $(".btn_sync").click(function () {
                $("#dataModal5").modal('show');
            });

            $(".btn_upload").click(function () {
                let data = Dolphin.form.getValue('#data_form');
                Dolphin.ajax({
                    url: '/api/4be6d131db0448a18fe0fe9e99771b4b',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            Dolphin.alert('操作成功', {
                                callback: function () {
                                    $('.btn_query').click();
                                    $("#dataModal5").modal('hide');
                                }
                            });
                        }
                    },
                    onError: function () {
                    }
                });
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                queryParams: {},
                hover: false,
                columns: [{
                    code: 'happenTime',
                    title: '交易时间',
                    width: '150px',
                    formatter: function (val, row) {
                        return val + ' - <span style="font-size: 85%;">' + row.openDay + '</span>';
                    }
                }, {
                    code: 'name',
                    title: '门店信息',
                    width: '100px',
                    className: "hide_el"
                }, {
                    code: 'code',
                    title: '订单号',
                    className: "hide_el",
                    width: '130px',
                    formatter: function (val, row) {
                        let color = "#000";
                        if(row.statistics){
                            color = "#00AEEF";
                        }
                        return val + ' - <span style="font-size: 85%;color: '+color+'">' + row.billNo + '</span>';
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
                }, {
                    code: 'id',
                    title: '操作',
                    className: "hide_el",
                    textAlign: 'center',
                    width: '75px',
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
                    if (data.value) {
                        $('#totalSum').html(data.value.total);
                        $('#feeSum').html(data.value.charge);
                    }
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
                                if (reData.value.divAmount) {
                                    $("#dividDisAmountTr").show();
                                } else {
                                    $("#dividDisAmountTr").hide();
                                }
                                me._dataLineList.loadData({rows: reData.value.orderLines});
                                me._payementList.loadData({rows: reData.value.payments});
                                $('#dataModal').modal('show');
                            }
                        });
                    });
                }
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
                        return row.hasTipFee ? val : '-';
                    }
                }, {
                    code: 'couponId',
                    title: '券编码',
                    className: "hide_el",
                    width: '130px',
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'corpCode',
                    title: '承担客户',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'isPoint',
                    title: '参与积分',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val?'Y':'N';
                    }
                },{
                    code: 'dividAmount',
                    title: '补贴金额',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val;
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false,

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
                        return row.productCode + '-' + val + '&nbsp;&nbsp;<span style="color: orangered;">' + (row.tempLine && row.tempLine === '1' ? '临时菜' : '') + '</span><span style="color: darkred;">' + (row.returnLineId != 0 ? row.returnLineId : '') + '</span><span style="color: red;">' + (row.category == 99 ? '【余】' : '') + '</span>';
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
                            ht.push(this.typeCode + this.name + ": " + this.disAmount);
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
        }
    };
});
