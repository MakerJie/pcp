/**
 * 日志页面
 * Created by Ning on 2017/7/26.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            Dolphin.form.parseSelect($("#chinaRegion"));
        },

        initEvent: function () {
            let me = this;

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
            })
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'name',
                    title: '登录用户',
                    width: '150px'
                }, {
                    code: 'createTime',
                    title: '登录时间',
                    width: '150px',
                }, {
                    code: 'remoteHost',
                    title: '登录者ip',
                    width: '150px',
                    className: "hide_el"
                }, {
                    code: 'city',
                    title: '登录地点',
                    width: '150px',
                    className: "hide_el",
                    formatter:function (val,row) {
                        return row.area +","+row.region+","+val;
                    }
                }, {
                    code: 'msg',
                    title: '结果信息',
                    width: '150px',
                    className: "hide_el"
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                queryParams:{},
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/7e0a6f494d4c490baca3d1940e7a2a43',
                pagination: true,
            });
        }
    };
});