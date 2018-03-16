/**
 * Created by wang,junjie on 2017/8/7.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            Dolphin.form.parse("#data_form");
            Dolphin.form.parse("#query_form");
            this.curQrcode = null;
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                console.log('add button click....');
                Dolphin.form.empty("#data_form");
                $("#imageRemark").show();
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let dd = Dolphin.form.getValue("#data_form");
                dd.crmChannel = 'wechat';
                Dolphin.ajax({
                    url: '/api/36c019abf27f4a33b67d6b0fc58ed889',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(dd),
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

            $(".btn_gen_qrcode").click(function () {
                let type = $(this).data('type');
                Dolphin.ajax({
                    url: '/wechat/qrcode?type=' + type,
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        scene_str: me.curQrcode.code + "|" + me.curQrcode.params
                    }),
                    success: function (reData, textStatus) {
                        console.log(reData);
                        if (reData.success) {
                            if (type == 'snsapi_base') {
                                $("#barTicketH").val(reData.value.ticket);
                                $("#qrUrlH").val("https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + reData.value.ticket);
                                $("#barImage").attr("src", "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + reData.value.ticket);
                            } else if (type == 'snsapi_userinfo') {
                                $("#qrUrlH").val(reData.value.ticket);
                                $("#barImage").attr("src", reData.value.ticket);
                            }
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
                    code: 'qrUrl',
                    title: '二维码',
                    width: '150px',
                    formatter: function (val) {
                        return '<img class="img-responsive" style="width: 70px;" src="' + val + '" />';
                    }
                }, {
                    code: 'name',
                    title: '二维码名称',
                    width: '150px',

                }, {
                    code: 'type',
                    title: '授权方式',
                    width: '150px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("qrcodeType", val);
                    }
                }, {
                    code: 'params',
                    title: '自定义参数',
                    width: '150px',
                    formatter: function (val) {
                        return val || '-';
                    }
                }, {
                    code: 'createTime',
                    title: '创建时间',
                    width: '190px'
                }, {
                    code: 'attentions',
                    title: '关注次数',
                    width: '160px',
                    formatter: function (val) {
                        return val || '-';
                    }
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '100px'
                }, {
                    code: 'id',
                    title: '操作',
                    width: '100px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        let s = org.breezee.buttons.edit({
                            id: row.id
                        });
                        if (row.status == 1) {
                            s = s + org.breezee.buttons.del({
                                    id: row.id
                                });
                        }
                        return s;
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/f335f040428f48e78f2e75152ec835f5',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('6cdb24004b0245c1ac06097800eb2695', 'id', function (data) {
                        $("#imageRemark").hide();
                        $("#imageBtn").show().data('type', data.value.type);
                        $('#dataModal').modal('show');
                        $("#barImage").attr("src", data.value.qrUrl);
                        me.curQrcode = data.value;
                    });
                    org.breezee.buttons.delCallback('6cdb24004b0245c1ac06097800eb2695', function (data) {
                        $('.btn_query').click();
                    });
                },
                onClick: function (data) {

                },
            });
        }

    };
});
