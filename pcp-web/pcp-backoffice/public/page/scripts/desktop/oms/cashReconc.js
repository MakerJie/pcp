/**
 * Created by wang,junjie on 2017/8/30.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/jquery-file-upload/js/vendor/jquery.ui.widget.js",
                    "/jquery-file-upload/js/vendor/jquery.ui.widget.js",
                    "/jquery-file-upload/js/jquery.fileupload.js","/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js",
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime()],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/jquery-file-upload/css/jquery.fileupload.css","/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.orderList("#orderList");
            this.cashHqList("#cashHqList");
            this.cashDataList();
            Dolphin.form.parseSelect($("#shopName2"));
            this.cashList("#cashList");
            this.fileData2 = [];
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


            //现金对账上传
            $('.btn_cashListSave').click(function () {
                let data = me.fileData2;
                $.each(data, function () {
                    if(this.arriveDate!=null&&this.arriveDate!=""){
                        let h=this.arriveDate.split(".");
                        this.arriveDate=h[0]+"-"+h[1]+"-"+h[2];
                        this.arriveDate = this.arriveDate + " 00:00:00";
                    }
                    if(this.businessDate!=null&&this.businessDate!=""){
                        let h=this.businessDate.split(".");
                        this.businessDate=h[0]+"-"+h[1]+"-"+h[2];
                        this.businessDate = this.businessDate + " 00:00:00";
                    }
                });
                Dolphin.ajax({
                    url: '/api/ffd14483ef7143e69e2229c199209ac6',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({cashReconcDetailInfos: data}),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                          /*  if(99 == reData.retcode){
                                Dolphin.alert("保存失败,存在已过账数据！");
                                me._cashList.empty();
                            }else {*/
                            Dolphin.alert("保存成功!");
                            me._cashList.empty();
                            $('#tab_user2').tab('show');
                          /*  }*/

                        } else {
                            $("#error_message").html('系统出错，请联系管理员');
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });


            //现金对账
            $('.btn_passCash').click(function () {
                let cashSd = me._cashHqList.getChecked();
                if (cashSd.length === 0) {
                    Dolphin.alert("请至少选择一条记录");
                    return;
                }
                Dolphin.form.empty("#data_form2");
                $('#dataModal2').modal('show');
            });

            $('#tab_user4').on('shown.bs.tab', function (e) {
                me._cashHqList.reload();
            });

            $('.btn-save').click(function () {
                let data2= me._orderList.data.rows;
                let data1=Dolphin.form.getValue("#order-form");

                if(data1.businessDate_gt!=null&&data1.businessDate_gt!=""){
                    data1.startDate=data1.businessDate_gt+" 00:00:00";
                }
                if(data1.businessDate_le!=null&&data1.businessDate_le!=""){
                    data1.endDate=data1.businessDate_le+" 00:00:00";
                }

                console.log("data1",data1);



                Dolphin.ajax({
                    url: '/api/f4a6f208dad0488db99b688c4dbae9c9',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        startDate:data1.startDate,
                        endDate:data1.endDate,
                        shopCode:data1.shopCode,
                        cashReconcLines: data2
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#tab_user4').tab('show');
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
               let dd= Dolphin.form.getValue('#order-form');
                if(dd.shopCode==null||dd.shopCode==""){
                    Dolphin.alert("请先选择门店");
                    return;
                }else{
                    me._orderList.load(null,dd);
                }
            });


            $('.btn_cashConfirm').click(function () {

                let sd = me._cashHqList.getChecked();
                let cashformDate=Dolphin.form.getValue("#data_form2");
                console.log(cashformDate);
                if(cashformDate.passCheckDate!=null&&cashformDate.passCheckDate!=""){
                    cashformDate.passCheckDate=cashformDate.passCheckDate+" 00:00:00";
                    console.log(cashformDate.passCheckDate);
                }
                Dolphin.confirm('确认过账至SAP，过账后不可更改?', {
                    callback: function (flag) {
                        if (flag) {
                            let rd = [];
                            $.each(sd, function () {
                                rd.push(this.id);
                            });
                            Dolphin.ajax({
                                url: '/api/fc06103509134ca797d11db2df41f6ae',
                                type: Dolphin.requestMethod.POST,
                                loading: true,
                                data: Dolphin.json2string({
                                    id: rd.join(','),
                                    passCheckDate:cashformDate.passCheckDate
                                }),
                                success: function (reData, textStatus) {
                                    if (reData.success) {
                                        Dolphin.alert("过账成功!");
                                        $('#dataModal2').modal('hide');
                                        history.go(0);
                                    } else {
                                        Dolphin.alert(reData.msg);
                                        $('#dataModal2').modal('hide');
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

        //现金对账上传
        cashFileParse: function (data) {
            this.fileData2 = data;
            this._cashList.loadData({rows: this.fileData2});
        },

        cashList: function () {
            let me = this;
            me._cashList = new Dolphin.LIST({
                panel: "#cashList",
                idField: 'id',
                hover: false,
                editListName: 'editList',
                columns: [{
                    code: 'receiveSideCode',
                    title: '收款方编码',
                    width: '150px',
                }, {
                    code: 'receiveSideName',
                    title: '收款方名称',
                    width: '150px',
                }, {
                    code: 'bankName',
                    title: '银行名称',
                    width: '150px',
                }, {
                    code: 'receiveAccount',
                    title: '收款账号',
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
                    code: 'arriveDate',
                    title: '到帐日期',
                    width: '150px',
                }, {
                    code: 'businessDate',
                    title: '营业日期',
                    width: '150px',
                }, {
                    code: 'tradeCode',
                    title: '交易号',
                    width: '150px',

                }, {
                    code: 'amount',
                    title: '金额',
                    width: '150px',
                }, {
                    code: 'fee',
                    title: '手续费',
                    width: '150px',

                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                pagination: false,
            });
        },



        //现金对账
        orderList: function () {
            let me = this;
            me._orderList =  new Dolphin.LIST({
                panel: "#orderList",
                idField: 'id',
                hover: false,
                editFlag:true,
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
                    formatter:function (val,row) {
                        if(val!=null){
                            row.posAmount=val.toFixed(2);
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
                    formatter:function (val,row) {
                        if(val!=null){
                            row.amount=val.toFixed(2);
                            return val.toFixed(2);
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'fee',
                    title: '手续费',
                    width: '90px',
                    formatter:function (val,row) {
                        if(val!=null){
                            row.fee=val.toFixed(2);
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
                    formatter: function (val,row) {
                        return (val||"-");
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
                        if(val=1000){
                            return "已过账";
                        }
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/f22f549d48e943c1b4cb89eee9b9d3e4',
                pagination: false,
                onLoadSuccess: function (td) {
                },
                onLoad: function () {

                }
            });
        },

        cashHqList: function () {
            let me = this;
            me._cashHqList = new Dolphin.LIST({
                panel: "#cashHqList",
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
                },  {
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
                    formatter: function (val) {
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
                    org.breezee.buttons.editCallback('fa25dd88d82f4d9e8c6777f4e2441c00', 'id', function (data) {
                        me._cashDataList.loadData({rows: data.value.cashReconcLines});
                        $("#cashMatModal").modal('show');

                    });
                    org.breezee.buttons.delCallback('f92eb05435c4451281440acaca7f80f4', function () {
                        me._cashHqList.reload();
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
                    formatter: function (val,row) {
                        return (val||"-");
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
