'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(['/assets/js/jquery.maskedinput.min.js',
                    "/assets/js/jquery.chosen.min.js"],
                '/page/scripts/desktop/asyncLoad.js');

            org.breezee.utils.loadJS(["/assets/js/moment.min.js",
                    "/assets/js/daterangepicker.min.js","/assets/js/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());

            this.initEvent();
            this.initDataList();
            this.editList();
            this._calList=this.calList('calList');
            this._finishList=this.finishList('finishList');
        },

        initEvent: function () {
            let me = this;


        },



        initDataList: function () {
            let me = this;
            me._rantList = new Dolphin.LIST({
                panel: "#rantList",
                idField: 'id',
                hover: false,
                editFlag: true,
                editBtn: false,
                panelType: 'panel-warning',
                columns: [{
                    code: 'code',
                    title: '期间',
                    width: '130px',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'name',
                    title: '起始日期',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'unit',
                    title: '结束日期',
                    width: '90px',
                    textAlign: 'center',
                    formatter: function (val) {
                        return val;
                    }
                }, {
                    code: 'quantity',
                    title: '扣率',
                    width: '130px',
                },],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/',
                data: {rows: []},
                pagination: false,
            });
        },

        editList: function () {
            const me = this;
            this._editList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {
                    pageSize: 1000
                },
                panelType: 'panel-warning',
                columns: [{
                    code: 'code',
                    title: '期间',
                    width: '130px',
                }, {
                    code: 'name',
                    title: '起始日期',

                }, {
                    code: 'unit',
                    title: '结束日期',
                    width: '90px',

                }, {
                    code: 'quantity',
                    title: '含税金额',
                    width: '130px',
                },],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false,
            })
        },




        calList: function () {
            const me = this;
            this._calList = new Dolphin.LIST({
                panel: "#calList",
                idField: 'id',
                hover: false,
                queryParams: {
                    pageSize: 1000
                },
                panelType: 'panel-warning',
                columns: [{
                    code: 'code',
                    title: '门店编码',
                    width: '130px',
                }, {
                    code: 'name',
                    title: '门店名称',

                }, {
                    code: 'unit',
                    title: '预提起始日期',
                    width: '90px',

                }, {
                    code: 'quantity',
                    title: '预提结束日期',
                    width: '130px',
                },{
                    code: 'quantity',
                    title: '过账日期',
                    width: '130px',
                },{
                    code: 'quantity',
                    title: '参考金额',
                    width: '130px',
                },{
                    code: 'quantity',
                    title: '过账金额',
                    width: '130px',
                },{
                    code: 'quantity',
                    title: '上次过账日期',
                    width: '130px',
                },{
                    code: 'quantity',
                    title: '备注',
                    width: '130px',
                },],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false,
            })
        },



        finishList: function () {
            const me = this;
            this._finishList = new Dolphin.LIST({
                panel: "#finishList",
                idField: 'id',
                hover: false,
                queryParams: {
                    pageSize: 1000
                },
                panelType: 'panel-warning',
                columns: [{
                    code: 'code',
                    title: '合同编码',
                    width: '130px',
                }, {
                    code: 'name',
                    title: '合同类型',

                }, {
                    code: 'unit',
                    title: '合同期限',
                    width: '90px',

                }, {
                    code: 'quantity',
                    title: '租金模式',
                    width: '130px',
                },{
                    code: 'quantity',
                    title: '门店名称',
                    width: '130px',
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                data: {rows: []},
                pagination: false,
            })
        },

    };
});
/**
 * Created by wang,junjie on 2017/9/13.
 */
