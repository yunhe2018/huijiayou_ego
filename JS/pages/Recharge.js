$(document).ready(function () {
    UserLogin.Check(Recharge.Init);
});
_orderNo = "";
var Recharge = {
    FormParam: {
        TotalMoney: 0,
        PayGate: "",
        PayGateType: "",
        RID: 0,
    },
    PayType: "",
    Init: function () {
        var tost = GetQueryString("tost");
        if (tost) {
            ShowMesaage("取消支付");
        }
        Recharge.LoadRechargeList();
        $("#balanceList li").on("click", function () {
            $(this).addClass("on").siblings().removeClass("on");
        });
        Recharge.LoadPayType();
        $("#btnSubmit").off("click").on("click", function () {
            var m = $("#balanceList .on");
            if (m.length <= 0) {
                ShowMesaage("请选择充值金额");
                return false;
            }
            var money = $(m).data("m");
            var rid = $(m).data("id");
            if (money == 0) {
                var customMoney = $("#txtCustomMoney").val();
                if (customMoney.length <= 0) {
                    ShowMesaage("请输入正确充值金额");
                    return false;
                }
                if (!isInteger(customMoney)) {
                    ShowMesaage("请输入正确充值金额");
                    return false;
                }
                if (parseInt(customMoney) <= 0) {
                    ShowMesaage("请输入正确充值金额");
                    return false;
                }
                Recharge.FormParam.TotalMoney = customMoney;
            }
            else {
                Recharge.FormParam.TotalMoney = money;
            }
            Recharge.FormParam.RID = rid;
            Recharge.RechargeMoney();
        });
        $("#div_rechargeinfo").html(g_const_API_Message["600001"]);
    },
    LoadRechargeList: function () {
        var data = rechargelist.ResultTable;
        var html = [];
        $(data).each(function (i) {
            html.push('<li class="' + (this.isdefault == "1" ? 'on' : '') + '" data-id="' + this.id + '" data-m="' + parseFloat(this.price).toFixed(0) + '">');
            var giveInfo = "";
            switch (this.givetype) {
                //赠送方式，0：无赠送，1：按比例送金额，2：金额，3：按比例送积分，4：积分
                case "0":
                    giveInfo = parseFloat(this.price).toFixed(0);
                    break;
                //case "1":
                //    giveInfo = '<i class="num">' + this.price + '</i><i class="fan">返' + this.givevalue + '%</i>';
                //    break;
                //case "2":
                //    giveInfo = '<i class="num">' + this.price + '</i><i class="fan">返' + this.givevalue + '元</i>';
                //    break;
                //case "3":
                //    giveInfo = '<i class="num">' + this.price + '</i><i class="fan">返' + this.givevalue + '%积分</i>';
                //    break;
                //case "4":
                //    giveInfo = '<i class="num">' + this.price + '</i><i class="fan">返' + this.givevalue + '积分</i>';
                    //    break;
                default:
                    giveInfo = '<i class="num">' + parseFloat(this.price).toFixed(0) + '</i><i class="fan">' + this.memo + '</i>';
                    break;
            }
            html.push(giveInfo);
            html.push('</li>');
        });
        html.push('<li data-m="0" data-id="0"><input type="text" class="txt_other" id="txtCustomMoney" placeholder="其他金额" /></li>');
        $('#balanceList').html(html.join(''));
    },
    LoadPayType: function () {
        // //微信
        //WeiXin: 1,
        ////苹果客户端
        //JYH_Android: 2,
        ////安卓客户端
        //JYH_iOS: 3,
        ////浏览器
        //Other: 4
        var clientType = GetClientType();
        if (IsInWeiXin.check()) {
            $("#wxpay").show().attr("type", "WxPay").find("div[class=radio]").addClass("on");
            Recharge.PayType = g_pay_ment.WxPay;
            $("#alipay").attr("type", "AliPay");
        }
        else if (!IsInWeiXin.check() && clientType == ClientType.JYH_Android) {
            $("#wxpay").show().attr("type", "WxPayApp").find("div[class=radio]").addClass("on");
            Recharge.PayType = g_pay_ment.WxPayApp;
            $("#alipay").show().attr("type", "AliPayApp");

        } else if (!IsInWeiXin.check() && clientType == ClientType.JYH_iOS) {
            //$("#alipay").show().attr("type", "AliPay").find("div[class=radio]").addClass("on");
            //Recharge.PayType = g_pay_ment.AliPay;
            //$("#wxpay").attr("type", "WxPay");

            $("#wxpay").show().attr("type", "WxPayApp").find("div[class=radio]").addClass("on");
            Recharge.PayType = g_pay_ment.WxPayApp;
            $("#alipay").show().attr("type", "AliPayApp");
        }
        else {
            $("#alipay").show().attr("type", "AliPay").find("div[class=radio]").addClass("on");
            Recharge.PayType = g_pay_ment.AliPay;
            $("#wxpay").attr("type", "WxPay");
        }

        //增加易付宝【支持全部类型】
        //$("#yipay").show().attr("type", "YiPayWap");
        //$("#yipay span[name=payMoney]").show();

        //增加银联支付【支持全部类型】
        //增加银联支付【暂不支持安卓APP和安卓中的浏览器中】
        //if (clientType != ClientType.JYH_iOS && clientType != ClientType.JYH_Android) {
        if (clientType != ClientType.JYH_Android && !(CheckMachine.versions.android)) {
            $("#yinlianpay").show().attr("type", "YinLianPayWap");
            $("#yinlianpay span[name=payMoney]").show();
        }


        $("#paytype li").on("click", function () {
            $("#paytype .radio").removeClass("on");
            $(this).find("div[class=radio]").addClass("on");
            var type = $(this).attr("type");
            Recharge.PayType = g_pay_ment[type];
        });
    },
    RechargeMoney: function () {
        Recharge.FormParam.PayGate = Recharge.PayType.Paygate;
        Recharge.FormParam.PayGateType = Recharge.PayType.PaygateType;
        var param = "";
        for (var i in Recharge.FormParam) {
            var v = Recharge.FormParam[i];
            param += "&" + i + "=" + v;
        }
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=recharge" + param,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
                if (msg.resultCode == "999") {
                    PageUrlConfig.SetUrl();
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            } else {
                var orderCode = msg.OrderNo;
                _orderNo = orderCode;
                Recharge.GoPay(orderCode);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GoPay: function (orderNo) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=gotoreachargepayment&OrderNo=" + orderNo,
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
            else {
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
         //WeixinJSBridge.log(res.err_msg);
         alert(res.err_msg);
         if (res.err_msg == "get_brand_wcpay_request:ok") {
             window.location.replace("/Order/RechargeSuccess.html?orderid=" + _orderNo + "&t=" + Math.random());
         }
             //else if (res.err_msg == "get_brand_wcpay_request:cancel") {
             //    //  ShowMesaage(g_const_API_Message["100028"]);
             //  //  window.location.href = g_const_PageURL.MyOrder_List + "?paytype=DFK" + "&t=" + Math.random();
             //    window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderid);
             //}
             //else if (res.err_msg == "get_brand_wcpay_request:fail") {
             //    window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderid);
             //}
         else {
             window.location.replace("/Account/Recharge.html?tost=t");
             //$("#btnSubmit").css({ "background": "#f6123d" }).click(function () {
             //    orderConfirm.CreateOrder();
             //});
             // window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderNo + "&t=" + Math.random());
         }
     }
     );
}