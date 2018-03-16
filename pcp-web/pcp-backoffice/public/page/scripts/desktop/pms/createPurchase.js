/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved.
 */

"use strict";
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/js/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            // this._dataList = this.dataList('#dataList');
            this.initEvent();
            this.productList(0);
            this.cartShow();
            this.productCart = {};
            this.cartNum = 0;
            this.orderData = {
                name: '上海新天地店',
                storeCode: '10011001'
            };
            Dolphin.form.parseSelect($('#supplyer'));
            Dolphin.form.parse("#order-form");
        },

        initEvent: function () {
            console.info(";;.........");

            $('.btn_query').click();
            $('#dataModal').modal('hide');
            let me = this;
            $('.btn-query').click(function () {
                let d = Dolphin.form.getValue('.query-form');
                me._dataList.reload(null, d);
            });



        },

        productList: function (pageNumber) {
            this.loadMateriel(pageNumber);
        },

    };
});