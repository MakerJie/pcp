$(function () {
    let url = location.search;
    let id = [];
    let str = [];
    let stockCheck = [];
    let purchaseShop = [];
    if (url.indexOf("?") != -1) {
        let string = url.substr(1);
        str = string.split("&");
        stockCheck = str[0].split("=");
        purchaseShop = str[1].split("=");
        id=str[2].split("=");
    }
    initFunction();
    function ajaxGetById() {
        Dolphin.ajax({
            url: "/api/0fe00de41519b82e98c505e53bfc441b@id="+id[1],
            type: Dolphin.requestMethod.GET,
            loading: true,
            onSuccess: function (data) {
                $("#time").html( data.value.stockCheckDate !=null ? data.value.stockCheckDate.substr(0, 10) : "-");
                $("#storeName").html(data.value.name !=null ? data.value.name : "-");
                $("#type").html(Dolphin.enum.getEnumText('stockCheckType', data.value.type) || '-');
                let values = data.value.stockCheckLines;
                if(values!=null){
                    eachLines(values);
                }
            }
        });
    }
    function findAll () {
        let dayCheck = false;
        let monthCheck = false;
        let weekCheck = false;
        if (stockCheck[1] == 3) {
            dayCheck = '';
            monthCheck = '';
            weekCheck = true;
        } else if (stockCheck[1] == 2) {
            dayCheck = '';
            weekCheck = '';
            monthCheck = true;
        } else if (stockCheck[1] == 1) {
            dayCheck = true;
            weekCheck = '';
            monthCheck = '';
        }
        Dolphin.ajax({
            url: '/api/54r97625a4e029553ab80367840a0806@code='+purchaseShop[1],
            type: Dolphin.requestMethod.GET,
            loading: true,
            onSuccess: function (data) {
                $("#storeName").html(data.value.name);
            }
        });
        Dolphin.ajax({
            url: '/api/53afe452392f44b19d64ae88d1de7491',
            type: Dolphin.requestMethod.POST,
            loading: true,
            data: Dolphin.json2string({
                properties: {
                    pageSize: 1000,
                    dayCheck: dayCheck,
                    weekCheck: weekCheck,
                    monthCheck: monthCheck,
                    type_in: 'Z091,Z092'}
            }),
            onSuccess: function (data) {
                getDate();
                $("#type").html(Dolphin.enum.getEnumText('stockCheckType', stockCheck[1]) || '-');
                if(data.rows!=null){
                    eachLines(data.rows);
                }
            }
        });
    }
    function checkHiddenUnit(unit) {
        let flag = false;
        switch (unit) {
            case 'ML':
                flag = true;
                break;
            case 'L':
                flag = true;
                break;
            case 'KG':
                flag = true;
                break;
            case 'G':
                flag = true;
                break;
            default:
                flag = false;
                break;
        }
        return flag;
    }

    function eachLines(lines) {
        $.each(lines, function (i, value) {
            let aa = '', str;
            console.log(value,'---');
            if (value.unitInfos && value.unitInfos.length > 0) {
                let span = $('<div class="input-prepend input-group">' +
                    '<input class="input" value="'+ (typeof(value.quantity1) != 'undefined' ? value.quantity1.split("_")[0] : '') +'" disabled listname="quantity1" data-multi="' + value.unitInfos[0].multiValue + '" data-unit="' + value.unitInfos[0].addUnit + '" type="text">' +
                    '<span>' + value.unitInfos[0].addUnit + '</span>' +
                    '</div>');
                let visible = (value.unitInfos[0].addUnit != value.unit ? "visible" : "hidden");
                if (visible == 'visible')
                    visible = checkHiddenUnit(value.unitInfos[0].addUnit) ? 'hidden' : 'visible';
                if(value.unitInfos[0].multiValue<1 && value.unitInfos[0].addUnit=='BTL')
                    str = (value.unitInfos[0].multiValue*1000)+'ML';
                else
                    str = value.unitInfos[0].multiValue + value.unit;
                let compu = $('<div class="unit-info" style="visibility: ' + visible + '">' +
                    '<span> 1' + value.unitInfos[0].addUnit + '</span>=<span>' + str + '</span></div>');
                 aa =  $('<div>').append(span).append(compu);
            }

            let bb='';
            if (value.unitInfos && value.unitInfos.length > 1) {
                let span = $('<div class="input-prepend input-group">' +
                    '<input class="input" value="'+ (typeof(value.quantity2) != 'undefined' ? value.quantity2.split("_")[0] : '') +'" disabled listname="quantity2" data-multi="' + value.unitInfos[1].multiValue + '" data-unit="' + value.unitInfos[1].addUnit + '" type="text">' +
                    '<span>' + value.unitInfos[1].addUnit + '</span>' +
                    '</div>');
                let visible = (value.unitInfos[1].addUnit != value.unit ? "visible" : "hidden");
                if (visible == 'visible')
                    visible = checkHiddenUnit(value.unitInfos[1].addUnit) ? 'hidden' : 'visible';
                if(value.unitInfos[1].multiValue<1 && value.unitInfos[1].addUnit=='BTL')
                    str = (value.unitInfos[1].multiValue*1000)+'ML';
                else
                    str = value.unitInfos[1].multiValue + value.unit;
                let compu = $('<div class="unit-info" style="visibility: ' + visible + '">' +
                    '<span> 1' + value.unitInfos[1].addUnit + '</span>=<span>' + str + '</span></div>');
                bb= $('<div>').append(span).append(compu);
            }

            let cc = '';
            if (value.unitInfos && value.unitInfos.length > 2) {
                let span = $('<div class="input-prepend input-group">' +
                    '<input class="input" value="'+ (typeof(value.quantity3) != 'undefined' ? value.quantity3.split("_")[0] : '') +'" disabled listname="quantity3" data-multi="' + value.unitInfos[2].multiValue + '" data-unit="' + value.unitInfos[2].addUnit + '" type="text">' +
                    '<span>' + value.unitInfos[2].addUnit + '</span>' +
                    '</div>');
                let visible = (value.unitInfos[2].addUnit != value.unit ? "visible" : "hidden");
                if (visible == 'visible')
                    visible = checkHiddenUnit(value.unitInfos[2].addUnit) ? 'hidden' : 'visible';
                if(value.unitInfos[2].multiValue<1 && value.unitInfos[2].addUnit=='BTL')
                    str = (value.unitInfos[2].multiValue*1000)+'ML';
                else
                    str = value.unitInfos[2].multiValue + value.unit;
                let compu = $('<div class="unit-info" style="visibility: ' + visible + '">' +
                    '<span> 1' + value.unitInfos[2].addUnit + '</span>=<span>' + str + '</span></div>');
                cc = $('<div>').append(span).append(compu);
            }

            let dd = '';
            if (value.unitInfos && value.unitInfos.length > 3) {
                let span = $('<div class="input-prepend input-group">' +
                    '<input class="input" value="'+ (typeof(value.quantity4) != 'undefined' ? value.quantity4.split("_")[0] : '') +'" disabled listname="quantity4" data-multi="' + value.unitInfos[3].multiValue + '" data-unit="' + value.unitInfos[3].addUnit + '" type="text">' +
                    '<span>' + value.unitInfos[3].addUnit + '</span>' +
                    '</div>');
                let visible = (value.unitInfos[3].addUnit != value.unit ? "visible" : "hidden");
                if (visible == 'visible')
                    visible = checkHiddenUnit(value.unitInfos[3].addUnit) ? 'hidden' : 'visible';
                if(value.unitInfos[3].multiValue<1 && value.unitInfos[3].addUnit=='BTL')
                    str = (value.unitInfos[3].multiValue*1000)+'ML';
                else
                    str = value.unitInfos[3].multiValue + value.unit;
                let compu = $('<div class="unit-info" style="visibility: ' + visible + '">' +
                    '<span> 1' + value.unitInfos[3].addUnit + '</span>=<span>' + str + '</span></div>');
                dd = $('<div>').append(span).append(compu);
            }

            let ee = '';
            if (value.unitInfos && value.unitInfos.length > 4) {
                let span = $('<div class="input-prepend input-group">' +
                    '<input class="input" value="'+ (typeof(value.quantity5) != 'undefined' ? value.quantity5.split("_")[0] : '') +'" disabled listname="quantity5" data-multi="' + value.unitInfos[4].multiValue + '" data-unit="' + value.unitInfos[4].addUnit + '" type="text">' +
                    '<span>' + value.unitInfos[4].addUnit + '</span>' +
                    '</div>');
                let visible = (value.unitInfos[4].addUnit != value.unit ? "visible" : "hidden");
                if (visible == 'visible')
                    visible = checkHiddenUnit(value.unitInfos[4].addUnit) ? 'hidden' : 'visible';
                if(value.unitInfos[4].multiValue<1 && value.unitInfos[4].addUnit=='BTL')
                    str = (value.unitInfos[4].multiValue*1000)+'ML';
                else
                    str = value.unitInfos[4].multiValue + value.unit;
                let compu = $('<div class="unit-info" style="visibility: ' + visible + '">' +
                    '<span> 1' + value.unitInfos[4].addUnit + '</span>=<span>' + str + '</span></div>');
                ee =  $('<div>').append(span).append(compu);
            }

            $("#tableTr").append("" +
                "<tr class='tr' align='center' style='height: 30px;'>" +
                "<td class='tr'>" + (Number(i)+Number(1)) + "</td>" +
                "<td class='tr'>" + (Dolphin.enum.getEnumText('checkArea', value.checkArea) || "-") + "</td>" +
                "<td class='tr'>" + value.code + "</td>" +
                "<td class='tr' align='left'>" + value.name + "</td>" +
                "<td class='tr'>" + ( $(aa[0]).html() != undefined ?  $(aa[0]).html()  : '-' ) + "</td>" +
                "<td class='tr'>" + ( $(bb[0]).html() != undefined ?  $(bb[0]).html()  : '-' ) + "</td>" +
                "<td class='tr'>" + ( $(cc[0]).html() != undefined ?  $(cc[0]).html()  : '-' ) + "</td>" +
                "<td class='tr'>" + ( $(dd[0]).html() != undefined ?  $(dd[0]).html()  : '-' ) + "</td>" +
                "<td class='tr'>" + ( $(ee[0]).html() != undefined ?  $(ee[0]).html()  : '-' ) + "</td>" +
                "<td class='tr'>" + (value.price|| 0) + "</td>" +
                "</tr>");
        });
    }

    function getDate() {
        let date = new Date();
        let seperator1 = "-";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        $("#time").html(currentdate);
    }
    function initFunction() {
        if (id[1] != ""){
            ajaxGetById();
        }else {
            findAll();
        }
    }
});
