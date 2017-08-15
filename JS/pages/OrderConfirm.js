
var _wxJsApiParam = ""; 
var _orderNo = "";
var useBalance = 0;
var payMoney = 0;
var OrderTotalMoney = 0;

var orderConfirm = {
    GoodsId: GetQueryString("pid") == "" ? localStorage["pid"] : GetQueryString("pid"),
    PeriodsId: GetQueryString("perid") == "" ? localStorage["perid"] : GetQueryString("perid"),
    Num: GetQueryString("num") == "" ? localStorage["num"] : GetQueryString("num"),
    LeftCount: 0,
    Price: 0,
    Init: function () {
        if (localStorage["fromSelectCoupon"]) {
            if (localStorage["fromSelectCoupon"] == "0") {
                orderConfirm.ClearCoupon();
            }
        }
        else {
            orderConfirm.ClearCoupon();
        }
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
        IpAddress: "",
        CouponNo: "",
        CouponMoney: 0,
        ListId: "",
        Balance: 0,
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
                var payMoney = parseFloat(orderConfirm.Num);
                orderConfirm.OrderForm.TotalMoney = payMoney;
                if (localStorage["SelectCoupon"]) {
                    var selectCoupon = JSON.parse(localStorage["SelectCoupon"]);
                    orderConfirm.OrderForm.CouponNo = selectCoupon.no;
                    orderConfirm.OrderForm.ListId = selectCoupon.lid;
                    orderConfirm.OrderForm.CouponMoney = parseFloat(selectCoupon.p);
                    payMoney = (payMoney - parseFloat(selectCoupon.p)) < 0 ? 0 : (payMoney - parseFloat(selectCoupon.p));
                }
                localStorage["payMoney"] = orderConfirm.OrderForm.TotalMoney;
                orderConfirm.GetAllBalance();
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
        $("#xieyi").on("click", function () {
            g_const_PageURL.GoTo(g_const_PageURL.ego_xieyi);
            return false;
        });
        $(".xy_check,.xy_txt").on("click", function () {
            console.log($(".xy").data("checkd"));
            if ($(".xy").data("checkd") == "1") {
                $(".xy").data("checkd", "0");
                $("#mark").css({ "background": "url() no-repeat" });
                $("#btnSubmit").find("span").css({ "background": "#666" });
            }
            else {
                $(".xy").data("checkd", "1");
                $("#mark").css({ "background": "url(/img/dagou.png) no-repeat", "background-size": "100%" });

                $("#btnSubmit").find("span").css({ "background": "#f6123d" }).off("click").on("click", function () {
                    $(this).off("click").css({ "background": "#666" });
                    orderConfirm.CreateOrder();
                });
            }
        });

        if (localStorage["SelectCoupon"]) {
            var selectCoupon = JSON.parse(localStorage["SelectCoupon"]);
            if (selectCoupon.lid == "0") {
                orderConfirm.LoadCouponCount();
                orderConfirm.ChangeMoney();
            }
            else {
                $("#couponCount").html("已抵" + selectCoupon.p + "元");
                orderConfirm.ChangeMoney();
            }
        }
        else {
            orderConfirm.LoadCouponCount();
            orderConfirm.ChangeMoney();
        }
    },
    PayType: "",
    SelectPayType: function (obj) {
        $(obj).show().find("div[class=radio]").addClass("on");
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
            //微信中
            if (g_const_wxpay == 1) {
                $("#wxpay").show().attr("type", "WxPay");

                $("#wxpay span[name=payMoney]").show();
            }
            orderConfirm.PayType = g_pay_ment.WxPay;
            $("#alipay").attr("type", "AliPay");


        }
        else if (!IsInWeiXin.check() && clientType == ClientType.JYH_Android) {
            //安卓APP中
            if (g_const_wxpay == 1) {
                $("#wxpay").show().attr("type", "WxPayApp");
            }
            orderConfirm.PayType = g_pay_ment.AliPayApp;
            $("#alipay").show().attr("type", "AliPayApp");
            $("#alipay span[name=payMoney]").show();



        } else if (!IsInWeiXin.check() && clientType == ClientType.JYH_iOS) {
            //IOS App中
            if (true) {
                if (g_const_wxpay == 1) {
                    $("#wxpay").show().attr("type", "WxPayApp");
                }
                orderConfirm.PayType = g_pay_ment.AliPayApp;
                $("#alipay").show().attr("type", "AliPayApp");
                $("#alipay span[name=payMoney]").show();
            }

        }
        else {
            //其他
            $("#alipay").show().attr("type", "AliPay");
            $("#alipay span[name=payMoney]").show();
            orderConfirm.PayType = g_pay_ment.AliPay;
            if (g_const_wxpay == 1) {
                $("#wxpay").attr("type", "WxPay");
            }

        }
        //增加易付宝【支持全部类型】
       // $("#yipay").show().attr("type", "YiPayWap");
        //  $("#yipay span[name=payMoney]").show();
        //增加银联支付【暂不支持安卓APP和安卓中的浏览器中】
        //if (clientType != ClientType.JYH_iOS && clientType != ClientType.JYH_Android) {
        if (clientType != ClientType.JYH_Android && !(CheckMachine.versions.android)) {
            $("#yinlianpay").show().attr("type", "YinLianPayWap");
            $("#yinlianpay span[name=payMoney]").show();
        }

        //注册点击事件
        $("#paytype li").off("click").on("click", function () {
            $("#paytype .radio").removeClass("on");
            $("span[name=payMoney]").hide();
            var radio = $(this).find("input").parent();
            $(radio).addClass("on");
            orderConfirm.OrderForm.Balance = 0;
            $(this).find("span[name=payMoney]").show();
            var type = $(this).attr("type");
            orderConfirm.PayType = g_pay_ment[type];
            orderConfirm.ChangeMoney();
        });
    },
    ChangeMoney: function () {
        var payMoney = parseInt(orderConfirm.OrderForm.TotalMoney - orderConfirm.OrderForm.CouponMoney);
        var balance = parseInt(orderConfirm.OrderForm.Balance);
        var left = payMoney - balance;
        if (payMoney == 0) {
            $("#balanceUse").html("0夺宝币").css({ color: "#999" });
            $("#paytype .radio").removeClass("on");
            $("#balanceCheck").removeClass("on");
            $("span[name=payMoney]").html(payMoney.toFixed("2") + "元").data("paymoney", payMoney).css({ color: "#999" });
        }
        if (left == 0) {
            $("#paytype .radio").removeClass("on");
            $("span[name=payMoney]").html(payMoney.toFixed("2") + "元").data("paymoney", payMoney).css({ color: "#999" });
        }
        if (payMoney != 0 && balance == 0) {
            $("span[name=payMoney]").html(payMoney.toFixed("2") + "元").data("paymoney", payMoney).css({ color: "#f6123d" });
            if ($("#paytype .on").length == 0) {
                $("#paytype li:visible").first().find("input").parent().addClass("on");
            }
            $("#balanceUse").html(balance + "夺宝币").css({ color: "#999" });
            $("#balanceCheck").removeClass("on");
        }
        if (payMoney != 0 && balance > 0) {
            $("#paytype li:first").find("input").parent().removeClass("on");
            $("span[name=payMoney]").html((payMoney - balance).toFixed("2") + "元").data("paymoney", (payMoney - balance)).css({ color: "#999" });
            $("#balanceUse").html(balance + "夺宝币").css({ color: "#f6123d" });
            $("#balanceCheck").addClass("on");
        }
        if (payMoney != 0 && balance > 0 && left > 0) {
            if ($("#paytype .on").length == 0) {
                $("#paytype li:visible").first().find("input").parent().addClass("on");
            }
            $("span[name=payMoney]").html((payMoney - balance).toFixed("2") + "元").data("paymoney", (payMoney - balance)).css({ color: "#f6123d" });
            $("#balanceUse").html(balance + "夺宝币").css({ color: "#f6123d" });
            $("#balanceCheck").addClass("on");
        }
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
            ShowMesaage("请先阅读并同意服务协议再购买");
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
        if (orderConfirm.OrderForm.TotalMoney < 1) {
            ShowMesaage("订单金额最小为1元");
            return false;
        }
        try {
            //搜狐接口获得客户端IP 
            var ILData_group = returnCitySN["cid"] + "|" + returnCitySN["cip"] + "|" + returnCitySN["cname"] //城市ID+“|”+IP+“|”+所在地名称;
            orderConfirm.OrderForm.IpAddress = ILData_group;
        } catch (e) {
            orderConfirm.OrderForm.IpAddress = "";
        }
        var param = "";
        for (var i in orderConfirm.OrderForm) {
            var v = orderConfirm.OrderForm[i];
            param += "&" + i + "=" + v;
        }
        orderConfirm.ClearCoupon();

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
                ShowMesaage(msg.resultMessage);
            } else {
                var orderCode = msg.OrderNo;
                _orderNo = orderCode;
                orderConfirm.Record_From(orderCode);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadCouponCount: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getcoupons",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.ResultCode) {
                if (msg.ResultCode == "99") {
                    ShowMesaageCallback(msg.Description, function () {
                        PageUrlConfig.SetUrl();
                        g_const_PageURL.GoTo(g_const_PageURL.Login);
                    }, 2000);
                }
                else {
                    ShowMesaage(msg.Description);
                }
            } else {
                if (msg.resultCode) {
                    if (msg.resultCode == "99") {
                        $("#couponCount").html("无可用").css({ color: "#999" });
                    }
                }
                else {
                    if (msg.resultcode == g_const_Success_Code) {
                        var counter = 0;
                        $(msg.couponlist).each(function () {
                            //var dateNow = new Date().getTime();
                            //var date_last = Date.Parse(this.date_info_end);
                            //var ts = dateNow - date_last.getTime();
                            if ((this.canuse == "1" || this.canuse == "3")
                                && (this.usepricemin == 0 || parseFloat(this.usepricemin) <= orderConfirm.OrderForm.TotalMoney)
                                && My_DateCheck.CheckEX('<=', Date.parse(this.date_info_begin.replace(/-/g, "/")))
                                && My_DateCheck.CheckEX('>', Date.parse(this.date_info_end.replace(/-/g, "/")))
                                )
                            {
                                 
                                if (this.userproudct_ids != "") {
                                    //支持商品
                                    var userproudct_ids = "," + this.userproudct_ids + ",";
                                    if (userproudct_ids.indexOf(orderConfirm.GoodsId) > -1) {
                                        ++counter;
                                    }
                                }
                                else if (this.nouserproudct_ids != "") {
                                    //不支持商品
                                    var nouserproudct_ids = "," + this.nouserproudct_ids + ",";
                                    if (nouserproudct_ids.indexOf(orderConfirm.GoodsId) == -1) {
                                        ++counter;
                                    }
                                }
                                else {
                                    ++counter;
                                }
                            }
                        });
                        if (counter > 0) {
                            $("#couponCount").html(counter + "张可用");
                        } else {
                            $("#couponCount").html("无可用").css({ color: "#999" });
                        }
                    }
                    else {
                        $("#couponCount").html("无可用").css({ color: "#999" });
                    }
                }
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
                        window.location.replace(msg.resultmessage)
                    }

                }
                else {
                    window.location.replace(msg.resultmessage);
                }
                orderConfirm.ClearCoupon();
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
    SelectCoupon: function () {
        localStorage["pid"] = orderConfirm.GoodsId;
        localStorage["perid"] = orderConfirm.PeriodsId;
        localStorage["num"] = orderConfirm.Num;
        g_const_PageURL.GoTo(g_const_PageURL.SelectCoupon, "OrderTotalMoney=" + orderConfirm.OrderForm.TotalMoney + "&GoodsId=" + orderConfirm.GoodsId);
    },
    ClearCoupon: function () {
        var coupon = { no: "0", p: "0", lid: "0" };
        localStorage["SelectCoupon"] = JSON.stringify(coupon);
        localStorage["payMoney"] = "";
    },
    GetAllBalance: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getbalance",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    //账号未被冻结
                    $("#balanceInfo").html(parseInt(msg.allBalance) + "夺宝币");
                    var realPay = orderConfirm.OrderForm.TotalMoney - orderConfirm.OrderForm.CouponMoney;
                    payMoney = realPay;
                    var balance = parseFloat(msg.allBalance);
                    if (msg.status != "2") {
                        if (balance != 0 && balance >= realPay) {
                            $("#balanceUse").html(realPay + "夺宝币");
                            useBalance = realPay;
                            orderConfirm.OrderForm.Balance = realPay;
                            $("#balanceCheck").addClass("on");
                            $("#balanceModel").show();
                        }
                        else if (balance != 0 && balance < realPay) {
                            $("#balanceUse").html(balance + "夺宝币");
                            useBalance = balance;
                            orderConfirm.OrderForm.Balance = balance;
                            $("#balanceCheck").addClass("on");
                            $("#balanceModel").show();
                        }
                        else {
                            useBalance = 0;
                            orderConfirm.OrderForm.Balance = 0;
                        }
                        realPay = realPay - orderConfirm.OrderForm.Balance;
                        $("span[name=payMoney]").html(realPay.toFixed("2") + "元").data("paymoney", realPay);
                        orderConfirm.ChangeMoney();
                        $("#balanceModel").off("click").on("click", function () {
                            if ($("#balanceCheck").hasClass("on")) {
                                $("#balanceCheck").removeClass("on");
                                orderConfirm.OrderForm.Balance = 0;
                            }
                            else {
                                $("#balanceCheck").addClass("on");
                                orderConfirm.OrderForm.Balance = useBalance;
                            }
                            orderConfirm.ChangeMoney();
                        });
                    }
                    else {
                        useBalance = 0;
                        orderConfirm.OrderForm.Balance = 0;
                        realPay = realPay - orderConfirm.OrderForm.Balance;
                        $("span[name=payMoney]").html(realPay.toFixed("2") + "元").data("paymoney", realPay);
                        orderConfirm.ChangeMoney();
                    }
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Record_From: function (orderCode) {
        var OrderFrom_1 = localStorage[g_const_localStorage.OrderFrom];

        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                $.ajax({
                    type: "POST",//用POST方式传输
                    dataType: "json",//数据格式:JSON
                    url: '/Ajax/API.aspx',//目标地址
                    data: "t=" + Math.random() +
                            "&action=merchant_order" +
                            "&merchantcode=" + escape(localStorage[g_const_localStorage.OrderFrom]) +
                            "&paramlist=" + escape(localStorage[g_const_localStorage.OrderFromParam].replace(/&/g, "@").replace(/=/g, "^")) +
                            "&orderno=" + escape(orderCode),
                    beforeSend: function () { },//发送数据之前
                    complete: function () { },//接收数据完毕
                    success: function (data) {
                    }
                });
            }
        }

        //爱德
        //if (OrderFrom_1 == Merchant1.Code) {
        //    try {
        //        productCodeList = productCodeList.substring(2);
        //        productNameList = productNameList.substring(2);
        //        productPriceList = productPriceList.substring(2);
        //        productNumberList = productNumberList.substring(2);
        //        //处理爱德数据
        //        Merchant1.productid = productCodeList.split('||')[0];
        //        Merchant1.productname = productNameList.split('||')[0];
        //        Merchant1.productprice = productPriceList.split('||')[0];
        //        Merchant1.orderid = paymsg.order_code;
        //        Merchant1.orderprice = _pay_money;//paymsg.order_money;
        //        Merchant1.RecordValid(Merchant1.RecordOrder);
        //    }
        //    catch (e) {
        //        OrderCreate.GoToPay(paymsg.order_code);

        //    }
        //}
        //    //处理领克特
        //else if (OrderFrom_1 == Merchant_LKT.Code) {
        //    try {
        //        //处理领克特
        //        Merchant_LKT.order_code = paymsg.order_code;
        //        //$.each(paymsg.orderSellerList, function (i, n) {
        //        //    Merchant_LKT.product_code += '||' + n.productCode;
        //        //    Merchant_LKT.product_price += '||' + n.price;
        //        //    Merchant_LKT.product_count += '||' + n.number;
        //        //    Merchant_LKT.product_cd += '||' + n.productCode;
        //        //})
        //        Merchant_LKT.product_code = productCodeList;
        //        Merchant_LKT.product_price = productPriceList;
        //        Merchant_LKT.product_count = productNumberList;
        //        Merchant_LKT.product_cd = productCodeList;
        //        Merchant_LKT.order_code = paymsg.order_code;
        //        Merchant_LKT.RecordOrder();
        //    }
        //    catch (e) {
        //        OrderCreate.GoToPay(paymsg.order_code);

        //    }
        //}
        //    //多麦--订单推送
        //else if (localStorage[g_const_localStorage.OrderFrom] == Merchant_duomai.Code && localStorage[g_const_localStorage.OrderFromRefer] != "") {
        //    try {
        //        //多麦--订单推送
        //        Merchant_duomai.order_sn = paymsg.order_code;//订单编号
        //        Merchant_duomai.order_time = Merchant1.GetNowTime();//用户下单时间
        //        if (parseFloat(duomai_manjianPrice) > 0) {
        //            //对于满减的订单，此参数值为满减的金额；如若没有满减，则传0
        //            Merchant_duomai.discount_amount = duomai_manjianPrice;//优惠金额=应付总金额-实际支付金额
        //            Merchant_duomai.orders_price = (parseFloat(duomai_manjianPrice) + parseFloat(_pay_money)).toFixed(2);//订单金额包含满减金额
        //        }
        //        else {
        //            Merchant_duomai.discount_amount = "0";
        //            Merchant_duomai.orders_price = _pay_money;//订单金额包含满减金额

        //        }
        //        Merchant_duomai.order_status = "0";//订单状态,目前-1表示无效，0表示未支付状态，其它直接给出状态描述，或者使用1、2、3这样的正整数

        //        //一个订单，多个商品时，每个商品属性都用“|”分隔多个，
        //        Merchant_duomai.goods_id = duomai_goods_id;//商品编号
        //        Merchant_duomai.goods_name = duomai_goods_name;//商品名称
        //        Merchant_duomai.goods_price = duomai_goods_price;//商品单价
        //        Merchant_duomai.goods_ta = duomai_goods_ta;//商品数量
        //        Merchant_duomai.goods_cate = duomai_goods_cate;//商品分类编号
        //        Merchant_duomai.totalPrice = duomai_totalPrice;//商品总净金额，商品总价减去此件商品使用的优惠券/现金券等其他非实付金额
        //        Merchant_duomai.RecordOrder();
        //    }
        //    catch (e) {
        //        OrderCreate.GoToPay(paymsg.order_code);
        //    }

        //}
        //else {
        //一般订单
        orderConfirm.GoPay(orderCode);
        //}
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
             window.location.replace("/Order/OrderSuccess.html?paytype=wxpay&orderid=" + _orderNo + "&t=" + Math.random());
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
             //window.location.replace("/Account/Recharge.html?t=" + Math.random());
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