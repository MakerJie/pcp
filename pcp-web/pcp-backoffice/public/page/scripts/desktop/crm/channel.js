/**
 *
 * Created by wang,junjie on 2017/8/4.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
            this.initDataList();
            this.dataQrCodeList("dataListSelect");
        },

        initEvent: function () {
            let me = this;


            //新增窗口弹出
            $('.btn_add').click(function () {
                console.log('add button click....');
                Dolphin.form.empty("#data_form");
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._channelList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let dd = Dolphin.form.getValue("#data_form");
                console.log(dd);
                Dolphin.ajax({
                    url: '/api/f9741043f295436ea7d3cdbda2c07f4d',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(dd),
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
                });
            });
        },

        initDataList: function () {
            let me = this;
            me._channelList = new Dolphin.LIST({
                panel: "#dataList",
                title:'渠道列表',
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'name',
                    title: '渠道名称',
                    width: '130px',

                }, {
                    code:'enName',
                    title:'渠道英文',
                    width:'130px'
                },{
                    code: 'attentions',
                    title: '关注次数',
                    width: '130px'
                },{
                    code: 'id',
                    title: '&nbsp;',
                    width: '150px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({
                                id: row.id
                            })+ '&nbsp;&nbsp;' + org.breezee.buttons.del({
                                id: row.id
                            });
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/d0f50a84219b4d488f9c42ef57c0e82d',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('9bf1c8f0b223433ab6a37db47089e5a4','id',function (data) {
                        $('#dataModal').modal('show');
                    });
                    org.breezee.buttons.delCallback('848cb91b20bf4134b8993e8185b36840',function (data) {
                        $('.btn_query').click();
                    });
                },
                onClick: function (data, row) {
                    me.dataListSelect.load(null, {}, {id: data.id});
                }
            });
        },

        dataQrCodeList: function () {
            let me = this;
            me.dataListSelect = new Dolphin.LIST({
                panel: "#dataListSelect",
                title:'二维码列表',
                idField: 'id',
                hover: false,
                data: {rows: []},
                columns: [{
                    code: 'code',
                    title: '二维码编码',
                    width: '150px'
                }, {
                    code: 'name',
                    title: '二维码名称',
                    width: '150px',

                },{
                    code: 'status',
                    title: '状态',
                    width: '160px'
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/37d8aba45dfe424aa7b4e56ceff36b07',
                pagination: true,
            });
        },
    };
});
