'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/js/moment.min.js",
                    "/assets/js/daterangepicker.min.js","/assets/js/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/jquery-file-upload/css/jquery.fileupload.css");

            this.initEvent();
            this.initDataList();
            this.initLineList();
            this.initDetailsList();
            console.log('load the materielList.js....');
            Dolphin.form.parse("#data_form");
            Dolphin.form.parseSelect($("#purchaseShop"));
            Dolphin.form.parse("#query_form");
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                if(data.happenTime==''){
                    alert("日期不可为空");
                }else{
                    data.happenTime = data.happenTime+" 00:00:00";
                    Dolphin.ajax({
                        url: '/api/fcb12241cd242133c83465ef94878b1f',
                        type: Dolphin.requestMethod.POST,
                        data: Dolphin.json2string(data),
                        success: function (reData, textStatus) {
                            if (reData.success) {
                                $('.btn_query').click();
                                $('#dataModal').modal('hide');
                            } else {
                                $("#error_message").html('系统出错，请联系管理员');
                            }
                        },
                        onError: function () {
                            $("#error_message").html('系统出错，请联系管理员');
                        }
                    });
                }
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
            })

            $("#type").change(function () {
                let d = $(this).val();
                console.log(d);
                if (d === '20') {
                    me._dataLineList.load(null, {
                        monthCheck: true
                    })
                } else if (d === '10') {
                    me._dataLineList.load(null, {
                        dayCheck: true
                    });
                }
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                title:'收货订单明细',
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '订单编号',
                    width: '150px'
                }, {
                    code: 'storeName',
                    title: '门店',
                    width: '150px'
                }, {
                    code: 'type',
                    title: '收货状态',
                    width: '150px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText('receiveType',val);
                    }
                }, {
                    code: 'creator',
                    title: '收货人',
                    width: '150px'
                }, {
                    code: 'happenTime',
                    title: '收货日期',
                    width: '150px',
                    formatter: function (val, row, index) {
                        return row.happenTime.substr(0,10);
                    }
                }, {
                    code: 'id',
                    title: '&nbsp;',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        if(row.delFlag){

                        } else {
                            return org.breezee.buttons.view({
                                id: row.id
                            });
                        }
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/98531b44dbbb87c1a1836b4c345c3e67',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.viewCallback('97a5f9b417afe452d634aceb04f52f19','id',function (data) {
                        data.value.happenTime = data.value.happenTime.substr(0,10);
                        Dolphin.form.setValue(data.value, '.edit-form');
                        me._LineList.loadData({rows:data.value.receiveLines});
                        $('#lineModal').modal('show');
                    });
                }
            });
        },
        initDetailsList: function () {
            let me = this;
            me._dataLineList = new Dolphin.LIST({
                panel: "#detailsList",
                editListName:'receiveLines',
                idField: 'id',
                hover: false,
                editFlag: true,
                columns: [{
                    code: 'name',
                    title: '物料名称',
                    width: '100px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'code',
                    title: '物料编码',
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '70px'
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '60px'
                }, {
                    code: 'price',
                    title: '价格',
                    width: '60px'
                }],
                multiple: true,
                rowIndex: false,
                checkbox: false,
                queryParams: {pageSize: 1000, type: 'Z001'},
                data: {rows: []},
                url: '/api/53afe452392f44b19d64ae88d1de7491',
                ajaxType: Dolphin.requestMethod.POST,
                pagination: false,
            });
        },
        initLineList: function () {
            let me = this;
            me._LineList = new Dolphin.LIST({
                panel: "#lineList",
                editListName:'receiveLines',
                idField: 'id',
                hover: false,
                editFlag: false,
                columns: [{
                    code: 'name',
                    title: '物料名称',
                    width: '100px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'code',
                    title: '物料编码',
                    width: '90px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '数量',
                    width: '70px'
                }, {
                    code: 'unit',
                    title: '单位',
                    width: '60px'
                }, {
                    code: 'price',
                    title: '价格',
                    width: '60px'
                }],
                multiple: true,
                rowIndex: false,
                checkbox: false,
                queryParams: {pageSize: 1000, type: 'Z001'},
                pagination: false,
            });
        }
    };
});
