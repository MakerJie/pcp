'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS([""],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            this.initEvent();
            this.initDataList();
            this.timeRuleList();
            this.scopeRuleList();
             this.shopSelectList();
             this.userDataList();
             this.couponSentList();
            Dolphin.form.parse("#query_form");
            Dolphin.form.parse("#data_form");
            Dolphin.form.parse("#user_query_form");
            this.uploading = false;
            let me = this;
            let ldrfy = $('#largeThum').dropify();
            ldrfy.on('dropify.fileReady', function (event, element) {
                let form = $('#largImageFormSub');
                form.attr('target', '_self');
                $.ajax({
                    url: (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + "/file/",
                    type: 'POST',
                    cache: false,
                    data: new FormData(form[0]),
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        me.uploading = true;
                    },
                    success: function (data) {
                        me.uploading = false;
                        $("#largeThumHidden").val(data);

                    }
                });
            });
            let smrfy = $('#smallThum').dropify();
            smrfy.on('dropify.fileReady', function (event, element) {
                var form = $('#smallImageFormSub');
                form.attr('target', '_self');
                $.ajax({
                    url: (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + "/file/",
                    type: 'POST',
                    cache: false,
                    data: new FormData(form[0]),
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        me.uploading = true;
                    },
                    success: function (data) {
                        me.uploading = false;
                        $("#smallThumHidden").val(data);

                    }
                });
            });
            this.tmpEl = null;
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                Dolphin.form.empty("#data_form");
                $("#remindCheck").attr('checked', true);
                $("#donationCheck").attr('checked', true);
                me._scopeRuleList.empty();
                me._timeRuleList.empty();
                $("#remindCheck").removeAttr('checked');
                $("#ownUseCheck").removeAttr('checked');
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $(".btn_saveRule").click(function () {
                let typeObject = me._dataList.getChecked()[0];
                let hh = me._timeRuleList.data.rows;
                let mm = me._scopeRuleList.data.rows;
                typeObject.couponTimeRuleLines = hh;
                typeObject.couponScopeRuleLines = mm;
                typeObject.properties = {
                    _saveRule: 1
                };
                Dolphin.ajax({
                    url: '/api/000b2c41804b476884555b87fe6a2fd5',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(typeObject),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#ruleDataModal').modal('hide');
                            Dolphin.alert("保存成功！");
                        } else {
                            $("#error_message_div").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message_div").html('系统出错，请联系管理员');
                    }
                });
            });

            $('.btn_save').click(function () {
                let dd = Dolphin.form.getValue("#data_form");
                if (dd.remind)
                    dd.remind = true;
                else
                    dd.remind = false;
                if (dd.donation)
                    dd.donation = true;
                else
                    dd.donation = false;
                if (dd.ownUse)
                    dd.ownUse = true;
                else
                    dd.ownUse = false;
                if (dd.activeDate)
                    dd.activeDate = dd.activeDate + " 00:00:00";
                if (dd.expireDate)
                    dd.expireDate = dd.expireDate + " 00:00:00";
                Dolphin.ajax({
                    url: '/api/000b2c41804b476884555b87fe6a2fd5',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(dd),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#dataModal').modal('hide');
                            Dolphin.form.empty("#userForm");
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

            $(".btn_product_select").click(function () {
                let ch = me._productList.getChecked(), prds = [];
                for (let i = 0; i < ch.length; i++) {
                    prds.push(ch[i].code);
                }
                if (prds.length > 0) {
                    me.tmpEl.val(prds.join(','));
                    me.tmpEl.closest('tr').data('data').product = prds.join(',');
                    me.tmpEl.closest('tr').data('data').exProduct = prds.join(',');
                    $("#productDataModal").modal('hide');
                }
            });
            $(".btn_shop_select").click(function () {
                let ch = me._shopList.getChecked(), prds = [];
                for (let i = 0; i < ch.length; i++) {
                    prds.push(ch[i].code);
                }
                if (prds.length > 0) {
                    me.tmpEl.val(prds.join(','));
                    me.tmpEl.closest('tr').data('data').shopCode = prds.join(',');
                    me.tmpEl.closest('tr').data('data').exShopCode = prds.join(',');
                    $("#shopDataModal").modal('hide');
                }
            });

            $(".btn_send").click(function () {
                if (me._dataList.getChecked().length == 0) {
                    Dolphin.alert('请选择一个优惠券类型');
                    return;
                }
                $("#userDataModal").modal('show');
            });

            $(".btn_user_send").click(function () {
                let tye = me._dataList.getChecked()[0];
                if (tye.status != 1) {
                    Dolphin.alert('所选择的优惠券状态异常，不可下发');
                    return;
                }
                let uqd = Dolphin.form.getValue("#user_query_form");
                let usd = me._userDataList.getChecked(), users = [];
                for (let i = 0; i < usd.length; i++) {
                    users.push(usd[i].cardNo);
                }
                if ($(this).data('send') == '2') {
                    uqd['_condition'] = 1;
                } else {
                    uqd = {};
                }
                let psd = {
                    userId: users.join(','),
                    couponType: {
                        id: me._dataList.getChecked()[0].id
                    },
                    properties: uqd
                };
                me.sendCoupon(psd, function (reData) {
                    if (reData.success) {
                        Dolphin.alert('下发成功');
                        $("#userDataModal").modal('hide');
                        me._dataList.reload();
                    } else {
                        Dolphin.alert('下发失败:' + reData.msg);
                    }
                })
            });

            $("#typeLimitSelect").change(function () {
                let v = $(this).val(),
                    df = $("#dayAfterForm"), af = $("#dayAreaForm");
                df.addClass('hidden');
                af.addClass('hidden');
                if (v == '2' || v == '3') {
                    df.removeClass('hidden');
                } else if (v == '4') {
                    af.removeClass('hidden');
                }
            });

            $(".btn_user_query").click(function () {
                let data = Dolphin.form.getValue("#user_query_form");

                console.log("dsafsad", data);
                data.birthday_like = "";
                if (data.birMonStr != "" && data.birMonStr != null) {
                    data.birthday_like = "-" + data.birMonStr + "-";
                }
                if (data.birDayStr != "" && data.birDayStr != null) {
                    data.birthday_like += data.birDayStr + " ";
                }


                if (data.userTag_like != null && data.userTag_like != "") {
                    let tag = data.userTag_like;
                    data.userTag_like = tag.join();
                }

                if (data.preference_like != null && data.preference_like != "") {
                    let prefer = data.preference_like;
                    data.preference_like = prefer.join();
                }
                data.province = Dolphin.enum.getEnumText("chinaRegion", data.province);
                me._userDataList.load(null, data);
            });

            $(".foodFaver").select2({
                selectOnClose: false,
                allowClear: true
            });
            $(".tagSelect").select2({
                selectOnClose: false,
                allowClear: true
            });

            $("#selectProvince").on("change", function () {
                let module2 = $(this).val();
                $("#selectCity").empty();
                $("#selectCity").append("<option value=''>" + "--请选择--" + "</option>");
                $.each(Dolphin.enum.getEnum("chinaCity"), function () {
                    if (this.logName == module2) {
                        let optionStr2 = "<option value=" + this.code + ">" + this.name + "</option>";
                        $("#selectCity").append(optionStr2);
                    }
                });
            });

            $(".btn_employee").click(function () {
                if (me._dataList.getChecked().length == 0) {
                    Dolphin.alert('请选择一个优惠券类型');
                    return;
                }
                $("#employeeModal").modal({
                    show: true,
                    backdrop: 'static'
                });
            });

            $("#btn_save_employeeFile").click(function () {
                let btn = $(this);
                btn.attr('disabled', true);
                let usd = me.employeeUpload.data.rows, users = [];
                for (let i = 0; i < usd.length; i++) {
                    users.push(usd[i].cardNo);
                }
                let psd = {
                    userId: users.join(','),
                    couponType: {
                        id: me._dataList.getChecked()[0].id
                    },
                };
                me.sendCoupon(psd, function (reData) {
                    if (reData.success) {
                        Dolphin.alert('下发成功');
                        $("#employeeModal").modal('hide');
                        me._dataList.reload();
                    } else {
                        Dolphin.alert('下发失败:' + reData.msg);
                        btn.removeAttr('disabled');
                    }
                })
            });
        },

        sendCoupon: function (data, cb) {
            Dolphin.ajax({
                url: '/api/9eb1af9f6cb54a1abac6b199cbd506b8',
                type: Dolphin.requestMethod.POST,
                data: Dolphin.json2string(data),
                success: function (reData, textStatus) {
                    cb(reData);
                },
                onError: function () {
                    Dolphin.alert('系统错误，请联系管理员');
                }
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'smallImage',
                    title: '小图',
                    width: '100px',
                    formatter: function (val, obj, data, index) {
                        return '<img class="img-responsive" style="width: 60px;" src="' + org.breezee.context.getImgSrc(val) + '" />';
                    }
                }, {
                    code: 'couponType',
                    title: '优惠券类型',
                    width: '150px',
                    formatter: function (val, row) {
                        if (val != null && val != "") {
                            return Dolphin.enum.getEnumText("couponType", val);
                        }
                        return "-";
                    }
                }, {
                    code: 'name',
                    title: '券名称',
                }, {
                    code: 'createTime',
                    title: '创建日期',
                    width: '190px'
                }, {
                    code: 'sentNum',
                    title: '下发',
                    with: '160px',
                    formatter: function (val) {
                        return val || '-';
                    }
                }, {
                    code: 'verifyNum',
                    title: '核销',
                    with: '160px',
                    formatter: function (val) {
                        return val || '-';
                    }
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '90px'
                }, {
                    code: 'id',
                    title: '券明细',
                    width: '150px',
                    formatter: function (val, row) {
                        return '<a class="btn btn-outline btn-circle btn-sm black btn-coupon-detail" ' +
                            'href="javascript:void(0);" ' +
                            'data-id="' + row.id + '" data-name="' + row.name + '" style="font-size: 12px;">' +
                            '<i class="fa fa-check"></i>下发历史</a>';
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({
                                id: row.id
                            }) + org.breezee.buttons.del({
                                id: row.id
                            }) + '<a class="editRuleBtn" ' +
                            'data-id="' + row.id + '" href="javascript:void(0);">' +
                            '<i class="fa fa-cube"></i></a>';
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/002e17f5d8e24e918c2ddb5ad706deb4',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('c2ddb06deb5ad7e2047f5d802e1e9184', 'id', function (data) {
                        if (data.value.largeImage) {
                            $("#largeThum").closest('.dropify-wrapper').find('.dropify-render').find('img').attr('src', org.breezee.context.getImgSrc(data.value.largeImage));
                        }
                        if (data.value.smallImage) {
                            $("#smallThum").closest('.dropify-wrapper').find('.dropify-render').find('img').attr('src', org.breezee.context.getImgSrc(data.value.smallImage));
                        }
                        if (data.value.remind)
                            $("#remindCheck").attr('checked', true);
                        else
                            $("#remindCheck").removeAttr('checked');

                        if (data.value.donation)
                            $("#donationCheck").attr('checked', true);
                        else
                            $("#donationCheck").removeAttr('checked');

                        if (data.value.ownUse)
                            $("#ownUseCheck").attr('checked', true);
                        else
                            $("#ownUseCheck").removeAttr('checked');

                        $("#typeLimitSelect").change();

                        $('#dataModal').modal('show');
                    });
                    org.breezee.buttons.delCallback('a9f75ec4af3911e7abc4cec278b6b50a',function (data) {
                        $('.btn_query').click();
                    });
                    $(".editRuleBtn").click(function () {
                        $("#typeId").val($(this).data('id'));
                        let foreignId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/c2ddb06deb5ad7e2047f5d802e1e9184@id=' + foreignId,
                            type: Dolphin.requestMethod.GET,
                            loading: true,
                            onSuccess: function (reData) {
                                me._scopeRuleList.loadData({rows: reData.value.couponScopeRuleLines});
                                me._timeRuleList.loadData({rows: reData.value.couponTimeRuleLines});
                                $('#ruleDataModal').modal({
                                    show: true,
                                    backdrop: 'static'
                                })
                            }
                        });
                    });

                    $(".btn-coupon-detail").click(function () {
                        let typeId = $(this).data('id');
                        $("#couponTitle").html($(this).data('name'));
                        $("#couponDataModal").modal('show');
                        me._couponDataList.load(null, {
                            couponType_id_obj_ae: typeId
                        })
                    });
                },
                onClick: function (data) {
                    me.curSaverTicket = data.code;
                    me.curSaverTicket2 = data.id;
                },
            });
        },

        timeRuleList: function () {
            const me = this;
            this._timeRuleList = new Dolphin.LIST({
                panel: "#timeRuleList",
                idField: 'id',
                hover: false,
                queryParams: {},
                editFlag: true,
                editBtn: true,
                addBtn: true,
                panelType: 'panel-warning',
                columns: [{
                    code: 'weekDay',
                    title: '星期',
                    editType: 'select',
                    options: 'weekDay',
                    width: '140px'
                }, {
                    code: 'startTime',
                    title: '开始时间',
                    editType: 'timepicker'
                }, {
                    code: 'endTime',
                    title: '结束时间',
                    editType: 'timepicker'
                }],
                multiple: false,
                rowIndex: false,
                checkbox: false,
                data: {rows: [{}]},
                pagination: false,
                onLoadSuccess: function () {

                },
                onAddRow: function () {
                    $('.clockpicker').clockpicker({
                        donetext: 'OK',
                        appendElement: $("#ruleDataModal")
                    });
                }
            })
        },

        scopeRuleList: function () {
            const me = this;
            this._scopeRuleList = new Dolphin.LIST({
                panel: "#scopeRuleList",
                idField: 'id',
                hover: false,
                queryParams: {},
                editFlag: true,
                editBtn: true,
                addBtn: true,
                panelType: 'panel-warning',
                columns: [{
                    code: 'saleMethod',
                    title: '销售方式',
                    width: '100px',
                    editType: 'select',
                    options: 'sellMethod'
                }, {
                    code: 'brand',
                    title: '品牌',
                    width: '100px',
                    editType: 'select',
                    options: 'brandSelect'
                }, {
                    code: 'shopCode',
                    title: '适用门店',
                    editType: 'popup',
                    width: '150px'
                }, {
                    code: 'exShopCode',
                    title: '不适用门店',
                    editType: 'popup',
                    width: '130px'
                }, {
                    code: 'category1',
                    title: '大品类',
                    width: '130px'
                }, {
                    code: 'category2',
                    title: '小品类',
                    width: '130px'
                }],
                multiple: false,
                rowIndex: false,
                checkbox: false,
                data: {rows: [{}]},
                pagination: false,
                onLoadSuccess: function () {

                },
                onAddRow: function () {
                    $(".btn_col_shopCode, .btn_col_exShopCode").click(function () {
                        me.tmpEl = $(this).parent().parent().children('input');
                        $("#shopDataModal").modal('show');
                    })
                }
            })
        },


        shopSelectList: function () {
            const me = this;
            me._shopList = new Dolphin.LIST({
                panel: "#shopList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'code',
                    title: '门店编码',
                    width: '120px'
                }, {
                    code: 'dn',
                    title: 'POS编码',
                    width: '120px'
                }, {
                    code: 'name',
                    title: '门店名称'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/445a2ba90204414387ba30a336f016b6',
                pagination: true
            });
        },

        userDataList: function () {
            const me = this;
            me._userDataList = new Dolphin.LIST({
                panel: "#userDataList",
                idField: 'id',
                hover: false,
                queryParams: {
                    _count: 1
                },
                columns: [{
                    code: 'cardNo',
                    title: '会员卡号',
                    width: '120px'
                }, {
                    code: 'mobile',
                    title: '联系手机',
                    width: '120px'
                }, {
                    code: 'realName',
                    title: '真实姓名'
                }, {
                    code: 'cardLevel',
                    title: '卡等级',
                    width: '110px',
                    formatter: function (val) {
                        return '<span>' + Dolphin.enum.getEnumText('userLevel', val) + '</span>';
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/41d7222ba7f246ceb33daaa4e5c97a0e',
                pagination: true
            });
        },

        couponSentList: function () {
            const me = this;
            me._couponDataList = new Dolphin.LIST({
                panel: "#couponSentList",
                idField: 'id',
                hover: false,
                queryParams: {
                    pageSize: 1000
                },
                columns: [{
                    code: 'code',
                    title: '下发编码',
                    width: '150px'
                }, {
                    code: 'creator',
                    title: '下发人',
                    width: '150px'
                }, {
                    code: 'quantity',
                    title: '下发数量',
                    width: '150px'
                }, {
                    code: 'createTime',
                    title: '下发时间',
                    width: '150px'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/d48a833914b34114a3e864e7f89fbd20',
                pagination: false
            });
        },

    };
});