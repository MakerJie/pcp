'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initDataList();
            Dolphin.form.parse("#query_form");
            Dolphin.form.parseSelect($("#shopName1"));
            Dolphin.form.parseSelect($("#shopName2"));
            Dolphin.form.parseSelect($("#shopName3"));
            this.middleware();

            let img = $('.dropify').dropify();
            img.on('dropify.fileReady', function (event, src) {
                $('#image').data("base64", src);
            });
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                console.log('add button click....');
                Dolphin.form.empty('#add_form');
                $('#dataModal2').modal('show');
            });

            $('.btn_query').click(function () {
                let data = Dolphin.form.getValue('#query_form');
                if (data.viewType_like != null && data.viewType_like != "") {
                    let tag = data.viewType_like;
                    data.viewType_like = tag.join();
                }
                me._dataList.load(null, data);
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue("#add_form");
                data.createTime = data.createTime || Dolphin.date2string(new Date(), 'yyyy-MM-dd hh:mm:ss');
                data.createTime = data.createTime + " 00:00:00";
                data.image = $("#image").closest('.dropify-wrapper').find('.dropify-render').find('img').attr('src');
                if (data.viewType != null && data.viewType != "") {
                    let prefer = data.viewType;
                    data.viewType = prefer.join();
                } else {
                    data.viewType = "";
                }
                Dolphin.ajax({
                    url: '/api/b898531754d26e3402308568e6744dbb',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#dataModal2').modal('hide');
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

            $('.btn_receive').click(function () {
                let data = Dolphin.form.getValue("#data_form");
                data.remark = org.breezee.context.userData.userName;
                Dolphin.ajax({
                    url: '/api/b898531754d26e3402308568e6744dbb',
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
            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
            });

            $(".viewTypeSelect").select2({
                selectOnClose: false,
                allowClear: true
            });
        },

        middleware: function () {
            const me = this;
            Dropzone.options.myAwesomeDropzone = {
                paramName: 'upfile',
                maxFilesize: 3, // MB
                acceptedFiles: ".csv,.txt",
                dictDefaultMessage: '请选择或者拖动文件上传',
                dictFallbackMessage: '浏览器不支持文件上传控件',
                dictFileTooBig: '文件不可以超过{{maxFilesize}}',
                dictResponseError: '文件上传失败',
                accept: function (file, done) {
                    done();
                },
                init: function () {
                    this.on("success", function (file) {
                        me.employeeUpload.loadData({rows: eval(file.xhr.response)});
                    });
                }
            };
            $(".select2").select2();
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '服务单号',
                    width: '120px',
                }, {
                    code: 'mobile',
                    title: '联系手机',
                    width: '120px',
                }, {
                    code: 'shopName',
                    title: '门店',
                    className: "hide_el",
                }, {
                    code: 'createTime',
                    title: '提交日期',
                    width: '120px',
                    className: "hide_el"
                }, {
                    code: 'viewType',
                    title: '意见类型',
                    width: '120px',
                    className: "hide_el"
                }, {
                    code: 'degree',
                    title: '满意度',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val || '-';
                    }
                }, {
                    code: 'image',
                    title: '图片',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, obj, data, index) {
                        return val ? '<img class="img-responsive" style="width: 60px;" src="'+org.breezee.context.getImgSrc(val + '.jpg')+'" />' : '-';
                    }
                }, {
                    code: 'status',
                    title: '状态',
                    width: '90px',
                    formatter: function (val, row) {
                        if (row.status == 2) {
                            return "已回复";
                        } else {
                            return "未回复";
                        }
                    }
                }, {
                    code: 'id',
                    title: '操作',
                    width: '70px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.view({
                            id: row.id
                        });
                        /*  +org.breezee.buttons.del({
                         id:row.id
                         })*/

                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/38badf2137ffaa0f8eb5ba744d4975b0',
                pagination: true,
                onLoadSuccess: function () {
                    org.breezee.buttons.viewCallback('f27269c42dc19f07132397c943098617', 'id', function (data) {
                        if (data.value.status == 1) {
                            $("#replyDiv").hide();
                            $("#btnDiv").show();

                        }
                        if (data.value.status == 2) {
                            $("#replyDiv").show();
                            $("#btnDiv").hide();
                        }
                        $("#fImage").attr("src", org.breezee.context.getImgSrc(data.value.image+'.jpg'));
                        $("#dataModal").modal('show');
                    });
                    /*  org.breezee.buttons.delCallback('3bc9abd0bb4a492dae5ca07a18bf2f84', function (data) {
                     $('.btn_query').click();
                     });*/
                },
            });
        }
    };
});