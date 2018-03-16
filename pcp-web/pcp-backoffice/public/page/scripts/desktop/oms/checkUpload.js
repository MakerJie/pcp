/**
 * Created by wang,junjie on 2017/8/26.
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
            this.editList("#editList");
            this.cashList("#cashList");
            this.fileData = [];
            this.fileData2 = [];
        },

        initEvent: function () {
            let me = this;

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
                Dolphin.ajax({
                    url: '/api/b58cec0416824e8fb5b81c3190da3d90',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({checkDetailInfos: data}),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                          /*  if(99 == reData.retCode){
                                Dolphin.alert("保存失败,存在未过账数据！")
                            }else {*/
                                Dolphin.alert("保存成功!");
                            /*}*/

                        } else {
                                $("#error_message").html('系统出错，请联系管理员');
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });



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
                            Dolphin.alert("保存成功!");
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
            this._editList.loadData({rows: this.fileData});
        },

        cashFileParse: function (data) {
            this.fileData2 = data;
            this._cashList.loadData({rows: this.fileData2});
        },

        editList: function () {
            let me = this;
            me._editList = new Dolphin.LIST({
                panel: "#editList",
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

    };
});
