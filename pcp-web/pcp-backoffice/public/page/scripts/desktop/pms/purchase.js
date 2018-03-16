'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(['/assets/js/bootstrap-datepicker.min.js'],
                '/page/scripts/desktop/asyncLoad.js');
            this.initEvent();
            this.initOrderGrid();
            this.cartShow();
            this.receiveList();
            this.deliveryList();
            this.editList();
            this.productCart = {};
            this.cartNum = 0;
            this.curTabIdx = 1;
            this.orderData = {
                name: '等账户的所属门店'
            };
            Dolphin.form.parseSelect($('#supplyer'));
            Dolphin.form.parseSelect($('#stockHouse'));
            // Dolphin.form.parseSelect($('#purchaseShop'));
            Dolphin.form.parseSelect($('#stockOut'));
            Dolphin.form.parseSelect($('#centerInShop'));
            Dolphin.form.parse("#order-form");
            Dolphin.form.parse("#query_form");
            Dolphin.form.parse("#data_form4");
            this.orderType = '10';
            this.curClickType = '10';
        },

        /**
         * 初始化事件
         */
        initEvent: function () {
            let me = this;
            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                me._orderGrid.query({properties: $.extend({}, d, {})});
            });

            $(".btn_add").click(function () {
                Dolphin.form.empty('#order-form');
                $("#dataModal").modal({
                    show: true,
                    backdrop: 'static'
                });
            });
            $('.btn-save').click(function () {
                let fd = Dolphin.form.getValue("#order-form");
                fd.status = $(this).data('status');
                $.extend(me.orderData, fd);
                if (fd['deliveryDate'])
                    me.orderData.deliveryDate = fd['deliveryDate'] + ' 00:00:00';
                me.orderData.type =Number(me.orderType);
                if (me.orderType == '40') {
                    me.orderData.storeCode = $("#centerInShop").val();
                } else {
                    me.orderData.storeCode = $("#purchaseShop").val();
                }
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(me.orderData),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderGrid.reload();
                            $("#dataModal").modal('hide');
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
                })
            });

            $('.btn_delete').click(function () {
                let fd = Dolphin.form.getValue("#data_form4");
                let id = fd['id'];
                Dolphin.ajax({
                    url: '/api/b2a49c35599241aab113d4b53073ebd7',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        id:id
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderGrid.reload();
                            $("#dataModal4").modal('hide');
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
                })
            });

            $('.btn-save2').click(function () {
                let fd = Dolphin.form.getValue("#data_form4");
                fd.status = $(this).data('status');
                $.extend(me.orderData, fd);
                if (fd['deliveryDate'])
                    me.orderData.deliveryDate = fd['deliveryDate'] + ' 00:00:00';
                me.orderData.type =Number(me.orderType);
                if (me.orderType == '40') {
                    me.orderData.storeCode = $("#centerInShop").val();
                } else {
                    me.orderData.storeCode = $("#purchaseShop").val();
                }
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(me.orderData),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderGrid.reload();
                            $("#dataModal4").modal('hide');
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
                })
            });


            $(".btn-search").click(function () {
                me.loadMateriel({
                    properties: {
                        type: 'Z001',
                        "code_like": $("#searchInput").val()
                    }
                }, 'query');
            });

            $(".optionRadio").click(function () {
                let v = $(this).val();
                me.curClickType = v;
                if (me.orderType != v) {
                    if (v === '10') {
                        $("#supplierSelect").show();
                        $("#supplyer").change();
                        $("#freePurchaseDiv").show();
                    } else {
                        $("#supplierSelect").hide();
                        $("#freePurchaseDiv").hide();
                    }
                    if (v === '30' || v === '40') {
                        $("#stockSelect").show();
                        $("#stockHouse").change();
                    } else {
                        $("#stockSelect").hide();
                    }
                    if (v === '20') {
                        $("#stockOutSelect").show();
                        $("#stockOut").change();
                    } else {
                        $("#stockOutSelect").hide();
                    }
                    if (v == '40') {
                        $("#shopInDiv").hide();
                        $("#centerInDiv").show();
                    } else {
                        $("#shopInDiv").show();
                        $("#centerInDiv").hide();
                    }
                }
                me.orderType = v;
            });
            $("#supplierSelect").show();
            $("#optionsRadios1").click();

            $("#supplierSelect").change(function () {
                me.loadMateriel({
                    properties: {
                        type: 'Z001'
                    }
                });
            });

            $("#stockSelect").change(function () {
                me.loadMateriel({
                    properties: {
                        type: 'Z001'
                    }
                });
            });

            $("#stockOut").change(function () {
                me.loadMateriel({
                    properties: {
                        type: 'Z001'
                    }
                });
                //获取门店所在的城市，用来筛选调入门店
            });

            $('body').on('click', '.prdChecked', function () {
                let ci = $(this).closest('ul').find('.checkInput');
                ci.val('');
                if (this.checked) {
                    ci.removeAttr('disabled');
                    ci.focus();
                } else {
                    ci.attr('disabled', 'true');
                    if (me.productCart[$(this).data('id')]) {
                        me.cartNum--;
                        $("#cartNumBadge").html(me.cartNum);
                    }
                    delete me.productCart[$(this).data('id')];
                }
            });


            $('body').on('change', '.checkInput', function () {
                if ($(this).val() > 0) {
                    let prdInfoData = $(this).closest('.prdInfo'),
                        id = $(this).data('id'),
                        unit = $(this).data('unit'),
                        unitrate = $(this).data('unitrate') || '1',
                        measureUnit = $(this).data('meunit') || '',
                        currency = $(this).data('currency') || '';
                    if (!me.productCart[id])
                        me.cartNum++;
                    else
                        delete  me.productCart[id];
                    me.productCart[id] = {
                        name: prdInfoData.find('.prdName').html(),
                        code: prdInfoData.find('.prdCode').html(),
                        material: prdInfoData.find('.prdCode').html(),
                        price: prdInfoData.find('.prdPrice').html(),
                        unit: unit,
                        currency: currency,
                        unitRate: unitrate,
                        measureUnit: measureUnit,
                        tax: 'J1',
                        quantity: $(this).val()
                    };
                    $("#cartNumBadge").html(me.cartNum);
                }
            });

            $(".nextStep").click(function () {
                let d = $(this).data('next');
                if (d == '1') {
                    me.curTabIdx++;
                } else if (d == '0') {
                    me.curTabIdx--;
                }

                $("#tab" + me.curTabIdx).tab('show');
            });
            $("#tab1").on('show.bs.tab', function (e) {
                me.curTabIdx = 1;
                me.footBtn();
                me.selectChange(true);
            });
            $('#tab3').on('show.bs.tab', function (e) {
                if (me.cartNum < 1) {
                    Dolphin.alert('请选择物料数据');
                    me.curTabIdx--;
                    me.footBtn();
                    return false;
                }
                me.selectChange(false);
                //判断购入门店的参数值
                if (me.orderType == '10') { //外部订单的话，取登录人的门店
                    me.orderData.procureCode = $("#supplyer").val();
                    $('#purchaseShop').attr('optionParam', '{"properties":{"code":"' + org.breezee.context.userData.shopCode + '"}}').empty();
                    Dolphin.form.parseSelect($('#purchaseShop'));
                } else if (me.orderType == '20') {
                    me.orderData.procureCode = $("#stockOut").val();
                    $('#purchaseShop').attr('optionParam', '{"properties":{"_cityShop":"' + me.orderData.procureCode + '"}}').empty();
                    Dolphin.form.parseSelect($('#purchaseShop'));
                } else if (me.orderType == '40') {
                    me.orderData.procureCode = $("#stockHouse").val();
                } else if (me.orderType == '30') {
                    me.orderData.procureCode = $("#stockHouse").val();
                    $('#purchaseShop').attr('optionParam', '{"properties":{"_cityShop":"' + me.orderData.procureCode + '"}}').empty();
                    Dolphin.form.parseSelect($('#purchaseShop'));
                }

                me.curTabIdx = 3;
                me.footBtn();
                let prd = [], total = 0;
                for (let k in me.productCart) {
                    prd.push(me.productCart[k]);
                    total += (me.productCart[k].price * me.productCart[k].quantity);
                }
                me._selectList.loadData({rows: prd});

                Dolphin.form.setValue($.extend(me.orderData, {
                    totalAmount: total.toFixed(2),
                    free: false,
                    org: '1000',
                    grp: '100',
                    currency: 'CNY'
                }), "#order-form");
                me.orderData.purchaseLines = prd;
            });

            $('#tab2').on('show.bs.tab', function (e) {
                me.curTabIdx = 2;
                me.footBtn();
                me.selectChange(true);
            });

            $(".btn_receive").click(function () {
                let rdf = Dolphin.form.getValue("#receive_form");
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        id: me.curPuraseId,
                        properties: {receive: "true"},
                        purchaseLines: rdf.receiveData
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderGrid.reload();
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

            $(".btn_delivery").click(function () {
                Dolphin.ajax({
                    url: '/api/7a85498f65ab4a18a35604bbdb1dd649',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        id: me.deliveryPuraseId,
                        properties: {delivery: "true"},
                        purchaseLines: me._deliveryList.data.rows
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._orderGrid.reload();
                            $("#dataModal3").modal('hide');
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

        /**
         * 上面的供应商，门店，总仓选择的input区域的隐藏与显示
         * @param enable
         */
        selectChange: function (enable) {
            if (enable) {
                $("#supplyer").removeAttr('disabled');
                $("#stockHouse").removeAttr('disabled');
                $("#stockOut").removeAttr('disabled');
            } else {
                $("#supplyer").attr('disabled', true);
                $("#stockHouse").attr('disabled', true);
                $("#stockOut").attr('disabled', true);
            }
        },

        initOrderGrid: function () {
            const me = this;
            this._orderGrid = new GRID({
                panel: '#dataList',
                url: '/api/fbbc247ea033447b9db0883366fc7c05',
                ajaxType: Dolphin.requestMethod.POST,
                childrenField: 'purchaseLines',
                queryParams: {},
                titleFormatter: function (data, index) {
                    let title = '';
                    title += '<span class="titleOrderNo">' + (this.opts.pageElements + index + 1) + '.</span>';
                    title += '<span style="margin: 0 5px;background-color: #FF6600;font-weight: 700;color: #fff;">' + Dolphin.enum.getEnumText('purchaseType', data.type) + '</span>';
                    title += (data.free ? '<em style="border: 1px solid;color: #0c60ee;">' + (data.free ? '免费' : '') + '</em>' : '');
                    title += '<span>订单号：' + (data.code || '待生成') + '</span>';
                    title += '<span>计划交货：' + data.deliveryDate + '</span>';

                    if (data.type == '10') {
                        title += '<span>供应商：' + data.procureCode + (data.procureName || '') + '</span>';
                        title += '<span>购入门店：' + data.storeCode + (data.shopName || '') + '</span>';
                    } else if (data.type == '20') {
                        title += '<span>转出门店：' + data.procureCode + (data.procureName || '') + '</span>';
                        title += '<span>购入门店：' + data.storeCode + (data.shopName || '') + '</span>';
                    } else if (data.type == '30') {
                        title += '<span>转出总仓：' + data.procureCode + (data.procureName || '') + '</span>';
                        title += '<span>购入门店：' + data.storeCode + (data.shopName || '') + '</span>';
                    } else if (data.type == '40') {
                        title += '<span>转出总仓：' + data.procureCode + (data.procureName || '') + '</span>';
                        title += '<span>转入总仓：' + data.storeCode + (data.shopName || '') + '</span>';
                    }

                    if (data.dn) {
                        title += '<span class="pull-right">提交时间：' + data.syncDate + '</span>';
                        title += '<span class="pull-right">SAP单号：' + data.dn + '</span>';
                    }
                    return title;
                },
                operationFormatter: function (data, index) {
                    return ""
                },
                columns: [{
                    code: 'image',
                    className: 'img',
                    width: '15%',
                    formatter: function (val, obj, data, index) {
                        return '<img class="img-responsive" style="width: 90px;" src="' + org.breezee.context.getImgSrc(val) + '" />';
                    }
                }, {
                    code: 'title',
                    className: 'info',
                    formatter: function (val, obj, data, index) {
                        let html = '';
                        html += '<div class="prt-remark unzhehang">' + obj.name + '</div>';
                        html += '<div class="prt-code">' + obj.material + '</div>';
                        return html;
                    }
                }, {
                    code: 'price',
                    className: 'price',
                    width: '160px',
                    formatter: function (val, obj, data, index) {
                        let html = '';
                        html += '<div>' + (val ? val : 0) + '</div>';
                        return html;
                    }
                }, {
                    code: 'quantity',
                    className: 'qtnCount',
                    width: '130px',
                    formatter: function (val, obj) {
                        let html = '';
                        html += '<div>' + (val ? val : 0) + " " + obj.unit + '</div>';
                        return html;
                    }
                }, {
                    code: 'receiveQuantity',
                    width: '110px',
                    textAlign: 'center',
                    className: 'info',
                    formatter: function (val, obj, data, index) {
                        let title = val || 0;
                        return title;
                    }
                }, {
                    code: 'deliveryQuantity',
                    width: '110px',
                    textAlign: 'center',
                    className: 'info',
                    formatter: function (val, obj, data, index) {
                        let title = val || 0;
                        return title;
                    }
                }, {
                    code: 'attr',
                    className: 'mergeCell',
                    merge: true,
                    width: '150px',
                    formatter: function (val, obj, data, objIndex, dataIndex) {
                        return "<div style='font-size: 13px;'>总金额:" + (data.totalAmount ? data.totalAmount.toFixed(2) : 0) + "</div>";
                    }
                }, {
                    code: 'status',
                    className: 'mergeCell',
                    merge: true,
                    width: '240px',
                    formatter: function (val, obj, data, objIndex, dataIndex) {
                        let html = "<div style='border-bottom: 1px solid #00CCFF;padding: 5px;'><span class='text-info'>" + data.statusName + "</span></div>" +
                            "<div style='padding: 5px'>";
                        if (data.type == '30' || data.type == '40') {
                            html += "<a class='btn btn-outline btn-circle btn-sm dark btn-delivery' " +
                                "href='javascript:void(0);' data-id='" + data.id + "' style='font-size: 12px;'>" +
                                "<i class='fa fa-share'></i>交货</a>";
                        }
                        html += "<a class='btn btn-outline btn-circle btn-sm purple btn-receive' " +
                            "href='javascript:void(0);' data-id='" + data.id + "' style='font-size: 12px;'>" +
                            "<i class='fa fa-check-square-o'></i>收货</a></div>";
                        html += "<a class='btn btn-outline btn-circle btn-sm purple btn-edit' " +
                            "href='javascript:void(0);' data-id='" + data.id + "' style='font-size: 12px;'>" +
                            "<i class='fa fa-check-square-o'></i>编辑</a></div>";
                        return html;
                    }
                }],
                onLoad: function () {
                    $(".btn-receive").click(function () {
                        me.curPuraseId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/80da5b20221f43308ae2a1b389b409e5@id=' + me.curPuraseId,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (reData) {
                                let dd = [];
                                $.each(reData.value.purchaseLines, function () {
                                    if (this.toQuantity) {
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


                    $(".btn-edit").click(function () {
                        me.curPuraseId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/80da5b20221f43308ae2a1b389b409e5@id=' + me.curPuraseId,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (reData) {
                                let dd = [];
                                $.each(reData.value.purchaseLines, function () {
                                    if (this.toQuantity) {
                                        dd.push(this);
                                    }
                                });
                                me._editList.loadData({rows: dd});
                                Dolphin.form.setValue(reData.value, '.edit-form');
                                $('#dataModal4').modal('show');

                            }
                        });
                    });



                    $(".btn-delivery").click(function () {
                        me.deliveryPuraseId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/80da5b20221f43308ae2a1b389b409e5@id=' + me.deliveryPuraseId,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (reData) {
                                let dd = [];
                                $.each(reData.value.purchaseLines, function () {
                                    if (this.toDelivery) {
                                        dd.push(this);
                                    }
                                });
                                me._deliveryList.loadData({rows: dd});
                                $("#dataModal3").modal({
                                    show: true,
                                    backdrop: 'static'
                                });
                            }
                        });
                    });
                }
            });
        },

        loadMateriel: function (typeData, type) {
            let me = this;
            $("#productList").empty();
            if (type != 'query') {
                this.productCart = {};
                this.cartNum = 0;
                $("#cartNumBadge").html(me.cartNum);
            }
            let supplier, sp = org.breezee.context.userData.shopCode;
            if (me.curClickType == '10') {
                supplier = $("#supplyer").val();
            } else {
                supplier = "";
            }
            if (me.curClickType == '30' || me.curClickType == '40') {
                sp = $("#stockHouse").val();
                if (!sp) {
                    return;
                }
            }
            Dolphin.ajax({
                // url: '/api/53afe452392f44b19d64ae88d1de7491',
                // type: Dolphin.requestMethod.POST,
                // data: Dolphin.json2string(typeData),
                url: '/api/2745ea263c994e688eac8ba1af6ae84a',
                data: Dolphin.json2string({
                    rule: "product",
                    mo: 'com.pcp.api.pms.service.IMaterielService',
                    endpoint: '035',
                    WERKS: sp.substr(0, 4),
                    LGORT: sp.substr(4),
                    LIFNR: supplier,
                    beanName: "com.pcp.api.pms.service.IMaterielService"
                }),
                loading: true,
                type: Dolphin.requestMethod.POST,
                success: function (data, textStatus) {
                    if (data.success) {
                        $.each(data.rows, function (i, value) {
                            $("#productList").append("<div class='col-md-4'>" +
                                "<div class='media'>" +
                                "<img class='d-flex mr-3' src='" + org.breezee.context.getImgSrc(value.image ? value.image : 'default.png') + "' alt='" + value.name + "'>" +
                                "<div class='media-body prdInfo'>" +
                                "<h5 class='mt-0 prdName'>" + value.name + "</h5>" +
                                "<div class='prdCode'>" + value.code + "</div>" +
                                "<div>" +
                                "<span class='prdPrice'>" + (value.price && Number(value.price).toFixed(2) || 0) + "</span><span>/" + value.unitRate + "</span>&nbsp;&nbsp;&nbsp;还余:0<span>" + (value.unit || '-') + "</span>" +
                                "</div>" +
                                "<ul class='list-inline' style='margin-top: 10px;display: flex;'>" +
                                "<li>" +
                                "<input type='checkbox'" + (me.productCart[value.id] ? "checked" : "") + " class='prdChecked' data-id='" + value.id + "'/>" +
                                "</li>" +
                                "<li>" +
                                "<div class='input-group' style='width: 65%;'>" +
                                "<input class='form-control checkInput' " +
                                "data-id='" + value.id + "' " +
                                "data-currency='" + (value.currency || '') + "' " +
                                "data-unitrate='" + (value.unitRate || '1') + "' " +
                                "data-meunit='" + (value.measureUnit || '') + "' " +
                                "data-unit='" + (value.unit || '') + "' placeholder=''" +
                                (me.productCart[value.id] ? "value=" + me.productCart[value.id].quantity : "disabled") +
                                " style='width:60px' type='number'/>" +
                                "<span class='input-group-addon prdUnit'>" + (value.unit || '-') + "</span>" +
                                "</div>" +
                                "</li>" +
                                "</ul>" +
                                "</div>" +
                                "</div>" +
                                "</div>");
                        });
                    } else {
                        $("#error_message").html(data.msg);
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },

        cartShow: function () {
            let me = this;
            me._selectList = new Dolphin.LIST({
                panel: "#selectList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'name',
                    title: '物料名称'
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '110px',
                    formatter: function (val, row) {
                        return val + ' ' + row.unit;
                    }
                }, {
                    code: 'price',
                    title: '价格',
                    width: '80px'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false
            });
        },

        footBtn: function () {
            let me = this;
            if (me.curTabIdx > 1) {
                $("#preStep").show();
            } else {
                $("#preStep").hide();
            }
            if (me.curTabIdx === 3) {
                $("#nextStep").hide();
                $("#saveBtn").show();
                $("#saveBtn2").show();
            } else {
                $("#nextStep").show();
                $("#saveBtn").hide();
                $("#saveBtn2").hide();
            }
        },

        receiveList: function () {
            this._receiveList = new Dolphin.LIST({
                panel: "#receiveList",
                idField: 'id',
                hover: false,
                title: '待收货物料',
                editFlag: true,
                editBtn:false,
                editListName:'receiveData',
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
                        return val + '_' + row.rowNum;
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
                    editType: 'number',
                    width: '110px'
                }, {
                    code: 'batchNo',
                    title: '批次号',
                    width: '110px'
                }, {
                    code: 'produceDate',
                    title: '生产日期',
                    width: '120px'
                }, {
                    code: 'endDate',
                    title: '到期日',
                    width: '120px'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false
            });
        },

        deliveryList: function () {
            this._deliveryList = new Dolphin.LIST({
                panel: "#deliveryList",
                idField: 'id',
                hover: false,
                title: '待收货物料',
                editFlag: true,
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
                        return val + '_' + row.rowNum;
                    }
                }, {
                    code: 'quantity',
                    title: '采购数量',
                    width: '110px',
                    formatter: function (val, row) {
                        return val + ' ' + row.unit;
                    }
                }, {
                    code: 'deliveryQuantity',
                    title: '已交货数量',
                    width: '110px',
                    formatter: function (val, row) {
                        return val ? val : '0';
                    }
                }, {
                    code: 'toDelivery',
                    title: '交货数量',
                    editType: 'number',
                    width: '110px'
                }, {
                    code: 'deliveryNo',
                    title: '批次号',
                    width: '110px'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false
            });
        },

        editList: function () {
            this._editList = new Dolphin.LIST({
                panel: "#editList",
                idField: 'id',
                hover: false,
                title: '采购订单',
                editFlag: true,
                columns: [{
                    code: 'material',
                    title: '物料编码',
                    width: '200px',
                }, {
                    code: 'name',
                    title: '物料名称',
                    width: '200px',

                },{
                    code: 'quantity',
                    title: '采购数量',
                    width: '200px',
                },],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false
            })
        }

    };
});