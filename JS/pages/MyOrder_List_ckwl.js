
$(document).ready(function () {
    //我的物流
    MyOrder_wl.GetList();
});
//我的订单--物流
var MyOrder_wl = {
    api_orderdetal_target: "com_cmall_familyhas_api_ApiOrderDetails",
    api_orderdetal_input: { "order_code": "" },
    GetList: function () {
        MyOrder_wl.api_orderdetal_input.order_code = GetQueryString("order_code");
        if (MyOrder_wl.api_orderdetal_input.order_code.length <= 0) {
            $("#wuliu").hide();
            $("#wuliuInfo").html('<h3>物流跟踪</h3><ul class="wuliu_track"><li class="cur"><p class="wuliu_track_ads">暂无物流信息</p><span class="wuliu_tip"><b></b></span></li></ul>');
            return false;
        }
        var s_api_input = JSON.stringify(this.api_orderdetal_input);
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_wl.api_orderdetal_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    PageUrlConfig.SetUrl();
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode == g_const_Success_Code) {
                MyOrder_wl.LoadExpressResult(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadExpressResult: function (msg) {
        if (msg.yc_express_num) {
            $("#wl_name").html(msg.yc_delivergoods_user_name);
            $("#wl_ydbh").html('运单编号:' + msg.yc_express_num);
        }
        else {
            $("#wuliu").hide();
        }
        var html = ['<h3>物流跟踪</h3>', ' <ul class="wuliu_track">'];
        if (msg.apiHomeOrderTrackingListResult.length > 0) {
            $.each(msg.apiHomeOrderTrackingListResult, function (i, n) {
                if (i == 0) {
                    html.push('<li class="cur"><p class="wuliu_track_ads">' + n.orderTrackContent + '</p><p class="wuliu_track_tel">' + n.yc_dis_time + '</p><span class="wuliu_tip"><b></b></span></li>');
                }
                else {
                    html.push('<li><p class="wuliu_track_ads">' + n.orderTrackContent + '</p><p class="wuliu_track_tel">' + n.yc_dis_time + '</p><span class="wuliu_tip"><b></b></span></li>');
                }
            });
        }
        else {
            html.push('<li class="cur"><p class="wuliu_track_ads">暂无物流信息</p><span class="wuliu_tip"><b></b></span></li>');
        }
        html.push('</ul>');
        $("#wuliuInfo").html(html.join(""));
    },
};