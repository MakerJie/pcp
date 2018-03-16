$(function () {
    org.breezee.page = {
        init: function () {
            this.initCard();
            this.initAdv();
            this.initPoint();

            $("#cardBlock").click(function () {
                $("#userInfoModal").modal('show');
            });

            JsBarcode("#barCode", org.breezee.context.userData.cardNo, {
                text: org.breezee.context.userData.cardNo,
                format: "CODE39",//选择要使用的条形码类型
                height: 100,//高度
                displayValue: true,//是否在条形码下方显示文字
                font: "fantasy",//设置文本的字体
                textAlign: "center",//设置文本的水平对齐方式
                textPosition: "top",//设置文本的垂直位置
                textMargin: 5,//设置条形码和文本之间的间距
                fontSize: 15,//设置文本的大小
                background: "#eee",//设置条形码的背景
                lineColor: "#2196f3",//设置条和文本的颜色。
                margin: 15//设置条形码周围的空白边距
            });

            Dolphin.ajax({
                url: '/api/2e98fa18378a45a1a776e15dc904fe3d',
                type: Dolphin.requestMethod.POST,
                loading: true,
                data: Dolphin.json2string({
                    properties: {
                        order_userCode_obj_ae: org.breezee.context.userData.cardNo,
                        _groupLine: 1
                    }
                }),
                success: function (reData, textStatus) {
                    if (reData.success) {
                        console.log(reData.rows);
                        let ht = [];
                        for (let i = 0; i < reData.rows.length; i++) {
                            ht.push("<p>"+(reData.rows[i].name || reData.rows[i].code)+"</p>");
                        }
                        if (ht.length > 0)
                            $("#myFavor").html(ht.join(""));
                    }
                }
            });

            $("#myFavorBtn").click(function () {
                console.log('................');
                $("#productInfoModal").modal('show');
            });

        },

        initCard: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/c2c9953a2ebd4df48fa8f8501a725b31',
                type: Dolphin.requestMethod.POST,
                data: Dolphin.json2string({
                    properties: {
                        cardLevel: org.breezee.context.userData.cardLevel
                    }
                }),
                loading: true,
                success: function (reData, textStatus) {
                    console.log(reData);
                    if (reData.success) {
                        if (reData.rows && reData.rows.length > 0) {
                            $("#cardImage").attr('src', org.breezee.context.getImgSrc(reData.rows[0].image));
                        }
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });
        },

        initAdv: function () {
            let me = this;
            Dolphin.ajax({
                url: '/api/00b6980f1bdb41c8ba158905b4fb11a8',
                type: Dolphin.requestMethod.POST,
                data: Dolphin.json2string({
                    properties: {
                        status: 1,
                        _now: 1
                    }

                }),
                loading: true,
                success: function (reData, textStatus) {
                    if (reData.success) {
                        if (reData.rows && reData.rows.length > 0) {

                            for (let i = 0; i < reData.rows.length; i++) {
                                if (reData.rows[i].position == 'left') {
                                    $("#left_image").data('link', reData.rows[i].id).children('img').attr('src', org.breezee.context.getImgSrc(reData.rows[i].frontImageData));
                                } else if (reData.rows[i].position == 'right') {
                                    $("#right_image").data('link', reData.rows[i].id).children('img').attr('src', org.breezee.context.getImgSrc(reData.rows[i].frontImageData));
                                }
                            }

                        }
                    }
                },
                onError: function () {
                    $("#error_message").html('系统出错，请联系管理员');
                }
            });

            $("#left_image,#right_image").click(function () {
                if ($(this).data('link')) {
                    location.href = "advDetail?id=" + $(this).data('link');
                }
            });
        },
        initPoint: function () {
            let me = this;
            if (org.breezee.context.userData.cardLevel < 3) {
                Dolphin.ajax({
                    url: '/api/c2c9953a2ebd4df48fa8f8501a725b31',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string({
                        properties: {
                            cardLevel: (org.breezee.context.userData.cardLevel + 1)
                        }
                    }),
                    loading: true,
                    success: function (reData, textStatus) {
                        if (reData.success) {
                            if (reData.rows && reData.rows.length > 0) {
                                $("#needPoint").text(Number(reData.rows[0].quota || 0) - Number(org.breezee.context.userData.salePoint || 0));
                            }
                        }
                    },
                    onError: function () {
                        $("#error_message").html('系统出错，请联系管理员');
                    }
                });
            } else {
                $("#needPoint").text(0);
            }

        },
    };
});