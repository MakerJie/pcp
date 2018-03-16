/**
 * Created by wang,junjie on 2017/10/23.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            $("#city-picker").cityPicker({
                title: "请选择您的城市",
                showDistrict: false
            });
            $("#date-input1").picker({
                title: "请选择萌宝1的生日",
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
            $("#date-input2").picker({
                title: "请选择萌宝2的生日",
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
            this.initProduct();

        },
        initProduct: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/ac843b67de424221a24e9962e7e281b33@id=' + org.breezee.context.userData.id,
                type: Dolphin.requestMethod.GET,
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.value.babySex) {
                            $(".babyInfo").show();
                            let babySex1 = reData.value.babySex.substr(0, 1);
                            let babySex2 = reData.value.babySex.substr(2, 1);
                            reData.value.babySex1 = babySex1;
                            reData.value.babySex2 = babySex2;
                        }
                        reData.value.sex1 = reData.value.sex==1?'男':'女';
                        Dolphin.form.setValue(reData.value, '#data_form');
                        if (reData.value.hasBaby == 1) {
                            $("#radio3").attr('check', true);
                            $(".babyInfo").show();
                        } else {
                            $("#radio4").attr('check', true);
                            $(".babyInfo").hide();
                        }
                        if (reData.value.tasting == 1) {
                            $("#radio5").attr('check', true);
                        } else {
                            $("#radio6").attr('check', true);
                        }
                        if (reData.value.birthday) {
                            $("#date-input").val(reData.value.birthday.substr(0, 10));
                        }
                        if (reData.value.babyBirthDay) {
                            $(".babyInfo").show();
                            let babyBir1 = reData.value.babyBirthDay.substr(0, 10);
                            let babyBir2 = reData.value.babyBirthDay.substr(11, 10);
                            $("#date-input1").val(babyBir1);
                            $("#date-input2").val(babyBir2);
                        }
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },

        initEvent: function () {
            let me = this;
            //计算星座
            function getAstro(month, day) {
                var s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
                var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
                return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
            }


            $("#wantArea").select({
                title: "我想参加",
                items: [
                    {
                        title: "新品试吃",
                        value: "新品试吃",
                    },
                    {
                        title: "儿童披萨制作派对",
                        value: "儿童披萨制作派对",
                    },
                    {
                        title: "交友派对",
                        value: "交友派对",
                    },
                ]
            });
            $("#preference").select({
                title: "选择菜品偏好",
                multi: true,
                max:2,
                items: [
                    {
                        title: "沙拉",
                        value: "沙拉",
                    },
                    {
                        title: "披萨",
                        value: "披萨",
                    },
                    {
                        title: "意面",
                        value: "意面",
                    },
                    {
                        title: "牛排",
                        value: "牛排",
                    },
                    {
                        title: "海鲜",
                        value: "海鲜",
                    }
                ],
                beforeClose: function (d, e, f) {
                    if (d) {
                        let dd = d.split(',');
                        if (dd.length > 2) {
                            alert('最多设置2个偏好');
                            return false;
                        }
                    }
                }
            });
            $("#userTag").select({
                title: "选择标签",
                multi: true,
                max:3,
                items: [
                    {
                        title: "素食主义",
                        value: "素食主义",
                    },
                    {
                        title: "修图狂人",
                        value: "修图狂人",
                    },
                    {
                        title: "爱电商",
                        value: "爱电商",
                    },
                    {
                        title: "无肉不欢",
                        value: "无肉不欢",
                    },
                    {
                        title: "无辣不欢",
                        value: "无辣不欢",
                    },

                    {
                        title: "仪式感",
                        value: "仪式感",
                    },
                    {
                        title: "修身达人",
                        value: "修身达人",
                    },
                    {
                        title: "懒癌晚期",
                        value: "懒癌晚期",
                    },


                    {
                        title: "甜品控",
                        value: "甜品控",
                    },
                    {
                        title: "选择困难症",
                        value: "选择困难症",
                    },
                    {
                        title: "溜娃负责人",
                        value: "溜娃负责人",
                    }
                ],
                beforeClose: function (d, e, f) {
                    if (d) {
                        let dd = d.split(',');
                        if (dd.length > 3) {
                            alert('最多设置3个标签');
                            return false;
                        }
                    }
                }
            });

            $(".babyInfo").hide();
            $("#hasBabyDiv").children('input').change(function () {
                if ($(this).val() == '1') {
                    $(".babyInfo").show();
                } else {
                    $(".babyInfo").hide();
                }
            });


            $('.btn_save').click(function () {
                let data = Dolphin.form.getValue('#data_form');
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
                data.constellation="";
                if (data.bornDay) {
                    data.bornDay = data.bornDay.split(" ").join("-");
                    data.birthday = data.bornDay + " 00:00:00";
                    let birMonth = data.birthday.substr(5, 2);
                    let birDay = data.birthday.substr(8, 2);
                    let birConstellation = getAstro(birMonth, birDay);
                    data.constellation = birConstellation + "座";
                }
                data.hasBaby = $('input:radio[name="hasBaby"]:checked').val();
                data.tasting = $('input:radio[name="tasting"]:checked').val();
                data.babyBirthDay = "";
                data.babySex = "";
                if(data.hasBaby==1){
                    if (data.babyBir1) {
                        data.babyBirthDay = data.babyBirthDay + data.babyBir1.split(" ").join("-") + ",";
                    }
                    if (data.babyBir2) {
                        data.babyBirthDay = data.babyBirthDay + data.babyBir2.split(" ").join("-") + ",";
                    }
                    if (data.babySex1) {
                        data.babySex = data.babySex + data.babySex1 + ",";
                    }
                    if (data.babySex2) {
                        data.babySex = data.babySex + data.babySex2 + ",";
                    }
                }
                data.properties={
                    update:true
                };
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

            });
        }
    };
});