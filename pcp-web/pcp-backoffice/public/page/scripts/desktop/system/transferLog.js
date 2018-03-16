/**
 * 接口日志
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
            Dolphin.form.parseSelect($("#moduleSelect"));
        },

        initEvent: function () {
            let me = this;
            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });
            $("#moduleSelect").on("change",function(){
                let module =$(this).val();
                $("#menuSelect").empty().append("<option value=''>"+"--请选择--"+"</option>");
                $.each(Dolphin.enum.getEnum("logMenu"),function () {
                    if(this.logName == module){
                        let optionStr="<option value="+this.code+">"+this.name+"</option>";
                        $("#menuSelect").append(optionStr);
                        console.log(this);
                    }
                });
            });
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
                    width: '100px',
                    className: "hide_el",
                    formatter:function (val,row) {
                        return val;
                    }
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
                    code: 'transferCode',
                    title: 'SAP接口',
                    width: '100px',
                    className: "hide_el"
                },{
                    code: 'module',
                    title: '所属模块',
                    width: '120px',
                    className: "hide_el",
                    formatter:function (val) {
                        return val;
                    }
                }, {
                    code: 'success',
                    title: '结果(信息)',
                    className: "hide_el",
                    formatter:function (val,row) {
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
                url: '/api/9dc492c0878e25467fb10fdb8798e06a',
                pagination: true,
                onLoadSuccess: function () {
                    $(".btn-view").click(function () {
                        me.transferId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/d87f4e248d82f4d9e8c6f741c0a25d70@id=' + me.transferId,
                            type: Dolphin.requestMethod.GET,
                            onSuccess: function (data) {
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