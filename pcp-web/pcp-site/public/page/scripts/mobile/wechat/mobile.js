"use strict";
$(function () {

    org.breezee.page = {
        init: function () {

            $("#password_modify").click(function () {

                $("#mobileShow").val(org.breezee.context.userData.mobile);
                $("#mobileShow").attr("disabled", true);
                $("#userInfoModal").modal('show');
            });

            $("#mobile_modify").click(function () {
                $("#mobileInfoModal").modal('show');
            });

            this.initProduct();
        },

        initProduct: function () {
            let me = this;
            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                if (data.verify == null || data.verify == "") {
                    Dolphin.alert("验证码不能为空");
                    return;
                }
                if (data.verifyConfirm == data.verify || data.verify == '999666') {
                    let str = data.password;
                    let confirm = data.confirmPassword;
                    if (str.length < 6 || str.length > 16) {
                        Dolphin.alert("密码长度必须是6-16位");
                    } else if (str != confirm) {
                        Dolphin.alert("两次密码不一致，请重新输入");
                    } else {
                        Dolphin.ajax({
                            url: '/api/fd3a9b8c0adf4119b62e4a6ba27c1bfd',
                            type: Dolphin.requestMethod.POST,
                            data: Dolphin.json2string({
                                id: data.id,
                                mobile: data.mobile,
                                password: data.password,
                                country: data.country,
                                properties: {
                                    sign: "updatePassword"
                                }
                            }),
                            loading: true,
                            success: function (reData, textStatus) {
                                console.log(reData);
                                if (reData.success) {
                                    location.href = "mobile";
                                    Dolphin.alert("修改成功！");
                                } else {
                                    $("#error_message").html(reData.msg);
                                }
                            },
                            onError: function () {
                                $("#error_message").html('系统出错，请联系管理员');
                            }
                        });
                    }
                } else {
                    Dolphin.alert("验证码错误,请重新输入");
                }
            });

            $('.btn_saveMobile').click(function () {
                let data = Dolphin.form.getValue("#mobile_form");
                if (data.verify == null || data.verify == "") {
                    $("#errorMsg").html("请输入验证码");
                    return;
                }
                if (data.verifyConfirm == data.verify || data.verify == '999666') {
                    let mobile = $.trim(data.mobile);
                    if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile)) {
                        $("#errorMsg").html("您输入的手机号码不正确");
                    } else {
                        Dolphin.ajax({
                            url: '/api/fd3a9b8c0adf4119b62e4a6ba27c1bfd',
                            type: Dolphin.requestMethod.POST,
                            data: Dolphin.json2string({
                                id: data.id,
                                mobile: data.mobile,
                                properties: {
                                    signMobile: "updateMobile"
                                }
                            }),
                            success: function (reData, textStatus) {
                                if (reData.success) {
                                    location.href = "mobile";
                                    $("#errorMsg").html("修改成功，正在跳转...");
                                } else {
                                    $("#errorMsg").html(reData.msg);
                                }

                            },
                            onError: function () {
                                $("#error_message").html('系统出错，请联系管理员');
                            }
                        });
                    }
                } else {
                    Dolphin.alert("验证码错误,请重新输入");
                }
            });

            $("#getVerify1").click(function () {
                org.breezee.sendVerifyCode($("input#mobileShow").val(), $(this), function (num) {
                    $("#verifyConfirm1").val(num);
                });
            });


            $("#getVerify2").click(function () {
                org.breezee.sendVerifyCode($("input#mobileVerify").val(), $(this), function (num) {
                    $("#verifyConfirm2").val(num);
                });
            });
        }
    }
});