/**
 * Created by wang,junjie on 2017/8/30.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            this.initEvent();
            this.orderList("#orderList");
            this.passList("#passList");
            Dolphin.form.parseSelect($("#shopName1"));
            Dolphin.form.parseSelect($("#contractStatus"));

        },

        initEvent: function () {
            let me = this;
            $(".btn-select").click(function () {
                let dd= Dolphin.form.getValue('#order-form');
                me._orderList.load(null,dd);
                me._passList.load(null,dd);
            });

            $(".confirmPass").click(function () {
                let sd = me._orderList.getChecked();
                console.log(sd);
                if(sd.length>0){
                    let rd = [];
                    for(let h=0;h<sd.length;h++){
                        rd.push({
                            id:sd[h].id,
                            passDate:sd[h].rentEndDate,
                            shopCode:sd[h].shopCode,
                            dn:sd[h].dn,
                            passAmount:sd[h].passAmount,
                            rentStartDate:sd[h].rentStartDate.substr(0,10),
                            rentEndDate:sd[h].rentEndDate.substr(0,10),
                            taxAmount:sd[h].taxAmount,
                            shopName:sd[h].shopName,
                            addRentId:sd[h].addRentId,
                            remark:sd[h].dn+"&"+sd[h].rentStartDate.substr(0,10)+"&-&"+sd[h].rentEndDate.substr(0,10)+"&"+sd[h].passAmount
                        });

                    }
                    Dolphin.confirm('确认过账至SAP，过账后不可更改?', {
                        callback: function (flag) {
                            if (flag) {
                                Dolphin.ajax({
                                    url: '/api/db843a48b37e4a33a4d7ba8bf5dfb298',
                                    type: Dolphin.requestMethod.POST,
                                    loading: true,
                                    data: Dolphin.json2string({
                                        contractPassInfos:rd
                                    }),
                                    success: function (reData, textStatus) {
                                        if (reData.success) {
                                            $('#ConditionModal3').modal('hide');
                                            $(".btn-select").click();
                                        } else {
                                            $('#ConditionModal3').modal('hide');
                                            Dolphin.alert(reData.msg);
                                        }
                                    },
                                    onError: function () {
                                        Dolphin.alert('系统出错，请联系管理员');
                                    }
                                });
                            }
                        }
                    });
                }else{
                    Dolphin.alert("请先选择要过账的数据!");
                }

            });



        },

        orderList: function () {
            let me = this;
            me._orderList = new Dolphin.LIST({
                panel: "#orderList",
                idField: 'id',
                hover: false,
                editFlag: true,
                editBtn:false,
                addBtn:false,
                data:{rows:[]},
                panelType: 'panel-warning',
                columns: [{
                    code: 'shopCode',
                    title: '门店编码',
                    width:'110px',
                    formatter(val,row){
                        return val+"<br/>"+row.dn;
                    }
                },{
                    code: 'shopName',
                    title: '门店名称',
                    width:'110px',
                    formatter(val,row){
                        return val;
                    }
                },{
                    code: 'rentStartDate',
                    title: '起始日期',
                    width:'110px',
                    formatter(val,row){
                        return val.substr(0,10);
                    }
                }, {
                    code: 'rentEndDate',
                    title: '结束日期',
                    width: '110px',
                    formatter(val,row){
                        return val.substr(0,10);
                    }

                },{
                    code: 'baseAmount',
                    title: '基本租金',
                    width: '130px',
                    formatter(val,row){
                        return val;
                    }
                }, {
                    code: 'deductAmount',
                    title: '提成租金',
                    width: '130px',
                    formatter(val,row){
                        if (!isNaN(val)){
                            var result = (val.toString()).indexOf(".");
                            if(result != -1) {
                                return val.toFixed(2);
                            } else {
                                return val;
                            }
                        }else{
                            return "-";
                        }

                    }
                },{
                    code: 'taxAmount',
                    title: '参考金额',
                    width: '130px',
                    formatter(val,row){
                        return val.toFixed(2);
                    }
                }, {
                    code: 'passAmount',
                    title: '过账金额',
                    width: '130px',
                    formatter: function (val, row) {
                        let input = $('<input class="form-control" placeholder="过账金额" id="passAmount" listname="passAmount" >');
                            input.val(row.taxAmount.toFixed(2));
                            row.passAmount=row.taxAmount;
                        input.change(function () {
                            row.passAmount = $(this).val();
                        });
                        return input;
                    }

                }, {
                    code: 'status',
                    title: '状态',
                    width: '80px',
                    formatter: function (val, row) {
                    if(val==1){
                        return "未过账";
                    }
                    if(val==2){
                        return "已过账";
                    }
                }

            }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                pagination: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/9924938b41924cb384fcf4a9dc40aff2',
            })
        },

        passList: function () {
            let me = this;
            me._passList = new Dolphin.LIST({
                panel: "#passList",
                idField: 'id',
                hover: false,
                editFlag: false,
                editBtn:false,
                addBtn:false,
                panelType: 'panel-warning',
                columns: [{
                    code: 'shopCode',
                    title: '门店编码',
                    width:'110px',
                    formatter(val,row){
                        return val+"<br/>"+row.dn;
                    }
                },{
                    code: 'shopName',
                    title: '门店名称',
                    width:'110px',
                    formatter(val,row){
                        return val;
                    }
                },{
                    code: 'rentStartDate',
                    title: '起始日期',
                    width:'110px',
                    formatter(val,row){
                        return val;
                    }
                }, {
                    code: 'rentEndDate',
                    title: '结束日期',
                    width: '110px',
                    formatter(val,row){
                        return val;
                    }

                },{
                    code: 'baseAmount',
                    title: '基本租金',
                    width: '130px',
                    formatter(val,row){
                        return val;
                    }
                }, {
                    code: 'deductAmount',
                    title: '提成租金',
                    width: '130px',
                    formatter(val,row){
                        if (!isNaN(val)){
                            var result = (val.toString()).indexOf(".");
                            if(result != -1) {
                                return val.toFixed(2);
                            } else {
                                return val;
                            }
                        }else{
                            return "-";
                        }
                    }
                }, {
                    code: 'taxAmount',
                    title: '参考金额',
                    width: '130px',
                    formatter(val,row){
                        return val;
                    }
                }, {
                    code: 'passAmount',
                    title: '过账金额',
                    width: '130px',
                    formatter: function (val, row) {
                        return val;
                    }

                }, {
                    code: 'status',
                    title: '状态',
                    width: '80px',
                    formatter: function (val, row) {
                        if(val==1){
                            return "未过账";
                        }
                        if(val==2){
                            return "已过账";
                        }
                    }

                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                pagination: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/5c9a3f35f1304368bba68e66e7fda2dd',
            })
        },

    };
});
