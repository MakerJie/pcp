/**
 * 操作日志
 * Created by Ning on 2017/9/5.
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
            Dolphin.form.parseSelect($("#typeSelect"));
            Dolphin.form.parseSelect($("#menuSelect"));
            Dolphin.form.parseSelect($("#moduleSelect"));
        },

        initEvent: function () {
            let me = this;
            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            // $("#moduleSelect").on("change",function(){
            //     let module =$(this).val();
            //     $("#menuSelect").empty();
            //     $("#menuSelect").append("<option value=''>"+"--请选择--"+"</option>");
            //     $.each(Dolphin.enum.getEnum("logMenu"),function () {
            //         if(this.logName == module){
            //             let optionStr="<option value="+this.code+">"+this.name+"</option>";
            //             $("#menuSelect").append(optionStr);
            //         }
            //     });
            // });

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
                    title: '操作用户',
                    width: '100px'
                }, {
                    code: 'rqTime',
                    title: '请求时间',
                    width: '190px',
                }, {
                    code: 'returnTime',
                    title: '回应时间',
                    width: '190px',
                    className: "hide_el"
                }, {
                    code: 'type',
                    title: '操作类型',
                    width: '100px',
                    className: "hide_el",
                    formatter:function (val) {
                        return Dolphin.enum.getEnumText('typeSelect', val);
                    }
                }, {
                    code: 'module',
                    title: '所属菜单',
                    width: '120px',
                    className: "hide_el",
                    formatter:function (val,rows) {
                        let logMenu = rows.menuName == null ? "" : Dolphin.enum.getEnumText('logMenu', rows.menuName);
                        return logMenu ;
                    }
                }, {
                    code: 'success',
                    title: '结果(信息)',
                    className: "hide_el",
                    formatter:function (val,rows) {
                        return Dolphin.enum.getEnumText('success', val);
                    }
                }, {
                    code: 'id',
                    title: '&nbsp;',
                    width: '75px',
                    className: "hide_el",
                    formatter: function (val, data) {
                        return "<div><a class='btn-view' " +
                            "href='javascript:void(0);' data-id='" + data.id + "' style='font-size: 12px;'>" +
                            "<i class='fa fa-share text-info'></i></a></div>";
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                queryParams:{},
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/271769c2397c949f072130d3f98642c1',
                pagination: true,
                onLoadSuccess: function () {
                    $(".btn-view").click(function () {
                        me.operationId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/a53cb35890c942ea930c0147896a0715@id=' + me.operationId,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (data) {
                                data.value.errMsg = data.value.errMsg == (""|| null) ? "无" : data.value.errMsg;
                                data.value.type = Dolphin.enum.getEnumText('typeSelect', data.value.type);
                                data.value.module = data.value.module+"<span style='color: red'>&nbsp;-->&nbsp;</span>"+
                                    (data.value.menuName == null ? "" : Dolphin.enum.getEnumText('logMenu', data.value.menuName));
                                data.value.success = Dolphin.enum.getEnumText('success', data.value.success);
                                Dolphin.form.setValue(data.value, '.edit-form');
                                $("#dataModal").modal({
                                    show: true,
                                    backdrop: 'static'
                                });
                            }
                        });
                    });
                },
            });
        }
    };
});