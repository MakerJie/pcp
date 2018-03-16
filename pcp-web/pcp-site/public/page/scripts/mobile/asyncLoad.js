$(function () {
    setTimeout(function () {
        if ($('#fileupload').length)
            $('#fileupload').fileupload({
                url: (org.breezee.context.contextPath == '/' ? '' : org.breezee.context.contextPath) + '/file/',
                dataType: 'json',
                done: function (e, data) {
                    $("#imageValue").val(data);
                },
                progressall: function (e, data) {
                }
            });

        if ($('#fileupload1').length > 0) {
            $('#fileupload1').fileupload({
                url: (org.breezee.context.contextPath == '' ? '/' : org.breezee.context.contextPath) + 'file/upload',
                dataType: 'json',
                done: function (e, data) {
                    org.breezee.page.fileParse(data._response.result);
                },
                progressall: function (e, data) {
                }
            });
        }

        if ($('#fileupload2').length > 0) {
            $('#fileupload2').fileupload({
                url: (org.breezee.context.contextPath == '' ? '/' : org.breezee.context.contextPath) + 'file/cashUpload',
                dataType: 'json',
                done: function (e, data) {
                    org.breezee.page.cashFileParse(data._response.result);
                },
                progressall: function (e, data) {
                }
            });
        }

        if ($('#daterange').length > 0 && $.fn.daterangepicker)
            $('#daterange').daterangepicker();

        if ($('.date-picker').length > 0 && $.fn.datepicker) {
            $('.date-picker').datepicker({
                autoclose: true,
                todayHighlight: true,
                orientation: 'left',
                topOffset: 65
            });
        }

        if ($('[data-rel="chosen"],[rel="chosen"]').length > 0 && $.fn.chosen)
            $('[data-rel="chosen"],[rel="chosen"]').chosen();

        if ($(".masked-input").length > 0 && $.fn.mask)
            $(".masked-input").mask("9999-99-99");

        if ($(".clockpicker").length > 0 && $.fn.clockpicker)
            $('.clockpicker').clockpicker({
                donetext: 'OK',
            });
    }, 2000);
});