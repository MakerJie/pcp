/**
 * Created by wang,junjie on 2017/8/30.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/jquery-file-upload/js/vendor/jquery.ui.widget.js",
                    "/jquery-file-upload/js/vendor/jquery.ui.widget.js",
                    "/jquery-file-upload/js/jquery.fileupload.js","/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/jquery-file-upload/css/jquery.fileupload.css","/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.editList();
            this.hqList("#hqList");
            this.hqList2("#hqList2");
            Dolphin.form.parseSelect($("#shopName1"));
            this.receiveList("#receiveList");
            this.fileData = [];
        },

        initEvent: function () {
            let me = this;

            $('#tab_user3').on('shown.bs.tab', function (e) {
                me._editList.reload();
            });
            //上次过账日期
            $("#shopName1").change(function () {
                let shopCode=$("#shopName1").val();
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


            //应收对账上传
            $('.btn_editListSave').click(function () {
                let data = me.fileData;
                $.each(data, function () {
                    if(this.tradeDate!=null&&this.tradeDate!=""){
                        if(this.tradeTime!=null||this.tradeTime!=""){
                            let h=this.tradeDate.split(".");
                            this.tradeDate=h[0]+"-"+h[1]+"-"+h[2];
                            this.tradeDate = this.tradeDate + " " + this.tradeTime;
                        }else{
                            this.tradeDate = this.tradeDate + " 00:00:00";
                        }
                    }
                });
                console.log("===",data);
                Dolphin.ajax({
                    url: '/api/b58cec0416824e8fb5b81c3190da3d90',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({checkDetailInfos: data}),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                               Dolphin.alert("保存成功!");
                                me._receiveList.empty();
                                $('#tab_user1').tab('show');
                        } else {
                            $("#error_message").html('系统出错，请联系管理员');
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            //应收对账
            $('.btn_passCheck').click(function () {
                let sd = me._hqList2.getChecked();
                if (sd.length === 0) {
                    Dolphin.alert("请至少选择一条记录");
                    return;
                }
                Dolphin.form.empty("#data_form");
                $('#dataModal').modal('show');
            });

            //应收对账提交至sap
            $('.btn_saveCheck').click(function () {
                let sd = me._hqList2.getChecked();
                let formDate2=Dolphin.form.getValue("#data_form");
                console.log(formDate2);
                if(formDate2.passCheckDate!=null&&formDate2.passCheckDate!=""){
                    formDate2.passCheckDate=formDate2.passCheckDate+" 00:00:00";
                }
                Dolphin.confirm('确认过账至SAP，过账后不可更改?', {
                    callback: function (flag) {
                        if (flag) {
                            let rd = [];
                            $.each(sd, function () {
                                rd.push(this.id);
                            });
                            Dolphin.ajax({
                                url: '/api/077d2f7f8ae04af8a927f251a7b39d9b',
                                type: Dolphin.requestMethod.POST,
                                loading: true,
                                data: Dolphin.json2string({
                                    id: rd.join(','),
                                    passCheckDate:formDate2.passCheckDate
                                }),
                                success: function (reData, textStatus) {
                                    if (reData.success) {
                                        Dolphin.alert("过账成功!");
                                        $('#dataModal').modal('hide');
                                        history.go(0);
                                    } else {
                                        $('#dataModal').modal('hide');
                                        Dolphin.alert(reData.msg);
                                    }
                                },
                                onError: function () {
                                    Dolphin.alert('系统出错，请联系管理员');
                                }
                            });
                        }
                    }
                });
            });

            //应收对账保存汇总表
            $('.btn-save2').click(function () {
                let data1=me._hqList.data.rows;
                let data2=Dolphin.form.getValue("#queryForm");
                console.log("data1",data1);

                if(data2.tradeDate_gt!=null&&data2.tradeDate_gt!=""){
                    data2.startDate=data2.tradeDate_gt+" 00:00:00";
                }
                if(data2.tradeDate_le!=null&&data2.tradeDate_le!=""){
                    data2.endDate=data2.tradeDate_le+" 00:00:00";
                }

                Dolphin.ajax({
                    url: '/api/a1373fc245cf4a68845bae1ca1555907',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        startDate:data2.startDate,
                        endDate:data2.endDate,
                        shopCode:data2.shopCode,
                        receiveCheckLines: data1
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#tab_user3').tab('show');
                            me._hqList2.reload();
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
            $(".btn_query").click(function () {
                console.log("query.....");
                let data=Dolphin.form.getValue('#queryForm');
                if(data.shopCode==null||data.shopCode==""){
                  Dolphin.alert("请先选择门店");
                  return;
                }else{
                    me._hqList.load(null,data);
                }
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
                            $('#tab_user3').tab('show');
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


        fileParse: function (data) {
            this.fileData = data;
            this._receiveList.loadData({rows: this.fileData});
        },

        receiveList: function () {
            let me = this;
            me._receiveList = new Dolphin.LIST({
                panel: "#receiveList",
                idField: 'id',
                hover: false,
                editListName: 'receiveList',
                columns: [{
                    code: 'receiveSideCode',
                    title: '收款方编码',
                    width: '150px',
                }, {
                    code: 'receiveSideName',
                    title: '收款方名称',
                    width: '150px',
                }, {
                    code: 'partyCode',
                    title: '平台编码',
                    width: '150px',
                }, {
                    code: 'partyName',
                    title: '平台名称',
                    width: '150px',
                }, {
                    code: 'shopCode',
                    title: '门店编码',
                    width: '150px',
                }, {
                    code: 'shopName',
                    title: '门店名称',
                    width: '150px',
                }, {
                    code: 'tradeDate',
                    title: '交易日期',
                    width: '150px',
                }, {
                    code: 'tradeTime',
                    title: '交易时间',
                    width: '150px',
                }, {
                    code: 'tradeCode',
                    title: '交易号',
                    width: '150px',

                }, {
                    code: 'receiveAmount',
                    title: '收款金额',
                    width: '150px',
                }, {
                    code: 'refundAmount',
                    title: '退款金额',
                    width: '150px',

                }, {
                    code: 'plaFee',
                    title: '平台手续费',
                    width: '150px',
                }, {
                    code: 'plaCommission',
                    title: '平台佣金',
                    width: '150px',

                }, {
                    code: 'plaSubsidy',
                    title: '平台补贴',
                    width: '150px',

                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                pagination: false,
            });
        },

        //应收对账
        hqList: function () {
            let me = this;
            me._hqList = new Dolphin.LIST({
                panel: "#hqList",
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
                    formatter:function (val,row) {
                        if(val!=null){
                            row.posAmount=val.toFixed(2);
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaAmount',
                    title: '平台金额',
                    width: '100px',
                    formatter:function (val,row) {
                        if(val!=null){
                            row.plaAmount=val.toFixed(2);
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'receiveSideName',
                    title: '收款方',
                    width: '100px',
                    formatter:function (val,row) {
                        return val;
                    }
                }, {
                    code: 'difference',
                    title: '差异',
                    width: '150px',
                    formatter:function (val,row) {
                        if(val!=null){
                            row.difference=val.toFixed(2);
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaFee',
                    title: '平台手续费',
                    width: '100px',
                    formatter:function (val,row) {
                        if(val!=null){
                            row.plaFee=val.toFixed(2);
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaCommission',
                    title: '平台佣金',
                    width: '80px',
                    formatter:function (val,row) {
                        if(val!=null){
                            row.plaCommission=val.toFixed(2);
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'plaSubsidy',
                    title: '平台补贴',
                    width: '100px',
                    formatter:function (val,row) {
                        if(val!=null){
                            row.plaSubsidy=val.toFixed(2);
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'bankReceive',
                    title: '银行应收',
                    width: '100px',
                    formatter:function (val,row) {
                        if(val!=null){
                            row.bankReceive=val.toFixed(2);
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
                        if(val=1000){
                            return "已过账";
                        }
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/9e73698f1e944398a9da8055b62a3045',
                pagination: false,
                onLoadSuccess: function (td) {
                },
            });
        },
        hqList2: function () {
            let me = this;
            me._hqList2 = new Dolphin.LIST({
                panel: "#hqList2",
                idField: 'id',
                hover: false,
                editFlag:true,
                editBtn:false,
                queryParams:{
                    status:2
                },
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
                    formatter: function (val, data, index) {

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
                    org.breezee.buttons.editCallback('0068105460474378947e9f22a2a1eeae', 'id', function (data) {
                        me._editList.loadData({rows: data.value.receiveCheckLines});
                        $("#matModal").modal('show');

                    });
                    org.breezee.buttons.delCallback('c4c5b94dae5848e09109f5ce9e9134bf', function () {
                        me._hqList2.reload();
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
                        if(val!=null){
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
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
                        if(val=1000){
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

