//2e98fa18378a45a1a776e15dc904fe3d

$(function () {

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
                let ht = [];
                for (let i = 0; i < reData.rows.length; i++) {
                    ht.push(reData.rows[i].name + "=" + reData.rows[i].quantity);
                    if (i == 2) {
                        break;
                    }
                    i++;
                }
                if (ht.length > 0)
                    $("#myFavor").html(ht.join("<p>"));
            }
        }
    });

});