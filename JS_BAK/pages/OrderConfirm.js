
var _wxJsApiParam = "";
var _orderNo = "";
var orderConfirm = {
    GoodsId: GetQueryString("pid") == "" ? localStorage["pid"] : GetQueryString("pid"),
    PeriodsId: GetQueryString("perid") == "" ? localStorage["perid"] : GetQueryString("perid"),
    Num: GetQueryString("num") == "" ? localStorage["num"] : GetQueryString("num"),
    LeftCount: 0,
    Price: 0,
    Init: function () {
        UserLogin.Check(orderConfirm.InitEvent);
        orderConfirm.LoadPayType();
        orderConfirm.LoadGoodsData();
        orderConfirm.GetWxPayType();
    },
    OrderForm: {
        ProductID: GetQueryString("pid") == "" ? localStorage["pid"] : GetQueryString("pid"),
        PeriodNum: GetQueryString("perid") == "" ? localStorage["perid"] : GetQueryString("perid"),
        ChipinNum: GetQueryString("num") == "" ? localStorage["num"] : GetQueryString("num"),
        TotalMoney: 0,
        PayGate: "",
        PayGateType: "",
        //PhoneNo: "",
    },
    //获得微信支付方式
    GetWxPayType: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=GetWxPayRetflag",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            
            $("#hid_wxpaytype").val(msg.payretflag);
                
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadGoodsData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getGoodsInfo&pid=" + orderConfirm.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                $("#goodsImg").attr("src", msg.ListImg || g_goods_Pic);
                $("#goodsName").html(msg.ProductName);
                $("#periodsNum").html("第" + orderConfirm.PeriodsId + "期");
                orderConfirm.Price = msg.UnitPrice;
                var payMoney = parseInt(orderConfirm.Num);
                orderConfirm.OrderForm.TotalMoney = payMoney;
                $("#payMoney").html(payMoney.toFixed("2")).data("paymoney", payMoney);
                orderConfirm.GetRecordCount(msg.SellPrice);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetRecordCount: function (totalCount) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getRecordCount&perid=" + orderConfirm.PeriodsId + "&pid=" + orderConfirm.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                orderConfirm.LeftCount = totalCount - msg.TotalCount;
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    InitEvent: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
        };
        $("#btnSubmit").click(function () {
            $("#btnSubmit").unbind().css({ "background": "#666" });
            //orderConfirm.CreateOrder();
        });
        //$("#btnBack").click(function () {
        //    // Message.ShowConfirm("确定要取消订单吗？", "稍后商品可能会被抢走哦～", "divAlert", "取消订单", "CancelOrder", "继续购买");
        //    history.back();
        //});
        $("#xieyi").on("click", function () {
            g_const_PageURL.GoTo(g_const_PageURL.ego_xieyi);
            return false;
        });
        $(".xy_check,.xy_txt").on("click", function () {
            console.log($(".xy").data("checkd"));
            if ($(".xy").data("checkd") == "1") {
                $(".xy").data("checkd", "0");
                $("#mark").css({ "background": "url() no-repeat" });
                $("#btnSubmit").unbind().css({ "background": "#666" });
            }
            else {
                $(".xy").data("checkd", "1");
                $("#mark").css({ "background": "url(/img/dagou.png) no-repeat", "background-size": "100%" });

                $("#btnSubmit").css({ "background": "#f6123d" }).click(function () {
                    orderConfirm.CreateOrder();
                });
            }
        });
    },
    PayType: "",
    LoadPayType: function () {
        if (IsInWeiXin.check()) {
            $("#wxpay").show().find("div[class=radio]").addClass("on");
            orderConfirm.PayType = g_pay_ment.WxPay;
        }
        else {
            $("#alipay").show().find("div[class=radio]").addClass("on");
            orderConfirm.PayType = g_pay_ment.AliPay;
        }
        $("#paytype li").on("click", function () {
            $(this).find("div[class=radio]").addClass("on");
            switch (id) {
                case "wxpay":
                    orderConfirm.PayType = g_pay_ment.WxPay;
                    break;
                case "alipay":
                    orderConfirm.PayType = g_pay_ment.AliPay;
                    break;
            }
        });
    },
    CreateOrder: function () {
        //if ($("#phone").val().length == 0) {
        //    ShowMesaage("请填写手机号");
        //    return false;
        //}
        //if (!isMobile($("#phone").val())) {
        //    ShowMesaage("手机号格式不正确");
        //    return false;
        //}
        if ($(".xy").data("checkd") == "0") {
            ShowMesaage("请阅读并同意购买规则");
            return false;
        }
        if (orderConfirm.LeftCount == 0) {
            Message.ShowConfirm("该期已满，前往最新期", "", "divAlert", "前往最新期", "orderConfirm.GoToNewPeriods", "取消");
            return false;
        }
        if (orderConfirm.Num > orderConfirm.LeftCount) {
            Message.ShowConfirm("该期仅剩余" + orderConfirm.LeftCount + "人次，更改为剩余人次", "", "divAlert", "更改", "orderConfirm.ChangeBuyCount", "取消");
            return false;
        }
        orderConfirm.SubitOrderInfo();
    },
    SubitOrderInfo: function () {
        orderConfirm.OrderForm.PayGate = orderConfirm.PayType.Paygate;
        orderConfirm.OrderForm.PayGateType = orderConfirm.PayType.PaygateType;
        //orderConfirm.OrderForm.PhoneNo = $("#phone").val();
        var param = "";
        for (var i in orderConfirm.OrderForm) {
            var v = orderConfirm.OrderForm[i];
            param += "&" + i + "=" + v;
        }
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=createorder" + param,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                var orderCode = msg.OrderNo;
                _orderNo = orderCode;
                orderConfirm.GoPay(orderCode);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //前往最新期
    GoToNewPeriods: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getnewperiod&pid=" + orderConfirm.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                if (msg.newPeriodNum == 0) {
                    g_const_PageURL.GoTo(g_const_PageURL.Index);
                }
                else {
                    var par = "perid=" + msg.newPeriodNum + "&pid=" + orderConfirm.GoodsId;
                    g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });

        //g_const_PageURL.GoTo(g_const_PageURL.Index);
    },
    //更改为剩余人次
    ChangeBuyCount: function () {
        orderConfirm.Num = orderConfirm.LeftCount;
        orderConfirm.OrderForm.ChipinNum = orderConfirm.LeftCount;
        orderConfirm.OrderForm.TotalMoney = orderConfirm.LeftCount;
        $("#payMoney").html(orderConfirm.OrderForm.TotalMoney.toFixed("2")).data("paymoney", orderConfirm.OrderForm.TotalMoney);
        orderConfirm.SubitOrderInfo();
    },
    GoPay: function (orderNo) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=gotopayment&OrderNo=" + orderNo,
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
                        window.location.href = msg.resultmessage
                    }

                }
                else {
                    window.location.href = msg.resultmessage
                }
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
         //WeixinJSBridge.log(res.err_msg);
         //alert(res.err_msg);
         if (res.err_msg == "get_brand_wcpay_request:ok") {
             window.location.replace("/Order/OrderSuccess.html?&paytype=wxpay&orderid=" + _orderNo + "&t=" + Math.random());
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
             //$("#btnSubmit").css({ "background": "#f6123d" }).click(function () {
             //    orderConfirm.CreateOrder();
             //});
             // window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderNo + "&t=" + Math.random());
         }
     }
     );
}
var UserIdentity = {
    api_target: "com_cmall_familyhas_api_ApiUserIdentityInfo",
    api_input: { "idNumber": "", "operFlag": "CHECK" },
    Type: 1,
    Check: function (idNumber) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checkuseridentity&idnumber=" + idNumber,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    if (UserIdentity.Type == 2) {
                        Address_Update.EditInfo();
                    }
                }
                else {
                    _needVerifyIdNumber = 1;
                    if (UserIdentity.Type == 1) {
                        // Message.ShowConfirm("您的身份证曾被海关退回，", "若继续使用，可能再次通关失败！", "divAlert", "修改身份证", "IDNumber.ChangeIDnumber", "继续使用");
                    }
                    else if (UserIdentity.Type == 3) {
                        Message.ShowConfirm("您的身份证曾被海关退回，", "若继续使用，可能再次通关失败！", "divAlertPrice", "修改身份证", "IDNumber.ChangeIDnumber", "继续购买", "OrderCreate.CreateToJYH");
                    }
                    else {
                        Message.ShowConfirm("您的身份证曾被海关退回，", "若继续使用，可能再次通关失败！", "divAlert", "修改身份证", "IDNumber.ChangeIDnumber", "继续购买", "Address_Update.EditInfo");
                    }
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
};