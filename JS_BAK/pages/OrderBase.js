var orderid = "";
var pagetype = "";
//获取订单信息
var OrderInfo = {
    LoadData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getorderdetail&oid=" + orderid,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.ResultCode == "99") {
                PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            } else {
                var data = msg.orderDetail[0];
                switch (pagetype) {
                    case "succ":
                        OrderSuccess.LoadOrderInfo(data);
                        break;
                    case "fail":
                        OrderFail.LoadOrderInfo(data);
                        break;
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
};

//验证支付宝返回信息
var Alipay = {
    Check: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: "get",
            data: "t=" + Math.random() + "&action=alipaycheck&" + location.search.substr(1),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                OrderInfo.LoadData();
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
};

//从活动页来源的，显示下载APP
var FromActShow = {
    ShowDownLoad: function () {

        if (localStorage["actlist"] != null && localStorage["actlist"] != "") {
            $.each(localStorage["actlist"].split('|'), function (i, n) {
                if (n.split('@')[0] == "lbl_succ_2") {
                    $("#" + n.split('@')[0]).html(n.split('@')[1]);
                    $("#" + n.split('@')[0]).show();
                }
            });
        }
    },
};