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
            this.orderListSelect();
            this._pointList = this.pointList('pointList');
            this._addressList = this.addressList('addressList');
            this._saverTicketList = this.saverTicketList('saverTicketList');
            this._levelChangeList = this.levelChangeList('levelChangeList');
            Dolphin.form.parse("#userDataModal");
            Dolphin.form.parse("#query_form");
            Dolphin.form.parse("#more_condition_form");
            Dolphin.form.parseSelect($("#userChannel"));
            Dolphin.form.parseSelect($("#userChannel2"));
            Dolphin.form.parseSelect($("#levelUpdate"));
            Dolphin.form.parseSelect($("#firstShop"));

            this.initEmployeeUpload();
            this.middleware();
            this.myUser = null;
        },

        initEvent: function () {
            let me = this;

            //新增窗口弹出
            $('.btn_add').click(function () {
                Dolphin.form.empty('#userForm');
                $('#userDataModal').modal('show');
            });

            $("#selectProvince").on("change", function () {
                let module = $(this).val();
                $("#selectCity").empty();
                $("#selectCity").append("<option value=''>" + "--请选择--" + "</option>");
                $.each(Dolphin.enum.getEnum("chinaCity"), function () {
                    if (this.logName == module) {
                        let optionStr = "<option value=" + this.code + ">" + this.name + "</option>";
                        $("#selectCity").append(optionStr);
                    }
                });
            });

            $("#addProvince").on("change", function () {
                let module2 = $(this).val();
                $("#addCity").empty();
                $("#addCity").append("<option value=''>" + "--请选择--" + "</option>");
                $.each(Dolphin.enum.getEnum("chinaCity"), function () {
                    if (this.logName == module2) {
                        let optionStr2 = "<option value=" + this.code + ">" + this.name + "</option>";
                        $("#addCity").append(optionStr2);
                    }
                });
            });

            $('.btn_query').click(function () {
                let data = Dolphin.form.getValue('#query_form');
                let d2 = Dolphin.form.getValue('#more_condition_form');
                $.extend(data, d2);
                data.birthday_like = "";
                if (data._birMonStr) {
                    data.birthday_like = "-" + data._birMonStr + "-";
                }
                if (data._birDayStr) {
                    data.birthday_like += data._birDayStr + " ";
                }
                data.babyBirthDay_like = "";
                if (data._babyMonth) {
                    data.babyBirthDay_like = "-" + data._babyMonth + "-";
                }
                if (data.babyDay) {
                    data.babyBirthDay_like += data.babyDay + ",";
                }
                if (data.userTag_like) {
                    let tag = data.userTag_like;
                    data.userTag_like = tag.join();
                }
                if (data.preference_like) {
                    let prefer = data.preference_like;
                    data.preference_like = prefer.join();
                }
                console.log(data);
                data.province = Dolphin.enum.getEnumText("chinaRegion", data.province);
                $("#moreConditionModal").modal('hide');
                me._dataList.load(null, data);
            });

            $("#uLevel").change(function () {
                let d = $(this).val();
                if (d == 1) {
                    $('.star').toggle(true);
                }
                if (d == 4) {
                    $('.star').toggle(false);
                }
            });

            $("#decide").change(function () {
                let d = $(this).val();
                if (d == 1) {
                    $('#baby').toggle(true);
                }
                if (d == 0) {
                    $('#baby').toggle(false);
                }
            });

            $('#saveBtn').click(function () {
                let data = Dolphin.form.getValue("#userForm");
                data.crmChannel = "backend";
                console.log("data", data);
                if (data.cardLevel == "") {
                    Dolphin.alert("请完善用户信息！");
                } else if (data.cardLevel == "1" && (data.name == '' || data.password == '' || data.mobile == '' || data.birthday == '' || data.sex == '' || data.province == '' || data.city == '' || data.hasBaby == '')) {
                    Dolphin.alert("请完善用户信息！");
                } else if (data.cardLevel == "4" && (data.name == '' || data.password == '' || data.mobile == '')) {
                    Dolphin.alert("请完善用户信息！");
                } else {
                    if (data.preference != null && data.preference != "") {
                        let prefer = data.preference;
                        data.preference = prefer.join();
                    } else {
                        data.preference = "";
                    }

                    if (data.userTag != null && data.userTag != "") {
                        let tag = data.userTag;
                        data.userTag = tag.join();
                    } else {
                        data.userTag = "";
                    }

                    if (data.birthday != null && data.birthday != "") {
                        data.birthday = data.birthday || Dolphin.date2string(new Date(), 'yyyy-MM-dd hh:mm:ss');
                        data.birthday = data.birthday + " 00:00:00";
                        let birMonth = data.birthday.substr(5, 2);
                        let birDay = data.birthday.substr(8, 2);
                        let birConstellation = getAstro(birMonth, birDay);
                        data.constellation = birConstellation + "座";
                    }
                    let babyBirthDay = "";
                    if (data.babyBir1 != null && data.babyBir1 != "") {
                        babyBirthDay = babyBirthDay + data.babyBir1 + ",";
                    }
                    if (data.babyBir2 != null && data.babyBir2 != "") {
                        babyBirthDay = babyBirthDay + data.babyBir2 + ",";
                    }

                    let babySex = "";
                    if (data.babySex1 != null && data.babySex1 != "") {
                        babySex = babySex + data.babySex1 + ",";
                    }
                    if (data.babySex2 != null && data.babySex2 != "") {
                        babySex = babySex + data.babySex2 + ",";
                    }
                    data.province = Dolphin.enum.getEnumText("chinaRegion", data.province);
                    data.address = data.province + " " + data.city;
                    Dolphin.ajax({
                        url: '/api/fd3a9b8c0adf4119b62e4a6ba27c1bfd',
                        type: Dolphin.requestMethod.POST,
                        data: Dolphin.json2string({
                            name: data.name,
                            mobile: data.mobile,
                            password: data.password,
                            country: 68,
                            province: data.province,
                            city: data.city,
                            address: data.address,
                            constellation: data.constellation,
                            crmChannel: data.crmChannel,
                            userTag: data.userTag,
                            cardLevel: data.cardLevel,
                            sex: data.sex,
                            birthday: data.birthday,
                            babyBirthDay: babyBirthDay,
                            babySex: babySex,
                            preference: data.preference,
                            wantArea: data.wantArea,
                            hasBaby: data.hasBaby,
                            tasting: data.tasting
                        }),
                        success: function (reData, textStatus) {
                            if (reData.success) {
                                $('#userDataModal').modal('hide');
                                Dolphin.alert("保存成功!");
                                $('.btn_query').click();
                            } else {
                                $("#error_message").html(reData.msg);
                            }

                        },
                        onError: function () {
                            $("#error_message").html('系统出错，请联系管理员');
                        }
                    })
                }
            });

            $('#dataModal').on('hidden.bs.modal', function () {
                Dolphin.form.empty('#data_form');
                $("#error_message").empty();
                me.myUser = null;
            });

            $("#btn_export").click(function () {
                let data = Dolphin.form.getValue('#query_form');
                let d2 = Dolphin.form.getValue('#more_condition_form');
                $.extend(data, d2);
                data.birthday_like = "";
                if (data._birMonStr) {
                    data.birthday_like = "-" + data._birMonStr + "-";
                }
                if (data._birDayStr) {
                    data.birthday_like += data._birDayStr + " ";
                }
                data.babyBirthDay_like = "";
                if (data._babyMonth) {
                    data.babyBirthDay_like = "-" + data._babyMonth + "-";
                }
                if (data.babyDay) {
                    data.babyBirthDay_like += data.babyDay + ",";
                }
                if (data.userTag_like) {
                    let tag = data.userTag_like;
                    data.userTag_like = tag.join();
                }
                if (data.preference_like) {
                    let prefer = data.preference_like;
                    data.preference_like = prefer.join();
                }
                let dd = {
                    _module: "crm",
                    _menuCode: "user",
                    _userId: org.breezee.context.userData.userCode,
                    _userInfo: data,
                    _callbackName: 'userExportCallback',
                    _className: 'com.pcp.export.dto.DealUserExcelDto',
                    _sheetName: '会员信息表',
                    _title: '会员信息表',
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


            //计算星座
            function getAstro(month, day) {
                var s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
                var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
                return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
            }

            $("#btn_employee").click(function () {
                $("#employeeModal").modal({
                    show: true,
                    backdrop: 'static'
                });
            });

            $("#btn_save_employeeFile").click(function () {
                let dr = me.employeeUpload.data.rows, mobile = [], flag = [];
                for (let i = 0; i < dr.length; i++) {
                    mobile.push(dr[i].a1);
                    flag.push(dr[i].a2);
                }
                Dolphin.ajax({
                    url: '/api/05babadec7b04a789ab96aa992eda37a',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        mobile: mobile.join(","),
                        remark: flag.join(",")
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        $(".btn_query").click();
                        $("#employeeModal").modal('hide');
                    },
                    onError: function () {
                        Dolphin.alert("更新失败");
                    }
                });
            });

            $(".btn_send_msg").click(function () {
                Dolphin.form.empty('#msg_send_form');
                let le = $(this).data('le');
                if (le == 1) {
                    $("#msgTitle").html('发送当前选中的会员');
                    $("#sendUsers").val(le);
                    $("#uNum").html(me._dataList.getChecked().length);
                } else if (le == 2) {
                    $("#msgTitle").html('发送所有查询结果会员');
                    $("#sendUsers").val(le);
                    $("#uNum").html(me._dataList.data.total);
                }
                $("#shortMsgModal").modal({
                    show: true,
                    backdrop: 'static'
                });
            });

            $("#btn_msg_send").click(function () {
                let data = Dolphin.form.getValue("#msg_send_form");
                let sendAllUser = null, mo = [];
                if (data.sendUsers == 1) {
                    sendAllUser = me._dataList.getChecked();
                    for (let i = 0; i < sendAllUser.length; i++) {
                        mo.push(sendAllUser[i].mobile);
                    }
                } else if (data.sendUsers == 2) {

                }
                data.name = mo.join(',');
                data.sendMessage = data.content;
                data.sendMethod = "qixin";
                data.type = "promotion";
                Dolphin.ajax({
                    url: '/api/20a15b9c4a9840f08c7eb28444ca3e11',
                    type: Dolphin.requestMethod.PUT,
                    loading: true,
                    data: Dolphin.json2string(data),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $('#shortMsgModal').modal('hide');
                            Dolphin.alert("发送成功!");
                        } else {
                            $('#shortMsgModal').modal('hide');
                            Dolphin.alert(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });

            });

            $("#btn_more").click(function () {
                $("#moreConditionModal").modal();
            });

            $("#orderShow").click(function () {
                $(".btn_order_query").click();
                $("#dataModal2").modal();
            });

            $(".btn-repeal").click(function () {
                let userId = me.myUser.id,
                    status = $(this).data('status');
                Dolphin.confirm('确认' + (status ? '激活' : '冻结') + '此会员?', {
                    callback: function (flag) {
                        if (flag) {
                            Dolphin.ajax({
                                url: '/api/0588b2c56bfe47a8a41cf52d71be1215',
                                type: Dolphin.requestMethod.DELETE,
                                data: Dolphin.json2string({
                                    id: userId,
                                    status: status
                                }),
                                loading: true,
                                success: function (reData, textStatus) {
                                    if (reData.success) {
                                        $('#dataModal').modal('hide');
                                        $(".btn_query").click();
                                    } else {
                                        Dolphin.alert(reData.msg);
                                    }
                                },
                                onError: function () {
                                    $("#error_message").html('系统出错，请联系管理员');
                                }
                            });
                        }
                    }
                });
            });

            $(".btn_order_query").click(function () {
                let userFormData = Dolphin.form.getValue("#order_query_form");
                userFormData.userCode = '';
                me._orderListSelect.load(null, userFormData);
            });

            $(".btn-levelUpdate").click(function () {
                Dolphin.form.empty("#updateLevelform");
                $("#updateLevel").modal('show');
            });

            $(".btn_user_order").click(function () {
                let uid = me.myUser.cardNo;
                let ordId = me._orderListSelect.getChecked();
                if (ordId.length == 0) {
                    alert('请选择一个订单');
                    return;
                }
                if (ordId[0].userCode) {
                    alert('订单已关联会员，请选择其他订单');
                    return;
                }
                Dolphin.ajax({
                    url: '/api/984a2cdfdc1c4677b0b3222777d85e9e',
                    type: Dolphin.requestMethod.POST,
                    loading: true,
                    data: Dolphin.json2string({
                        id: ordId[0].id,
                        userCode: uid,
                        properties: {
                            _orderUser: 1
                        }
                    }),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            me._dataLineList.load(null, {userCode: me.myUser.cardNo});
                            me._pointList.load(null, {user_id_obj_ae: me.myUser.id});
                            me._saverTicketList.load(null, {
                                user_id_obj_ae: me.myUser.id
                            });
                            $("#dataModal2").modal('hide');
                        } else {
                            Dolphin.alert(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            $(".updateLevelSave").click(function () {
                let userId = me.myUser.id;
                let updateLevelform = Dolphin.form.getValue("#updateLevelform");
                updateLevelform.id = userId;
                Dolphin.ajax({
                    url: '/api/015ff57a80334adeb6057aec4065a701',
                    type: Dolphin.requestMethod.POST,
                    loading: true,
                    data: Dolphin.json2string(updateLevelform),
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            $("#updateLevel").modal('hide');
                            $("#dataModal").modal("hide");
                            $(".btn_query").click();
                        } else {
                            Dolphin.alert(reData.msg);
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            });

            $(".js-example-disabled-results").select2({});
        },

        middleware: function () {
            const me = this;
            Dropzone.options.myAwesomeDropzone = {
                paramName: 'upfile',
                maxFilesize: 3, // MB
                maxFiles: 1,
                acceptedFiles: ".csv,.txt",
                addRemoveLinks: true,
                dictDefaultMessage: '请选择或者拖动文件上传',
                dictFallbackMessage: '浏览器不支持文件上传控件',
                dictFileTooBig: '文件不可以超过{{maxFilesize}}',
                dictResponseError: '文件上传失败',
                dictRemoveFile: '移除',
                dictMaxFilesExceeded: '只能上传一个文件',
                accept: function (file, done) {
                    done();
                },
                init: function () {
                    this.on("success", function (file) {
                        me.employeeUpload.loadData({rows: eval(file.xhr.response)});
                    });
                }
            };
            $(".foodFaver").select2({
                maximumSelectionLength: 2,
                selectOnClose: false,
                allowClear: true
            });
            $(".tagSelect").select2({
                maximumSelectionLength: 3,
                selectOnClose: false,
                allowClear: true
            });

        },

        initEmployeeUpload: function () {
            let me = this;
            me.employeeUpload = new Dolphin.LIST({
                panel: "#employeeList",
                idField: 'id',
                hover: false,
                columns: [{
                    code: 'a2',
                    title: '类型',
                    width: '100px',
                    formatter: function (val) {
                        return val || 'Y';
                    }
                }, {
                    code: 'a0',
                    title: '姓名',
                }, {
                    code: 'a1',
                    title: '手机号',
                    width: '160px',
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                data: {rows: []},
                pagination: false,
                onLoadSuccess: function () {

                }
            });
        },

        initDataList: function () {
            let me = this;
            me.levelColor = ['', 'info', 'warning', 'danger', 'inverse', 'success'];
            me._dataList = new Dolphin.LIST({
                panel: "#dataList",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'realName',
                    title: '姓名',
                    className: 'td-user-img',
                    formatter: function (val, row) {
                        return '<a href="javascript:void(0);" class="viewBtn" data-id="' + row.id + '">' +
                            '<img src="' + (row.headImg || '/assets/plugins/images/users/john.jpg') + '" alt="user" class="img-circle"> ' + (row.realName || row.name) + '</a>';
                    }
                }, {
                    code: 'mobile',
                    title: '联系手机',
                    width: '120px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        return val || "-";
                    }
                }, {
                    code: 'crmChannel',
                    title: '来源',
                    width: '90px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("crmChannel", val) || '';
                    }
                }, {
                    code: 'createTime',
                    title: '注册时间',
                    width: '180px'
                }, {
                    code: 'cardNo',
                    title: '会员卡号',
                    width: '110px'
                }, {
                    code: 'age',
                    title: '年龄',
                    width: '75px'
                }, {
                    code: 'city',
                    title: '城市',
                    width: '110px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (row.province) {
                            if (row.province.indexOf("北京") > -1 || row.province.indexOf("上海") > -1 || row.province.indexOf("天津") > -1) {
                                return row.province;
                            }
                        }
                        return val;
                    }
                }, {
                    code: 'cardLevel',
                    title: '卡等级',
                    className: "hide_el",
                    width: '90px',
                    formatter: function (val) {
                        return '<span class="label label-' + me.levelColor[val] + '">' + Dolphin.enum.getEnumText('userLevel', val) + '</span>';
                    }
                }, {
                    code: 'sex',
                    title: '性别',
                    width: '75px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("sex", val);
                    }
                }, {
                    code: 'totalPoint',
                    title: '积分值',
                    width: '100px',
                    textAligh: 'right',
                    formatter: function (val) {
                        return val || '-';
                    }
                }, {
                    code: 'status',
                    title: '状态',
                    width: '85px',
                    className: "hide_el",
                    formatter(val){
                        return val == 1 ? "<span class='text-info'>激活</span>" : "<span class='text-danger'>冻结</span>";
                    }

                }],
                multiple: true,
                rowIndex: true,
                checkbox: true,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/41d7222ba7f246ceb33daaa4e5c97a0e',
                pagination: true,
                onLoadSuccess: function () {
                    me.myUser = null;
                    org.breezee.buttons.viewCallback('ac843b67de424221a24e9962e7e281b33', 'id', function (data) {
                        Dolphin.form.empty('.edit-form');
                        me._saverTicketList.load(null, {
                            user_id_obj_ae: data.value.id
                        });
                        /*      me._addressList.loadData({rows: data.value.addressLines});*/
                        me._levelChangeList.loadData({rows: data.value.upRecordInfos});
                        me._dataLineList.load(null, {userCode: data.value.cardNo});
                        me._pointList.load(null, {user_id_obj_ae: data.value.id, pageNumber: 0});

                        me.myUser = data.value;
                        console.log(me.myUser, '---------------');

                        if (data.value.sex == 1) {
                            data.value.sex = "男";
                        }
                        if (data.value.sex == 2) {
                            data.value.sex = "女";
                        }
                        let htr = data.value.babySex;
                        if (htr) {
                            data.value.babySex1 = data.value.babySex.substr(0, 1);
                            data.value.babySex2 = data.value.babySex.substr(2, 1);
                            if (data.value.babySex1 == 1) {
                                data.value.babySex1 = "男";
                            }
                            if (data.value.babySex1 == 2) {
                                data.value.babySex1 = "女";
                            }
                            if (data.value.babySex2 == 1) {
                                data.value.babySex2 = "男";
                            }
                            if (data.value.babySex2 == 2) {
                                data.value.babySex2 = "女";
                            }
                        }
                        if (data.value.hasBaby == 1) {
                            data.value.hasBaby = "有";
                        }
                        if (data.value.hasBaby == 0) {
                            data.value.hasBaby = "无";
                        }
                        if (data.value.babyBirthDay) {
                            data.value.babyBir1 = data.value.babyBirthDay.substr(0, 10);
                            data.value.babyBir2 = data.value.babyBirthDay.substr(11, 10);
                        }
                        if (data.value.tasting == 1) {
                            data.value.tasting = "是";
                        }
                        if (data.value.tasting == 0) {
                            data.value.tasting = "否";
                        }
                        if (data.value.birthday != null && data.value.birthday != "") {
                            data.value.birthday = data.value.birthday.substr(0, 10);
                        }
                        if (data.value.status == 1) {
                            data.value.status = "激活";
                        }
                        if (data.value.status == 0) {
                            data.value.status = "冻结";
                        }
                        data.value.crmChannel = Dolphin.enum.getEnumText('crmChannel', data.value.crmChannel) || "-";
                        data.value.levelName = Dolphin.enum.getEnumText('userLevel', data.value.levelName) || "-";
                        data.value.province = Dolphin.enum.getEnumText('chinaRegion', data.value.province) || "-";
                        Dolphin.form.setValue(data.value, '.edit-form');
                        $("#userTitle").html('<span style="font-size: 19px;">' + data.value.realName + '</span> #' + data.value.cardNo + ' <span style="font-size: 85%;font-weight: 700;">已' + data.value.status + '</span>');
                        $(".btn-repeal").attr("data-id", data.value.id);
                        $(".btn-activate").attr("data-id", data.value.id);
                        $("#order_userCode").val(data.value.code);
                        if (data.value.status == "激活") {
                            $("#activate").hide();
                            $("#repeal").show();
                        }
                        if (data.value.status == "冻结") {
                            $("#activate").show();
                            $("#repeal").hide();
                        }
                        $('#dataModal').modal({
                            show: true,
                            backdrop: 'static'
                        });

                        Dolphin.ajax({
                            url: '/api/2e98fa18378a45a1a776e15dc904fe3d',
                            type: Dolphin.requestMethod.POST,
                            loading: true,
                            data: Dolphin.json2string({
                                properties: {
                                    order_userCode_obj_ae: data.value.cardNo,
                                    _groupLine: 1
                                }
                            }),
                            success: function (reData, textStatus) {
                                if (reData.success) {
                                    let ht = [];
                                    for (let i = 0; i < reData.rows.length; i++) {
                                        ht.push(reData.rows[i].name + reData.rows[i].code + "=" + reData.rows[i].quantity);
                                    }
                                    if (ht.length > 0) {
                                        $("#myFavor").html(ht.join(";"));
                                    }
                                }
                            }
                        });
                    });

                },
            });
        },
        pointList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: "#" + panel,
                idField: 'id',
                hover: false,
                data: {rows: []},
                queryParams: {
                    pageSize: 100
                },
                columns: [{
                    code: 'happenTime',
                    title: '发生时间',
                    width: '180px'
                }, {
                    code: 'amount',
                    title: '积分增减',
                    width: '110px'
                }, {
                    code: 'pointType',
                    title: '积分类型',
                    width: '110px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("pointType", val);
                    }
                }, {
                    code: 'remark',
                    title: '变动原因'
                }, {
                    code: 'endTime',
                    title: '过期时间',
                    width: '180px',
                    className: "hide_el"
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/95b457acbebe4fbf90499c614ad444fc',
                pagination: true,
            });
        },

        addressList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: "#" + panel,
                idField: 'id',
                editListName: 'addressLines',
                hover: false,
                columns: [{
                    code: 'code',
                    title: '编码',
                    width: '300px'
                }, {
                    code: 'province',
                    title: '省/市',
                    width: '150px'
                }, {
                    code: 'city',
                    title: '城市',
                    width: '300px',
                    formatter: function (val, row) {
                        if (row.province) {
                            console.log(row.province);
                            if (row.province.indexOf("北京") > -1 || row.province.indexOf("上海") > -1 || row.province.indexOf("天津") > -1) {
                                return row.province;
                            }
                        }
                        return val;
                    }
                }, {
                    code: 'detail',
                    title: '详情',
                    width: '500px',
                }, {
                    code: 'consignee',
                    title: '收货人',
                    width: '300px',
                    className: "hide_el"
                }, {
                    code: 'tel',
                    title: '电话',
                    width: '300px',
                    className: "hide_el"
                }, {
                    code: 'status',
                    title: '是否为默认',
                    width: '300px',
                    className: "hide_el"
                }],
                data: {rows: []},
                multiple: false,
                rowIndex: true,
                checkbox: false,
                /*ajaxType: Dolphin.requestMethod.POST,*/
                pagination: false,
            });
        },

        saverTicketList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: "#" + panel,
                idField: 'id',
                editListName: 'addressLines',
                data: {rows: []},
                hover: false,
                queryParams: {
                    pageSize: 1000
                },
                columns: [{
                    code: 'name',
                    title: '优惠券名称'
                }, {
                    code: 'fetchDate',
                    title: '获得时间',
                    width: '180px'
                }, {
                    code: 'couponType.couponType',
                    title: '券类型',
                    width: '130px',
                    formatter: function (val, row) {
                        if (val) {
                            return Dolphin.enum.getEnumText("couponType", val);
                        }
                        return "-";
                    }
                }, {
                    code: 'activeDate',
                    title: '有效期',
                    width: '210px',
                    formatter: function (val, row) {
                        return (val ? val.substr(0, 10) : '-') + '~' + (row.expireDate ? row.expireDate.substr(0, 10) : '-');
                    }
                }, {
                    code: 'statusName',
                    title: '券状态',
                    width: '90px',
                    className: "hide_el"
                }, {
                    code: 'fetchMethod',
                    title: '来源',
                    width: '100px',
                    className: "hide_el",
                    formatter: function (val, row) {
                        if (row.transferUser) {
                            val = 'transfer';
                        }
                        return Dolphin.enum.getEnumText("couponMethod", val);
                    }
                }],
                multiple: false,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/0036e34aceb04f5297a5f9b4171b2d65',
                pagination: false,
                onLoadSuccess: function (data) {
                    $("#giftCount").html(data.total);
                }
            });
        },
        levelChangeList: function (panel) {
            let me = this;
            return new Dolphin.LIST({
                panel: "#" + panel,
                idField: 'id',
                editListName: 'addressLines',
                hover: false,
                columns: [{
                    code: 'createTime',
                    title: '等级变动时间',
                    width: '180px'
                }, {
                    code: 'name',
                    title: '变动类型',
                    width: '170px',
                    formatter(data){
                        return Dolphin.enum.getEnumText('gradeChangeStatus', data) || "-";
                    }
                }, {
                    code: 'beforeLevel',
                    title: '变动前等级',
                    width: '130px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("userLevel", val);
                    }
                }, {
                    code: 'afterLevel',
                    title: '变动后等级',
                    width: '130px',
                    formatter: function (val) {
                        return Dolphin.enum.getEnumText("userLevel", val);
                    }
                }, {
                    code: 'remark',
                    title: '变动原因',
                    className: "hide_el"
                }, {
                    code: 'creator',
                    title: '变动操作人',
                    width: '150px',
                    className: "hide_el"
                }],
                data: {rows: []},
                multiple: false,
                rowIndex: true,
                checkbox: false,
                /* ajaxType: Dolphin.requestMethod.POST,*/
                pagination: false,
                onLoadSuccess: function (data) {
                    console.log(data);
                }
            });
        },

        initDataLineList: function () {
            let me = this;
            me._dataLineList = new Dolphin.LIST({
                panel: "#orderList",
                idField: 'id',
                queryParams: {
                    pageSize: 1000
                },
                hover: false,
                columns: [{
                    code: 'code',
                    title: '订单号',
                    width: '140px'
                }, {
                    code: 'userCode',
                    title: '会员信息',
                    width: '110px'
                }, {
                    code: 'happenTime',
                    title: '消费时间',
                    width: '170px'
                }, {
                    code: 'method',
                    title: '消费方式',
                    width: '130px',
                    formatter: function (val) {
                        return val && Dolphin.enum.getEnumText('saleMethod', val);
                    }
                }, {
                    code: 'name',
                    title: '消费门店',
                    formatter: function (val) {
                        return val || '未知门店';
                    }
                }, {
                    code: 'subAmount',
                    title: '实付金额',
                    width: '100px',
                    className: "hide_el"
                }],
                multiple: true,
                rowIndex: true,
                checkbox: false,
                ajaxType: Dolphin.requestMethod.POST,
                data: {rows: []},
                //url: '/api/7b5e3f88ed474fe4a9b356bd7c681626',
                pagination: false,
                onLoadSuccess: function (data) {
                    $("#orderCount").html(data.total);
                }
            });
        },

        orderListSelect: function () {
            let me = this;
            me._orderListSelect = new Dolphin.LIST({
                panel: "#orderListSelect",
                idField: 'id',
                hover: false,
                queryParams: {},
                columns: [{
                    code: 'code',
                    title: '订单号',
                    width: '130px'
                }, {
                    code: 'happenTime',
                    title: '消费时间',
                    width: '180px'
                }, {
                    code: 'name',
                    title: '门店',
                }, {
                    code: 'totalAmount',
                    title: '金额',
                    width: '90px',
                }, {
                    code: 'userCode',
                    title: '会员',
                    width: '150px'
                }],
                multiple: false,
                rowIndex: false,
                checkbox: true,
                loading: true,
                data: {rows: []},
                ajaxType: Dolphin.requestMethod.POST,
                url: '/api/7b5e3f88ed474fe4a9b356bd7c681626',
                pagination: true,
            });
        },

    };
});