'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
            this.toReceiveList = this.orderList("#toReceiveList");
            this.orderList = this.orderList("#orderList");
            this.editList();
            this.receiveList();
            Dolphin.form.parse("#query_form");
            this.status = 100;
            this.sign = 1;
            this.toReceiveList.load(null, {
                status: this.status
            });
            this.curList = this.toReceiveList;
        },

        initEvent: function () {
            let me = this;

            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                if (me.sign == 1) {
                    d.status = me.status;
                }
                me.curList.load(null, d);
            });

            $('.btn-save').click(function () {
                let fd = Dolphin.form.getValue("#order-form");
                if (fd['deliveryDate']) {
                    fd.deliveryDate = fd['deliveryDate'] + ' 00:00:00';
                }
                fd.status = $(this).data('status');
                $.extend(me.orderData, fd);
                me.orderData.procureCode = $("#supplyer").val();
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(me.orderData),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderList.reload();
                            $('#tab_user2').tab('show')
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

            $("#prints").click(function () {
                let hiddenId = $("#hiddenId").val();
                window.open("http://" + window.location.host + org.breezee.context.contextPath + org.breezee.context.viewPrefix + "/pms/details?type=10&data=" + hiddenId+"&status="+me.selStatus);
            });
            $("#print_btn_receive").click(function () {
                let hiddenId = $("#hiddenId").val();
                window.open("http://" + window.location.host + org.breezee.context.contextPath + org.breezee.context.viewPrefix + "/pms/details?type=10&data=" + hiddenId);
            });
            $("#tab_user2").on('show.bs.tab', function (e) {
                me.status = null;
                me.sign = 2;
                me.curList = me.orderList;
                $(".btn_query").click();
            });

            $("#tab_user1").on('show.bs.tab', function (e) {
                me.status = 100;
                me.sign = 1;
                me.curList = me.toReceiveList;
                $(".btn_query").click();
            });

            $(".btn_receive").click(function () {
                let rdf = Dolphin.form.getValue("#receive_form"),btn = $(this);
                btn.attr('disabled',true);
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        id: me.curPuraseId,
                        menuCode:'purchaseList1',
                        status:$(this).data('status'),
                        properties: {receive: "true"},
                        purchaseLines: rdf.receiveData
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me.toReceiveList.reload();
                            $("#dataModal2").modal('hide');
                        } else {
                            Dolphin.alert(reData.msg, {
                                countDownTime: 10000,
                                width: '480px',
                                countDownFlag: false
                            });
                            btn.removeAttr('disabled');
                        }
                    },
                    onError: function () {
                        $(".error_message_e").html('系统出错，请联系管理员');
                        btn.removeAttr('disabled');
                    }
                });
            });
        },

        orderList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: panel,
                idField: 'id',
                hover: false,
                queryParams: {
                    type: '10',
                    status_not_equal: "1"
                },
                columns: [{
                    code: 'submitor',
                    title: '提交时间',
                    width: '100px',
                    formatter: function (val, row) {
                        return row.syncDate ? row.syncDate : row.createTime;
                    }
                }, {
                    code: 'name',
                    title: '供应商',
                    width: '150px',
                }, {
                        code: 'code',
                        title: '订单号',
                        width: '100px',
                        formatter: function (val, row) {
                            return '<div>' + val + '</div><div style="font-size: 95%;color: #0B90C4;">' + (row.dn || '') + '</div>'
                        }
                    }, {
                        code: 'totalAmount',
                        title: '订单金额',
                        width: '100px',
                        formatter: function (val) {
                            return val ? val.toFixed(2) : '-';
                        }
                    }, {
                        code: 'storeName',
                        title: '购入门店',
                        width: '150px'
                    }, {
                        code: 'deliveryDate',
                        title: '计划交货',
                        width: '100px',
                        formatter: function (val) {
                            return val && val.substr(0, 10);
                        }
                    }, {
                        code: 'submitor',
                        title: '提交人',
                        width: '90px',
                        formatter: function (val, row) {
                            return val ? val : row.creator
                        }
                    }, {
                        code: 'statusName',
                        title: '状态',
                        className: 'text-info',
                        width: '100px',
                        formatter: function (val, data, index) {
                            return val;
                        }

                    }, {
                        code: 'id',
                        title: '操作',
                        width: '160px',
                        className: "hide_el",
                        formatter: function (val, data, index) {
                            let html = null;
                            if (me.status == 100) {
                                html = "<a class='btn btn-outline btn-circle btn-sm purple btn-receive' " +
                                    "href='javascript:void(0);' data-id='" + data.id + "' style='font-size: 12px;'>" +
                                    "<i class='fa fa-check-square-o'></i>收货</a></div><a class='btn btn-outline btn-circle btn-sm blue btn-repeal' " +
                                    "href='javascript:void(0);' data-id='" + data.id + "' style='font-size: 12px;'>" +
                                    "<i class='fa fa-ban'></i>作废</a></div>";
                            } else if (me.status == 400) {
                                html = "";
                            } else {
                                html = org.breezee.buttons.view1({id: val});
                            }
                            return html;
                        }

                    }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/fbbc247ea033447b9db0883366fc7c05',
                data: {rows: []},
                pagination: true,
                onLoadSuccess: function (td) {
                    org.breezee.buttons.viewCallback('80da5b20221f43308ae2a1b389b409e5', 'id', function (data) {
                        $("#hiddenId").val(data.value.id);
                        let retData = data.value;
                        me.selStatus = retData.status;
                        $("#dn").html(retData.dn);
                        me._editList.loadData({rows: retData.purchaseLines});
                        $("#matModal").modal('show');
                    });

                    $(".btn-receive").click(function () {
                        $("#hiddenId").val($(this).data('id'));
                        me.curPuraseId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/80da5b20221f43308ae2a1b389b409e5@id=' + me.curPuraseId,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (reData) {
                                let dd = [];
                                $.each(reData.value.purchaseLines, function () {
                                    this.toQuantity = this.quantity || 0;
                                    if (this.toQuantity > 0) {
                                        dd.push(this);
                                    }
                                });
                                me._receiveList.loadData({rows: dd});
                                $("#dataModal2").modal({
                                    show: true,
                                    backdrop: 'static'
                                });
                            }
                        });
                    });
                    if (panel == '#toReceiveList' && td.total) {
                        $("#unReceiveNum").html(td.total);
                    }

                    $(".btn-repeal").click(function () {
                        $("#hiddenId").val($(this).data('id'));
                        me.curPuraseId = $(this).data('id');
                        Dolphin.confirm('确认作废此订单,作废后不可更改?', {
                            callback: function (flag) {
                                if (flag) {
                                    Dolphin.ajax({
                                        url: '/api/ab113d4b5305973ebd7b2a49c359241a',
                                        type: Dolphin.requestMethod.POST,
                                        data:Dolphin.json2string({
                                            id:me.curPuraseId,
                                            menuCode:'purchaseList1',
                                        }),
                                        loading: true,
                                        success: function (reData, textStatus) {
                                            if (reData.success) {
                                                $(".btn_query").click();
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

                },
                onLoad: function () {

                }
            });
        },

        editList: function () {
            const me = this;
            this._editList = new Dolphin.LIST({
                panel: "#materielSelectDiv",
                idField: 'id',
                hover: false,
                panelType: 'panel-warning',
                editListName: "purchaseLines",
                editFlag: false,
                columns: [{
                    code: 'material',
                    title: '物料编码',
                    width: '150px',
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
                    code: 'price',
                    title: '采购价格',
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '采购数量',
                    width: '90px',
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
                    code: 'subTotal',
                    title: '小计',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val, row) {
                        if (row.price != null && row.quantity != '') {
                            return (row.price * row.quantity).toFixed(2);
                        } else {
                            return '-';
                        }

                    }
                }, {
                    code: 'receiveQuantity',
                    title: '已收数量',
                    textAlign: 'right',
                    width: '100px',
                    formatter: function (val) {
                        if (val == 3) {
                            return '<del>' + val + '</del>';
                        }
                        return val || '-';
                    }
                }, {
                    code: 'receiveOff',
                    title: '&nbsp;&nbsp;',
                    width: '130px',
                    formatter: function (val, row) {
                        if (val == 2) {
                            return '<a class="btn btn-outline btn-circle btn-sm purple offBtn" ' +
                                'data-id="' + row.id + '" data-dn="' + row.receiveDn + '" ' +
                                'href="javascript:;"><i class="fa fa-edit"></i>冲销</a>';
                        } else if (val == 3) {
                            return '收货已冲销';
                        }
                        return '';
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false,
                onLoadSuccess: function () {
                    $(".offBtn").click(function () {
                        let data = $(this).data(), btn = $(this);
                        Dolphin.confirm('确认要冲销此收货数据吗？', {
                            callback: function (flag) {
                                if (flag == true) {
                                    Dolphin.ajax({
                                        url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                                        type: Dolphin.requestMethod.PUT,
                                        data: Dolphin.json2string({
                                            id:$("#hiddenId").val(),
                                            menuCode:'purchaseList1',
                                            properties: {
                                                receiveOff: "true"
                                            },
                                            purchaseLines: [{
                                                id: data.id,
                                                receiveDn: data.dn
                                            }]
                                        }),
                                        loading: true,
                                        success: function (reData, textStatus) {
                                            if (reData.success) {
                                                btn.hide();
                                                btn.parent().html('冲销成功');
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
                                    });
                                }
                            }
                        })
                    });
                }
            })
        },

        receiveList: function () {
            this._receiveList = new Dolphin.LIST({
                panel: "#receiveList",
                idField: 'id',
                hover: false,
                editFlag: true,
                editBtn: false,
                editListName: 'receiveData',
                columns: [{
                    code: 'material',
                    title: '物料编码',
                    width: '110px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'name',
                    title: '物料名称',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'price',
                    title: '采购价格',
                    width: '100px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '采购数量',
                    width: '100px',
                    formatter: function (val, row) {
                        return val + ' ' + row.unit;
                    }
                }, {
                    code: 'toQuantity',
                    title: '收货数量',
                    width: '120px',
                    formatter: function (val, row) {
                        let input = $('<input class="form-control" placeholder="数量" id="toQuantity" listname="toQuantity" >');
                        input.val(row.toQuantity);
                        input.change(function () {
                            row.toQuantity = $(this).val();
                            $(this).closest('tr').find('[columncode="subTotal"]').html((row.toQuantity * row.price).toFixed(2));
                        });
                        return input;
                    }
                }, {
                    code: 'subTotal',
                    title: '小计',
                    width: '100px',
                    formatter: function (val, row) {
                        return (row.toQuantity * row.price).toFixed(2);
                    }
                }, {
                    code: 'reason',
                    title: '差异原因',
                    editType: 'select',
                    options: 'shopRejectReason',
                    width: '170px'
                }, {
                    code: 'remark',
                    title: '备注',
                    width: '170px'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false,
                onLoadSuccess: function () {

                }
            });
        },
    };
});
