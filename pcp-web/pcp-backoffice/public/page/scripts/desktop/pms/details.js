$(function () {
    let url = location.search;
    findById(url);
    function findById(url) {
        let str = [];
        let id = [];
        let type = [];
        if (url.indexOf("?") != -1) {
            let string = url.substr(1);
            str = string.split("&");
            id = str[1].split("=");
            type = str[0].split("=");
            if (type[1] == "10") {
                $("#procureName").html("供货商编号&nbsp;&nbsp;");
                $("#productName").html("供货商名称&nbsp;&nbsp;");
                $("#productEmail").html("供货商Email&nbsp;&nbsp;");
                $("#incorporated").html("订货门店&nbsp;&nbsp;");
            } else if (type[1] == "20") {
                $("#procureName").html("总仓编号&nbsp;&nbsp;");
                $("#productName").html("总仓名称&nbsp;&nbsp;");
                $("#productEmail").html("总仓Email&nbsp;&nbsp;");
                $("#incorporated").html("订货门店&nbsp;&nbsp;");
            } else if (type[1] == "30") {
                $("#procureName").html("接收方编号&nbsp;&nbsp;");
                $("#productName").html("接收方名称&nbsp;&nbsp;");
                $("#productEmail").html("接收方Email&nbsp;&nbsp;");
                $("#incorporated").html("退货门店&nbsp;&nbsp;");
            } else if (type[1] == "50") {
                $("#procureName").html("调出总仓编号&nbsp;&nbsp;");
                $("#productName").html("调出总仓名称&nbsp;&nbsp;");
                $("#productEmail").html("调出总仓Email&nbsp;&nbsp;");
                $("#incorporated").html("订货总仓&nbsp;&nbsp;");
            }

        }
        Dolphin.ajax({
            url: '/api/80da5b20221f43308ae2a1b389b409e5@id=' + id[1],
            type: Dolphin.requestMethod.GET,
            onSuccess: function (reData) {
                let data = reData.value;
                $("#type").html(Dolphin.enum.getEnumText('purchaseType', data.type) || "未知");
                $("#procureCode").html(data.procureCode);
                $("#code").html(data.dn);
                getShopName(data.storeCode);
                getSupplier(data.procureCode);
                $("#submitor").html(data.submitor || data.creator);
                $("#createTime").html(data.createTime);
                $("#productMobile").html("-");
                $("#name").html(data.name);
                $("#mobile").html("-");
                $("#totalAmount").html(data.totalAmount.toFixed(2));
                $("#deliveryDate").html(data.deliveryDate.substr(0, 10));
                let tr = [], td;
                let totalRecAmount =0.0;
                $.each(data.purchaseLines, function (i, value) {
                    td = [];
                    td.push("<td style='width: 5%' class='tr'>" + (i + 1) + "</td>");
                    td.push("<td style='width: 10%' class='tr'>" + (value.material || '-') + "</td>");
                    td.push("<td style='padding-left: 10px;' class='tr' align='left'>" + (value.name || '-') + "</td>");
                    td.push("<td style='width: 8%' class='tr'>" + (value.price || '-') + "</td>");
                    td.push("<td style='width: 8%' class='tr'>" + (value.quantity || '-') + "&nbsp;&nbsp;" + (value.unit || '-') + "</td>");
                    td.push("<td style='width: 8%' class='tr'>" + (value.receiveQuantity || '-') + "</td>");
                    td.push("<td style='width: 10%' class='tr'>" + (Dolphin.enum.getEnumText('shopRejectReason', value.reason) || '-') + "</td>");
                    td.push("<td style='width: 12%' class='tr'>" + (value.remark || '-') + "</td>");
                    td.push("<td style='width: 10%' class='tr'>" + ((Number(value.quantity) || 0) * (Number(value.price) || 0)).toFixed(2) || '-' + "</td>");
                    if (data.status == 200 && data.type == 10) {
                        td.push("<td style='width: 10%' class='tr'>" + ((Number(value.receiveQuantity) || 0) * (Number(value.price) || 0)).toFixed(2) || '-' + "</td>");
                    }
                    tr.push("<tr class='tr' align='center' style='height: 30px;'>" + td.join('') + "</tr>");
                    totalRecAmount+=(Number(value.receiveQuantity) || 0) * (Number(value.price) || 0);
                });
                $("#tableTr").append(tr.join(''));
                $("#totalRecAmount").html(totalRecAmount.toFixed(2));
            }
        });
    }

    function getShopName(storeCode) {
        Dolphin.ajax({
            url: '/api/54r97625a4e029553ab80367840a0806@code=' + storeCode,
            type: Dolphin.requestMethod.GET,
            loading: true,
            onSuccess: function (data) {
                $("#storeCode").html(data.value.name);
            }
        });
    }

    function getSupplier(supplierCode) {
        Dolphin.ajax({
            url: '/api/ab113d53073eb4b9c355d7b2a499241a@code=' + supplierCode,
            type: Dolphin.requestMethod.GET,
            loading: true,
            onSuccess: function (data) {
                $("#productMobile").html(data.value.email);
            }
        });
    }
});
