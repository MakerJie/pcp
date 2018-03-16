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
            this.editList();
            this.editList2();
            this._hqList=this.hqList2("#hqList");
            this._hqList2=this.hqList2("#hqList2");
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
                    url: '/api/87e930338a3d4e14963604b3d91c08cd@shopCode='+shopCode,
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

            //应收对账查询
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


            //应收对账子表差异说明保存
            $('.checkSave').click(function () {
                let data1=me._editList.data.rows;
                console.log("======",data1);
                Dolphin.ajax({
                    url: '/api/b445685e58c44cd0a00939a633fc1102',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        checkInfos: data1
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            Dolphin.alert("保存成功！");
                            $('#matModal').modal('hide');
                            me._editList.reload();
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

        hqList2: function (panel) {
            let me = this;
            return  new Dolphin.LIST({
                panel: panel,
                idField: 'id',
                hover: false,
                editFlag:true,
                editBtn:false,
                data:{rows:[]},
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
                },{
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
                        if(val!=null&&val!=""){
                            return val.substr(0,10);
                        }else {
                            return "-";
                        }
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
                        if(val=1000){
                            return "已过账";
                        }
                    }
                }, {
                    code: 'id',
                    title: '&nbsp;',
                    width: '150px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
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
                url: '/api/295a008c5f7c4187b62cd8035690096d',
                pagination: false,
                onLoadSuccess: function (td) {

                    org.breezee.buttons.viewCallback('0068105460474378947e9f22a2a1eeae', 'id', function (data) {
                        me._editList2.loadData({rows: data.value.receiveCheckLines});
                        $("#matModal2").modal('show');

                    });

                    org.breezee.buttons.editCallback('0068105460474378947e9f22a2a1eeae', 'id', function (data) {
                        me._editList.loadData({rows: data.value.receiveCheckLines});
                        $("#matModal").modal('show');

                    });
                    org.breezee.buttons.delCallback('c4c5b94dae5848e09109f5ce9e9134bf', function () {
                        $(".btn-select").click();
                    });

                },
            });
        },
        editList: function () {
            let me = this;
            me._editList = new Dolphin.LIST({
                panel: "#editList",
                idField: 'id',
                hover: false,
                editFlag:true,
                editBtn:false,
                data:{rows:[]},
                columns: [{
                    code: 'partyName',
                    title: '第三方平台',
                    width: '130px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'posAmount',
                    title: 'pos金额',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaAmount',
                    title: '平台金额',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'receiveSideName',
                    title: '收款方',
                    width: '100px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'difference',
                    title: '差异',
                    width: '150px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'plaFee',
                    title: '平台手续费',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaCommission',
                    title: '平台佣金',
                    width: '80px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaSubsidy',
                    title: '平台补贴',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'bankReceive',
                    title: '银行应收',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'diffIntroduce',
                    title: '差异说明',
                    width: '200px',
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
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                pagination: false,
            });
        },

        editList2: function () {
            let me = this;
            me._editList2 = new Dolphin.LIST({
                panel: "#editList2",
                idField: 'id',
                hover: false,
                editFlag:false,
                editBtn:false,
                data:{rows:[]},
                columns: [{
                    code: 'partyName',
                    title: '第三方平台',
                    width: '130px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'posAmount',
                    title: 'pos金额',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaAmount',
                    title: '平台金额',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'receiveSideName',
                    title: '收款方',
                    width: '100px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'difference',
                    title: '差异',
                    width: '150px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'plaFee',
                    title: '平台手续费',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaCommission',
                    title: '平台佣金',
                    width: '80px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaSubsidy',
                    title: '平台补贴',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'bankReceive',
                    title: '银行应收',
                    width: '100px',
                    formatter:function (val) {
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'diffIntroduce',
                    title: '差异说明',
                    width: '200px',
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
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                pagination: false,
            });
        },

    };
});
