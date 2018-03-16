/**
 *
 * Created by Ning on 2017/8/19.
 */
'use strict';
$(function () {
    org.breezee.page = {
        init: function () {
            org.breezee.utils.loadJS(["/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.js"],
                "/page/scripts/desktop/asyncLoad.js?_token=" + new Date().getTime());
            org.breezee.utils.loadCSS("/assets/plugins/bower_components/bootstrap-datepicker/bootstrap-datepicker.min.css");
            this.initEvent();
            this.initOrderGrid();
            Dolphin.form.parseSelect($("#purchaseType"));
            Dolphin.form.parseSelect($("#storeSelect"));
        },

        initEvent: function () {
            let me = this;
            $(".btn_query").click(function () {
                let d = Dolphin.form.getValue('#query_form');
                me._orderGrid.query({properties: $.extend({}, d, {})});
            });

            $("#storeSelect").change(function () {
                $("#supplyer").empty();
                if($(this).val()) {
                    $("#supplyer").attr('optionParam', '{"endpoint":"038","userId":"'+org.breezee.context.userData.userId+'","WERKS":"' + $(this).val().substr(0, 4) + '","LGORT":"' + $(this).val().substr(4) + '"}')
                    Dolphin.form.parseSelect($("#supplyer"));
                }
            });
        },

        initOrderGrid: function () {
            let syncDate_gt = $("#syncDate_gt").val();
            let syncDate_le = $("#syncDate_le").val();
            this._orderGrid = new GRID({
                panel: '#dataList',
                url: '/api/fbbc247ea033447b9db0883366fc7c05',
                ajaxType: Dolphin.requestMethod.POST,
                childrenField: 'purchaseLines',
                queryCondition:"",
                queryParams: {
                    properties:{
                        syncDate_gt:syncDate_gt,
                        syncDate_let:syncDate_le,
                        status:'200'
                    }
                },
                titleFormatter: function (data, index) {
                    let title = '<div style="background-color: white">';
                    title += '<span>' + (this.opts.pageElements + index + 1) + '.</span>';
                    title += '<span>订单编号：' + (data.code || '待生成') + '</span>';
                    title += '<span style="margin-left:25px;">订单类型：<span style="margin: 0 5px;background-color: #FF6600;font-weight: 700;color: #fff;">'+Dolphin.enum.getEnumText('purchaseType', data.type) + '</span></span>';
                    title += '<span style="margin-left:25px;">收货日期：' + data.syncDate + '</span>';
                    if (data.type == '10') {
                        title += '<span style="margin-left:25px;">供应商：' + (data.procureName || '') + '</span>';
                        title += '<span style="margin-left:25px;">购入门店：' + (data.storeName || '') + '</span>';
                    }else if (data.type == '20') {
                        title += '<span style="margin-left:25px;">转出门店：' + data.procureName || '' + '</span>';
                        title += '<span style="margin-left:25px;">购入门店：' + data.storeName || '' + '</span>';
                    } else if (data.type == '30') {
                        title += '<span style="margin-left:25px;">转出总仓：' + data.procureName || '' + '</span>';
                        title += '<span style="margin-left:25px;">购入门店：' + data.storeName  || '' + '</span>';
                    } else if (data.type == '40') {
                        title += '<span style="margin-left:25px;">转出总仓：' + data.procureName || '' + '</span>';
                        title += '<span style="margin-left:25px;">转入总仓：' + data.storeName || '' + '</span>';
                    }
                    let aa = 0;
                    $.each(data.purchaseLines,function () {
                        aa+=(Number(this.receiveQuantity||0)||0)*(Number(this.unitPrice||0)||0);
                    });
                    title += '<span style="margin-left:25px;">总计：'+ (aa.toFixed(2)) +'</span></div>';
                    return title;
                },
                operationFormatter: function (data, index) {
                    return ""
                },
                columns: [{
                    code: '',
                    textAlign: 'left',
                    width:"15%",
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                        let html = '';
                        html += '<div class="prt-code">' + obj.code + '</div>';
                        return html;
                    }
                }, {
                    code: '',
                    textAlign: 'left',
                    className: 'qtnCount',
                    width: '20%',
                    formatter: function (val, obj, data, index) {
                        let name = '';
                        if(obj.name.length>18){
                            name=obj.name.substr(0, 15)+"<br/>"+obj.name.substr(15,obj.name.length);
                        }else {
                            name=obj.name;
                        }
                        let html = '';
                        html += '<div class="prt-remark unzhehang">' + name + '</div>';
                        return html;
                    }
                }, {
                    code: '',
                    textAlign: 'left',
                    width: '15%',
                    className: 'qtnCount',
                    formatter: function (val, obj) {
                        let html = '';
                        html += '<div>' + (obj.quantity !=null ? obj.quantity : 0) + " " + obj.unit + '</div>';
                        return html;
                    }
                }, {
                    code: '',
                    textAlign: 'left',
                    width: '15%',
                    className: 'qtnCount',
                    formatter: function (val, obj) {
                        let html = '';
                        html += '<div>' + (obj.receiveQuantity !=null ? obj.receiveQuantity : 0) + " " + obj.unit + '</div>';
                        return html;
                    }
                }, {
                    code: '',
                    width: '10%',
                    textAlign: 'left',
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                        let title = obj.unitPrice || 0;
                        return title;
                    }
                }, {
                    code: '',
                    width: '10%',
                    textAlign: 'left',
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                        let title = Number((obj.unitPrice||0)*(obj.receiveQuantity||0)).toFixed(2)|| 0;
                        return title;
                    }
                }, {
                    code: '',
                    width: '15%',
                    textAlign: 'left',
                    loading:true,
                    className: 'qtnCount',
                    formatter: function (val, obj, data, index) {
                        let title = Dolphin.enum.getEnumText('shopRejectReason', obj.reason);
                        if(title==undefined||title=="undefined"){
                            title='';
                        }
                        return title;
                    }
                }],
                onLoad: function () {
                }
            });
        },
    };
});