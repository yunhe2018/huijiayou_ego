$(document).ready(function () {
    RechargeSuccess.getData();
});

var RechargeSuccess = {
    getData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getrechargeorder&orderNo=" + GetQueryString("orderid"),
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
                ShowMesaage(msg.resultMessage);
            }
            else {
                $("#rechargeMoney").html('获取' + parseInt(msg.RechargeMoney) + '个夺宝币');
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
};