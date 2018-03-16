/**
 * Created by wang,junjie on 2017/8/30.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.cashDataList();
            this.cashDataList2();
            this._hqList=this.cashHqList("#hqList");
            this._hqList2=this.cashHqList("#hqList2");
            Dolphin.form.parseSelect($("#shopName2"));
            this.status=2;
            this._hqList.load(null, {
                status: this.status
            });
            this.curList = this._hqList;
        },

        initEvent: function () {
            let me = this;

            //上次过账日期
            $("#shopName2").change(function () {
                let shopCode=$("#shopName2").val();
                console.log(shopCode);
                Dolphin.ajax({
                    url: '/api/0048c85e2eb046b6ac18fbcc7e4f3704@shopCode='+shopCode,
                    type: Dolphin.requestMethod.POST,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            console.log("===",reData);
                            if(reData.value!=null){
                                $("#lastPassDate").val(reData.value.substr(0,10));
                            }
                        } else {
                            $("#error_message").html('系统出错，请联系管理员');
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });

            });


            $(".btn-select").click(function () {
                console.log("query.....");
                let d = Dolphin.form.getValue('#query_form');
                d.status = me.status;
                me.curList.load(null, d);
            });

            $("#tab_user1").on('show.bs.tab', function (e) {
                me.status = 2;
                me.curList = me._hqList;
                console.log(me.status);
                $(".btn-select").click();
            });
            $("#tab_user2").on('show.bs.tab', function (e) {
                me.status = null;
                me.curList = me._hqList2;
                console.log(me.status);
                $(".btn-select").click();
            });


            //现金对账子表差异说明保存
            $('.cashSave').click(function () {
                let data2= me._cashDataList.data.rows;
                Dolphin.ajax({
                    url: '/api/40e303b73f304122a2e638693957348c',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        cashInfos: data2
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            Dolphin.alert("保存成功！");
                            $('#cashMatModal').modal('hide');
                            me._cashDataList.reload();
                        } else {
                            $("#error_message").html('系统出错，请联系管理员');
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });

            });
        },

        cashHqList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: panel,
                idField: 'id',
                hover: false,
                editFlag:true,
                editBtn:false,
                //data:{rows:[]},
                columns: [{
                    code: 'createTime',
                    title: '创建时间',
                    width: '130px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'creator',
                    title: '创建者',
                    width: '100px',
                    formatter:function (val) {
                        return val;
                    }
                },{
                    code: 'code',
                    title: '待过账单号',
                    width: '100px',
                    formatter:function (val) {
                        return val;
                    }
                },  {
                    code: 'shopCode',
                    title: '门店编码',
                    width: '100px',
                    formatter:function (val) {
                        return (val || "-");
                    }
                }, {
                    code: 'shopName',
                    title: '门店名称',
                    width: '100px',
                    formatter:function (val) {
                        return (val || "-");
                    }
                },{
                    code: 'startDate',
                    title: '开始日期',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null&&val!=""){
                            return val.substr(0,10);
                        }else {
                            return "-";
                        }
                    }
                },{
                    code: 'endDate',
                    title: '结束日期',
                    width: '100px',
                    formatter:function (val) {
                        return (val || "-");
                    }
                }, {
                    code: 'status',
                    title: '状态',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        if(val==1){
                            return "待确认";
                        }
                        if(val==2){
                            return "待过账";
                        }
                        if(val==1000){
                            return "已过账";
                        }
                    }
                }, {
                    code: 'id',
                    title: '&nbsp;',
                    width: '150px',
                    className: "hide_el",
                    formatter: function (val,row) {
                        if(row.status==1000){
                            return  org.breezee.buttons.view({id: val});
                        }
                        return org.breezee.buttons.edit({id: val}) + " " + org.breezee.buttons.del({id: val});
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/f6e2ed65de4141448775ed6d0608448d',
                pagination: false,
                onLoadSuccess: function (td) {
                    org.breezee.buttons.viewCallback('fa25dd88d82f4d9e8c6777f4e2441c00', 'id', function (data) {
                        me._cashDataList2.loadData({rows: data.value.cashReconcLines});
                        $("#cashMatModal2").modal('show');

                    });
                    org.breezee.buttons.editCallback('fa25dd88d82f4d9e8c6777f4e2441c00', 'id', function (data) {
                        me._cashDataList.loadData({rows: data.value.cashReconcLines});
                        $("#cashMatModal").modal('show');

                    });
                    org.breezee.buttons.delCallback('f92eb05435c4451281440acaca7f80f4', function (data) {
                        $(".btn-select").click();
                    });
                },
            });
        },

        cashDataList: function () {
            let me = this;
            me._cashDataList =  new Dolphin.LIST({
                panel: "#cashDataList",
                idField: 'id',
                hover: false,
                editFlag:true,
                editBtn:false,
                data:{row:[]},
                columns: [{
                    code: 'shopName',
                    title: '门店名称',
                    width: '140px',
                    formatter: function (val) {
                        return val;
                    }
                },{
                    code: 'posAmount',
                    title: 'POS金额',
                    width:'100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'amount',
                    title: '到账金额',
                    width: '100px',
                    textAlign: 'center',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'fee',
                    title: '手续费',
                    width: '90px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'receiveAccount',
                    title: '银行账号',
                    width: '150px',
                    formatter: function (val,row) {
                        return (val||"-");
                    }
                },{
                    code: 'difference',
                    title: '差异',
                    className:'totalTd',
                    width: '90px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                },{
                    code: 'remark',
                    title: '门店差异说明',
                    className:'totalTd',
                    width: '200px',
                },{
                    code: 'status',
                    title: '状态',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        if(val==1){
                            return "待确认";
                        }
                        if(val==2){
                            return "待过账";
                        }
                        if(val==1000){
                            return "已过账";
                        }
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                pagination: false,
            });
        },

        cashDataList2: function () {
            let me = this;
            me._cashDataList2 =  new Dolphin.LIST({
                panel: "#cashDataList2",
                idField: 'id',
                hover: false,
                editFlag:false,
                editBtn:false,
                data:{row:[]},
                columns: [{
                    code: 'shopName',
                    title: '门店',
                    width: '140px',
                    formatter: function (val) {
                        return val;
                    }
                },{
                    code: 'posAmount',
                    title: 'POS金额',
                    width:'100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'amount',
                    title: '到账金额',
                    width: '100px',
                    textAlign: 'center',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'fee',
                    title: '手续费',
                    width: '90px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'receiveAccount',
                    title: '银行账号',
                    width: '150px',
                    formatter: function (val,row) {
                        return (val||"-");
                    }
                },{
                    code: 'difference',
                    title: '差异',
                    className:'totalTd',
                    width: '90px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                },{
                    code: 'remark',
                    title: '门店差异说明',
                    className:'totalTd',
                    width: '200px',
                },{
                    code: 'status',
                    title: '状态',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        if(val==1){
                            return "待确认";
                        }
                        if(val==2){
                            return "待过账";
                        }
                        if(val==1000){
                            return "已过账";
                        }
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                pagination: false,
            });
        },

    };
});
