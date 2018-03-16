$(function () {
    org.breezee.page = {
        init: function () {
            this.initEvent();
        },
        initEvent: function () {
            let me = this;
            //新增窗口弹出

            $('#updatePwd').click(function () {
                $("#message").modal('show');
            });
            $('#viewAccount').click(function () {
                let data = Dolphin.form.getValue("#dataForm");
                data.id = org.breezee.context.userData.userId;
                Dolphin.ajax({
                    url: 'api/4aad240dc757e0106c04a598a787b50a',
                    type: Dolphin.requestMethod.POST,
                    data: Dolphin.json2string(data),
                    success: function (reData) {
                        if (reData.success) {
                            Dolphin.form.setValue(reData.value, '.editMessage-form');
                            $("#accountMessage").modal('show');
                        }
                    },
                    onError: function (data) {
                        alert(data.error);
                    }
                });
            });
        },
    };
});
