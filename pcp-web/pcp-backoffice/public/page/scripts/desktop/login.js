/*
 * Copyright (c) 2016 Breezee.org. All Rights Reserved. 
 */

$(function () {
    $("#login_btn").click(function () {
        let data = Dolphin.form.getValue('form');
        if(!data.code){
            $('.error-mess').css('display','block');
            $('#error-message').html('用户名不可为空');
            return;
        }
        if(!data.password){
            $('.error-mess').css('display','block');
            $('#error-message').html('密码不可以为空');
            return;
        }
        let redirectUrl = $(this).data('redirect') || '/index';
        Dolphin.ajax({
            url: '/api/login',
            type: Dolphin.requestMethod.POST,
            data: Dolphin.json2string(data),
            success: function (reData, textStatus) {
                if(!reData.success){
                    $('.error-mess').css('display','block');
                    $('#error-message').html(reData.msg || '服务出错，请联系管理员');
                }else{
                    $('.error-mess').css('display','none');
                    Dolphin.goUrl(redirectUrl);
                }
                $('#login_btn').removeAttr("disabled").html("登录");
            },
            onError: function () {
                $('#login_btn').removeAttr("disabled").html("登录");
            },
            onComplete:function () {
            }
        });
        $('#login_btn').attr("disabled", true).html("正在登录中...");
    });

    $("input[name='password']").keydown(function (e) {
        if (e.keyCode === 13) {
            $('#login_btn').click();
        }
    });
});