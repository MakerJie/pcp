$(function () {
    Dolphin.ajax({
        url: '/api/cb96f1e48e0b4d45aa08d5248d6bcca3@id=' + org.breezee.context.queryData.id,
        type: Dolphin.requestMethod.GET,
        loading: true,
        success: function (reData, textStatus) {
            console.log(reData);
            if (reData.success) {
                if (reData.value) {
                    $("#imageDetail").attr('src', org.breezee.context.getImgSrc(reData.value.detailImageData));
                }
            }
        },
        onError: function () {
            $("#error_message").html('系统出错，请联系管理员');
        }
    });
});