'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.orderData = {
                shopCode: org.breezee.context.userData.shopCode,
                name: org.breezee.context.userData.userName,
                type: 90
            };
            this.initEvent();
            this.initDataList();
            this.editList();
            this.orderList("#orderList");
            Dolphin.form.parseSelect($("#supplyer"));
            Dolphin.form.parseSelect($("#purchaseShop"));
            let now = new Date();
            now.setDate(now.getDate() + 1);
            Dolphin.form.setValue({
                deliveryDate: Dolphin.longDate2string(now, 'yyyy-MM-dd')
            }, "#order-form");
            this.cartPrd = {};
            this.lastSupplier = null;
            this.clearData();
        },

        initEvent: function () {
            let me = this;

            $(".btn_upload").click(function () {
                let sd = me._orderList.getChecked();
                if (sd.length === 0) {
                    Dolphin.alert("请至少选择一条记录");
                    return;
                }
                Dolphin.confirm('确认提交至SAP，提交后不可更改?', {
                    callback: function (flag) {
                        if (flag) {
                            let rd = [];
                            $.each(sd, function () {
                                rd.push(this.id);
                            });
                            Dolphin.ajax({
                                url: '/api/4256e1100ca14383b3e78d2ad2db8716',
                                type: Dolphin.requestMethod.POST,
                                loading: true,
                                data: Dolphin.json2string({
                                    id: rd.join(','),
                                    menuCode: 'purchaseNew9'
                                }),
                                success: function (reData, textStatus) {
                                    if (reData.success) {
                                        me._orderList.reload();
                                        $('#tab_user2').tab('show');
                                    } else {
                                        Dolphin.alert(reData.msg);
                                    }
                                },
                                onError: function () {
                                    Dolphin.alert('系统出错，请联系管理员');
                                }
                            });
                        }
                    }
                });
            });

            $("#supplyer").change(function () {
                if (me.lastSupplier && me._editList.data.rows.length > 0) {
                    Dolphin.confirm("更换供应商，将清除已选择的物料列表", {
                        callback: function (flag) {
                            if (flag) {
                                me._editList.loadData({rows: []});
                            } else {
                                $("#supplyer").val(me.lastSupplier);
                                return false;
                            }
                        }
                    });
                }
                me.lastSupplier = $(this).val();
            });

            $(".confirmEmail").click(function () {
                let checkedData = me._emailList.getChecked();
                $("#cosEmail").val(checkedData[0].email);
                $("#emailModel").modal("hide");
            });

            $("#matSelectBtn").click(function () {
                $("#codeInput").val("");
                let supplyerVal = $("#supplyer").val();
                if (supplyerVal == null || supplyerVal == "") {
                    Dolphin.alert("请先选择供应商");
                } else {
                    Dolphin.ajax({
                        url: '/api/e69293fefcd54ca3b8bef8f0a7a73688',
                        type: Dolphin.requestMethod.POST,
                        data: Dolphin.json2string({
                            properties: {
                                code: supplyerVal
                            }
                        }),
                        loading: true,
                        success: function (reData, textStatus) {
                            if (reData.success && reData.rows.length > 0) {
                                if (reData.rows[0].email) {
                                    let email = reData.rows[0].email;
                                    let arr = email.split(",");
                                    if (arr.length > 1) {
                                        let emailData = [];
                                        for (let i = 0; i < arr.length; i++) {
                                            emailData.push({email: arr[i]});
                                        }
                                        $("#emailModel").modal({
                                            show: true,
                                            backdrop: 'static'
                                        });
                                        me._emailList.loadData({rows: emailData});
                                    } else {
                                        $("#cosEmail").val(arr[0]);
                                    }
                                    me.loadPrd();
                                } else {
                                    me.loadPrd();
                                }
                            } else {
                                me.loadPrd();
                            }
                        },
                        onError: function () {
                            Dolphin.alert("系统出错了，请联系管理员");
                        }
                    });
                }
            });

            $("input[id='codeInput']").keydown(function (e) {
                if (e.keyCode === 13) {
                    $('#matSelectSearch').click();
                }
            });

            $("#matSelectSearch").click(function () {
                let supplyerVal = $("#supplyer").val();
                let searchName = $("#codeInput").val();
                if (supplyerVal == null || supplyerVal == "") {
                    Dolphin.alert("请先选择供应商");
                } else {
                    let d = me.lastSupplier;
                    let sp = org.breezee.context.userData.shopCode;
                    me._dataList.load(null, {}, {
                        rule: "materiel",
                        mo: 'com.pcp.api.pms.service.IMaterielService',
                        endpoint: '035',
                        WERKS: sp.substr(0, 4),
                        LGORT: sp.substr(4),
                        LIFNR: d,
                        MAKTX: searchName,
                        beanName: "com.pcp.api.pms.service.IMaterielService"
                    });
                    $("#matModal").modal({
                        show: true,
                        backdrop: 'static'
                    });
                    $("#selectedCount").html(me.selectedCount);
                }
            });

            $('.btn-save').click(function () {
                let ef = $("#order-form");
                if (!Dolphin.form.validate(ef)) {
                    return;
                }
                let fd = Dolphin.form.getValue("#order-form");
                if (fd['deliveryDate']) {
                    fd.deliveryDate = fd['deliveryDate'] + ' 00:00:00';
                }
                fd.status = $(this).data('status');
                $.extend(me.orderData, fd);
                me.orderData.procureCode = $("#supplyer").val();
                me.orderData.purchaseLines = [];
                for (let k in me.cartPrd) {
                    if (me.cartPrd[k].quantity > 0)
                        me.orderData.purchaseLines.push(me.cartPrd[k]);
                }
                me.orderData.menuCode = 'purchaseNew9';
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(me.orderData),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderList.reload();
                            $('#tab_user2').tab('show');
                            me.clearData();
                        } else {
                            Dolphin.alert(reData.msg, {
                                countDownTime: 10000,
                                width: '480px',
                                countDownFlag: false
                            });
                        }
                    },
                    onError: function () {
                        Dolphin.alert("系统出错了，请联系管理员");
                    }
                })
            });

            $(".btn_confirm").click(function () {
                me.cartChange();
                let dd = [];
                for (let k in me.cartPrd) {
                    dd.push(me.cartPrd[k]);
                }
                me._editList.loadData({rows: dd});
                $("#matModal").modal('hide');
            });

            $('.btn_delete').click(function () {
                let fd = Dolphin.form.getValue("#data_form4");
                let id = fd['id'];
                Dolphin.ajax({
                    url: '/api/b2a49c35599241aab113d4b53073ebd7',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        id: id
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderGrid.reload();
                            $("#dataModal4").modal('hide');
                        } else {
                            Dolphin.alert(reData.msg, {
                                countDownTime: 10000,
                                width: '480px',
                                countDownFlag: false
                            });
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                })
            });

            $('#tab_user2').on('shown.bs.tab', function (e) {
                me._orderList.reload();
            });

            let $disabledResults = $(".js-example-disabled-results");
            $disabledResults.select2();
        },

        loadPrd: function () {
            let me = this;
            let d = me.lastSupplier;
            let sp = org.breezee.context.userData.shopCode;
            me._dataList.load(null, {}, {
                rule: "materiel",
                mo: 'com.pcp.api.pms.service.IMaterielService',
                endpoint: '035',
                WERKS: sp.substr(0, 4),
                LGORT: sp.substr(4),
                LIFNR: d,
                beanName: "com.pcp.api.pms.service.IMaterielService"
            });
            $("#matModal").modal({
                show: true,
                backdrop: 'static'
            });
            $("#selectedCount").html(me.selectedCount);
        },

        clearData: function () {
            let me = this;
            me.selectedCount = 0;
            me._editList.loadData({rows: []});
            me.cartPrd = {};
            $("#supplyer").val('');
            $("#totalAmount").val(0.00);
            $("#newSupplierDiv").show();
            $("#editSupplierDiv").hide();
            $("#pId").val('');
            $("#selectedCount").html(me.selectedCount);
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#materielSelectDiv",
                idField: 'id',
                hover: false,
                editFlag: true,
                editBtn: false,
                panelType: 'panel-warning',
                columns: [{
                    code: 'code',
                    title: '物料编号',
                    width: '140px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'name',
                    title: '物料名称',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'unit',
                    title: '订单单位',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '120px',
                    formatter: function (val, row) {
                        let input = $('<input class="form-control" placeholder="数量" id="quantity" listname="quantity" >');
                        if (me.cartPrd[row.code]) {
                            input.val(me.cartPrd[row.code].quantity);
                        }
                        input.change(function () {
                            row.quantity = $(this).val();
                            if (row.quantity > 0) {
                                if (!me.cartPrd[row.code]) {
                                    me.selectedCount++;
                                } else {
                                    me.cartPrd[row.code].quantity += row.quantity;
                                }
                                me.cartPrd[row.code] = {
                                    name: row.name,
                                    code: row.code,
                                    material: row.material || row.code,
                                    price: row.price,
                                    unitPrice: row.unitPrice,
                                    unit: row.unit,
                                    currency: row.currency,
                                    unitRate: row.unitRate,
                                    measureUnit: row.measureUnit,
                                    tax: row.tax,
                                    quantity: row.quantity,
                                    orUnit: row.orUnit,
                                    subTotal: row.quantity * row.price
                                };
                            } else {
                                if (me.cartPrd[row.code]) {
                                    delete me.cartPrd[row.code];
                                    me.selectedCount--;
                                }
                            }
                            $(this).closest('tr').find('[columncode="subTotal"]').html(row.quantity * row.price);
                            $("#selectedCount").html(me.selectedCount);
                        });
                        return input
                    }
                }, {
                    code: 'price',
                    title: '参考价',
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'subTotal',
                    title: '小计',
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',//2745ea263c994e688eac8ba1af6ae84a
                data: {rows: []},
                pagination: false,
                onLoadSuccess: function () {
                },
                onChecked: function (val) {
                },
                onUnchecked: function () {
                }
            });
        },

        cartChange: function () {
            let me = this, total = 0;
            for (let k in me.cartPrd) {
                total += (Number(me.cartPrd[k].price) * Number(me.cartPrd[k].quantity));
            }
            $("#totalAmount").val(total.toFixed(2));
        },

        orderList: function () {
            let me = this;
            me._orderList = new Dolphin.LIST({
                panel: "#orderList",
                idField: 'id',
                hover: false,
                queryParams: {
                    type: me.orderData.type,
                    shopCode_in: org.breezee.context.userData.shops.join(','),
                    status: 1,
                    pageSize: 1000
                },
                columns: [{
                    code: 'submitor',
                    title: '提交时间',
                    width: '130px',
                    formatter: function (val, row) {
                        return row.syncDate ? row.syncDate : row.createTime;
                    }
                }, {
                    code: 'type',
                    title: '订单类型',
                    width: '100px',
                    formatter: function (val) {
                        let t = Dolphin.enum.getEnumText('purchaseType', val);
                        return '<span class="label label-danger">' + t + '</span>';
                    }
                }, {
                    code: 'code',
                    title: '订单号',
                    width: '100px',
                }, {
                    code: 'totalAmount',
                    title: '参考金额',
                    width: '100px',
                    formatter: function (val) {
                        return val ? val.toFixed(2) : '-';
                    }
                }, {
                    code: 'name',
                    title: '供应商',
                    formatter: function (val, row) {
                        return val ? val : row.procureCode;
                    }
                }, {
                    code: 'deliveryDate',
                    title: '退货日期',
                    width: '100px',
                    formatter: function (val) {
                        return val && val.substr(0, 10);
                    }
                }, {
                    code: 'submitor',
                    title: '提交人',
                    width: '100px',
                    formatter: function (val, row) {
                        return val ? val : row.creator
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '90px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({id: val}) + " " + org.breezee.buttons.del({id: val});
                    }

                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/fbbc247ea033447b9db0883366fc7c05',
                pagination: false,
                onLoadSuccess: function (data) {
                    org.breezee.buttons.editCallback('80da5b20221f43308ae2a1b389b409e5', 'id', function (data) {
                        me.clearData();
                        let retData = data.value;
                        retData.deliveryDate = (retData.deliveryDate && retData.deliveryDate.substr(0, 10)) || '';
                        retData.totalAmount = retData.totalAmount && retData.totalAmount.toFixed(2);
                        Dolphin.form.setValue(retData, '#order-form');
                        $("#supplyer").val(retData.procureCode);
                        me.lastSupplier = retData.procureCode;
                        $("#newSupplierDiv").hide();
                        $("#editSupplierDiv").show();
                        $("#selectedSupplier").val(retData.name);
                        let dd = [];
                        $.each(retData.purchaseLines, function () {
                            let row = this;
                            me.cartPrd[row.code] = {
                                name: row.name,
                                code: row.code,
                                material: row.material || row.code,
                                price: row.price,
                                unitPrice: row.unitPrice,
                                unit: row.unit,
                                currency: row.currency,
                                unitRate: row.unitRate,
                                measureUnit: row.measureUnit,
                                tax: row.tax,
                                quantity: row.quantity,
                                orUnit: row.orUnit || row.measureUnit,
                                subTotal: row.quantity * row.price
                            };
                            dd.push(me.cartPrd[row.code]);
                        });
                        me._editList.loadData({rows: dd});
                        $("#tab_user1").tab('show');
                    });
                    $('.delBtn').click(function () {
                        let _this = $(this);
                        Dolphin.confirm('确认删除？', {
                            callback: function (flag) {
                                if (flag) {
                                    Dolphin.ajax({
                                        url: '/api/ab113d4b5305973ebd7b2a49c359241a',
                                        type: Dolphin.requestMethod.POST,
                                        loading: true,
                                        data: Dolphin.json2string({
                                            id: _this.data('id'),
                                            menuCode: 'purchaseNew9'
                                        }),
                                        onSuccess: function (reData) {
                                            me._orderList.reload();
                                        }
                                    });
                                }
                            }
                        })
                    });
                    $("#unSubmitNum").html(data.total);
                },
                onLoad: function () {

                }
            });
        },

        editList: function () {
            const me = this;
            this._editList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {
                    type: "10",
                    pageSize: 1000
                },
                panelType: 'panel-warning',
                editFlag: true,
                columns: [{
                    code: 'code',
                    title: '物料编码',
                    width: '130px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'name',
                    title: '物料名称',
                    width: '170px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '75px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '130px',
                    formatter: function (val, row) {
                        let input = $('<input class="form-control" placeholder="数量" id="quantity" listname="quantity">');
                        input.val(row.quantity);
                        input.change(function () {
                            row.quantity = $(this).val();
                            if (row.quantity > 0) {
                                me.cartPrd[row.code].quantity = row.quantity;
                            } else {
                                delete me.cartPrd[row.code];
                                me.selectedCount--;
                            }
                            me.cartChange();
                            $(this).closest('tr').find('[columncode="subTotal"]').html(row.quantity * row.price);
                        });
                        return input
                    }
                }, {
                    code: 'price',
                    title: '价格',
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'subTotal',
                    title: '小计',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return (val && val.toFixed(2)) || '-';
                    }
                }],
                multiple: true,
                addBtn: false,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false,
                onRemoveRow: function (data) {
                    me.selectedCount--;
                    delete me.cartPrd[data.code];
                    me.cartChange();
                }
            })
        },

        emailList: function () {
            const me = this;
            this._emailList = new Dolphin.LIST({
                panel: "#emailList",
                idField: 'id',
                hover: false,
                panelType: 'panel-warning',
                editFlag: false,
                addBtn: false,
                columns: [{
                    code: 'email',
                    title: '邮件',
                    width: '130px',
                    formatter: function (val) {
                        return val;
                    }
                },],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                data: {rows: []},
                pagination: false,
            })
        },

    };
});
