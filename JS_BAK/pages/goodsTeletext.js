var goodsTeletext = {
    GoodsId: GetQueryString("pid"),
    Init: function () {
        $("#back").on("click", function () {
            history.back();
        });
        goodsTeletext.LoadGoodsData();
    },
    LoadGoodsData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getGoodsInfo&pid=" + goodsTeletext.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                var teletextImg = msg.TeletextImg.split(',');
                $(teletextImg).each(function () {
                    if (this) {
                        $("#teletext").append('<img src="' + this + '"/>');
                    }
                });

            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
}