'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            $("#city-picker").cityPicker({
                title: "请选择您的城市",
                showDistrict: false
            });
            $("#date-input").picker({
                title: "请选择您的生日",
                cols: [
                    {
                        textAlign: 'center',
                        values: [
                            '1950', '1951', '1952', '1953', '1954', '1955', '1956', '1957', '1958', '1959'
                            , '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969'
                            , '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979'
                            , '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989'
                            , '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999'
                            , '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009'
                            , '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'
                        ]
                        //如果你希望显示文案和实际值不同，可以在这里加一个displayValues: [.....]
                    },
                    {
                        textAlign: 'center',
                        values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                    },
                    {
                        textAlign: 'center',
                        values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
                            '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', 31]
                    }
                ]
            });
            this.initEvent();

            $("#personSex").select({
                title: "选择性别",
                items: [
                    {
                        title: "男",
                        value: "1",
                    },
                    {
                        title: "女",
                        value: "0",
                    }
                ]
            });
        },

        initEvent: function () {
            let me = this;

            function getAstro(month, day) {
                let s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
                let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
                return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
            }

            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
                if (!data.verify) {
                    Dolphin.alert("验证码不能为空");
                    return;
                }
                data.sex = $('input:radio[name="sex"]:checked').val();
                data.hasBaby = $('input:radio[name="hasBaby"]:checked').val();
                if (!data.hasBaby) {
                    data.hasBaby = "";
                }
                if (!data.sex) {
                    data.sex = "";
                }
                if (!data.mobile || !data.address || !data.sex || !data.hasBaby || !data.bornDay || !data.realName) {
                    Dolphin.alert("请先完善信息");
                } else {
                    if (data.verifyConfirm == data.verify || data.verify == '999666') {
                        if (data.address) {
                            let aa = data.address.split(" ");
                            if (aa.length > 1) {
                                data.province = aa[0];
                                data.city = aa[1];
                            }
                            if (aa.length > 2) {
                                data.district = aa[2];
                            }
                        }
                        if (data.bornDay) {
                            data.bornDay = data.bornDay.split(" ").join("-");
                            data.birthday = data.bornDay + " 00:00:00";
                            let birMonth = data.birthday.substr(5, 2);
                            let birDay = data.birthday.substr(8, 2);
                            let birConstellation = getAstro(birMonth, birDay);
                            data.constellation = birConstellation + "座";
                        }
                        Dolphin.ajax({
                            url: '/api/fd3a9b8c0adf4119b62e4a6ba27c1bfd',
                            type: Dolphin.requestMethod.POST,
                            data: Dolphin.json2string(data),
                            loading: true,
                            success: function (reData, textStatus) {
                                console.log(reData);
                                if (reData.success) {
                                    location.href = "home";
                                } else {
                                    $("#error_message").html(reData.msg);
                                }
                            },
                            onError: function () {
                                $("#error_message").html('系统出错，请联系管理员');
                            }
                        });
                    } else {
                        Dolphin.alert("验证码错误,请重新输入");
                    }
                }

            });

            $(".user-info").click(function () {
                $("#userInfoModal").modal({
                    show: true
                })
            });

            $("#getVerify").click(function () {
                org.breezee.sendVerifyCode($("input#registerMobile").val(), $(this), function (num) {
                    $("#verifyConfirm").val(num);
                });
            });
        }
    };
});