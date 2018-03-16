'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.toReceiveList = this.orderList("#toReceiveList");
            // this.toReceiveList.opts.queryParams.storeCode_in = org.breezee.context.userData.shops.join(',');
            this.orderList = this.orderList("#orderList");
            this.editList();
            this.receiveList();
            this.status = 100;
            this.toReceiveList.load(null, {
                status: this.status,
                _storeShop: true
            });
            this.curList = this.toReceiveList;
        },

        initEvent: function () {
            let me = this;

            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                d.status = me.status;
                me.curList.load(null, d);
            });

            $("#tab_user2").on('show.bs.tab', function (e) {
                me.status = null;
                me.curList = me.orderList;
                $(".btn_query").click();
            });

            $("#tab_user1").on('show.bs.tab', function (e) {
                me.status = 100;
                me.curList = me.toReceiveList;

                $(".btn_query").click();
            });

            $("#print").click(function () {
                let hiddenId = $("#hiddenId").val();
                window.open("http://" + window.location.host + org.breezee.context.contextPath + org.breezee.context.viewPrefix + "/pcm/printOrder?data=" + hiddenId);
            });

            $("#print_btn").click(function () {
                let hiddenId = $("#hiddenId").val();
                window.open("http://" + window.location.host + org.breezee.context.contextPath + org.breezee.context.viewPrefix + "/pcm/printOrder?data=" + hiddenId);
            });

            $(".btn_receive").click(function () {
                let rdf = Dolphin.form.getValue("#receive_form");
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        id: me.curPuraseId,
                        menuCode:'purchaseList2',
                        properties: {
                            receive: "true",
                        },
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
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
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
                    type: '20',
                    status_not_equal: "1"
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
                    formatter: function (val, row) {
                        return '<div>' + val + '</div><div style="font-size: 95%;color: #0B90C4;">' + (row.dn || '') + '</div>'
                    }
                }, {
                    code: 'totalAmount',
                    title: '订单金额',
                    width: '100px',
                    formatter: function (val) {
                        return val.toFixed(2) || '-';
                    }
                }, {
                    code: 'storeName',
                    title: '购入门店',
                    width: '150px'
                }, {
                    code: 'procureName',
                    title: '调出门店',
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
                    width: '100px'
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '100px'
                }, {
                    code: 'id',
                    title: '操作',
                    width: '150px',
                    className: "hide_el",
                    formatter: function (val, data, index) {
                        let html = null;
                        if (me.status == 100) {
                            html = "<div><a class='btn btn-outline btn-circle btn-sm purple btn-receive' " +
                                "href='javascript:void(0);' data-id='" + data.id + "' style='margin-right: 5px;'>" +
                                "<i class='fa fa-check-square-o'></i>收货</a><a class='btn btn-outline btn-circle btn-sm blue btn-reject' " +
                                "href='javascript:void(0);' data-id='" + data.id + "'>" +
                                "<i class='fa fa-ban'></i>拒收</a></div>";
                        } else {
                            html = org.breezee.buttons.view({id: val});
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
                                    this.toQuantity = this.quantity - (this.receiveQuantity || 0);
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

                    if (panel == '#toReceiveList' && td.total)
                        $("#unReceiveNum").html(td.total);
                    $(".btn-reject").click(function () {
                        let data = $(this).data();
                        Dolphin.confirm('确认拒收此订单吗?', {
                            callback: function (flag) {
                                if (flag) {
                                    Dolphin.ajax({
                                        url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                                        type: Dolphin.requestMethod.PUT,
                                        data: Dolphin.json2string({
                                            id: data.id,
                                            menuCode:'purchaseList2',
                                            properties: {
                                                reject: true,
                                            }
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
                    width: '180px',
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
                    title: '参考价格',
                    width: '90px',
                    formatter: function (val) {
                        return (val || '-');
                    }
                }, {
                    code: 'quantity',
                    title: '采购数量',
                    width: '90px',
                    textAlign: 'right',
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
                    code: 'receiveQuantity',
                    title: '已收货数量',
                    width: '110px',
                    //textAlign: 'right',
                    formatter: function (val) {
                        return val;
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false
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
                    width: '130px',
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
                    code: 'quantity',
                    title: '采购数量',
                    width: '110px',
                    formatter: function (val, row) {
                        return val + ' ' + row.unit;
                    }
                }, {
                    code: 'receiveQuantity',
                    title: '已收货数量',
                    width: '110px',
                    formatter: function (val, row) {
                        return val ? val : '0';
                    }
                }, {
                    code: 'toQuantity',
                    title: '收货数量',
                    readonly: true,
                    width: '110px'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false
            });
        },
    };
});
