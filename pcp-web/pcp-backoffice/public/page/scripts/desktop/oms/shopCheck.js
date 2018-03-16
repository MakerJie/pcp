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
            this.hqList("#hqList");
            Dolphin.form.parseSelect($("#shopName"));
            Dolphin.form.parseSelect($("#shopCode"));
            Dolphin.form.parseSelect($("#shopName1"));
            Dolphin.form.parseSelect($("#shopCode1"));
        },

        initEvent: function () {
            let me = this;
            $('#tab_user2').on('shown.bs.tab', function (e) {
                me._dataList.reload();
            });

            $(".btn-query").click(function () {
                me._hqList.query(null,Dolphin.form.getValue('#order-form'));
            });

            $(".btn-query2").click(function () {
                let receiveFormData= Dolphin.form.getValue('#receiveForm');
                console.log("receiveFormData",receiveFormData);
                me._dataList.query(null,Dolphin.form.getValue('#receiveForm'));
            });

     /*       $('.btn-saveCheck').click(function () {
                Dolphin.form.empty("#data_form");
                $('#dataModal').modal('show');
            });

            $('.btn-cashSave').click(function () {
                Dolphin.form.empty("#data_form2");
                $('#dataModal2').modal('show');
            });*/


            $('.btn-save2').click(function () {
                  let data1=me._dataList.data.rows;
                  console.log("======",data1);
                  Dolphin.ajax({
                    url: '/api/b445685e58c44cd0a00939a633fc1102',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        checkInfos: data1
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#dataModal').modal('hide');
                            me._dataList.reload();
                        } else {
                            $("#error_message").html('系统出错，请联系管理员');
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });


            });

            $('.btn-save').click(function () {
                let data2= me._hqList.data.rows;
                Dolphin.ajax({
                    url: '/api/40e303b73f304122a2e638693957348c',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string({
                        cashInfos: data2
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#dataModal2').modal('hide');
                            me._hqList.reload();
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

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                editFlag: true,
                editBtn: false,
                data: {rows: []},
                panelType: 'panel-warning',
                columns: [{
                    code: 'partyName',
                    title: '第三方平台',
                    width: '140px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'posAmount',
                    title: 'POS金额',
                    width: '100px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'plaAmount',
                    title: '平台金额',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                },{
                    code: 'difference',
                    title: '差异',
                    width: '100px',
                    formatter: function (val) {
                        return val;
                    }

                }, {
                    code: 'diffIntroduce',
                    title: '差异说明',
                    width: '200px',

                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/507f93d6f7d6439984108ffefe8d8054',
                pagination: false,
                onLoadSuccess: function () {
                },
                onChecked: function (val) {
                },
                onUnchecked: function () {
                }
            });
        },

        hqList: function () {
            let me = this;
            me._hqList= new Dolphin.LIST({
                panel: "#hqList",
                idField: 'id',
                hover: false,
                editFlag: true,
                editBtn: false,
                panelType: 'panel-warning',
                columns: [ {
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
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'fee',
                    title: '银行手续费',
                    width: '90px',
                    formatter: function (val,row) {
                        return (val||"-");
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
                    width: '150px',

                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/4a90ba9c04c64b8e870ef62259ccde30',
                data: {rows: []},
                pagination: false,
                onLoadSuccess: function () {
                },
            });
        },

    };
});
