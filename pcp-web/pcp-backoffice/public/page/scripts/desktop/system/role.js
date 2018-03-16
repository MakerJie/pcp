/**
 * 权限
 * Created by Ning on 2017/8/8.
 */

'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
            this.initDataList();
            this.dataAccountList("dataListSelect");
            this.permitSelect = $("#permits_select").multipleSelect();
            this.curAccount = null;
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                $("#code").attr({"disabled": false});
                Dolphin.form.empty("#data_form");
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._roleList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                if (data._permits){
                    data.permits = data._permits.join(',');
                }
                data.menuCode = 'role';
                Dolphin.ajax({
                    url: '/api/7f4618b93db981fd2f25d08a0650aee1',
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
            me._roleList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'code',
                    title: '角色编码',
                }, {
                    code: 'name',
                    title: '角色名称',
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (row.delFlag) {
                            return "已删除";
                        }
                        return val;
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        if (row.delFlag) {

                        } else {
                            return org.breezee.buttons.edit({
                                    id: row.id
                                }) + org.breezee.buttons.del({id: row.id});
                        }
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/cbf622a243b4a66db67ddf7d20b201e3',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('e14a6bfdb0b047f4ad193b7508f8c42d', 'id', function (data) {
                        $("#code").attr({"disabled": true});
                        if (data.value && data.value.permits) {
                            let pp = data.value.permits.split(",");
                            $("#permits_select").multipleSelect('setSelects', pp);
                        }
                        $('#dataModal').modal('show');
                    });
                    $('.delBtn').click(function () {
                        let _this = $(this);
                        Dolphin.confirm('确认删除？', {
                            callback: function (flag) {
                                if (flag) {
                                    Dolphin.ajax({
                                        url: '/api/33b67d6b0f8936c019c58ed8abf27f4a',
                                        type: Dolphin.requestMethod.POST,
                                        loading: true,
                                        data: Dolphin.json2string({
                                            id: _this.data('id'),
                                            menuCode:'role'
                                        }),
                                        onSuccess: function (reData) {
                                            $('.btn_query').click();
                                        }
                                    });
                                }
                            }
                        })
                    });
                },
                onClick: function (data, row) {
                    me.dataListSelect.load(null, {id: data.id});
                }
            });
        },

        dataAccountList: function () {
            let me = this;
            me.dataListSelect = new Dolphin.LIST({
                panel: "#dataListSelect",
                idField: 'id',
                title: '关联账号列表',
                hover: false,
                queryParams:{},
                columns: [{
                    code: 'code',
                    title: '账号编码',
                    width: '150px'
                }, {
                    code: 'name',
                    title: '账号名称',
                    width: '300px'
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '90px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (row.delFlag) {
                            return "已删除";
                        }
                        return val;
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/44e8ac0b4852c9bab26e9c03f884ce2d',
                data: {rows: []},
                pagination: true,

            });
        },
    };
});