
//微信支付参数
var _wxJsApiParam = {};

$(document).ready(function () {
    UserLogin.Check(MyOrder_detaile.GetList);
    //返回
    $(".go-back").click(function () {
        window.location.replace(PageUrlConfig.BackTo());
    });
    $("#btn_pay").click(function () {
        $("#btn_pay").hide();
        $("#btn_pay_wait").show();
        MyOrderPay.checklogin();
    });
    //获得传递的订单号
    $("#hid_order_code").val(GetQueryString("order_code"));
});

function SavePayType11(paytype) {
    $("#alpayicq").removeClass();
    $("#weixinicq").removeClass();
    //$("selother").attr("class", "");
    switch (paytype) {
        case "alipay":
            $("#alpayicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("alipay");

            break;
        case "weixin":
            $("#weixinicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("weixin");
            break;
        case "yipay":
            $("#yipayicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("yipay");

            break;
    }

}

//我的订单--订单详情
var MyOrder_detaile = {
    GetList: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //重新登录，并按链接回调
            UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val())
            return;
        }
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getorderdetail&oid=" + $("#hid_order_code").val(),
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            var data = msg.orderDetail[0];
            console.log(data);
            var realPayMoney = parseFloat(data.totalmoney) - parseFloat(data.couponmoney) - parseFloat(data.accountmoney);
            // 订单金额
            $("#hid_order_money").val(realPayMoney.toFixed(2));
            //加载支付方式
            onlinePayType.Load_Result(data);
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

//在线支付包含的支付方式
var onlinePayType = {
    Load_Result: function (data) {
        //金额
        $("#payMoney").html('<i>￥</i>' + $("#hid_order_money").val());
        //支付方式
        var clientType = GetClientType();
        if (IsInWeiXin.check()) {
            $("#wxpay").show().attr("type", "WxPay").find("a").addClass("curr");
            $("#alipay").attr("type", "AliPay");
            $("#hid_selpaytype").val("WxPay");
        }
        else if (!IsInWeiXin.check() && clientType == ClientType.JYH_Android) {
            $("#wxpay").show().attr("type", "WxPayApp").find("a").addClass("curr");
            $("#alipay").show().attr("type", "AliPayApp");
            $("#hid_selpaytype").val("WxPayApp");

        } else if (!IsInWeiXin.check() && clientType == ClientType.JYH_iOS) {

            $("#wxpay").show().attr("type", "WxPayApp").find("a").addClass("curr");
            $("#alipay").show().attr("type", "AliPayApp");
            $("#hid_selpaytype").val("WxPayApp");
        }
        else {
            $("#alipay").show().attr("type", "AliPay").find("a").addClass("curr");
            $("#wxpay").attr("type", "WxPay");
            $("#hid_selpaytype").val("AliPay");
        }

        //增加易付宝【支持全部类型】
        $("#yipay").show().attr("type", "YiPayWap");
        $("#yipay span[name=payMoney]").show();


        $("#paytype dd").on("click", function () {
            $("#paytype a").removeClass("curr");
            $(this).find("a").addClass("curr");
            var type = $(this).attr("type");
            $("#hid_selpaytype").val(type);
        });
    },
};


//订单支付
var MyOrderPay = {
    checklogin: function () {
        _orderid = $("#hid_order_code").val();
        UserLogin.Check(MyOrderPay.GoPay);
    },
    GoPay: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //重新登录，并按链接回调
            UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val())
            return;
        }
        var payment = "";
        var payType = $("#hid_selpaytype").val();
        switch (payType) {
            case "AliPay":
                payment = g_pay_ment.AliPay;
                break;
            case "WxPay":
                payment = g_pay_ment.WxPay;
                break;
            case "AliPayApp":
                payment = g_pay_ment.AliPayApp;
                break;
            case "WxPayApp":
                payment = g_pay_ment.WxPayApp;
                break;
            case "YiPayWap":
                payment = g_pay_ment.YiPayWap;
                break;
        }
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=gotopayment&OrderNo=" + $("#hid_order_code").val() + "&PayGate=" + payment.Paygate + "&PayGateType=" + payment.PaygateType,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode == "0") {
                if (IsInWeiXin.check()) {
                    if ($("#hid_wxpaytype").val() == "1") {
                        //本地jsapi处理
                        _wxJsApiParam = JSON.parse(msg.resultmessage).jsapiparam;
                        Message.Operate('', "divAlert");
                        callpay();
                    }
                    else {
                        //跳转网关处理
                        window.location.replace(msg.resultmessage)
                    }

                }
                else {
                    window.location.replace(msg.resultmessage);
                }
            }
            else if (msg.resultcode == "22")//支付金额为0
            {
                window.location.replace("/Order/OrderSuccess.html?paytype=wxpay&orderid=" + _orderNo + "&t=" + Math.random());
            } else {
                ShowMesaage(msg.resultmessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

function jsApiCall() {
    WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
     _wxJsApiParam,//josn串
     function (res) {
         //$("#btn_pay").click(function () {
         //    $("#btn_pay").removeAttr("onclick");
         //    MyOrderPay.checklogin();
         //});
         $("#btn_pay_wait").hide();
         $("#btn_pay").show();

         //WeixinJSBridge.log(res.err_msg);
         //alert(res.err_code + res.err_desc + res.err_msg);
         if (res.err_msg == "get_brand_wcpay_request:ok") {
             //window.location.replace(g_const_PageURL.OrderSuccess + "?frd=yes&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
             window.location.replace(g_const_PageURL.OrderSuccess + "?paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
         if (res.err_msg == "get_brand_wcpay_request:cancel") {
             ShowMesaage(g_const_API_Message["100028"]);
         }
         if (res.err_msg == "get_brand_wcpay_request:fail") {
             window.location.replace(g_const_PageURL.OrderFail + "?paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
     }
     );
}