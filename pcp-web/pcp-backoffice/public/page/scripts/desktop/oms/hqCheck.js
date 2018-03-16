/**
 * Created by wang,junjie on 2017/8/30.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/jquery-file-upload/js/vendor/jquery.ui.widget.js",
                    "/jquery-file-upload/js/vendor/jquery.ui.widget.js",
                    "/jquery-file-upload/js/jquery.fileupload.js","/assets/js/moment.min.js",
                    "/assets/js/daterangepicker.min.js","/assets/js/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/jquery-file-upload/css/jquery.fileupload.css");
            this.initEvent();
            this.initDataList();
            this.editList();
            this.hqList("#hqList");
            this.hqList2("#hqList2");
            this.cashHqList("#cashHqList");
            this.cashDataList();
            Dolphin.form.parseSelect($("#shopName1"));
            Dolphin.form.parseSelect($("#shopName2"));
            Dolphin.form.parseSelect($("#checkStatus"));
            Dolphin.form.parseSelect($("#checkStatus2"));
        },

        initEvent: function () {
            let me = this;

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
                    console.log("=================")
                    formDate2.passCheckDate=formDate2.passCheckDate+" 00:00:00";
                    console.log(formDate2.passCheckDate);
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
                                        $('#dataModal').modal('hide');
                                        me._hqList2.reload();
                                    } else {
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
                console.log("dsaf",data1);
                Dolphin.ajax({
                    url: '/api/a1373fc245cf4a68845bae1ca1555907',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        receiveCheckLines: data1
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            Dolphin.alert("保存成功！");
                            $(".btn_query").click();
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
                me._hqList.load(null, Dolphin.form.getValue('#queryForm'));
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

            $('.btn-save').click(function () {
                let data2= me._orderList.data.rows;
                console.log("dsaf",data2);
                Dolphin.ajax({
                    url: '/api/f4a6f208dad0488db99b688c4dbae9c9',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        cashReconcLines: data2
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            Dolphin.alert("保存成功！");
                            $(".btn-select").click();
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
                let cashData=Dolphin.form.getValue('#order-form');
                console.log(cashData);
                console.log("cashSelect...");
               me._orderList.query(null,cashData);
            });


            $('.btn_cashConfirm').click(function () {

                let sd = me._cashHqList.getChecked();
                let cashformDate=Dolphin.form.getValue("#data_form2");
                console.log(cashformDate);
                if(cashformDate.passCheckDate!=null&&cashformDate.passCheckDate!=""){
                    console.log("=================")
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
                                    } else {
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
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'plaAmount',
                    title: '平台金额',
                    width: '100px',
                    formatter:function (val) {
                        return val;
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
                        return val;
                    }
                }, {
                    code: 'plaCommission',
                    title: '平台佣金',
                    width: '80px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'plaSubsidy',
                    title: '平台补贴',
                    width: '100px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'bankReceive',
                    title: '银行应收',
                    width: '100px',
                    formatter:function (val) {
                        return val;
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
                }/*,{
                 code:'id',
                 title:'确认过账',
                 lassName:'totalTd',
                 width: '100px',
                 formatter: function (val,row) {
                 let html = '';
                 if(row.status==2){
                 html  += '<input type="checkbox" checked="checked" class="checkConfirm" style="margin-left:30px;" data-id="'+row.id+'"  data-status="'+row.status+'"/>';
                 }
                 if(row.status==1){
                 html  += '<input type="checkbox"  class="checkConfirm" style="margin-left:30px;" data-id="'+row.id+'"  data-codeStr="'+row.codeStr+'"/>';
                 }
                 return html;
                 }
                 }*/],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/9e73698f1e944398a9da8055b62a3045',
                pagination: false,
                onLoadSuccess: function (td) {
                    /*   $(".checkConfirm").click(function () {
                     let data = $(this).data();
                     console.log("id",data.id,"codeStr",codeStr);
                     Dolphin.ajax({
                     url: '/api/fcd5848a8a9e456aa1042036b3f46f81?id='+ data.id+"&codeStr="+codeStr,
                     type: Dolphin.requestMethod.POST,
                     onSuccess: function (reData) {
                     me._hqList.reload();
                     }
                     });
                     });*/


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
                },{
                    code: 'startDate',
                    title: '开始日期',
                    width: '100px',
                    formatter:function (val) {
                        return (val || "-");
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
                        let html = "<a class='btn btn-outline btn-sm dark btn-cashView' " +
                            "href='javascript:void(0);' data-id='" + data.id + "' style='font-size: 12px;'>" +
                            "<i class='fa fa-share'></i>查看</a>";
                        return html;
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/295a008c5f7c4187b62cd8035690096d',
                pagination: false,
                onLoadSuccess: function (td) {
                    $(".btn-cashView").click(function () {
                        let cashId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/0068105460474378947e9f22a2a1eeae@id=' + cashId,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (data) {
                                console.log(data);
                                me._editList.loadData({rows: data.value.receiveCheckLines});
                                $("#matModal").modal('show');
                            }
                        });
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
                        return val;
                    }
                }, {
                    code: 'plaAmount',
                    title: '平台金额',
                    width: '100px',
                    formatter:function (val) {
                        return val;
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
                        return val;
                    }
                }, {
                    code: 'plaCommission',
                    title: '平台佣金',
                    width: '80px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'plaSubsidy',
                    title: '平台补贴',
                    width: '100px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'bankReceive',
                    title: '银行应收',
                    width: '100px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'diffIntroduce',
                    title: '差异说明',
                    width: '200px',
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'status',
                    title: '状态',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return "待过账";
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                pagination: false,
            });
        },



      //现金对账
        initDataList: function () {
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
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'amount',
                    title: '到账金额',
                    width: '100px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'fee',
                    title: '手续费',
                    width: '90px',
                    formatter: function (val) {
                        return val;
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
                }/*,{
                    code:'id',
                    title:'确认过账',
                    lassName:'totalTd',
                    width: '100px',
                    formatter: function (val,row) {
                        let html = '';
                        if(row.status==2){
                            html  += '<input type="checkbox" checked="checked" class="checkConfirm2" style="margin-left:30px;" data-id="'+row.id+'"  data-status="'+row.status+'"/>';
                        }
                        if(row.status==1){
                            html  += '<input type="checkbox"  class="checkConfirm2" style="margin-left:30px;" data-id="'+row.id+'"  data-status="'+row.status+'"/>';
                        }
                        return html;
                    }
                }*/],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/f22f549d48e943c1b4cb89eee9b9d3e4',
                pagination: false,
                onLoadSuccess: function (td) {
                /*    $(".checkConfirm2").click(function () {
                        let data = $(this).data();
                        let decide=$(this).is(':checked')
                        Dolphin.ajax({
                            url: '/api/df22cfa6dc5643e2a5bd3b6c0c2ef3e3?id='+ data.id+"&decide="+decide,
                            type: Dolphin.requestMethod.POST,
                            onSuccess: function (reData) {
                                me._orderList.reload();
                            }
                        });
                    });*/
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
                },{
                    code: 'startDate',
                    title: '开始日期',
                    width: '100px',
                    formatter:function (val) {
                        return (val || "-");
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
                        return  org.breezee.buttons.view({id: val});
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
                        me._cashDataList.loadData({rows: data.value.cashReconcLines});
                        $("#cashMatModal").modal('show');
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
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'amount',
                    title: '到账金额',
                    width: '100px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'fee',
                    title: '手续费',
                    width: '90px',
                    formatter: function (val) {
                        return val;
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
                    formatter: function (val,row) {
                        return (val||"-");
                    }
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
