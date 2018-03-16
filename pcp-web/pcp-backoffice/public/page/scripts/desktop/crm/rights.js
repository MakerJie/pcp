"use strict";
$(function () {

    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            Dolphin.form.parseSelect($(".authorityType"));
            Dolphin.form.parseSelect($(".couponSelect"));
        },

        initEvent: function () {
            let me = this;
            $('.btn_add').click(function () {
                $("input[type=checkbox]").removeAttr("checked");
                Dolphin.form.empty("#data_form");
                $("#pointValue").val('');
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $(".btn_save").click(function () {
                let data = Dolphin.form.getValue("#data_form"), extend = {};
                let cc = $("#cardLevelSelect").find("input[type='checkbox']:checked");
                let tt = [];
                for (let i = 0; i < cc.length; i++) {
                    tt.push($(cc[i]).val());
                }
                extend.cardLevel = tt.join(",");
                extend.pointValue = $("#pointValue").val();
                let cs = $(".couponRow"), couponSel = [], row;
                for (let n = 0; n < cs.length; n++) {
                    row = $(cs[n]);
                    if (row.find('.numInput').val()) {
                        couponSel.push(row.find('select').val() + "," + row.find('.numInput').val() + "," + row.find('.totalInput').val());
                    }
                }
                extend.coupons = couponSel.join(";");
                let ed = $("#exData").data();
                extend.rule = ed.rule;
                extend.text = $("#rightDescription").html();
                data.rule = extend;
                if (data.beginTime)
                    data.beginTime = data.beginTime + " 00:00:00";
                if (data.endTime)
                    data.endTime = data.endTime + " 23:59:59";
                Dolphin.ajax({
                    url: '/api/5436ea7d3c043f29dbdaf4df2c079741',
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
                if (v == 1 || v == 4) {
                    $("input[type=checkbox]").attr("disabled", true).removeAttr("checked");
                } else {
                    $("input[type=checkbox]").removeAttr("disabled");
                }
                if (v == 6 || v == 7) {
                    $("#pointValue").attr('disabled', true);
                } else {
                    $("#pointValue").removeAttr("disabled");
                }
                if (v == 1 || v == 6) {
                    $("#rightDescription").html('');
                    return;
                }
                if (v) {
                    $(".btn_conf").data('type', v);
                    $("#extendModal").modal('show');
                    $(".atype").hide();
                    $("#type" + v).show();
                }
            });

            $(".btn_conf").click(function () {
                let t = $(this).data('type');
                if (t == 3) {
                    $("#rightDescription").html('距离生日前' + ($('#birthDayAhead').val()) + '天进行发放');
                    $("#exData").data('rule', $('#birthDayAhead').val());
                } else if (t == 4) {
                    $("#rightDescription").html($("#cardChange").find("option:selected").text());
                    $("#exData").data('rule', $('#cardChange').val());
                } else if (t == 5) {
                    $("#rightDescription").html($("#firstConsume").find("option:selected").text());
                    $("#exData").data('rule', $('#firstConsume').val());
                } else if (t == 2) {
                    let cc = $("#type2").find("input[type='checkbox']:checked");
                    let rr = ["", "我想参加", "菜品偏好", "是否爱品酒", "标签", "是否育有萌宝"], tt = [], vv = [];
                    for (let i = 0; i < cc.length; i++) {
                        tt.push(rr[$(cc[i]).val()]);
                        vv.push($(cc[i]).val());
                    }
                    $("#rightDescription").html("完善信息：" + tt.join(","));
                    $("#exData").data('rule', vv.join(','));
                } else if (t == 7) {
                    let cc = $("#type7").find("input[type='checkbox']:checked");
                    let rr = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"], tt = [], vv = [];
                    for (let i = 0; i < cc.length; i++) {
                        tt.push(rr[$(cc[i]).val()]);
                        vv.push($(cc[i]).val());
                    }
                    $("#rightDescription").html("完善信息：" + tt.join(","));
                    $("#exData").data('rule', vv.join(','));
                } else if (t == 8) {
                    $("#rightDescription").html("每" + $("#monthKeep").val() + "月消费" + $("#countKeep").val() + "次");
                    $("#exData").data('rule', $('#monthKeep').val() + "/" + $("#countKeep").val());
                }
                $("#exData").data('text', $("#rightDescription").html());
                $("#extendModal").modal('hide');
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
                    title: '权益名称',
                    width: '190px'
                }, {
                    code: 'type',
                    title: '权益类别',
                    width: '200px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("authorityType", val);
                    }
                }, {
                    code: 'detail',
                    title: '权益内容'
                }, {
                    code: 'beginTime',
                    title: '权益时效',
                    width: '220px',
                    formatter: function (val, row) {
                        if (row.beginTime != "" && row.beginTime != null) {
                            return (row.beginTime.substr(0, 10) + " ~ " + row.endTime.substr(0, 10));
                        } else {
                            return "-";
                        }
                    }
                }, {
                    code: 'updateTime',
                    title: '更新时间',
                    width: '160px'
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
                url: '/api/7c0e82d19b4d48d0f50a842f58f9c42e',
                pagination: true,
                onLoadSuccess: function (data) {
                    org.breezee.buttons.editCallback('6a37db4709bf189e5a4c8f0b223433ab', 'id', function (data) {
                        Dolphin.form.empty("#data_form");
                        $("#rightDescription").html('');
                        if (data.value.beginTime) {
                            data.value.beginTime = data.value.beginTime.substr(0, 10);
                        }
                        if (data.value.endTime) {
                            data.value.endTime = data.value.endTime.substr(0, 10);
                        }
                        Dolphin.form.setValue(data.value, '#data_form');
                        $("#atypeSelect").change();
                        $("#extendModal").modal('hide');
                        let ext = data.value.rule;
                        if (ext) {
                            if (ext.cardLevel) {
                                let cl = ext.cardLevel.split(",");
                                for (let i = 1; i < 5; i++) {
                                    document.getElementById("checkbox" + i).checked = false;
                                }
                                for (let i = 0; i < cl.length; i++) {
                                    document.getElementById("checkbox" + cl[i]).checked = true;
                                }
                            }
                            if (ext.text) {
                                $("#rightDescription").html(ext.text);
                            }
                            if (ext.pointValue) {
                                $("#pointValue").val(ext.pointValue);
                            } else {
                                $("#pointValue").val(ext.pointValue);
                            }
                            $("#exData").data('rule', ext.rule);
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
                        $("#dataModal").modal('show');
                    });
                    org.breezee.buttons.delCallback('6a37db4709bf189e5a4c8f0b223433ab', 'id', function (data) {
                        $('.btn_query').click();
                    });
                },
                onClick: function (data) {

                }
            });
        }
    };
});