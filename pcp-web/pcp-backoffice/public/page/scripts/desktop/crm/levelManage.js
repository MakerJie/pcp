/**
 * Created by wang,junjie on 2017/8/7.
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
            Dolphin.form.parse("#data_form");
            Dolphin.form.parse("#query_form");
            let img = $('.dropify').dropify();
            img.on('dropify.fileReady', function (event, src) {
                let form = $('#cardImageForm');
                form.attr('target', '_self');
                $.ajax({
                    url: (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + "/file/",
                    type: 'POST',
                    cache: false,
                    data: new FormData(form[0]),
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                    },
                    success: function (data) {
                        $("#imageHidden").val(data);
                    }
                });
            });
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                Dolphin.form.empty('#data_form');
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let dd = Dolphin.form.getValue("#data_form");
                dd.name = $("#userLevelSel").find("option:selected").text();
                Dolphin.ajax({
                    url: '/api/ad1a6bfd8f8c42b0b04793b750de14f4',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(dd),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#dataModal').modal('hide');
                            history.go(0);
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
            me.levelColor = ['', 'info', 'warning', 'danger', 'inverse', 'success'];
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'image',
                    title: '样式',
                    width: '150px',
                    formatter: function (val, obj, data, index) {
                        return '<img class="img-responsive" style="width: 60px;" src="' + org.breezee.context.getImgSrc(val) + '" />';
                    }
                }, {
                    code: 'cardLevel',
                    title: '卡等级名称',
                    width: '150px',
                    formatter: function (val, row) {
                        return '<span class="label label-' + me.levelColor[val] + '">' + (row.name + '-' + val) + '</span>';
                    }
                }, {
                    code: 'fluctuate',
                    title: '是否参与升降级',
                    width: '150px',
                    formatter(val){
                        if (val == 1) {
                            return "是";
                        } else if (val == 0) {
                            return "否";
                        } else {
                            return "-";
                        }
                    }
                }, {
                    code: 'quota',
                    title: '升级积分值',
                    width: '150px'
                }, {
                    code: 'discount',
                    title: '折扣率（%）',
                    width: '160px'
                }, {
                    code: 'safeguard',
                    title: '保级值',
                    width: '160px'
                }, {
                    code: 'cent',
                    title: '1元积分值',
                    width: '200px',
                    formatter: function (val, row) {
                        return val || "-";
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '90px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({
                                id: row.id
                            }) + org.breezee.buttons.del({
                                id: row.id
                            });
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/c2c9953a2ebd4df48fa8f8501a725b31',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('adf51d81b57f4e70bf03f2548d16dac1', 'id', function (data) {
                        if (data.value.image) {
                            $("#cardImage").closest('.dropify-wrapper').find('.dropify-render').find('img').attr('src', org.breezee.context.getImgSrc(data.value.image));
                        }
                        $('#dataModal').modal('show');
                    });
                    org.breezee.buttons.delCallback('adf51d81b57f4e70bf03f2548d16dac1', 'id', function (data) {
                        $('.btn_query').click();
                    });
                }
            });
        },


    };
});
