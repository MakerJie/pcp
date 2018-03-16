'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS([],
                );
            this.initEvent();
            this.initDataList();
            this.initDataLineList();
            console.log('load the accountList.js....');
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                console.log('add button click....');
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                Dolphin.ajax({
                    url: '/api/000b2c41804b476884555b87fe6a2fd5',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('.btn_query').click();
                            me._dataList.load();
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

            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
            });

            $("#couponStatusSel").change(function () {
                let v = $(this).val();
                me._dataList.load(null, {
                        status: v
                })
            });

            $(".btn_del_coupon").click(function () {
                let d = me._dataList.getChecked();
                Dolphin.ajax({
                    url: '/api/006515bbff184fd18f6396d5f592a22c',
                    type: Dolphin.requestMethod.DELETE,
                    data: Dolphin.json2string({
                        couponInfos: d
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                                me._dataList.load();
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
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
                columns: [{
                    code: 'name',
                    title: '类型名称',
                    width: '160px'
                }, {
                    code: 'rule',
                    title: '类型规则',
                    width: '270px',
                    formatter: function (val, row) {
                        let pro = row.properties;
                        let html = [];
                        if (pro.daterange) {
                            html.push("<div>");
                            html.push(pro.daterange);
                            html.push("</div>");
                        }
                        if (pro.customerType) {
                            html.push("<div>适用客户：");
                            html.push(pro.customerType);
                            html.push("</div>");
                        }
                        if (pro.product) {
                            html.push("<div>适用菜品：");
                            html.push(pro.product);
                            html.push("</div>");
                        }
                        if (pro.order) {
                            html.push("<div>订单条件：");
                            html.push(pro.order);
                            html.push("</div>");
                        }
                        if (pro.disType) {
                            html.push("<div>券类型：");
                            html.push(pro.disType == 'fixAmount' ? '固定金额' : "固定折扣");
                            html.push("</div><div>券值：");
                            html.push(pro.disValue);
                            html.push("</div>");
                        }
                        return html.join('');
                    }
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '90px'
                }, {
                    code: 'id',
                    title: '&nbsp;',
                    width: '90px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({
                                id: row.id
                            })/* + '<a class="btn btn-outline btn-circle btn-sm dark genBtn" data-id="' + val +
                            '" href="javascript:;"><i class="fa fa-external-link-square"></i> 生成</a>'*/;
                    }
                }],
                multiple: false,
                rowIndex: false,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/002e17f5d8e24e918c2ddb5ad706deb4',
                pagination: false,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('c2ddb06deb5ad7e2047f5d802e1e9184','id',function (data) {
                        $('#dataModal').modal('show');
                    });
                    $(".genBtn").click(function () {
                        let name = prompt("请输入需要生成的数量", "");
                        if (name) {
                            me.generateCoupon($(this).data('id'), name);
                        }
                    });
                },
                onClick: function (data, row) {
                    me._dataList.load(null, {
                        couponType_id_obj_ae: data.id
                    });
                }
            });
        },

        generateCoupon: function (typeId, count) {
            const me = this;
            Dolphin.ajax({
                url: '/api/001bd9ba5ef94878b1fcb192d2d271d0?typeId=' + typeId + '&count=' + count,
                type: Dolphin.requestMethod.GET,
                success: function (reData, textStatus) {
                    if (reData.success) {
                        me._dataList.load(null, {
                            properties: {
                                couponType_id_obj_ae: typeId
                            }
                        });
                    } else {
                        $("#error_message").html(reData.msg);
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },

        initDataLineList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataLineList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '券编码',
                    width: '110px'
                }, {
                    code: 'createTime',
                    title: '生成时间',
                    width: '150px'
                }, {
                    code: 'typeName',
                    title: '券类型',
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '120px',
                    formatter: function (val, row) {
                        if (row.delFlag) {
                            return val + '<span style="font-size:80%;color: red;font-weight: bold;">(作废)</span>'
                        }
                        return val;
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/0036e34aceb04f5297a5f9b4171b2d65?',
                data: {rows: []},
                pagination: true,
                onLoadSuccess: function () {

                }
            });
        }
    };
});