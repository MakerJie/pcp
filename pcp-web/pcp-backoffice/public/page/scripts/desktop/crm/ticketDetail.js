'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS([""],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            this.initEvent();
            this.couponDataList();
            Dolphin.form.parse("#query_form");
        },

        initEvent: function () {
            let me = this;
            $('.btn_query').click(function () {
                let data = Dolphin.form.getValue('#query_form');
                if (data.fetchMethod == 'transfer') {
                    data.fetchMethod = '';
                    data.status = 11;
                }
                me._couponDataList.load(null, data);
            });
        },

        couponDataList: function () {
            const me = this;
            me._couponDataList = new Dolphin.LIST({
                panel: "#couponDataList",
                idField: 'id',
                hover: false,
                queryParams: {
                    _count: 1,
                    _ignoreDel: 1
                },
                columns: [{
                    code: 'code',
                    title: '券号',
                    width: '150px'
                }, {
                    code: 'activeDate',
                    title: '有效期',
                    width: '210px',
                    formatter: function (val, row) {
                        let html = [];
                        if (row.activeDate)
                            html.push(row.activeDate.substring(0, 10));
                        else
                            html.push("-");
                        html.push("至");
                        if (row.expireDate)
                            html.push(row.expireDate.substring(0, 10));
                        else
                            html.push("-");
                        return html.join(' ');
                    }
                }, {
                    code: 'name',
                    title: '券名称',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText("couponType", val);
                    }
                }, {
                    code: 'cardNo',
                    title: '会员卡号',
                    width: '150px'
                }, {
                    code: 'fetchMethod',
                    title: '获取方式',
                    width: '150px',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText("couponMethod", val);
                    }
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '100px',
                    formatter: function (val, row) {
                        if (row.status == 7) {
                            return '<span class="text-danger">' + val + '</span>;'
                        } else if (row.status == 5) {
                            return '<span class="text-warning">' + val + '</span>;'
                        } else if (row.status == 3) {
                            return '<span class="text-info">' + val + '</span>;'
                        }
                        return val;
                    }
                }, {
                    code: 'fetchDate',
                    title: '下发时间',
                    width: '160px',
                    formatter: function (val, row) {
                        return val;
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '80px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        let ht = [];
                        ht.push(org.breezee.buttons.view({id: row.id}));
                        if (row.status === 1) {
                            ht.push(org.breezee.buttons.del({id: row.id}));
                        }
                        return ht.join('');
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/0036e34aceb04f5297a5f9b4171b2d65',
                pagination: true,
                onLoadSuccess: function (td) {
                    org.breezee.buttons.delCallback('36c0fb36d49a4744837ce03db467e855', function () {
                    });
                    org.breezee.buttons.viewCallback('51bd83556f5e431a92bb4b20d84f96d0', 'id', function (data) {
                        if (data.value) {
                            $("#couponCode").html(data.value.code);
                            $("#c_verifyDate").html('-');
                            $("#c_shop").html('-');
                            $("#c_orderCode").html('-');
                            for (let k in data.value) {
                                $("#c_" + k).html(data.value[k] || '-');
                            }
                            $("#couponImage").attr('src',org.breezee.context.getImgSrc(data.value.couponType.smallImage));
                        }
                        $("#dataModal").modal('show');
                    });
                },
            });
        },
    };
});