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
            Dolphin.form.parseSelect($("#storeSelect"));
            $('.btn_query').click();
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                $("#error_message").empty();
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {
                    // filter:'100'
                },
                columns: [{
                    code: 'code',
                    title: '盘点单号',
                    width: '150px'
                }, {
                    code: 'name',
                    title: '门店名称',
                    width: '150px',
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
                    code: 'creator',
                    title: '创建人',
                    width: '90px'
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '110px'
                }, {
                    code: 'id',
                    title: '&nbsp;',
                    width: '90px',
                    className: "hide_el",
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
                url: '/api/9e6d18d69d748cab68aa3313df2c8ec8',
                data:{rows:[]},
                pagination: true,
                onUnchecked: function () {
                    // console.log(me._dataList.getChecked().length);
                },
                onLoadSuccess: function (data) {
                    org.breezee.buttons.viewCallback('0fe00de41519b82e98c505e53bfc441b', "id", function (data) {
                        $("#hiddenBtn").hide();
                        $("#purchaseShop").attr("disabled", true);
                        $("#stockCheck").attr("disabled", true);
                        me._dataLineList.loadData({rows: data.value.stockCheckLines});
                        $('#dataModal').modal({
                            show: true,
                            backdrop: 'static'
                        });
                    });
                }
            });
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
                editFlag: false,
                columns: [{
                    code: 'code',
                    title: '物料编码',
                    width: '120px',
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
                    code: 'quantity1',
                    title: '数量（单位1）',
                    className: 'quantity',
                    editType: 'number',
                    width: '140px',
                    formatter: function (val, row) {
                        if (row.unitInfos && row.unitInfos.length > 0) {
                            let span = $('<div class="input-prepend input-group">' +
                                '<input style="padding-left: 30px;" disabled listname="quantity1" data-multi="' + row.unitInfos[0].multiValue + '" data-unit="' + row.unitInfos[0].addUnit + '"  class="form-control" type="text">' +
                                '<span class="input-group-addon">' + row.unitInfos[0].addUnit + '</span>' +
                                '</div>');
                            span.find('input').change(function () {
                                if(Number($(this).val())) {
                                    row.quantity1 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    $(this).val('');
                                }
                            }).val(row.v1);

                            let visible = (row.unitInfos[0].addUnit != row.unit ? "visible" : "hidden");
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[0].multiValue < 1) {
                                compu += '<span> '+row.unitInfos[0].addVal + row.unit + '</span>=<span>' + row.unitInfos[0].val + row.unitInfos[0].addUnit + '</span>';
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
                                '<input style="padding-left: 30px;" disabled listname="quantity2" data-multi="' + row.unitInfos[1].multiValue + '" data-unit="' + row.unitInfos[1].addUnit + '"  class="form-control" type="text">' +
                                '<span class="input-group-addon">' + row.unitInfos[1].addUnit + '</span>' +
                                '</div>');
                            span.find('input').change(function () {
                                if(Number($(this).val())) {
                                    row.quantity2 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    $(this).val('');
                                }
                            }).val(row.v2);

                            let visible = (row.unitInfos[1].addUnit != row.unit ? "visible" : "hidden");
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[1].multiValue < 1) {
                                compu += '<span> '+row.unitInfos[1].addVal + row.unit + '</span>=<span>' + row.unitInfos[1].val + row.unitInfos[1].addUnit + '</span>';
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
                                '<input style="padding-left: 30px;" disabled  listname="quantity3" data-multi="' + row.unitInfos[2].multiValue + '" data-unit="' + row.unitInfos[2].addUnit + '"  class="form-control" type="text">' +
                                '<span class="input-group-addon">' + row.unitInfos[2].addUnit + '</span>' +
                                '</div>');
                            span.find('input').change(function () {
                                if(Number($(this).val())) {
                                    row.quantity3 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    $(this).val('');
                                }
                            }).val(row.v3);

                            let visible = (row.unitInfos[2].addUnit != row.unit ? "visible" : "hidden");
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[2].multiValue < 1) {
                                compu += '<span> '+row.unitInfos[2].addVal + row.unit + '</span>=<span>' + row.unitInfos[2].val + row.unitInfos[2].addUnit + '</span>';
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
                                '<input style="padding-left: 30px;" disabled listname="quantity4" data-multi="' + row.unitInfos[3].multiValue + '" data-unit="' + row.unitInfos[3].addUnit + '"  class="form-control" type="text">' +
                                '<span class="input-group-addon">' + row.unitInfos[3].addUnit + '</span>' +
                                '</div>');
                            span.find('input').change(function () {
                                if(Number($(this).val())) {
                                    row.quantity4 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    $(this).val('');
                                }
                            }).val(row.v4);

                            let visible = (row.unitInfos[3].addUnit != row.unit ? "visible" : "hidden");
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[3].multiValue < 1) {
                                compu += '<span> '+row.unitInfos[3].addVal + row.unit + '</span>=<span>' + row.unitInfos[3].val + row.unitInfos[3].addUnit + '</span>';
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
                                '<input style="padding-left: 30px;" disabled listname="quantity5" data-multi="' + row.unitInfos[4].multiValue + '" data-unit="' + row.unitInfos[4].addUnit + '"  class="form-control" type="text">' +
                                '<span class="input-group-addon">' + row.unitInfos[4].addUnit + '</span>' +
                                '</div>');
                            span.find('input').change(function () {
                                if(Number($(this).val())) {
                                    row.quantity5 = $(this).val() + "_" + $(this).data('multi') + "_" + $(this).data('unit');
                                } else {
                                    $(this).val('');
                                }
                            }).val(row.v5);
                            let visible = (row.unitInfos[4].addUnit != row.unit ? "visible" : "hidden");
                            let compu = '<div class="unit-info" style="visibility: ' + visible + '">';
                            if (row.unitInfos[4].multiValue < 1) {
                                compu += '<span> '+row.unitInfos[4].addVal + row.unit + '</span>=<span>' + row.unitInfos[4].val + row.unitInfos[4].addUnit + '</span>';
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
