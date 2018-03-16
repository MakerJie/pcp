'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
            this.initDataList();
            Dolphin.form.parseSelect($("#customerSel"));
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                Dolphin.form.empty("#data_form");
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._accountList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                data.menuCode='payconfig';
                Dolphin.ajax({
                    url: '/api/037521a5d3164d89a1e8b87bcfa3aa23',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#dataModal').modal('hide');
                            $('.btn_query').click();
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
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
            me._accountList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'code',
                    title: '支付方式编码',
                    width: '160px'
                }, {
                    code: 'name',
                    title: '支付方式名称'
                }, {
                    code: 'amount',
                    title: '支付折扣比例',
                    width: '160px',
                    className: "hide_el"
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '150px',
                    className: "hide_el"
                }, {
                    code: 'id',
                    title: '操作',
                    width: '100px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return '<a class="btn btn-outline btn-circle btn-sm purple editBtn" ' +
                            'data-id="' + val + '" ' +
                            ' data-name="' + row.name + '" ' +
                            ' data-code="' + row.code + '"' +
                            ' data-status="' + row.status + '"' +
                            ' data-customerId="' + row.customerId + '"' +
                            ' data-amount="' + row.amount + '"' +
                            ' href="javascript:;"><i class="fa fa-edit"></i>编辑</a>';
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/5afa3f00d2ac4808b19d156b876c6615',
                pagination: true,
                onLoadSuccess: function () {
                    $('.editBtn').click(function () {
                        let d = $(this).data();
                        Dolphin.form.setValue(d, '.edit-form');
                        $('#dataModal').modal('show');
                    });
                },

                onClick: function (data) {
                },
            });
        }
    };
});