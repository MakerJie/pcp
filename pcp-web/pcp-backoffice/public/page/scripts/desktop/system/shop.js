'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            console.log('load the shop.js....');
        },

        initEvent: function () {
            let me = this;

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });


            $('.btn_add').click(function () {
                console.log('add button click....');
                Dolphin.form.empty('#add_form');
                $('#dataModal').modal('show');
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue("#add_form");
                data.createTime = data.createTime || Dolphin.date2string(new Date(), 'yyyy-MM-dd hh:mm:ss');
                data.createTime = data.createTime + " 00:00:00";
                console.log("====",data);
                Dolphin.ajax({
                    url: '/api/f154583e71a74078bf16b10de571786b',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
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
                })
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {
                    _count: 1
                },
                columns: [{
                    code: 'createTime',
                    title: '开业日期',
                    width: '130px',
                    className: 'hidden-xs'
                }, {
                    code: 'code',
                    title: '门店编码',
                    width: '140px',
                    formatter: function (val, row) {
                        return '<div>' + val + '</div>';
                    }
                }, {
                    code: 'name',
                    title: '门店名称',
                    width: '180px',
                    formatter:function (val,row) {
                        return (row.brand || '')+val;
                    }
                }, {
                    code: 'remark',
                    title: '地址',
                    className: 'hidden-xs',
                    formatter: function (val) {
                        return val && val.length > 30 ? val.substr(0, 30) : val;
                    }
                }, {
                    code: 'telephone',
                    title: '电话',
                    width: '180px',
                    className: 'hidden-xs'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/445a2ba90204414387ba30a336f016b6',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('016b6020442ba9387ba30a336445af14', 'id', function (data) {
                        $('#dataModal').modal('show');
                    });
                }
            });
        }
    };
});