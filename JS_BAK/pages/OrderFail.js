var _paytype_temp = "";
var _orderid_temp = "";
var _out_trade_no_temp = "";

$(document).ready(function () {
    pagetype = "fail";
    if (GetQueryString("paytype") == "getpay" || GetQueryString("paytype") == "wxpay") {
        _paytype_temp = GetQueryString("paytype");
        orderid = GetQueryString("orderid");
        _orderid_temp = GetQueryString("orderid");
        OrderInfo.LoadData();
    }
    else {
        _out_trade_no_temp = GetQueryString("out_trade_no");
        orderid = GetQueryString("out_trade_no");
        Alipay.Check();
    }
    $("#btnBack").click(function () {
        if (localStorage.getItem(g_const_localStorage.IsnewReg) == 1) {
            
            Message.ShowConfirm("确定不填写推荐人吗？", "仅有这一次机会哦~", "divAlert", "确定", "OrderFail.GoBack", "取消");
        }
        else {
            
            OrderFail.GoBack();
        }
    });
    $("#btnOrderChange").click(function () {
        window.location.replace(g_const_PageURL.MyOrder_pay + "?order_code=" + orderid + "&t=" + Math.random());
    });
    if (localStorage.getItem(g_const_localStorage.IsnewReg) == 1) {
        $("#divRecom").show();
    }
    else {
        $("#divRecom").hide();
    }
    $("#btnTJR").click(function () {
        window.location.replace(g_const_PageURL.Recom + "&t=" + Math.random());
    });

    //获取用户是否可以绑定上线
    //AccountInfo.Check();

    //判断是否显示下载APP
    FromActShow.ShowDownLoad();
});

var OrderFail = {
    LoadOrderInfo: function (paymsg) {
        $("#orderNoId").html(paymsg.order_code);
        $("#actualMoneyId").html(paymsg.order_money);
        $("#toRebateMoneyId").html(paymsg.cashBackMoney);
        $("#spendtime").html(paymsg.failureTimeReminder);
        OrderInfo.UpdatePayStatus(paymsg.order_code, "20");
        // Merchant1.RecordValid(Merchant1.RecordOrder);
        Merchant_MT.mt_umobile = "";
        Merchant_MT.productcode = paymsg.orderSellerList[0].productCode;
        Merchant_MT.orderno = paymsg.order_code;
        Merchant_MT.moneypay = parseFloat(paymsg.due_money).toFixed(2);
        Merchant_MT.express_name = paymsg.consigneeName;
        Merchant_MT.express_mobile = paymsg.consigneeTelephone;
        Merchant_MT.express_address = paymsg.consigneeAddress;
        Merchant_MT.ispay = 0;
        Merchant_MT.Paymethod = g_pay_Type.GetPayTypeText(paymsg.pay_type);
        Merchant_MT.RecordOrder();
    },
    GoBack: function () {
        //location = g_const_PageURL.OrderConfirm;//"/Order/OrderConfirm.html";
        localStorage[g_const_localStorage.IsnewReg] = "0";
        window.location.replace(g_const_PageURL.MyOrder_detail + "?order_code=" + orderid + "&t=" + Math.random());
    },
    
};


////获取用户是否可以绑定上线
//var AccountInfo = {
//    api_target: "com_cmall_groupcenter_account_api_ApiAccountInfoNew",
//    api_input: {},
//    Check: function () {

//        var s_api_input = JSON.stringify(AccountInfo.api_input);
//        var obj_data = { "api_input": s_api_input, "api_target": AccountInfo.api_target, "api_token": "1" };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });

//        request.done(function (msg) {
//            if (msg.resultcode) {
//                if (msg.resultcode == g_const_Error_Code.UnLogin) {
//                    //Session失效，重新登录，传递回调地址
//                    if (_paytype_temp != "") {
//                        UserRELogin.login(g_const_PageURL.OrderFail + "?paytype=" + _paytype_temp + "&orderid" + _orderid_temp);
//                    }
//                    else {
//                        UserRELogin.login(g_const_PageURL.OrderFail + "?out_trade_no=" + _out_trade_no_temp);
//                    }
//                    return;
//                }
//                if (msg.resultcode != g_const_Success_Code_IN) {
//                    ShowMesaage(msg.resultmessage);
//                    return;
//                }
//            }
//            if (msg.resultCode) {
//                if (msg.resultCode == g_const_Success_Code) {
//                    if (parseInt(msg.flagRelation) == 1) {
//                        //绑定描述,1是可绑定上线 0是不可绑定
//                        $("#divRecom").show();
//                    }
//                    else {
//                        $("#divRecom").hide();
//                    }

//                }
//                else {
//                    ShowMesaage(msg.resultMessage);
//                }
//            }
//        });

//        request.fail(function (jqXHR, textStatus) {
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    }
//};