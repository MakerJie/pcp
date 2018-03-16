'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/js/moment.min.js",
                    "/assets/js/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());

            this.initEvent();
            this.initDataList();
            this._linesList = this.initDetailsList();
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                console.log('add button click....');
                me._linesList.loadData({rows: [{}, {}]});
                Dolphin.form.empty("#data_form");
                Dolphin.form.setValue({
                    happenTime: Dolphin.longDate2string(new Date().getTime(), 'yyyy-MM-dd')
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
                let dd = Dolphin.form.getValue(ef);
                dd.happenTime = dd.happenTime + " 00:00:00";
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
                $("#matModal").modal('show');
            });

            $("#matSelectSearch").click(function () {
                me._matSelectList.opts.checkedData = me._linesList.data.rows;
                me._matSelectList.load(null, Dolphin.form.getValue("#mat-select-form"));
            });

            $(".btn_confirm").click(function () {
                console.log('.........');

                me._linesList.loadData({rows: me._matSelectList.getChecked()});
                $("#matModal").modal('hide');
            });
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
                    code: 'dn',
                    title: '物料凭证',
                    width: '120px'
                }, {
                    code: 'creator',
                    title: '创建人',
                    width: '120px'
                }, {
                    code: 'id',
                    title: '&nbsp;',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.view({
                            id: row.id
                        });
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/fbbc247ea033447b9db0883366fc7c05',
                pagination: true,
                paginationSimpleFlag:true,
                onClick: function (data) {
                    console.log(data);
                    me._linesList.loadData({rows: data.purchaseLines});
                },
                onLoadSuccess: function () {
                    org.breezee.buttons.viewCallback('e452d64ae88d1392de749153aff44b19', 'id', function (data) {
                        me._linesList.loadData({rows: data.value.fetchLines});
                        $(".btn_save").hide();
                        $('#dataModal').modal('show');
                    });
                }
            });
        },

        initDetailsList: function () {
            let me = this;
            return new Dolphin.LIST({
                panel: "#dataLineList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '物料编码',
                    width: '140px',
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
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '100px',
                    formatter: function (val) {
                        return val || '-';
                    }
                }, {
                    code: '小计',
                    title: '数量',
                    editType: 'number',
                    width: '100px'
                }],
                multiple: true,
                rowIndex: false,
                checkbox: false,
                data: {rows: [{}, {}]},
                ajaxType: Dolphin.requestMethod.POST,
                pagination: false,
            });
        }
    };
});
