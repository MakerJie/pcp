/**
 * Created by wang,junjie on 2017/8/4.
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
            Dolphin.form.parse("#userForm");
            Dolphin.form.parse("#query_form");
            this.curTabIdx = 1;
            let me = this;
            let fid =  $('#frontImageData').dropify();
            fid.on('dropify.fileReady', function(event, src){
                let form = $('#frontImageDataForm');
                form.attr('target', '_self');
                $.ajax({
                    url: (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + "/file/",
                    type: 'POST',
                    cache: false,
                    data: new FormData(form[0]),
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        me.uploading = true;
                    },
                    success: function (data) {
                        me.uploading = false;
                        $("#frontImageDataHidden").val(data);

                    }
                });
            });

            let did =  $('#detailImageData').dropify();
            did.on('dropify.fileReady', function(event, src){
                let form = $('#detailImageDataForm');
                form.attr('target', '_self');
                $.ajax({
                    url: (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + "/file/",
                    type: 'POST',
                    cache: false,
                    data: new FormData(form[0]),
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        me.uploading = true;
                    },
                    success: function (data) {
                        me.uploading = false;
                        $("#detailImageDataHidden").val(data);
                    }
                });
            });
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                Dolphin.form.empty("#dataModal");
                console.log('add button click....');
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn-save').click(function () {
                let dd = Dolphin.form.getValue("#userForm");
                console.log("dd", dd);
                if (dd.topCarriageDate != null && dd.topCarriageDate != "") {
                    dd.topCarriageDate = dd.topCarriageDate + " 00:00:00";
                }
                if (dd.underCarriageDate != null && dd.underCarriageDate != "") {
                    dd.underCarriageDate = dd.underCarriageDate + " 00:00:00";
                }
                dd.code = "";
                Dolphin.ajax({
                    url: '/api/00b1912832884e81bf7ecc744a2d1a65',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(dd),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('.btn_query').click();
                            $('#dataModal').modal('hide');
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            $(".nextStep").click(function () {
                let d = $(this).data('next');
                if (d == '1') {
                    me.curTabIdx++;
                } else if (d == '0') {
                    me.curTabIdx--;
                }
                $("#tab_user" + me.curTabIdx).tab('show');
            });
            $("#tab_user1").on('show.bs.tab', function (e) {
                me.curTabIdx = 1;
                me.footBtn();
            });

            $('#tab_user2').on('show.bs.tab', function (e) {
                me.curTabIdx = 2;
                me.footBtn();
            });

        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'frontImageData',
                    title: '图片',
                    width:'120px',
                    formatter: function (val, obj, data, index) {
                        console.log(org.breezee.context.getImgSrc(val));
                        return '<img class="img-responsive" style="width: 60px;" src="' + org.breezee.context.getImgSrc(val) + '" />';
                    }
                }, {
                    code: 'name',
                    title: '名称',
                    width: '190px',

                }, {
                    code: 'position',
                    title: '位置',
                    width: '130px',
                    formatter:function (val) {
                        return Dolphin.enum.getEnumText('position',val);
                    }
                }, {
                    code: 'topCarriageDate',
                    title: '上架时间',
                    width: '150px',
                    formatter(val, data){
                        if (data.topCarriageDate != null && data.topCarriageDate != "") {
                            data.topCarriageDate = data.topCarriageDate.substr(0, 10);
                        }
                        return data.topCarriageDate;
                    }
                }, {
                    code: 'underCarriageDate',
                    title: '下架时间',
                    width: '150px',
                    formatter(val, data){
                        if (data.underCarriageDate != null && data.underCarriageDate != "") {
                            data.underCarriageDate = data.underCarriageDate.substr(0, 10);
                        }
                        return data.underCarriageDate;
                    }
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '130px',
                    formatter:function (val,row) {
                        return '<span class="text-'+(row.status?'info':'danger')+'">'+val+'</span>'
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '80px',
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
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/00b6980f1bdb41c8ba158905b4fb11a8',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('cb96f1e48e0b4d45aa08d5248d6bcca3', 'id', function (data) {
                        if (data.value.topCarriageDate != null && data.value.topCarriageDate != "") {
                            data.value.topCarriageDate = data.value.topCarriageDate.substr(0, 10);
                        }
                        if (data.value.underCarriageDate != null && data.value.underCarriageDate != "") {
                            data.value.underCarriageDate = data.value.underCarriageDate.substr(0, 10);
                        }
                        Dolphin.form.setValue(data.value, '#userForm');
                        if (data.value.frontImageData) {
                            $("#frontImageData").closest('.dropify-wrapper').find('.dropify-render').find('img').attr('src', org.breezee.context.getImgSrc(data.value.frontImageData));
                        }
                        if (data.value.detailImageData) {
                            $("#detailImageData").closest('.dropify-wrapper').find('.dropify-render').find('img').attr('src', org.breezee.context.getImgSrc(data.value.detailImageData));
                        }
                        $('#dataModal').modal('show');
                    });
                    org.breezee.buttons.delCallback('6fba25f0b40a46f18d2985b681276ac3', 'id', function (data) {
                        $('.btn_query').click();
                    });
                }
            });
        },


        footBtn: function () {
            let me = this;
            if (me.curTabIdx > 1) {
                $("#preStep").show();
            } else {
                $("#preStep").hide();
            }
            if (me.curTabIdx === 2) {
                $("#nextStep").hide();
                $("#saveBtn").show();
            } else {
                $("#nextStep").show();
                $("#saveBtn").hide();
            }
        }


    };
});