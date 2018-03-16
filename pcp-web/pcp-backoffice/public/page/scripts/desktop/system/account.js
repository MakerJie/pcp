'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
            this.initDataList();
            this._shopListSelect = this.shopSelectList('shopListSelect');
            this._roleListSelect = this.roleSelectList();
            console.log('load the accountList.js....');
            this.curAccount = null;
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                console.log('add button click....');
                Dolphin.form.empty("#data_form");
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._accountList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                data.menuCode="account";
                Dolphin.ajax({
                    url: '/api/36b1252c1f10c1474ea58bcc27be8e57',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    loading: true,
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

            $(".btn-shop-select").click(function () {
                if (me.curAccount) {
                    $("#dataModal2").modal('show');
                    me._shopListSelect.load(null,{});
                } else {
                    Dolphin.alert('请先选择一个账户');
                }
            });

            $(".btn-account-select").click(function () {
                if (me.curAccount) {
                    $("#dataModal3").modal('show');
                    me._roleListSelect.load(null, {});
                } else {
                    Dolphin.alert('请先选择一个账户');
                }
            });

            $("input[id='nameInput']").keydown(function (e) {
                if (e.keyCode === 13) {
                    $('#nameSelectSearch').click();
                }
            });

            $("#nameSelectSearch").click(function () {
                let name_like = $("#nameInput").val();
                me._shopListSelect.load(null, {name_like: name_like,Is_Count: me.curAccount});
            });

            $(".btn_confirm").click(function () {
                let checkedAccount = me._accountList.getChecked()[0];
                let checkedShop = me._shopListSelect.getChecked();
                let dd = [];
                $.each(checkedShop, function () {
                    if (this.code) {
                        dd.push({
                            shopCode: this.code,
                            accountCode: checkedAccount.code,
                            code: checkedAccount.code + "_" + this.code,
                            name: checkedAccount.name,
                            shopName: this.name
                        });
                    }
                });
                Dolphin.ajax({
                    url: '/api/7f04d855026b43d1920b4a1bd5b81a3d',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        id: checkedAccount.id,
                        menuCode:'account',
                        code:checkedAccount.code,
                        shopAccountInfos: dd
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $("#dataModal2").modal('hide');
                            $('.btn_query').click();
                        }
                    },
                    onError: function () {
                    }
                });
            });

            $(".btn_role").click(function () {
                let checkedAccount = me._accountList.getChecked()[0];
                let checkedRole = me._roleListSelect.getChecked();
                let dd = [];
                $.each(checkedRole, function () {
                    dd.push(this.id);
                });
                Dolphin.ajax({
                    url: '/api/7f04dd1926b43bd5b81a3d0b4a185502',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        id: checkedAccount.id,
                        menuCode:'account',
                        roleIds: dd
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $("#dataModal3").modal('hide');
                            $('.btn_query').click();
                        }
                    },
                    onError: function () {

                    }
                });
            });

            $(".btn_restpassword").click(function () {
                let checkedAccount = me._accountList.getChecked()[0];
                Dolphin.confirm('确认重置此账号密码为:' + checkedAccount.code + '123?', {
                    callback: function (flag) {
                        if (flag) {
                            Dolphin.ajax({
                                url: '/api/044a10ad24a598a787b50a0dc757e06c',
                                type: Dolphin.requestMethod.POST,
                                data: Dolphin.json2string({
                                    id: checkedAccount.id,
                                    menuCode:'account',
                                    password: checkedAccount.password,
                                    confirmPassword: checkedAccount.code + '123',
                                    properties: {
                                        _password: true
                                    }
                                }),
                                loading: true,
                                success: function (reData) {
                                    if (reData.success) {
                                        Dolphin.alert('密码重置成功');
                                    } else {
                                        Dolphin.alert(reData.msg);
                                    }
                                },
                                onError: function (data) {
                                    alert(data.error);
                                }
                            });
                        }
                    }
                });
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
                    title: '账号编码',
                    width: '120px'
                }, {
                    code: 'name',
                    title: '账号名称',
                    width: '130px'
                }, {
                    code: 'mobile',
                    title: '联系手机',
                    width: '120px',
                    className: "hide_el"
                }, {
                    code: 'email',
                    title: '电子邮件',
                    width: '150px',
                    className: "hide_el"
                }, {
                    code: 'roleStr',
                    title: '角色列表',
                    className: "hide_el",
                    formatter: function (val) {
                        if (val) {
                            return val.split(",").join("<br/>");
                        }
                    }
                }, {
                    code: 'shopNames',
                    title: '关联门店',
                    className: "hide_el",
                    formatter: function (val) {
                        if (val) {
                            return val.split(",").join("<br/>");
                        }
                    }
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
                }, {
                    code: 'id',
                    title: '操作',
                    width: '90px',
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
                url: '/api/39f139515f18427984e8774c59ba727b',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('25274ec2bcc14367be8e57c1f10a58b1', 'id', function (data) {
                        $('#dataModal').modal('show');
                    });

                    // org.breezee.buttons.delCallback('defa810cf1f4f0b61b9203c363ea2fff', "id", function (data) {
                    //     $('.btn_query').click();
                    // });
                    $('.delBtn').click(function () {
                        let _this = $(this);
                        Dolphin.confirm('确认删除？', {
                            callback: function (flag) {
                                if (flag) {
                                    Dolphin.ajax({
                                        url: '/api/defa810cf1f4f0b61b9203c363ea2fff',
                                        type: Dolphin.requestMethod.POST,
                                        loading: true,
                                        data: Dolphin.json2string({
                                            menuCode:'account',
                                            id: _this.data('id')
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

                onClick: function (data) {
                    me.curAccount = data.code;
                },
            });
        },

        shopSelectList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: "#" + panel,
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '门店编码',
                    width: '150px'
                }, {
                    code: 'name',
                    title: '门店名称',
                    width: '300px'
                }],
                multiple: true,
                rowIndex: false,
                checkbox: true,
                loading: true,
                ajaxType: Dolphin.requestMethod.POST,
                queryParams: {
                    type: ''
                },
                url: '/api/445a2ba90204414387ba30a336f016b6',
                pagination: true,

            });
        },

        roleSelectList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: "#roleListSelect",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '角色编码',
                    width: '150px'
                }, {
                    code: 'name',
                    title: '角色名称',
                    width: '300px'
                }],
                multiple: true,
                rowIndex: false,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                queryParams: {
                    pageSize: 1000
                },
                url: '/api/cbf622a243b4a66db67ddf7d20b201e3',
                pagination: true,

            });
        }
    };
});