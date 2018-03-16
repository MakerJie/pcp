'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            this.initEvent();
            this.initDataList();
            this.initDataLineList();
            Dolphin.form.parse($("#line_data_form"));
            Dolphin.form.parseSelect($("#payWay"));
            Dolphin.form.parseSelect($("#shopSelect"));
            console.log('load the dividerule.js....');

            $("#shopSelect").multipleSelect();
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                console.log('add button click....');
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null, Dolphin.form.getValue('#query_form'));
            });

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                if (data.startDate && data.startDate.length === 10)
                    data.startDate += " 00:00:00";
                if (data.endDate && data.endDate.length === 10)
                    data.endDate += " 23:59:59";
                data.name = $("#payWay").find("option:selected").text();
                data.menuCode='divideRule';
                Dolphin.ajax({
                    url: '/api/00a1fd2ee17f4618b93db98f258a065d',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._dataList.reload();
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
            //规则明细
            $('.line_btn_save').click(function () {
                let mySelect = me._dataList.getChecked();
                let data = Dolphin.form.getValue('#line_data_form');
                data.ruleId = mySelect[0].id;
                data.name = $("#shopSelect").find("option:selected").text();
                let ww = [];
                if (data.mon)
                    ww.push('1');
                if (data.tue)
                    ww.push("2");
                if (data.wed)
                    ww.push("3");
                if (data.thu)
                    ww.push("4");
                if (data.fri)
                    ww.push("5");
                if (data.sat)
                    ww.push("6");
                if (data.sun)
                    ww.push("7");
                data.weekDay = ww.join(',');
                console.log("dsafsadfsa",data);
                if (data._shopCode){
                    data.shopCode = data._shopCode.join(',');
                }


                console.log(data._shopCode);
                Dolphin.ajax({
                    url: '/api/00dc75710ad24a598a787b50a44ae06c',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._dataLineList.load(null, {
                                rule_id_obj_ae: me.curRuleId
                            });
                            $('#lineDataModal').modal('hide');
                        } else {
                            $("#line_error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
            });

            $('#lineDataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#line_data_form');
                $("#line_error_message").empty();
            });

            $('.line_btn_add').click(function () {
                let mySelect = me._dataList.getChecked();
                if (mySelect.length == 0) {
                    alert('请选择一个规则类型');
                    return;
                }
                $('#lineDataModal').modal('show');
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
                    title: '类型名称',
                    width: '150px',
                    formatter: function (val, row) {
                        let html = [];
                        html.push('<div>名称:');
                        html.push(row.name);
                        html.push('</div><div>折扣类别:');
                        html.push(row.type);
                        html.push('</div>');
                        html.push('<div>折扣编码:');
                        html.push(row.disCode);
                        html.push('</div>');
                        return html.join('');
                    }
                }, {
                    code: 'code',
                    title: '支付方式',
                    width: '200px',
                    formatter: function (val, row) {
                        let html = [];
                        html.push('<div>');
                        html.push(row.payCode + row.name);
                        html.push('</div>');
                        html.push('<div>');
                        if(row.startDate && row.endDate) {
                            html.push(row.startDate.substr(0, 10) + '~' + row.endDate.substr(0, 10));
                        }
                        html.push('</div>');
                        return html.join('');
                    }
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '75px'
                }, {
                    code: 'id',
                    title: '操作',
                    width: '80px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return '<a class="btn btn-outline btn-circle btn-sm purple editRuleBtn" ' +
                            'data-id="' + val + '" href="javascript:;"><i class="fa fa-edit"></i>编辑</a>'
                    }
                }],
                multiple: false,
                rowIndex: false,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/008c9da88af646f58ea042dab7c816b3',
                pagination: false,
                onLoadSuccess: function () {
                    $('.editRuleBtn').click(function () {
                        let _this = $(this);
                        Dolphin.ajax({
                            url: '/api/0094513404cb44989731991c430db34c@id=' + _this.data('id'),
                            type: Dolphin.requestMethod.GET,
                            loading: true,
                            onSuccess: function (reData) {
                                if (reData.value.startDate)
                                    reData.value.startDate = reData.value.startDate.substr(0, 10);
                                if (reData.value.endDate)
                                    reData.value.endDate = reData.value.endDate.substr(0, 10);
                                Dolphin.form.setValue(reData.value, '.edit-form');
                                $('#dataModal').modal('show');
                            }
                        });
                    });
                },
                onClick: function (data) {
                    me.curRuleId = data.id;
                    me._dataLineList.loadData({rows: data.ruleLines});
                }
            });
        },

        initDataLineList: function () {
            let me = this;
            me._dataLineList = new Dolphin.LIST({
                panel: "#dataLineList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'ruleContent',
                    title: '规则内容',
                    formatter: function (val, row) {
                        let d = [];
                        d.push('<div>日期:' + row.weekDay + '</div>');
                        d.push('<div>活动门店:' + (row.shopCode && row.shopCode.length > 20 ? row.shopCode.substr(0, 20) + '...' : row.shopCode) + '</div>');
                        return d.join('');
                    }
                }, {
                    code: 'value',
                    title: '值',
                    width: '75px'
                }, {
                    code: 'statusName',
                    title: '状态',
                    width: '90px'
                }, {
                    code: 'id',
                    title: '操作',
                    width: '80px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        return org.breezee.buttons.edit({
                            id: row.id
                        });
                    }
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/00d85cbc2bb9425095a986f49dd8c166',
                data: {rows: []},
                pagination: false,
                onLoadSuccess: function () {
                    org.breezee.buttons.editCallback('00de3bfc441b41519b82e98c505efe05', "id", function (data) {
                        if (data.value.shopCode) {
                            $("#shopSelect").multipleSelect('setSelects', data.value.shopCode.split(','));
                        } else {
                            $("#shopSelect").multipleSelect('setSelects', []);
                        }
                        console.log(data.value.weekDay);
                        if (data.value.weekDay) {
                            let wd = data.value.weekDay.split(",");
                            for (let k = 0; k < wd.length; k++) {
                                $('[data-idx="' + wd[k] + '"]').attr('checked', true);
                            }
                        }
                        Dolphin.form.setValue(data.value, '#line_data_form');
                        $('#lineDataModal').modal('show');
                    });
                }
            });
        }
    };

});