'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            this.initEvent();
            this.initDataList();
            Dolphin.form.parse('#query_form');
            Dolphin.form.parse('#data_form');
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_clean').click(function () {
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                let d = Dolphin.form.getValue('#query_form');
                if (d.pointType == '6') {
                    d.pointType = '';
                    d.status = 0;
                }
                me._dataList.reload(null, d);
            });

            $(".btn_export").click(function () {
                let f = Dolphin.form.getValue('#query_form');
                let dd = {
                    _module: "crm",
                    _menuCode: "userPoint",
                    _userPointHistoryInfo: f,
                    _userId: org.breezee.context.userData.userCode,
                    _callbackName: 'userPointExportCallback',
                    _className: 'com.pcp.export.dto.UserPointExcelDTO',
                    _sheetName: '积分流水表',
                    _title: '积分流水表',
                };
                let url = (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + '/api/e6381042cfb97c0cd0a49b578f4b6adc';
                let form = $("<form />");
                form.attr({"style": "display: none", "target": '_blank', "method": "post", "action": url});
                $('body').append(form);
                let input = $("<input>");
                input.attr({"name": "content", "value": Dolphin.json2string(dd), "type": "hidden"});
                form.append(input);
                form.submit();
                form.remove();
            });


            $('.btn_save').click(function () {
                let data = me._dataList.data.rows;
                data[0].remark = $("#changeReason").val();
                Dolphin.ajax({
                    url: '/api/89760b99b10f4eed9d4869d75958a071',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(data[0]),
                    success: function (reData) {
                        if (reData.success) {
                            $('#userDataModal').modal('hide');
                            history.go(0);
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                })
            });
        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'userName',
                    title: '会员名称',
                    width: '110px',
                }, {
                    code: 'cardNo',
                    title: '会员卡号',
                    width: '110px'
                }, {
                    code: 'cardLevel',
                    title: '会员等级',
                    width: '100px',
                    formatter(val, row){
                        return Dolphin.enum.getEnumText("userLevel", val);
                    }
                }, {
                    code: 'mobile',
                    title: '联系手机',
                    width: '110px'
                }, {
                    code: 'happenTime',
                    title: '发生时间',
                    width: '190px',
                }, {
                    code: 'pointType',
                    title: '积分类型',
                    width: '110px',
                    formatter: function (val, row) {
                        return Dolphin.enum.getEnumText("pointType", val);
                    }
                }, {
                    code: 'remark',
                    title: '变动原因',
                    className: "hide_el"
                }, {
                    code: 'amount',
                    title: '积分增减',
                    width: '110px',
                    textAlign: 'right'
                }, {
                    code: 'totalAmount',
                    title: '积分余额',
                    width: '120px',
                    className: "hide_el",
                    textAlign: 'right'
                },{
                    code: 'status',
                    title: '状态',
                    width: '90px',
                    textAlign:'center',
                    formatter:function (val) {
                        return val==1?'正常':'<span style="color: #222;">过期</span>';
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/95b457acbebe4fbf90499c614ad444fc',
                pagination: true,
                onLoadSuccess: function () {

                }
            });
        }

    };
});