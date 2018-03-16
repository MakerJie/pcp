$(document).ready(function () {
    Dolphin.ajax({
        url: '/api/e108158b2c56bfe47a8a41cf525d71b2',
        type: Dolphin.requestMethod.POST,
        data: Dolphin.json2string({
            properties: {
                purchase1: {type: '10', status: '1'}, //外部订货待提交订单
                purchase2: {type: '10', status: '100'}, //外部订货待收货订单
                purchase3: {type: '10', status_not_equal: "1"}, //外部订货全部订单
                purchase4: {type: '30', status: "1"}, //总仓订货待提交订单
                purchase5: {type: '30', status: '300'}, //总仓订货待收货订单
                purchase6: {type: '30', status_not_equal: "1"}, //总仓订货全部订单
                purchase7: {type: '90', status: "1"}, //外部退货待提交订单
                purchase8: {type: '80', status: "1"}, //总仓退货待提交订单
                purchase9: {type_in: '80,90', status: "100"}, //门店退货发货待发货订单
                purchase10: {type_in: '80,90', status: ""}, //外部退货全部
                purchase11: {type: '40', status: "1"}, //总仓调拨待提交订单
                purchase12: {type_in: '30,40', status: "100"}, //外部退货全部
                purchase13: {type_in: '40,80', status: "300"}, //总仓调拨收货待收货订单
                purchase14: {type_in: '40,80', status_not_equal: "1"}, //总仓调拨收货全部
                shopCode_in: org.breezee.context.userData.shops.join(','),
            }
        }),
        onSuccess: function (data) {
            let purchase = data.value;
            //外部订单总条数
            let purchaseSum1 = Number(purchase.purchase1) + Number(purchase.purchase3);
            $("#purchaseSum1").html(purchaseSum1);
            //总仓订单总条数
            let purchaseSum2 = Number(purchase.purchase4) + Number(purchase.purchase6);
            $("#purchaseSum2").html(purchaseSum2);
            //退货单总条数
            let purchaseSum3 = Number(purchase.purchase7) + Number(purchase.purchase8) + Number(purchase.purchase10);
            $("#purchaseSum3").html(purchaseSum3);
            //调拨单总条数
            let purchaseSum4 = Number(purchase.purchase11) + Number(purchase.purchase12) + Number(purchase.purchase14);
            $("#purchaseSum4").html(purchaseSum4);
            let sum = purchaseSum1+purchaseSum2+purchaseSum3+purchaseSum4;
            console.log(sum);
            for (let k in purchase) {
                $("#" + k).html(purchase[k]);
                $("#" + k).css("height", purchase[k] + "%");
            }
        }
    });
});