'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css","/jquery-file-upload/css/jquery.fileupload.css");
            this.orderData = {
                shopCode: org.breezee.context.userData.shopCode,
                name: org.breezee.context.userData.userName,
                type: 10
            };
            this.initEvent();
            this.initDataListSelect();
            Dolphin.form.parseSelect($("#ticket"));
            Dolphin.form.parse("#pointStoreForm");
            Dolphin.form.parseSelect($("#pointStoreType"));
        },

        initEvent: function () {
            let me = this;
            $('.addPointStore').click(function () {
                Dolphin.form.empty("#pointStoreForm");
                $("#deleteBtn").css("display","none");
                $("#saveBtn").css("display","block");
                $('#dataSelectModal').modal('show');

            });

            $('.btn_query').click(function () {
                me.dataListSelect.load(null, Dolphin.form.getValue('#query_form'));
            });
            $("#selectLevel").change(function () {
                let d = $(this).val();
                if (d === '1') {
                    $("#blue").css("display", "block");
                    $("#gold").css("display", "block");
                    $("#platinum").css("display", "block");
                    $("#black").css("display", "block");
                } else if (d === '2') {
                    $("#blue").css("display", "none");
                    $("#gold").css("display", "block");
                    $("#platinum").css("display", "block");
                    $("#black").css("display", "block");
                } else if (d === '3') {
                    $("#blue").css("display", "none");
                    $("#gold").css("display", "none");
                    $("#platinum").css("display", "block");
                    $("#black").css("display", "block");
                } else if (d === '4') {
                    $("#blue").css("display", "none");
                    $("#gold").css("display", "none");
                    $("#platinum").css("display", "none");
                    $("#black").css("display", "block");
                }
            });

            $('.btnPointStore').click(function () {
                let dd = Dolphin.form.getValue('#pointStoreForm');
                Dolphin.ajax({
                    url: '/api/160c3f59be8f4495b86ecd6e61035041',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(dd),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me.dataListSelect.load(null, {
                                pointStoreTypeId: $("#pointStoreTypeId").val()
                            });
                            $('#dataSelectModal').modal('hide');
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
        initDataListSelect: function () {
            let me = this;
            me.dataListSelect = new Dolphin.LIST({
                panel: "#dataListSelect",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '商品编码',
                    width:'160px'
                }, {
                    code: 'name',
                    title: '商品名称',
                },{
                    code:'type',
                    title:'所属模块',
                    width:'150px',
                    formatter:function (val) {
                        return Dolphin.enum.getEnumText('pointStoreType',val);
                    }
                },{
                    code:'exchangeLevel',
                    title: '所需积分',
                    width:'180px',
                    formatter:function (val,row) {
                        if(row.exchangeLevel==1){
                            return row.buleCardPoint+" [蓝卡]";
                        }else if(row.exchangeLevel==2){
                            return row.goldCardPoint+" [金卡]";
                        }if(row.exchangeLevel==3){
                            return row.platinumCardPoint+" [铂金卡]";
                        }if(row.exchangeLevel==4){
                            return row.blackCardPoint+" [黑卡]";
                        }
                    }
                },  {
                    code: 'voucherName',
                    title: '优惠券名称',
                    width:'250px',
                },{
                    code: 'createTime',
                    title: '创建时间',
                    width:'180px',
                },{
                    code: 'id',
                    title: '操作',
                    width: '70px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({
                            id: row.id
                        })+org.breezee.buttons.del({
                                id: row.id
                            });
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/542dba0a139644e39257c08c035e33d5',
                pagination: true,
                onLoadSuccess: function (data) {
                    org.breezee.buttons.editCallback('257c08c03553d542dba0a139644e39e3','id',function (data) {
                        $('#dataSelectModal').modal('show');
                    });
                    org.breezee.buttons.delCallback('4fb099623f49c904e3e23fd9fc74982e',function (data) {
                        $('.btn_query').click();
                    });
                }
            });
        },
    };
});
