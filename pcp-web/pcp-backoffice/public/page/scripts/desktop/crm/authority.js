'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            this.initCouponsListSelect();
            this.activityRuleList();
            Dolphin.form.parseSelect($("#querySelect"));
            Dolphin.form.parseSelect($("#authoritySelect"));
            this.tmpEl = null;
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                $("#code").attr("readOnly",false);
                $('#dataModal').modal('show');
            });

            $(".btn_save_line").click(function () {
                let foreignData=me._dataList.getChecked();
                console.log("foreign",foreignData);
                let data = me._activityRuleList.data.rows;
                console.log("data",data);
                let ret=[];
                $.each(data,function () {
                    ret.push({
                        id:this.id,
                        code:this.code,
                        name:this.name,
                        feignId: foreignData[0].id,
                        integral:this.integral,
                        cardLevel:this.cardLevel,
                        couponCodeStr:this.couponCodeStr
                    });
                });
                Dolphin.ajax({
                    url: '/api/219a404fad9c4e1db313ea6293f3b721',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        checkInfos:ret
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#dataLineModal').modal('hide');
                            Dolphin.alert("保存成功！");

                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                })
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });


            $('.btn_save').click(function () {
                let data =  Dolphin.form.getValue("#data_form");
                data.beginTime =data.beginTime || Dolphin.date2string(new Date(),'yyyy-MM-dd hh:mm:ss');
                data.beginTime = data.beginTime+" 00:00:00";
                data.endTime =data.endTime || Dolphin.date2string(new Date(),'yyyy-MM-dd hh:mm:ss');
                data.endTime = data.endTime+" 00:00:00";
                Dolphin.ajax({
                    url: '/api/5436ea7d3c043f29dbdaf4df2c079741',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#userDataModal').modal('hide');
                            history.go(0);
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                })
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
            });

            $('.btn_confirm').click(function () {
                let ch = me._couponsListSelect.getChecked(),prds = [];
                for (let i = 0; i < ch.length; i++) {
                    prds.push(ch[i].code);
                }
                if (prds.length > 0) {
                    me.tmpEl.val(prds.join(','));
                    console.log(me.tmpEl.val());
                    $("#dataModal2").modal('hide');
                }
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '权益编码',
                    width: '140px',
                },{
                    code: 'name',
                    title: '权益名称',
                    width: '90px'
                }, {
                    code: 'type',
                    title: '权益类别',
                    width: '160px',
                    formatter:function (val) {
                        return Dolphin.enum.getEnumText('authorityType', val);
                    }
                }, {
                    code: 'beginTime',
                    title: '权益实效',
                    width: '160px',
                    formatter:function (val,row) {
                        return (row.beginTime.substr(0,10) + "<br/>" + row.endTime.substr(0,10));
                    }
                },{
                code: 'id',
                    title: '操作',
                    width: '110px',
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
                url: '/api/7c0e82d19b4d48d0f50a842f58f9c42e',
                pagination: true,
                onLoadSuccess: function (data) {
                    org.breezee.buttons.editCallback('6a37db4709bf189e5a4c8f0b223433ab', 'id', function (data) {
                        $("#code").attr("readOnly",true);
                        data.value.beginTime=data.value.beginTime.substr(0,10);
                        data.value.endTime=data.value.endTime.substr(0,10);
                        Dolphin.form.setValue(data.value, '#data_form');
                        $("#dataModal").modal('show');
                    });
                    org.breezee.buttons.delCallback('2f5c0e82d198f9c427b4d48d0f50a8e4', 'id', function (data) {
                        $('.btn_query').click();
                    });
                    $(".editRuleBtn").click(function () {
                        let foreignId=$(this).data('id');
                        Dolphin.ajax({
                            url: '/api/2f5c0e82d198f9c427b4d48d0f50a8e4',
                            type: Dolphin.requestMethod.POST,
                            loading: true,
                            data:Dolphin.json2string({
                                properties:{
                                    feignId: foreignId
                                }
                            }),
                            onSuccess: function (reData) {
                                me._activityRuleList.loadData({rows: reData.rows});
                                $('#dataLineModal').modal({
                                    show: true,
                                    backdrop: 'static'
                                });
                            }
                        });


                    });

                },
            });
        },
        initCouponsListSelect: function () {
            let me = this;
            me._couponsListSelect = new Dolphin.LIST({
                panel: "#couponsListSelect",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '优惠券ID',
                    width: '150px'
                }, {
                    code:'name',
                    title:'券名称',
                    width:'150px'
                },{
                    code: 'couponType',
                    title: '优惠券类型',
                    width: '90px',
                    formatter:function (val,row) {
                        return Dolphin.enum.getEnumText("couponType",val);
                    }
                }],
                multiple: true,
                rowIndex: false,
                checkbox: true,
                loading: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/002e17f5d8e24e918c2ddb5ad706deb4',
                pagination: false,
            });
        },
        activityRuleList: function () {
            const me = this;
            this._activityRuleList = new Dolphin.LIST({
                panel: "#activityRuleList",
                idField: 'id',
                hover: false,
                queryParams: {},
                editFlag: true,
                editBtn: true,
                addBtn: true,
                panelType: 'panel-warning',
                columns: [{
                    code: 'cardLevel',
                    title: '会员等级',
                    width: '100px',
                    editType: 'select',
                    options: 'userLevel',
                }, {
                    code: 'integral',
                    title: '积分',
                    width: '100px'
                }, {
                    code: 'couponCodeStr',
                    title: '优惠券',
                    editType: 'popup',
                    width: '150px'
                },],
                multiple: false,
                rowIndex: false,
                checkbox: false,
                data: {rows: [{}]},
                pagination: false,
                onLoadSuccess: function () {

                },
                onAddRow: function () {
                    $(".btn_col_couponCodeStr").click(function () {
                        me.tmpEl = $(this).parent().parent().children('input');
                        $("#dataModal2").modal("show");
                    })
                }
            })
        },
    };
});