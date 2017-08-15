
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
            // 订单金额
            $("#hid_order_money").val(data.paymoney);
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
        var order_money = "<dt>请支付：<em><i>￥</i>" + $("#hid_order_money").val() + "</em></dt>";
        //支付方式
        var all_pay_type = "";
        //判断是否在为新内置浏览器
        var sel = "curr";
        if (IsInWeiXin.check() == true) {
            all_pay_type += "<dd id=\"selweixin\" onclick=\"javascript:$('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#weixinicq').attr('class', 'curr');$('#hid_selpaytype').val('weixin');\" ><em class=\"weixin\"></em>微信支付<a id=\"weixinicq\" href=\"#\" class='" + sel + "' ></a></dd>";
            if (sel != "") {
                $("#hid_selpaytype").val("weixin");
                sel = "";
            }
        }
        else {
            all_pay_type += "<dd id=\"selalipay\" onclick=\"javascript: $('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#alpayicq').attr('class', 'curr');$('#hid_selpaytype').val('alipay');\" ><em class=\"alipay\"></em>支付宝<a id=\"alpayicq\" href=\"#\" class='" + sel + "' ></a></dd>";
            if (sel != "") {
                $("#hid_selpaytype").val("alipay");
                sel = "";
            }
        }
        $(".pay-method").html(order_money + all_pay_type);
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
            case "alipay":
                payment = g_pay_ment.AliPay;
                break;
            case "weixin":
                payment = g_pay_ment.WxPay;
                break;
        }
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=gotopayment&OrderNo=" + $("#hid_order_code").val(),
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode == "0") {
                if (IsInWeiXin.check()) {
                    alert(msg.resultmessage);
                    _wxJsApiParam = msg.resultmessage
                    Message.Operate('', "divAlert");
                    callpay();
                }
                else {
                    window.location.href = msg.resultmessage
                }
            } else {

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
             window.location.replace(g_const_PageURL.OrderSuccess + "?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
         if (res.err_msg == "get_brand_wcpay_request:cancel") {
             ShowMesaage(g_const_API_Message["100028"]);
         }
         if (res.err_msg == "get_brand_wcpay_request:fail") {
             window.location.replace(g_const_PageURL.OrderFail + "?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
     }
     );
}