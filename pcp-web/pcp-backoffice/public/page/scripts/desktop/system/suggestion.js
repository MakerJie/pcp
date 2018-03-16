'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
        },

        initEvent: function () {
            let me = this;
            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams:{},
                columns: [{
                    code: 'createTime',
                    title: '提出日期',
                    width: '180px',
                    className:'hidden-xs'
                }, {
                    code: 'name',
                    title: '联系人',
                    width: '110px'
                }, {
                    code: 'remark',
                    title: '联系方式',
                    width: '150px'
                },{
                    code: 'content',
                    title: '内容'
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/2c1e294396c142f086108102705da6ee',
                pagination: true,
                onLoadSuccess: function () {
                }
            });
        }
    };
});