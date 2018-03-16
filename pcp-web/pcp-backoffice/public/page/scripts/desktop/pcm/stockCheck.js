'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            this.initEvent();
            this.initDataList();
            this.initDetailsList();

            Dolphin.form.parse("#data_form");
            Dolphin.form.parse("#query_form");
            Dolphin.form.parseSelect($("#purchaseShop"));
            $('.btn_query').click();
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                $("#hiddenBtn").show();
                $("#purchaseShop").attr("disabled", false);
                $("#stockCheck").attr("disabled", false);
                $("#type").removeAttr("disabled");
                Dolphin.form.empty("#data_form", {
                    ignore: ['uid']
                });
                me._dataLineList.loadData({rows: []});
                Dolphin.form.setValue({
                    storeCode: org.breezee.context.userData.shopCode,
                    stockCheckDate: $("#stockcheckdateInput").data('date')
                }, $("#data_form"));
                $('#dataModal').modal({
                    show: true,
                    backdrop: 'static'
                });
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let ef = $("#data_form");
                if (!Dolphin.form.validate(ef)) {
                    return;
                }
                let data = Dolphin.form.getValue('#data_form');
                data.uid = $("#hiddenUid").data('value');
                data.stockCheckDate = data.stockCheckDate + " 00:00:00";
                let ss = [], i;
                $.each(data.stockCheckLines, function () {
                    ss.push({
                        code: this.code,
                        name: this.name,
                        checkArea: this.checkArea,
                        category1: this.category1,
                        category2: this.category2,
                        quantity1: this.quantity1,
                        quantity2: this.quantity2,
                        quantity3: this.quantity3,
                        quantity4: this.quantity4,
                        quantity5: this.quantity5,
                        unit: this.unit,
                        price: this.price
                    });
                    i++;
                });
                data.stockCheckLines = ss;
                data.menuCode = 'stockCheck';
                Dolphin.ajax({
                    url: '/api/fdcf8a22a786e14dac060475f91e9404',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(data),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $("#error_message_save").html("保存成功");
                            $('.btn_query').click();
                            // $('#dataModal').modal('hide');
                            if (reData.value.id) {
                                $("#hiddenId").val(reData.value.id);
                            }
                            setTimeout(function () {
                                $("#error_message_save").html("");
                            }, 3000);
                        } else {
                            $("#error_message_save").html('系统出错，请联系管理员');
                        }
                    },
                    onError: function () {
                        $("#error_message_save").html('系统出错，请联系管理员');
                    }
                });
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                $("#error_message_save").empty();
            });

            $("#stockCheck").change(function () {
                let d = $(this).val(), shop = $("#purchaseShop").val();

                if (d === '3') {
                    me._dataLineList.load(null, {
                        dayCheck: '',
                        monthCheck: '',
                        weekCheck: true,
                        yearCheck:'',
                        _shop: shop
                    })
                } else if (d === '2') {
                    me._dataLineList.load(null, {
                        dayCheck: '',
                        weekCheck: '',
                        monthCheck: true,
                        yearCheck:'',
                        _shop: shop
                    })
                } else if (d === '1') {
                    me._dataLineList.load(null, {
                        dayCheck: true,
                        weekCheck: '',
                        monthCheck: '',
                        yearCheck:'',
                        _shop: shop
                    });
                }else if (d === '4') {
                    me._dataLineList.load(null, {
                        dayCheck: '',
                        weekCheck: '',
                        monthCheck: '',
                        yearCheck:true,
                        _shop: shop
                    });
                }
            });
            $('#print').click(function () {
                let stockCheck = $("#stockCheck").val();
                let purchaseShop = $("#purchaseShop").val();
                let hiddenId = $("#hiddenId").val();
                if (!stockCheck) {
                    Dolphin.alert("请选择盘点类型");
                    return;
                }
                if (!purchaseShop) {
                    Dolphin.alert("请选择门店");
                    return;
                }
                window.open("http://" + window.location.host + org.breezee.context.contextPath + org.breezee.context.viewPrefix + "/pcm/details?stockCheck=" + stockCheck + "&purchaseShop=" + purchaseShop + "&hiddenId=" + hiddenId);
            });
            $(".btn_upload").click(function () {
                let sd = me._dataList.getChecked();
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
                                url: '/api/00b5f7f9915f456f935de39f419ec641',
                                type: Dolphin.requestMethod.POST,
                                loading: true,
                                data: Dolphin.json2string({
                                    id: rd.join(','),
                                    menuCode: 'stockCheck'
                                }),
                                success: function (reData, textStatus) {
                                    if (reData.success) {
                                        $('.btn_query').click();
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
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'code',
                    title: '盘点单号',
                    width: '130px'
                }, {
                    code: 'name',
                    title: '门店名称',
                }, {
                    code: 'type',
                    title: '盘点类型',
                    width: '90px',
                    formatter: function (val, row, index) {
                        return Dolphin.enum.getEnumText("stockCheckType", val);
                    }
                }, {
                    code: 'stockCheckDate',
                    title: '盘点日期',
                    width: '150px',
                    formatter: function (val) {
                        return val.substr(0, 10);
                    }
                }, {
                    code: 'subTotal',
                    title: '小计',
                    width: '90px',
                    textAlign: 'right',
                    formatter: function (val, row) {
                        if (val && Number(val))
                            return Number(val).toFixed(2);
                        return '-';
                    }
                }, {
                    code: 'creator',
                    title: '创建人',
                    width: '90px'
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '110px'
                }, {
                    code: 'id',
                    title: '操作',
                    width: '100px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        if (row.status == 1) {
                            return org.breezee.buttons.edit({
                                    id: row.id
                                }) + '&nbsp;&nbsp;' + org.breezee.buttons.del({
                                    id: row.id
                                });
                        } else if (row.status == 100) {
                            return org.breezee.buttons.view({
                                id: row.id
                            });
                        }
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/9e6d18d69d748cab68aa3313df2c8ec8',
                data: {rows: []},
                pagination: true,
                onChecked: function (data) {
                    if (data.status == 100) {
                        $(".btn_upload").attr('disabled', true);
                    } else if (data.status == 1) {
                        $(".btn_upload").removeAttr('disabled');
                    }
                },
                onLoadSuccess: function (data) {
                    org.breezee.buttons.editCallback('0fe00de41519b82e98c505e53bfc441b', "id", function (data) {
                        if (data.value.stockCheckDate) {
                            $("#stockcheckdateInput").val(data.value.stockCheckDate.substr(0, 10));
                        }
                        me._dataLineList.loadData({rows: data.value.stockCheckLines});
                        $("#hiddenBtn").show();
                        $("#purchaseShop").attr("disabled", false);
                        $("#stockCheck").attr("disabled", false);
                        if (data.value.subTotal && Number(data.value.subTotal))
                            $("#totalAmount").html(data.value.subTotal.toFixed(2));
                        $('#dataModal').modal({
                            show: true,
                            backdrop: 'static'
                        });
                    });
                    $('.delBtn').click(function () {
                        let _this = $(this);
                        Dolphin.confirm('确认删除？', {
                            callback: function (flag) {
                                if (flag) {
                                    Dolphin.ajax({
                                        url: '/api/a95f7a0ee3944c09bec8099c7b4c85bc',
                                        type: Dolphin.requestMethod.POST,
                                        loading: true,
                                        data: Dolphin.json2string({
                                            id: _this.data('id'),
                                            menuCode: 'stockCheck'
                                        }),
                                        onSuccess: function (reData) {
                                            $('.btn_query').click();
                                        }
                                    });
                                }
                            }
                        })
                    });
                    org.breezee.buttons.viewCallback('0fe00de41519b82e98c505e53bfc441b', "id", function (data) {
                        $("#hiddenBtn").hide();
                        $("#purchaseShop").attr("disabled", true);
                        $("#stockCheck").attr("disabled", true);
                        me._dataLineList.loadData({rows: data.value.stockCheckLines});
                        data.value.stockCheckDate = data.value.stockCheckDate.substr(0, 10);
                        Dolphin.form.setValue(data.value, '.edit-form');
                        $('#dataModal').modal({
                            show: true,
                            backdrop: 'static'
                        });
                    });
                }
            });
        },

        checkHiddenUnit: function (unit) {
            let flag = false;
            switch (unit) {
                case 'ML':
                    flag = true;
                    break;
                case 'L':
                    flag = true;
                    break;
                case 'KG':
                    flag = true;
                    break;
                case 'G':
                    flag = true;
                    break;
                default:
                    flag = false;
                    break;
            }
            return flag;
        },

        initDetailsList: function () {
            let me = this;
            $("#detailsList").empty();
            me._dataLineList = new Dolphin.LIST({
                panel: "#detailsList",
                editListName: 'stockCheckLines',
                idField: 'id',
                editBtn: false,
                hover: false,
                editFlag: true,
                columns: [{
                    code: 'code',
                    title: '物料编码',
                    width: '120px',
                    formatter: function (val, row) {
                        let s = '<div>' + val + '</div>';
                        if (row.diffVal) {
                            s = '<div style="color: red;" data-stock="' + row.stockNum + '">' + val + '</div>';
                        }
                        return s;
                    }
                }, {
                    code: 'name',
                    title: '物料名称',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity1',
                    title: '数量（单位1）',
                    className: 'quantity',
                    editType: 'number',
                    width: '140px',
                    formatter: function (val, row) {
                        if (row.unitInfos && row.unitInfos.length > 0) {
                            let span = $('<div class="input-prepend input-group">' +
                                '<span class="input-group-addon">' + row.unitInfos[0].addUnit + '</span>' +
                                '<input listname="quantity1" data-multi="' + row.unitInfos[0].multiValue + '" data-unit="' + row.unitInfos[0].addUnit + '"  class="form-control" type="text">' +
                                '</div>');
                            span.find('input').change(function () {
                                if (Number($(this).val())) {
                                    row.quantity1 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    row.quantity1 = "0_" + $(this).data('multi') + "_" + $(this).data('unit');
                                    $(this).val('');
                                }
                            }).val(row.v1);

                            let visible = (row.unitInfos[0].addUnit != row.unit ? "visible" : "hidden");
                            if (visible == 'visible')
                                visible = me.checkHiddenUnit(row.unitInfos[0].addUnit) ? 'hidden' : 'visible';
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[0].multiValue < 1 && row.unitInfos[0].addUnit == 'BTL') {
                                compu += '<span> 1' + row.unitInfos[0].addUnit + '</span>=<span>' + (row.unitInfos[0].multiValue * 1000) + 'ML' + '</span>';
                                // compu += '<span> ' + row.unitInfos[0].addVal + row.unit + '</span>=<span>' + row.unitInfos[0].val + row.unitInfos[0].addUnit + '</span>';
                            } else {
                                compu += '<span> 1' + row.unitInfos[0].addUnit + '</span>=<span>' + row.unitInfos[0].multiValue + row.unit + '</span>';
                            }
                            compu += '</div>';
                            return $('<div>').append(span).append($(compu));
                        }
                        return '-';
                    }
                }, {
                    code: 'quantit2',
                    title: '数量（单位2）',
                    className: 'quantity',
                    editType: 'number',
                    width: '140px',
                    formatter: function (val, row) {
                        if (row.unitInfos && row.unitInfos.length > 1) {
                            let span = $('<div class="input-prepend input-group">' +
                                '<span class="input-group-addon">' + row.unitInfos[1].addUnit + '</span>' +
                                '<input listname="quantity2" data-multi="' + row.unitInfos[1].multiValue + '" data-unit="' + row.unitInfos[1].addUnit + '"  class="form-control" type="text">' +
                                '</div>');
                            span.find('input').change(function () {
                                if (Number($(this).val())) {
                                    row.quantity2 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    row.quantity2 = "0_" + $(this).data('multi') + "_" + $(this).data('unit');
                                    $(this).val('');
                                }
                            }).val(row.v2);

                            let visible = (row.unitInfos[1].addUnit != row.unit ? "visible" : "hidden");
                            if (visible == 'visible')
                                visible = me.checkHiddenUnit(row.unitInfos[1].addUnit) ? 'hidden' : 'visible';
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[1].multiValue < 1 && row.unitInfos[1].addUnit == 'BTL') {
                                compu += '<span> 1' + row.unitInfos[1].addUnit + '</span>=<span>' + (row.unitInfos[1].multiValue * 1000) + 'ML' + '</span>';
                                // compu += '<span> ' + row.unitInfos[1].addVal + row.unit + '</span>=<span>' + row.unitInfos[1].val + row.unitInfos[1].addUnit + '</span>';
                            } else {
                                compu += '<span> 1' + row.unitInfos[1].addUnit + '</span>=<span>' + row.unitInfos[1].multiValue + row.unit + '</span>';
                            }
                            compu += '</div>';
                            return $('<div>').append(span).append($(compu));
                        }
                        return '-';
                    }
                }, {
                    code: 'quantity3',
                    title: '数量（单位3）',
                    className: 'quantity',
                    editType: 'number',
                    width: '140px',
                    formatter: function (val, row) {
                        if (row.unitInfos && row.unitInfos.length > 2) {
                            let span = $('<div class="input-prepend input-group">' +
                                '<span class="input-group-addon">' + row.unitInfos[2].addUnit + '</span>' +
                                '<input listname="quantity3" data-multi="' + row.unitInfos[2].multiValue + '" data-unit="' + row.unitInfos[2].addUnit + '"  class="form-control" type="text">' +
                                '</div>');
                            span.find('input').change(function () {
                                if (Number($(this).val())) {
                                    row.quantity3 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    row.quantity3 = "0_" + $(this).data('multi') + "_" + $(this).data('unit');
                                    $(this).val('');
                                }
                            }).val(row.v3);

                            let visible = (row.unitInfos[2].addUnit != row.unit ? "visible" : "hidden");
                            if (visible == 'visible')
                                visible = me.checkHiddenUnit(row.unitInfos[2].addUnit) ? 'hidden' : 'visible';
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[2].multiValue < 1 && row.unitInfos[2].addUnit == 'BTL') {
                                compu += '<span> 1' + row.unitInfos[2].addUnit + '</span>=<span>' + (row.unitInfos[2].multiValue * 1000) + 'ML' + '</span>';
                                // compu += '<span> ' + row.unitInfos[2].addVal + row.unit + '</span>=<span>' + row.unitInfos[2].val + row.unitInfos[2].addUnit + '</span>';
                            } else {
                                compu += '<span> 1' + row.unitInfos[2].addUnit + '</span>=<span>' + row.unitInfos[2].multiValue + row.unit + '</span>';
                            }
                            compu += '</div>';
                            return $('<div>').append(span).append($(compu));
                        }
                        return '-';
                    }
                }, {
                    code: 'quantity4',
                    title: '数量（单位4）',
                    className: 'quantity',
                    editType: 'number',
                    width: '140px',
                    formatter: function (val, row) {
                        if (row.unitInfos && row.unitInfos.length > 3) {
                            let span = $('<div class="input-prepend input-group">' +
                                '<span class="input-group-addon">' + row.unitInfos[3].addUnit + '</span>' +
                                '<input listname="quantity4" data-multi="' + row.unitInfos[3].multiValue + '" data-unit="' + row.unitInfos[3].addUnit + '"  class="form-control" type="text">' +
                                '</div>');
                            span.find('input').change(function () {
                                if (Number($(this).val())) {
                                    row.quantity4 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    row.quantity4 = "0_" + $(this).data('multi') + "_" + $(this).data('unit');
                                    $(this).val('');
                                }
                            }).val(row.v4);

                            let visible = (row.unitInfos[3].addUnit != row.unit ? "visible" : "hidden");
                            if (visible == 'visible')
                                visible = me.checkHiddenUnit(row.unitInfos[3].addUnit) ? 'hidden' : 'visible';
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[3].multiValue < 1 && row.unitInfos[3].addUnit == 'BTL') {
                                compu += '<span> 1' + row.unitInfos[3].addUnit + '</span>=<span>' + (row.unitInfos[3].multiValue * 1000) + 'ML' + '</span>';
                                // compu += '<span> ' + row.unitInfos[3].addVal + row.unit + '</span>=<span>' + row.unitInfos[3].val + row.unitInfos[3].addUnit + '</span>';
                            } else {
                                compu += '<span> 1' + row.unitInfos[3].addUnit + '</span>=<span>' + row.unitInfos[3].multiValue + row.unit + '</span>';
                            }
                            compu += '</div>';
                            return $('<div>').append(span).append($(compu));
                        }
                        return '-';
                    }
                }, {
                    code: 'quantity5',
                    title: '数量（单位5）',
                    className: 'quantity',
                    editType: 'number',
                    width: '140px',
                    formatter: function (val, row) {
                        if (row.unitInfos && row.unitInfos.length > 4) {
                            let span = $('<div class="input-prepend input-group">' +
                                '<span class="input-group-addon">' + row.unitInfos[4].addUnit + '</span>' +
                                '<input listname="quantity5" data-multi="' + row.unitInfos[4].multiValue + '" data-unit="' + row.unitInfos[4].addUnit + '"  class="form-control" type="text">' +
                                '</div>');
                            span.find('input').change(function () {
                                if (Number($(this).val())) {
                                    row.quantity5 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    row.quantity5 = "0_" + $(this).data('multi') + "_" + $(this).data('unit');
                                    $(this).val('');
                                }
                            }).val(row.v5);
                            let visible = (row.unitInfos[4].addUnit != row.unit ? "visible" : "hidden");
                            if (visible == 'visible')
                                visible = me.checkHiddenUnit(row.unitInfos[4].addUnit) ? 'hidden' : 'visible';
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[4].multiValue < 1 && row.unitInfos[4].addUnit == 'BTL') {
                                compu += '<span> 1' + row.unitInfos[4].addUnit + '</span>=<span>' + (row.unitInfos[4].multiValue * 1000) + 'ML' + '</span>';
                                // compu += '<span> ' + row.unitInfos[4].addVal + row.unit + '</span>=<span>' + row.unitInfos[4].val + row.unitInfos[4].addUnit + '</span>';
                            } else {
                                compu += '<span> 1' + row.unitInfos[4].addUnit + '</span>=<span>' + row.unitInfos[4].multiValue + row.unit + '</span>';
                            }
                            compu += '</div>';
                            return $('<div>').append(span).append($(compu));
                        }
                        return '-';
                    }
                }, {
                    code: 'recommendPrice',
                    title: '参考价',
                    width: '80px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'subTotal',
                    title: '小计',
                    width: '100px',
                    textAlign: 'right',
                    formatter: function (val) {
                        if (val && Number(val))
                            return val.toFixed(2);
                        return '-';
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                queryParams: {pageSize: 1000, type_in: 'Z091,Z092', _stockCheck: true},
                url: '/api/53afe452392f44b19d64ae88d1de7491',
                data: {rows: []},
                ajaxType: Dolphin.requestMethod.POST,
                pagination: false,
            });
        }
    };
});
