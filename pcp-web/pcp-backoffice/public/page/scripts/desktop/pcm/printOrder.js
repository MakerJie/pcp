$(function () {
    let url = location.search;
    findById(url);
    function findById(url) {
        let id = null;
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            id = str.split("=");
        }
        Dolphin.ajax({
            url: '/api/80da5b20221f43308ae2a1b389b409e5@id=' + id[1],
            type: Dolphin.requestMethod.GET,
            onSuccess: function (reData) {
                let data = reData.value;
                $("#type").html(Dolphin.enum.getEnumText('purchaseType', data.type) || '-');
                $("#procureCode").html(data.procureCode);
                $("#code").html(data.dn);
                getShopName(data.storeCode);
                $("#submitor").html(data.submitor||data.creator);
                $("#syncDate").html(data.syncDate||'-');
               // $("#productMobile").html("-");
                $("#name").html(data.name);
                //$("#mobile").html("-");
                $("#totalAmount").html(data.totalAmount.toFixed(2));
                $("#deliveryDate").html(data.deliveryDate.substr(0,10));
                $.each(data.purchaseLines, function (i, value) {
                    $("#tableTr").append("" +
                        "<tr class='tr' align='center' style='height: 30px;'>" +
                        "<td style='width: 5%' class='tr'>"+(i+1)+"</td>" +
                        "<td style='width: 15%' class='tr'>"+(value.material||'-')+"</td>" +
                        "<td style='width: 25%' class='tr' align='left'>"+(value.name||'-')+"</td>" +
                        "<td style='width: 15%' class='tr'>"+(value.price||'-')+"</td>" +
                        "<td style='width: 15%' class='tr'>"+(value.quantity||'-')+"</td>" +
                        "<td style='width: 12%' class='tr'>"+(value.unit||'-')+"</td>" +
                        "<td style='width: 13%' class='tr'>"+((Number(value.quantity)||0)*(Number(value.price)||0)).toFixed(2)||'-' +"</td>" +
                        "</tr>");
                });
            }
        });
    }
    function getShopName(storeCode) {
        Dolphin.ajax({
            url: '/api/54r97625a4e029553ab80367840a0806@code='+storeCode,
            type: Dolphin.requestMethod.GET,
            loading: true,
            onSuccess: function (data) {
                $("#storeCode").html(data.value.name);
            }
        });
    }
});
