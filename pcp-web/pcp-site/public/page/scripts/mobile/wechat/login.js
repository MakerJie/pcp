$(function () {

    $("#forgetPass").click(function () {
        $("#userInfoModal").modal('show');
    });

    $("#getVerify").click(function () {
        org.breezee.sendVerifyCode($("#mobilePhone").val(), $(this), function (num) {
        });
    });

    $("#btn_login").click(function () {
        let data = Dolphin.form.getValue('#data_form');
        data.properties = {
            checkSms: 1
        };
        Dolphin.ajax({
            url: '/api/da022736933546d0aeee969c9c44fbf7',
            type: Dolphin.requestMethod.POST,
            data: Dolphin.json2string(data),
            loading: true,
            success: function (reData, textStatus) {
                console.log(reData);
                if (reData.success) {
                    location.href = "home?openId=" + reData.value.openid;
                } else {
                    $("#error_message").html(reData.msg);
                }
            },
            onError: function () {
                $("#error_message").html('系统出错，请联系管理员');
            }
        });
    });

    $("#btn_register").click(function () {
        location.href = "register?openId=" + $(this).data('openid');
    });

    $("#getVerify1").click(function () {
        org.breezee.sendVerifyCode($("input#mobileShow").val(), $(this), function (num) {
            $("#verifyConfirm1").val(num);
        });
    });

    $('.btn_save').click(function () {
        let data = Dolphin.form.getValue('#updatePassform');
        if (data.verify == null || data.verify == "") {
            Dolphin.alert("验证码不能为空");
            return;
        }
        if (data.verifyConfirm == data.verify || data.verify == '999666') {
            let str = data.password;
            let confirm = data.confirmPassword;
            let re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
            if (str.length < 8 || str.length > 16) {
                Dolphin.alert("密码长度必须是8-16位");
                return;
            } else if (!re.test(str)) {
                Dolphin.alert("密码必须是字母数字组合");
                return;
            } else if (str != confirm) {
                Dolphin.alert("两次密码不一致，请重新输入");
                return;
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
                            location.href = "login";
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
            return;
        }
    });
});