'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            this._linesList = this.initDetailsList("#detailsList", true);
            this._linesListView = this.initDetailsList("#detailsListView", false);
            this.initMatList();
            Dolphin.form.parseSelect($("#queryType"));
            Dolphin.form.parseSelect($("#purchaseShop"));
            Dolphin.form.parse("#data_form");
            Dolphin.form.parseSelect($("#typeSelect"));
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                me._linesList.loadData({rows: []});
                Dolphin.form.empty("#data_form");
                Dolphin.form.setValue({
                    happenTime: Dolphin.longDate2string(new Date().getTime(), 'yyyy-MM-dd'),
                    shopCode: org.breezee.context.userData.shopCode
                }, $("#data_form"));
                $('#dataModal').modal({
                    show: true,
                    backdrop: 'static'
                });
            });

            $("#workType").change(function () {
                let typeValue = $("#workType").val();
                if ("Y51" == typeValue || "Y52" == typeValue) {
                    $('[listname="reason"]').empty();
                    Dolphin.form.parseSelect($('[listname="reason"]'));
                } else {
                    $('[listname="reason"]').empty().append('<option value="">--请选择--</option>');
                }
                for (let i = 0; i < me._linesList.opts.data.rows.length; i++) {
                    me._linesList.opts.data.rows[i].reason = '';
                }
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let ef = $("#data_form");
                if (!Dolphin.form.validate(ef)) {
                    return;
                }
                let dd = Dolphin.form.getValue(ef);
                dd.happenTime = dd.happenTime + " 00:00:00";
                dd.menuCode = 'fetch';
                Dolphin.ajax({
                    url: '/api/2133c8346c94d63cd5769610241cd24f',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(dd),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('.btn_query').click();
                            $('#dataModal').modal('hide');
                        } else {
                            $(".error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $(".error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                $(".error_message").empty();
                $(".btn_save").show();
            });

            $("#materielSelectBtn").click(function () {
                $("#matSelectSearch").click();
                $("#matModal").modal('show');
            });

            $("input[id='codeInput']").keydown(function (e) {
                if (e.keyCode === 13) {
                    $('#matSelectSearch').click();
                }
            });

            $("#matSelectSearch").click(function () {
                me._matSelectList.opts.checkedData = me._linesList.data.rows;
                let dd = {};
                dd["type"] = $("#typeSelect").val();
                dd["name_like"] = $("#codeInput").val();
                me._matSelectList.load(null, dd);
            });

            $(".btn_confirm").click(function () {
                let data = {};
                for (let i = 0; i < me._matSelectList.opts.checkedData.length; i++) {
                    data[me._matSelectList.opts.checkedData[i].code] = me._matSelectList.opts.checkedData[i];
                }
                let dd = [];
                for (let k in data) {
                    dd.push(data[k]);
                }
                me._linesList.loadData({rows: dd});
                $("#workType").change();
                $("#matModal").modal('hide');
            });

            let $disabledResults = $(".js-example-disabled-results");
            $disabledResults.select2();
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '单据号',
                    width: '150px'
                }, {
                    code: 'type',
                    title: '业务类型',
                    width: '110px',
                    formatter: function (val, row, index) {
                        let t = Dolphin.enum.getEnumText('fetchType', val);
                        let h = (val == '10' ? 'success' : 'danger');
                        return '<span class="label label-' + h + '">' + t + '</span>';
                    }
                }, {
                    code: 'happenTime',
                    title: '发生时间',
                    width: '130px',
                    formatter: function (val, row, index) {
                        return row.happenTime.substr(0, 10);
                    }
                }, {
                    code: 'shopName',
                    title: '发生门店',
                    width: '140px',
                }, {
                    code: 'num',
                    title: '行数量',
                    width: '90px',
                    formatter: function (val) {
                        if (val && Number(val) > 0) {
                            return Number(val).toFixed(2);
                        }
                        return '-';
                    }
                }, {
                    code: 'dn',
                    title: '物料凭证',
                    width: '120px'
                }, {
                    code: 'creator',
                    title: '创建人',
                    width: '100px'
                }, {
                    code: 'id',
                    title: '操作',
                    width: '75px',
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
                url: '/api/6b4c345c3988f533f6188cab1837c1a7',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.viewCallback('e452d64ae88d1392de749153aff44b19', 'id', function (data) {
                        me._linesListView.loadData({rows: data.value.fetchLines});
                        let rental = 0;
                        $.each(data.value.fetchLines,function () {
                            rental+=Number(this.subTotal||0);
                        });
                        $("#rental").html(rental);
                        data.value.happenTime = data.value.happenTime.substr(0, 10);
                        Dolphin.form.setValue(data.value, '.view-form');
                        $("#type").html(Dolphin.enum.getEnumText('fetchType', data.value.type));
                        me.curId = data.value.id;
                        $('#dataModal1').modal('show');
                    });
                }
            });
        },

        //新增list
        initDetailsList: function (panel, flag) {
            let me = this;
            return new Dolphin.LIST({
                panel: panel,
                editListName: 'fetchLines',
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '物料编码',
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'name',
                    title: '物料名称',
                    width: '200px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '70px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'stock',
                    title: '库存数',
                    width: '90px',
                    formatter: function (val) {
                        return val || '-';
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '100px',
                    formatter: function (val, row) {
                        if (flag) {
                            let input = $('<input class="form-control" placeholder="数量" id="quantity" listname="quantity" >');
                            input.val(row.quantity);
                            input.change(function () {
                                row.quantity = $(this).val();
                                $(this).closest('tr').find('[columncode="subTotal"]').text((row.quantity * row.recommendPrice).toFixed(2)).val((row.quantity * row.recommendPrice).toFixed(2))
                                let dd = Dolphin.form.getValue('#data_form');
                                let totalAmount = 0;
                                $.each(dd.fetchLines,function () {
                                    totalAmount+=(Number(this.quantity||0)*Number(this.recommendPrice||0));
                                });
                                $("#totalAmount").html(totalAmount.toFixed(2));
                            });
                            return input
                        }
                        return val;
                    }
                }, {
                    code: 'recommendPrice',
                    title: '金额',
                    width: '100px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'subTotal',
                    title: '小计',
                    width: '100px',
                    formatter: function (val) {
                        if(val && Number(val)){
                            return Number(val).toFixed(2);
                        }
                        return val;
                    }
                }, {
                    code: 'reason',
                    title: '原因',
                    editType: "select",
                    options: "reason",
                }, {
                    code: 'attribute',
                    title: '备注',
                }, {
                    code: 'status',
                    title: '&nbsp;&nbsp;',
                    width: '95px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        if(flag)
                            return '-';
                        if (val == 600)
                            return '已冲销';
                        return '<a class="btn btn-outline btn-sm red write-off" data-id="' + row.id + '" href="javascript:;"><i class="fa fa-ban"></i>冲销</a>'
                    }
                }],
                multiple: true,
                editFlag: flag,
                editBtn: flag,
                rowIndex: true,
                checkbox: false,
                addBtn: false,
                data: {rows: [{}, {}]},
                ajaxType: Dolphin.requestMethod.POST,
                pagination: false,
                onLoadSuccess: function () {
                    $(".write-off").click(function () {
                        let btn = $(this), data = btn.data();
                        Dolphin.confirm('确认冲销此物料损耗吗?', {
                            callback: function (flag) {
                                if (flag) {
                                    Dolphin.ajax({
                                        url: '/api/2133c8346c94d63cd5769610241cd24f',
                                        type: Dolphin.requestMethod.PUT,
                                        data: Dolphin.json2string({
                                            id: me.curId + ',' + data.id,
                                            menuCode:'fetch',
                                            properties: {
                                                reject: true,
                                            }
                                        }),
                                        loading: true,
                                        success: function (reData, textStatus) {
                                            if (reData.success) {
                                                btn.hide();
                                                btn.parent().html('冲销成功');
                                            } else {
                                                Dolphin.alert(reData.msg);
                                            }
                                        },
                                        onError: function () {
                                            $("#error_message").html('系统出错，请联系管理员');
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
            });
        },

        initMatList: function () {
            let me = this;
            me._matSelectList = new Dolphin.LIST({
                panel: "#materielSelectDiv",
                idField: 'id',
                hover: false,
                checkedData: [],
                columns: [{
                    code: 'code',
                    title: '物料编码',
                    width: '160px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'name',
                    title: '物料名称',
                    formatter: function (val) {
                        return val;
                    }
                }],
                multiple: true,
                rowIndex: false,
                checkbox: true,
                queryParams: {},
                data: {rows: []},
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/53afe452392f44b19d64ae88d1de7491',
                pagination: true,
            });
        }
    };
});
