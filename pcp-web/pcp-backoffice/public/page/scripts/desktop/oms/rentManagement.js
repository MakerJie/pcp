'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS([],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");

            this.initEvent();
            this.initDataList();
            this.editList();
            this.moneyList();
            this.moneyList2();
            this.rantList();

            Dolphin.form.parseSelect($("#shopName"));
            Dolphin.form.parseSelect($("#shopName1"));
            Dolphin.form.parseSelect($("#shopName2"));
            Dolphin.form.parseSelect($("#shopName3"));
        },

        initEvent: function () {
            let me = this;
            //新增窗口弹出
            $('.btn_add').click(function () {
                Dolphin.form.empty("#dataModal");
                me._editList.empty();
                me._rantList.empty();
                me._moneyList.empty();
                me._moneyList2.empty();
                $('#dataModal').modal('show');
            });

            $('.btn_query').click(function () {
                me._dataList.load(null,Dolphin.form.getValue('#query_form'));
            });

            $('#saveBtn').click(function () {
                let data=Dolphin.form.getValue("#userForm");
                if(data.takeEffectDate!=null){
                    data.takeEffectDate=data.takeEffectDate+" 00:00:00";
                }
                if(data.invalidDate!=null){
                    data.invalidDate=data.invalidDate+" 00:00:00";
                }

                Dolphin.ajax({
                    url: '/api/d51d3c7c8dfa4b3d8c9e8a9b5b1e01dc',
                    type: Dolphin.requestMethod.PUT,
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
            $(".btn_saveRule").click(function () {
                let typeObject = me._dataList.getChecked()[0];
                typeObject.rentModel=$("#rentModel").val();
                typeObject.commissionRent=$("#commissionRent").val();
                let data2=me._moneyList.getRows();
                let data3=me._moneyList2.getRows();
                let data4=me._editList.getRows();
                let data5=me._rantList.getRows();
                for(let i=0;i<data2.length;i++){
                    if(data2[i].rentStartDate!=null&&data2[i].rentStartDate!=""){
                        data2[i].rentStartDate=data2[i].rentStartDate+" 00:00:00";
                    }
                    if(data2[i].rentEndDate!=null&&data2[i].rentEndDate!=""){
                        data2[i].rentEndDate=data2[i].rentEndDate+" 00:00:00";
                    }
                    data2[i].shopCode=typeObject.shopCode;
                    if(data2[i].taxAmount!=null&&data2[i].taxAmount!="") {
                        data2[i].taxAmount = data2[i].taxAmount.toFixed(2);
                    }
                }
                for(let j=0;j<data3.length;j++){
                    if(data3[j].addStartDate!=null&&data3[j].addStartDate!=""){
                        data3[j].addStartDate=data3[j].addStartDate+" 00:00:00";
                    }
                    if(data3[j].addEndDate!=null&&data3[j].addEndDate){
                        data3[j].addEndDate=data3[j].addEndDate+" 00:00:00";
                    }
                    data3[j].shopCode=typeObject.shopCode;
                    if(data3[j].deductionRate!=null&&data3[j].deductionRate!="") {
                        data3[j].deductionRate = data3[j].deductionRate.toFixed(2);
                    }
                }
                typeObject.rentMoneyLines = data2;
                typeObject.addRentLines = data3;
                typeObject.rentMoneyMainInfoList=data4;
                typeObject.addRentMainInfoList=data5;

                typeObject.properties = {
                    _saveRule:1
                };
                Dolphin.ajax({
                    url: '/api/d51d3c7c8dfa4b3d8c9e8a9b5b1e01dc',
                    type: Dolphin.requestMethod.PUT,
                    data: Dolphin.json2string(typeObject),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#ruleDataModal').modal('hide');
                            Dolphin.alert("保存成功！");
                        } else {
                            $("#error_message").html(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            window.confirmDuration=function(beginDate,endDate) {
                let durationStart=beginDate;
                let durationEnd=endDate;
                let dayAll=getDayAll(durationStart,durationEnd);//区间内的所有日期



                let xi=getWeek(durationStart);//起始日期是星期几
                let yu=getWeek(durationEnd);
                let firstMon;
                if(xi!=1){
                    firstMon=7-xi;
                }else{
                    firstMon=-1;
                }
                let firstMonday=dayAll[firstMon+1];//第一个星期一
                let fml=dayAll[firstMon];
                let monArray=getWeekAll(firstMonday,durationEnd);//所有的周一


                let firstSun=dayAll[firstMon+7];
                let sunArray=getWeekAll(firstSun,durationEnd);//所有的周日

                let durationData=[];
                if(xi==1){
                    if(yu==7){
                        for(let i=0;i<sunArray.length-1;i++){
                            durationData.push({
                                rentStartDate: monArray[i],
                                rentEndDate: sunArray[i],
                                duration:7
                            });
                        }
                        durationData.push({
                            rentStartDate: monArray[sunArray.length-1],
                            rentEndDate: sunArray[sunArray.length-1],
                            duration:7
                        });
                    }else{
                        for(let i=0;i<sunArray.length;i++){
                            durationData.push({
                                rentStartDate: monArray[i],
                                rentEndDate: sunArray[i],
                                duration:7
                            });
                        }

                        let days1=getDayAll(monArray[monArray.length-1],durationEnd);
                        durationData.push({
                            rentStartDate: monArray[monArray.length-1],
                            rentEndDate: durationEnd,
                            duration:days1.length
                        });
                    }

                }else{

                    if(yu==7){
                        let days2=getDayAll(durationStart,fml);
                        durationData.push({
                            rentStartDate: durationStart,
                            rentEndDate: fml,
                            duration:days2.length
                        });

                        for(let j=0;j<sunArray.length-1;j++){
                            durationData.push({
                                rentStartDate: monArray[j],
                                rentEndDate: sunArray[j],
                                duration:7
                            });
                        }
                        durationData.push({
                            rentStartDate: monArray[sunArray.length-1],
                            rentEndDate: sunArray[sunArray.length-1],
                            duration:7
                        });
                    }else{
                        let days3=getDayAll(durationStart,fml);
                        durationData.push({
                            rentStartDate: durationStart,
                            rentEndDate: fml,
                            duration:days3.length
                        });

                        for(let j=0;j<sunArray.length;j++){
                            durationData.push({
                                rentStartDate: monArray[j],
                                rentEndDate: sunArray[j],
                                duration:7
                            });
                        }
                        let days4=getDayAll(monArray[monArray.length-1],durationEnd);
                        durationData.push({
                            rentStartDate: monArray[monArray.length-1],
                            rentEndDate: durationEnd,
                            duration:days4.length
                        });
                    }
                }
                return durationData;
            };

            $("#durationConfirm").click(function () {
                let data1=me._editList.data.rows;
                let rentModel=$("#rentModel").val();
                let contractTaxRate=$("#contractTaxRate").val();
                let rentArea=$("#rentArea").val();
                let tax=1+contractTaxRate/100;
                let money=0;
                let ret = [];
                if("固定月租金"==rentModel) {
                    for(let i=0;i<data1.length;i++){
                        money=parseFloat(money)+parseFloat(data1[i].taxAmount);
                        let begin=data1[i].rentStartDate;
                        let end=data1[i].rentEndDate;
                        let durationData=confirmDuration(begin,end);
                        ret = ret.concat(durationData);
                    }
                    money = parseFloat(money) / tax;
                }
                if("固定日租金"==rentModel) {
                    for(let i=0;i<data1.length;i++){
                        let begin=data1[i].rentStartDate;
                        let end=data1[i].rentEndDate;
                        let total=getDayAll(begin,end);
                        money=parseFloat(money)+parseFloat(data1[i].taxAmount)*(total.length);
                        let durationData=confirmDuration(begin,end);
                        ret = ret.concat(durationData);
                    }
                    money=money*rentArea/tax;
                }
                let k=0;
                $.each(ret,function () {
                    k+=this.duration;
                });
                let everyMoney=parseFloat(money)/k;
                let finsh=[];
                let tmpMoney=0;
                for(let j=0;j<ret.length-1;j++){
                    tmpMoney+=ret[j].duration*everyMoney;
                    finsh.push({
                        rentStartDate: ret[j].rentStartDate,
                        rentEndDate: ret[j].rentEndDate,
                        taxAmount:ret[j].duration*everyMoney,
                        duration:ret[j].duration,
                    });
                }
                finsh.push({
                    rentStartDate: ret[ret.length-1].rentStartDate,
                    rentEndDate: ret[ret.length-1].rentEndDate,
                    taxAmount:money-tmpMoney,
                    duration:ret[ret.length-1].duration,
                });

                me._moneyList.loadData({rows: finsh});
                $('#ConditionModal').modal('hide');
            });

            $("#durationConfirm2").click(function () {
                let data1=me._rantList.data.rows;
                let commissionRent=$("#commissionRent").val();
                let contractTaxRate=$("#contractTaxRate").val();
                let tax=1+contractTaxRate/100;
                let ret = [];
                for(let i=0;i<data1.length;i++){
                       let mm=[];
                       let begin=data1[i].addStartDate;
                       let end=data1[i].addEndDate;
                       let durationData=confirmDuration(begin,end);
                    if("含税金额"==commissionRent){
                        $.each(durationData,function () {
                            mm.push({
                                addStartDate:this.rentStartDate,
                                addEndDate:this.rentEndDate,
                                deductionRate:data1[i].deductionRate/100/tax,
                                addDuration:this.duration
                            });
                        });
                    }

                    if("不含税金额"==commissionRent){
                        $.each(durationData,function () {
                            mm.push({
                                addStartDate:this.rentStartDate,
                                addEndDate:this.rentEndDate,
                                deductionRate:data1[i].deductionRate/100,
                                addDuration:this.duration
                            });
                        });
                    }
                       ret = ret.concat(mm);
                }

                me._moneyList2.loadData({rows: ret});
                $('#ConditionModal2').modal('hide');

            });

            Date.prototype.format=function (){
                let s='';
                s+=this.getFullYear()+'-';          // 获取年份。
                s+=(this.getMonth()+1)+"-";         // 获取月份。
                s+= this.getDate();                 // 获取日。
                return(s);                          // 返回日期。
            };

            function getWeekAll(begin,end){
                if(!begin)
                    return [];
                console.log(begin);
                let dateAllArr = new Array();
                let ab = begin.split("-");
                let ae = end.split("-");
                let db = new Date();
                db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
                let de = new Date();
                de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
                let unixDb=db.getTime();
                let unixDe=de.getTime();
                for(let k=unixDb;k<=unixDe;){
                    dateAllArr.push((new Date(parseInt(k))).format().toString());
                    k=k+7*24*60*60*1000;
                }
                return dateAllArr;
            };

            function getDayAll(begin,end){
                let dateAllArr = new Array();
                let ab = begin.split("-");
                let ae = end.split("-");
                let db = new Date();
                db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
                let de = new Date();
                de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
                let unixDb=db.getTime();
                let unixDe=de.getTime();
                for(let k=unixDb;k<=unixDe;){
                    dateAllArr.push((new Date(parseInt(k))).format().toString());
                    k=k+24*60*60*1000;
                }
                return dateAllArr;
            }

            function getWeek(dateString){
                let dateArray = dateString.split("-");
                let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
                return "7123456".charAt(date.getDay());
            };

        },

        initDataList: function () {
            let me = this;
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'code',
                    title: '合同编码',
                    width: '150px',
                }, {
                    code: 'contractType',
                    title: '合同类型',
                    width: '150px',

                }, {
                    code: 'invalidDate',
                    title: '合同期限',
                    width: '150px',
                    formatter(val){
                      if(val!=null&&val!=""){
                          return val.substr(0,10);
                      }else{
                          return "-";
                      }

                    }
                },{
                    code: 'shopCode',
                    title: '门店编码',
                    width: '150px',
                    formatter: function (val, row, index) {
                        return row.shopCode+"<br/>"+row.dn;
                    }
                },{
                    code: 'shopName',
                    title: '门店名称',
                    width: '150px',
                },{
                    code: 'id',
                    title: '&nbsp;',
                    width: '150px',
                    className: "hide_el",
                    formatter: function (val, row, index) {
                        if(row.contentClause){
                            return org.breezee.buttons.view({
                                    id: row.id
                                })+ '&nbsp;&nbsp;' + org.breezee.buttons.del({
                                    id: row.id
                                }) + '&nbsp;&nbsp;'+'<a class="editRuleBtn" ' +
                                'data-id="' + row.id + '" href="javascript:void(0);">' +
                                '<i class="fa fa-cube"></i></a>';
                        }else{
                            return org.breezee.buttons.view({
                                    id: row.id
                                })+ '&nbsp;&nbsp;' + org.breezee.buttons.del({
                                    id: row.id
                                });
                        }

                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/cbf4becec0bd48fda6918cf452cfc56c',
                pagination: true,
                onLoadSuccess: function (data) {

                    org.breezee.buttons.viewCallback('e0d666b116fd47758a7560f7d1fe5c2c','id',function (data) {
                        if(data.value.takeEffectDate!=null&&data.value.takeEffectDate!=""){
                            data.value.takeEffectDate=data.value.takeEffectDate.substr(0,10);
                        }
                        if(data.value.invalidDate!=null&&data.value.invalidDate!=""){
                            data.value.invalidDate=data.value.invalidDate.substr(0,10);
                        }
                        Dolphin.form.setValue(data.value, '#dataModal');
                        $('#dataModal').modal('show');
                    });
                    org.breezee.buttons.delCallback('c983d920714642b29d3945b723fe3545',function (data) {
                        $('.btn_query').click();
                    });
                    $(".editRuleBtn").click(function () {
                        $("#typeId").val($(this).data('id'));
                        let foreignId = $(this).data('id');
                        Dolphin.ajax({
                            url: '/api/e0d666b116fd47758a7560f7d1fe5c2c@id=' + foreignId,
                            type: Dolphin.requestMethod.GET,
                            loading: true,
                            onSuccess: function (reData) {
                                $.each(reData.value.rentMoneyLines,function () {
                                  this.rentStartDate=this.rentStartDate.substr(0,10);
                                    this.rentEndDate=this.rentEndDate.substr(0,10);
                                });
                                $.each(reData.value.addRentLines,function () {
                                    this.addStartDate=this.addStartDate.substr(0,10);
                                    this.addEndDate=this.addEndDate.substr(0,10);
                                });


                                let d = reData.value.contentClause;
                                if (d) {
                                    $('#rentModel2').show();
                                    $('#commissionRent2').show();
                                }else{
                                    $('#rentModel2').hide();
                                    $('#commissionRent2').hide();
                                }


                                $("#rentModel").val(reData.value.rentModel);
                                $("#commissionRent").val(reData.value.commissionRent);
                                $("#contractTaxRate").val(reData.value.taxRate);
                                $("#rentArea").val(reData.value.rentArea);
                                me._moneyList.loadData({rows: reData.value.rentMoneyLines});
                                me._moneyList2.loadData({rows:reData.value.addRentLines});
                                let sign=1;
                                if(reData.value.rentMoneyLines){
                                    $.each(reData.value.rentMoneyLines,function () {
                                        if(this.status==2){
                                            sign=2;
                                        }
                                    });
                                }

                                if(reData.value.addRentLines){
                                    $.each(reData.value.addRentLines,function () {
                                        if(this.status==2){
                                            sign=2;
                                        }
                                    });
                                }

                                if(sign==2){
                                    $("#saveRule").hide();
                                }else{
                                    $("#saveRule").show();
                                }

                                me._editList.loadData({rows: reData.value.rentMoneyMainInfoList});
                                me._rantList.loadData({rows:reData.value.addRentMainInfoList});
                                $('#ruleDataModal').modal({
                                    show: true,
                                    backdrop: 'static'
                                });
                            }
                        });
                    });
                }
            });
        },


        editList: function () {
            const me = this;
            this._editList = new Dolphin.LIST({
                panel: "#editList",
                idField: 'id',
                hover: false,
                queryParams: {},
                editFlag: true,
                editBtn:true,
                data:{rows:[{}]},
                addBtn:true,
                panelType: 'panel-warning',
                columns: [{
                    code: 'rentStartDate',
                    title: '起始日期',
                    width:'110px',
                    formatter: function (val, row) {
                            let input = $("<input type='text' name='rentStartDate' class='form-control'>");
                            input.datepicker({
                                format: "yyyy-mm-dd",
                                language: navigator.language,
                                autoclose: true,
                            });
                            input.change(function () {
                                row.rentStartDate = input.val();
                            });
                            return input;
                    }

                }, {
                    code: 'rentEndDate',
                    title: '结束日期',
                    width: '110px',
                    formatter: function (val,row) {
                        let input = $("<input type='text' name='rentEndDate'  class='form-control'>");
                        input.datepicker({
                            format: "yyyy-mm-dd",
                            language: navigator.language,
                            autoclose: true,
                        });
                        input.change(function () {
                            row.rentEndDate = input.val();
                        });
                        return input;
                    }

                }, {
                    code: 'taxAmount',
                    title: '含税金额',
                    width: '130px',
                }],
                multiple: false,
                rowIndex: false,
                checkbox: false,
                pagination: false,
            })
        },
        moneyList: function () {
            const me = this;
            this._moneyList = new Dolphin.LIST({
                panel: "#moneyList",
                idField: 'id',
                hover: false,
                queryParams: {},
                editFlag: false,
                editBtn:false,
                addBtn:false,
                panelType: 'panel-warning',
                columns: [{
                    code: 'rentStartDate',
                    title: '起始日期',
                    width:'110px',
                }, {
                    code: 'rentEndDate',
                    title: '结束日期',
                    width: '110px',

                }, {
                    code: 'duration',
                    title: '天数',
                    width: '100px',
                },{
                    code: 'taxAmount',
                    title: '金额',
                    width: '130px',
                    formatter(val){
                        return val.toFixed(2);
                    }
                },],
                multiple: false,
                rowIndex: false,
                checkbox: false,
                data: {rows: []},
                pagination: false,
            })
        },


        //提成租金
        rantList: function () {
            let me = this;
            me._rantList = new Dolphin.LIST({
                panel: "#rantList",
                idField: 'id',
                hover: false,
                queryParams: {},
                data:{rows:[{}]},
                editFlag: true,
                editBtn:true,
                addBtn:true,
                panelType: 'panel-warning',
                columns: [{
                    code:'addStartDate',
                    title: '起始日期',
                    width: '110px',
                    formatter: function (val,row) {
                        let input = $("<input type='text'name='addStartDate'  class='form-control'>");
                        input.datepicker({
                            format: "yyyy-mm-dd",
                            language: navigator.language,
                            autoclose: true,
                        });
                        input.change(function () {
                            row.addStartDate = input.val();
                        });
                        return input;
                    }
                }, {
                    code:'addEndDate',
                    title: '结束日期',
                    width: '110px',
                        formatter: function (val,row) {
                            let input = $("<input type='text' name='addEndDate'  class='form-control'>");
                            input.datepicker({
                                format: "yyyy-mm-dd",
                                language: navigator.language,
                                autoclose: true,
                            });
                            input.change(function () {
                                row.addEndDate = input.val();
                            });
                            return input;
                        }

                }, {
                    code: 'deductionRate',
                    title: '扣率',
                    width: '130px',
                },],
                multiple: false,
                rowIndex: false,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                pagination: false,
            });
        },

        moneyList2: function () {
            let me = this;
            me._moneyList2 = new Dolphin.LIST({
                panel: "#moneyList2",
                idField: 'id',
                hover: false,
                queryParams: {},
                editFlag: false,
                editBtn:false,
                addBtn:false,
                panelType: 'panel-warning',
                columns: [{
                    code:'addStartDate',
                    title: '起始日期',
                    width: '110px',
                }, {
                    code:'addEndDate',
                    title: '结束日期',
                    width: '110px',

                }, {
                    code: 'addDuration',
                    title: '天数',
                    width: '100px',
                },{
                    code: 'deductionRate',
                    title: '扣率',
                    width: '130px',
                    formatter(val){
                        var result = (val.toString()).indexOf(".");
                        if(result != -1) {
                            return val.toFixed(2);
                        } else {
                           return val;
                        }
                    }
                },],
                multiple: false,
                rowIndex: false,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                data: {rows: []},
                pagination: false,
            });
        },

    };
});
