"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            this.shopSelectList();
            this.rewardUserList();
            Dolphin.form.parseSelect($(".couponSelect"));
            Dolphin.form.parseSelect($("#qrSelect"));
            Dolphin.form.parse("#data_form");
            Dolphin.form.parse("#query_form");

            this.select2();

        },

        select2: function () {
            $(".select2").select2();
        },

        initEvent: function () {
            let me = this;

            $('.btn_add').click(function () {
                $("input[type=checkbox]").removeAttr("checked");
                Dolphin.form.empty("#data_form");
                $(".select2").val(null).trigger('change');
                $("#pointValue").val('');
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $(".btn_save").click(function () {
                let data = Dolphin.form.getValue("#data_form"), extend = {}, users = {}, orders = {};
                //设置会员查询条件
                if (data.type != 1) { //不是入会活动
                    let cc = $("#cardLevelSelect").find("input[type='checkbox']:checked");
                    let tt = [];
                    for (let i = 0; i < cc.length; i++) {
                        tt.push($(cc[i]).val());
                    }
                    users.cardLevel = tt.join(",");
                    users.sex = data.sex;
                    users.constellation = data.constellation;
                    users.userTag = data.userTag;
                    users.preference = data.preference;
                    users.tasting = data.tasting;
                    users.wantArea = data.wantArea;
                    users.joinYear = data.joinYear;
                    users.birthMonth = data.birthMonth;

                    if (data.type == 3) {
                        orders.shopCode = data.shopCode;
                        orders.period = data.period;
                        orders.payAmount = data.payAmount;
                        orders.productCode = data.productCode;
                        orders.payCode = data.payCode;
                    } else {
                        orders = {};
                    }
                } else {
                    users = {};
                }
                //---
                extend.pointValue = $("#pointValue").val();
                extend.toCard = $("#toCardSel").val();
                let cs = $(".couponRow"), couponSel = [], row;
                for (let n = 0; n < cs.length; n++) {
                    row = $(cs[n]);
                    if (row.find('.numInput').val()) {
                        couponSel.push(row.find('select').val() + "," + row.find('.numInput').val() + "," + row.find('.totalInput').val());
                    }
                }
                extend.coupons = couponSel.join(";");
                extend.users = users;
                extend.orders = orders;
                data.rule = extend;
                if (data.beginTime)
                    data.beginTime = data.beginTime + " 00:00:00";
                if (data.endTime)
                    data.endTime = data.endTime + " 23:59:59";
                console.log(data, '--------------');
                Dolphin.ajax({
                    url: '/api/04e33fd9fc744fb099623f49c9982ee2',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $("#dataModal").modal('hide');
                            $('.btn_query').click();
                        }
                    },
                    onError: function () {
                    }
                });
            });

            $("#atypeSelect").change(function () {
                let v = $(this).val();
                if (v == 1) {
                    $(".qcondion").hide();
                    $(".order").hide();
                    $("#toCardDiv").show();
                } else {
                    if (v == 3) {
                        $(".order").show();
                    } else {
                        $(".order").hide();
                    }
                    $(".qcondion").show();
                    $("#toCardDiv").hide();
                }
            });

            $(".btn_col_product").click(function () {
                me.tmpEl = $(this).parent().parent().children('input');
                $("#productDataModal").modal('show');
            });
            $(".btn_col_shopCode").click(function () {
                me.tmpEl = $(this).parent().parent().children('input');
                $("#shopDataModal").modal('show');
            });

            $(".btn_product_select").click(function () {
                let ch = me._productList.getChecked(), prds = [];
                for (let i = 0; i < ch.length; i++) {
                    prds.push(ch[i].dn);
                }
                if (prds.length > 0) {
                    me.tmpEl.val(prds.join(','));
                    $("#productDataModal").modal('hide');
                }
            });
            $(".btn_shop_select").click(function () {
                let ch = me._shopList.getChecked(), prds = [];
                for (let i = 0; i < ch.length; i++) {
                    prds.push(ch[i].dn);
                }
                if (prds.length > 0) {
                    me.tmpEl.val(prds.join(','));
                    $("#shopDataModal").modal('hide');
                }
            });

            $(".btn_shop_query").click(function () {
                me._shopList.load(null, {
                    name_like: $("#shopName").val()
                })
            });

            $(".btn_prd_query").click(function () {
                me._productList.load(null, {
                    name_like: $("#prdName").val()
                })
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
                    title: '活动名称',
                    width: '190px'
                }, {
                    code: 'type',
                    title: '活动类别',
                    width: '120px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("activityType", val);
                    }
                }, {
                    code: 'qrcodeInfo.name',
                    title: '二维码名称',
                    width: '150px',
                    formatter: function (val) {
                        return val ? val : '---';
                    }
                }, {
                    code: 'qrcodeInfo.qrUrl',
                    title: '二维码',
                    width: '120px',
                    formatter: function (val, row) {
                        return val ? '<img class="img-responsive" style="width: 70px;" src="' + val + '" />' : '---';
                    }
                }, {
                    code: 'detail',
                    title: '活动内容'
                }, {
                    code: 'beginTime',
                    title: '活动时效',
                    width: '220px',
                    formatter: function (val, row) {
                        let ht = [];
                        if (row.beginTime) {
                            ht.push(row.beginTime.substr(0, 10));
                        }
                        if (row.endTime) {
                            ht.push("~");
                            ht.push(row.endTime.substr(0, 10));
                        }
                        if (ht.length === 0) {
                            ht.push("-");
                        }
                        return ht.join('');
                    }
                }, {
                    code: 'count',
                    title: '参与次数',
                    width: '90px',
                    formatter: function (val, row) {
                        return val ? ('<a href="javascript:void(0);" class="rel-user" data-id="' + row.id + '">' + val + '</a>') : '-';
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({
                                id: row.id
                            }) + org.breezee.buttons.del({
                                id: row.id
                            });
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/04e45a9e0a45443fbfa3d1bbd36f00f4',
                pagination: true,
                onLoadSuccess: function (data) {
                    org.breezee.buttons.editCallback('04f4bead73e84a27be0e53cdb75d709f', 'id', function (data) {
                        Dolphin.form.empty("#data_form");
                        if (data.value.beginTime)
                            data.value.beginTime = data.value.beginTime.substr(0, 10);
                        if (data.value.endTime)
                            data.value.endTime = data.value.endTime.substr(0, 10);

                        let ext = data.value.rule;
                        if (ext) {
                            console.log(ext.users);
                            if (ext.users) {
                                if (ext.users.cardLevel) {
                                    let cl = ext.users.cardLevel.split(",");
                                    for (let i = 0; i < cl.length; i++) {
                                        $("#checkbox" + cl[i]).attr("checked", true);
                                    }
                                } else {
                                    $("#cardLevelSelect").find("input[type='checkbox']").removeAttr('checked');
                                }
                                $("#constellationSel").val(ext.users.constellation).trigger('change');
                                $("#userTagSel").val(ext.users.userTag).trigger('change');
                                $("#preferenceSel").val(ext.users.preference).trigger('change');
                                $("#birthMonthSel").val(ext.users.birthMonth).trigger('change');
                                $("#tastingSel").val(ext.users.tasting);
                                $("#sexSel").val(ext.users.sex);
                                $("#wantAreaSel").val(ext.users.wantArea);
                                $("#joinYearIn").val(ext.users.joinYear);
                            }
                            if (ext.orders) {
                                $("#shopCode").val(ext.orders.shopCode);
                                $("#periodSel").val(ext.orders.period).trigger('change');
                                $("#payAmountIn").val(ext.orders.payAmount);
                                $("#productCode").val(ext.orders.productCode);
                                $("#payCodeSel").val(ext.orders.payCode).trigger('change');
                            }
                            if (ext.pointValue)
                                $("#pointValue").val(ext.pointValue);
                            else
                                $("#pointValue").val('');
                            if(ext.toCard){
                                $("#toCardSel").val(ext.toCard);
                            } else {
                                $("#toCardSel").val('');
                            }
                            let coup = ext.coupons;
                            if (coup) {
                                let cpp = coup.split(";"), cppp, cr;
                                for (let i = 0; i < cpp.length; i++) {
                                    cppp = cpp[i].split(",");
                                    cr = $('.couponRow' + i);
                                    cr.find('select').val(cppp[0]);
                                    cr.find('.numInput').val(cppp[1]);
                                    cr.find('.totalInput').val(cppp[2]);
                                }
                            }
                        }
                        Dolphin.form.setValue(data.value, '#data_form');
                        $("#atypeSelect").change();
                        $("#dataModal").modal('show');
                    });
                    org.breezee.buttons.delCallback('1fd8e4097d374b2bb4760051f930c636', 'id', function (data) {
                        $('.btn_query').click();
                    });
                    $(".rel-user").click(function () {
                        me._rewardUserList.load(null, {
                            reward_id_obj_ae: $(this).data('id')
                        });
                        $("#relUserWin").modal('show');
                    });
                },
                onClick: function (data) {

                }
            });
        },

        shopSelectList: function () {
            const me = this;
            me._shopList = new Dolphin.LIST({
                panel: "#shopList",
                idField: 'id',
                hover: false,
                queryParams: {
                    pageSize: 1000
                },
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
                pagination: false
            });
        },

        rewardUserList: function () {
            const me = this;
            me._rewardUserList = new Dolphin.LIST({
                panel: "#rewardUserList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'createTime',
                    title: '关注时间',
                    width: '190px'
                }, {
                    code: 'userName',
                    title: '会员名称',
                    width: '150px'
                }, {
                    code: 'userMobile',
                    title: '会员手机',
                    width: '140px'
                }, {
                    code: 'userCard',
                    title: '会员卡号'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/befde1e32b7f42858c74614f062dabe7',
                pagination: true
            });
        }
    };
});
