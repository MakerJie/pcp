function timeOut() {  //超时函数
    $("#lottyImage").rotate({
        angle: 0,
        duration: 10000,
        animateTo: 2160, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，2160是因为我要让它转6圈，就是360*6得来的
        callback: function () {
            alert('网络超时')
        }
    });
}

function btnDisable() {
    $("#lotteryBtn").attr('disabled', true);
    $("#todayCount").html(1);
    $("#remainCount").html(0);
}

function rotateFunc(awards, angle, text) {  //awards:奖项，angle:奖项对应的角度
    $('#lottyImage').stopRotate();
    $("#lottyImage").rotate({
        angle: 0,
        duration: 5000,
        animateTo: angle + 1440, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
        callback: function () {
            let data = {
                pointType: '1',
                userId: org.breezee.context.userData.id,
                amount: awards,
                name: "每日签到",
                remark:'每日签到'
            };
            Dolphin.ajax({
                url: '/api/89760b99b10f4eed9d4869d75958a071',
                type: Dolphin.requestMethod.PUT,
                data: Dolphin.json2string(data),
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        alert(text);
                        btnDisable();
                    } else {
                        alert('系统错误，请稍候再试');
                    }
                },
                onError: function () {
                    alert('系统错误，请稍候再试');
                }
            });
        }
    });
}


$(function () {
    Dolphin.ajax({
        url: '/api/95b457acbebe4fbf90499c614ad444fc',
        type: Dolphin.requestMethod.POST,
        data: Dolphin.json2string({
            properties: {
                happenTime_gt: $("#pageData").data('time'),
                happenTime_le: $("#pageData").data('time'),
                pointType: '1',
                user_id_obj_ae: org.breezee.context.userData.id
            }
        }),
        loading: true,
        success: function (reData, textStatus) {
            console.log(reData);
            if (reData.success) {
                if (reData.rows.length > 0) {
                    btnDisable();
                }
            } else {
                alert('系统错误，请稍候再试');
                btnDisable();
            }
        },
        onError: function () {
            alert('系统错误，请稍候再试');
        }
    });

    let prob = [500, 350, 100, 39, 10, 0];//概率的展现
    let arr = [5, 5, 5, 10, 20, 50, 200]; //返回的数组
    let r = Math.floor(Math.random() * 1000); //用1000乘以随机数
    let d = 0;
    if (r >= prob[0]) {
        d = 1;
    } else if (r >= prob[1]) {
        d = 2;
    } else if (r >= prob[2]) {
        d = 3;
    } else if (r >= prob[3]) {
        d = 4;
    } else if (r >= prob[4]) {
        d = 5;
    } else if (r >= 0) {
        d = 6;
    }
    //60度:20,120度:50,240度:10
    //逆时针，30度为一个
    $("#lotteryBtn").click(function () {
        if (arr[d] == 5) {
            rotateFunc(5, 180, '恭喜您抽中5积分')
        } else if (arr[d] == 10) {
            rotateFunc(10, 240, '恭喜您抽中10积分')
        } else if (arr[d] == 20) {
            rotateFunc(20, 60, '恭喜您抽中20积分')
        } else if (arr[d] == 50) {
            rotateFunc(50, 120, '恭喜您抽中50积分')
        } else if (arr[d] == 200) {
            rotateFunc(200, 300, '恭喜您抽中200积分')
        } else {
            rotateFunc(5, 180, '恭喜您抽中5积分')
        }
    });
});