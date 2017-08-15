//订单类型
var _order_type;
//订单类型
var _order_souce;
//区编码
var _area_code;
//优惠券
var _coupon_codes;
//商品列表
var _goods;
//商品价格
var _goodsprice;
//支付类型
var _pay_type = "";
//支付类型
var _fapiao;
//发票内容
var _fapiaonr;
//发票备注
var _fapiaobillRemark;
//应付金额
var _pay_money;
//应付金额
var _cash_money;
//送货地址ID
var _addressid = 0;
//微信支付参数
var _wxJsApiParam = {};
//订单编号
var _orderid = "";
var _issmg = 0;
//详细地址
var _addressStreet = "";
var of_status = 1;
var _orderfrom = "";
var _needVerifyIdNumber = 0;
//提交商品数据
var productCodeList = "";
var productNameList = "";
var productPriceList = "";
var productNumberList = "";
var _endTime = "";
var _num = "";

//地址信息（xxx省xxx市xxx区）格式
var _provinces = "";
$(document).ready(function () {
    _order_type = g_order_Type.PinTuan;
    _order_souce = g_order_Souce.Weixin;
    OrderConfirmPin.LoadGood();
    $("#btnSubmit").click(function () {
        CreateOrder();
    });
    if (localStorage[g_const_localStorage.OrderAddress] != null) {
        _addressid = localStorage[g_const_localStorage.OrderAddress];
    }
    //编辑地址
    $("#divAddressLogin").click(function () {
        //保存返回地址
        PageUrlConfig.SetUrl();
        localStorage["fromOrderConfirm"] = "1"
        if (_addressid == "") {
            _addressid = "0";
        }
        window.location.href = g_const_PageURL.AddressList + "?eid=" + GetQueryString("eid") + "&addressid=" + _addressid + "&login=" + UserLogin.LoginStatus + "&t=" + Math.random();
    });
    //编辑地址
    $("#divAddressUnLogin").click(function () {
        //保存返回地址
        PageUrlConfig.SetUrl();
        localStorage["fromOrderConfirm"] = "1"
        if (_addressid == "") {
            _addressid = "0";
        }
        window.location.href = g_const_PageURL.AddressEdit + "?eid=" + GetQueryString("eid") + "&addressid=0&login=" + UserLogin.LoginStatus + "&t=" + Math.random();
    });
    ////后退至商品详情页
    //$("#btnBack").click(function () {
    //    //清除缓存支付方式
    //    localStorage["selpaytype"] = "";
    //    localStorage[g_const_localStorage.CouponCodes] = "";
    //    Message.ShowConfirm("确定要取消订单吗？", "稍后商品可能会被抢走哦～", "divAlert", "取消订单", "CancelOrder", "继续购买");
    //});
});


var OrderConfirmPin = {
    EventCode: GetQueryString("eid"),
    Num: 0,
    EndTime: "",
    LoadGood: function () {
        g_type_tuanInfo.api_input.eventCoe = OrderConfirmPin.EventCode;
        g_type_tuanInfo.LoadData(OrderConfirmPin.LoadGoodResult);
    },
    LoadGoodResult: function (list) {
        $("#goodInfo").empty();
        if (list.length > 0) {
            var data = list[0];

            if (data) {
                //填充订单提交商品参数
                _goods = [{ "sku_num": "1", "area_code": "", "product_code": data.productCode, "chooseFlag": "1", "sku_code": data.skuCode }];
                _pay_money = data.favorablePrice;
                _num = data.purchaseNum;
                _endTime = data.endTime;

                OrderConfirmPin.Num = data.purchaseNum;
                OrderConfirmPin.EndTime = data.endTime;
                //渲染订单中的商品数据
                var goodHtml = [];
                goodHtml.push('<div class="goodImg"><img src="' + (data.mainpicUrl || g_goods_Pic) + '"></div>');
                goodHtml.push('<div class="goodtxt"><p class="text2">' + data.skuName + '</p><p class="price">￥' + data.sellingPrice.toFixed(2) + '元</p></div>');
                goodHtml.push(' <div class="total">快递：￥0.00 总价<i>￥' + data.favorablePrice + '</i></div>');

                $("#goodInfo").html(goodHtml.join(""));
                UserLogin.Check(SetLoginDiv);
                //OrderDetail.OrderConfirm();
                OrderDetail.LoadOrderInfo();
            }
        }
    }
};

function CreateOrder() {
    OrderCreate.CreateToJYH();
}
function SetLoginDiv() {
    if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
        if (_addressid == 0 || _addressid == "") {
            Address_Default.GetObj();
        }
        else {
            Address_Info.GetByID(_addressid);
        }
    }
    else {
        $("#divLogin").show();
    }
}
function setPaytype(type, obj) {
    $("#payGate li").find("div[class=radio]").removeClass("on");
    $(obj).find("div[class=radio]").addClass("on");
    switch (type) {
        case 1:
            _pay_type = g_pay_Type.Alipay;
            break;
        case 0:
            _pay_type = g_pay_Type.Getpay;
            break;
        case 2:
            _pay_type = g_pay_Type.WXpay;
            break;
    }
}

function CancelOrder() {
    //回退到商品详情页
    window.location.replace(PageUrlConfig.BackTo());
}
var Address_Update = {
    api_input: { "id": "", "mobile": "", "areaCode": "", "street": "", "name": "", "provinces": "", "isdefault": "", "idNumber": "" },
    EditInfo: function () {
        var s_api_input = JSON.stringify(Address_Update.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_Update.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressedit&api_input=" + s_api_input + "&validcode=",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    if (msg.resultcode == "916421182") {
                        Message.ShowAlert("您的身份证曾被海关退回", "为确保下单成功，请核对身份证！", "divAlert", "确定");
                    }
                    else {
                        ShowMesaage(msg.resultmessage);
                        Message.Operate('', "divAlert");
                    }
                    return;
                }
                else {
                    _needVerifyIdNumber = 0;
                    ShowMesaage("身份证提交成功");
                    Address_Info.GetByID(Address_Update.api_input.id);
                    Message.Operate('', "divAlert");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
};
//获取默认地址
var Address_Default = {
    GetObj: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressdefault",
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                if (msg.areaCode.length > 0) {
                    Address_Default.SetAddressInfo(msg);
                    Address_Default.ShowAddressDiv(1);
                }
                else {
                    Address_Default.ShowAddressDiv(0);
                }
            }
            else {
                Address_Default.ShowAddressDiv(0);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    ShowAddressDiv: function (loginstatus) {
        if (loginstatus == 1) {
            $("#divAddressLogin").show();
            $("#divPaytype").show();
        }
        else {
            $("#divAddressUnLogin").show();
            $("#divAddressLogin").hide();
        }
    },
    SetAddressInfo: function (result) {
        _provinces = result.provinces;
        $("#spaddressuser").html(result.name + '<span class="tel" id="spaddressphone">' + result.mobile + '</span>');
        $("#spaddressdetail").text(result.provinces + result.street);
        _addressid = result.id;
        _area_code = result.areaCode;
        _addressStreet = result.street;

        Address_Update.api_input.id = result.id;
        Address_Update.api_input.mobile = result.mobile;
        Address_Update.api_input.areaCode = result.areaCode;
        Address_Update.api_input.street = result.street;
        Address_Update.api_input.name = result.name;
        Address_Update.api_input.provinces = result.provinces;
        Address_Update.api_input.idNumber = result.idNumber;
        Address_Update.api_input.isdefault = result.isdefault;

        OrderDetail.CheckAddress(_goods[0].product_code);
    },
};

var Address_Info = {
    GetByID: function (addressid) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getaddressbyid&addressid=" + addressid,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Error_Code.NoAddress) {
                Address_Default.GetObj();
                $("#divLogin").hide();
            }
            else if (msg.resultcode == g_const_Success_Code_IN) {
                if (msg.areaCode.length > 0) {
                    Address_Default.SetAddressInfo(msg);
                    Address_Default.ShowAddressDiv(1);
                }
                else {
                    Address_Default.GetObj();
                }
            }
            else {
                Address_Default.GetObj();
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
}
var ispay = 0;
var OrderDetail = {
    api_target: "com_cmall_familyhas_api_APiOrderConfirm",
    api_input: { "area_code": "", "coupon_codes": "", "goods": [], "buyer_code": "", "order_type": "", "channelId": "" },
    OrderConfirm: function () {
        OrderDetail.api_input.area_code = _area_code;
        OrderDetail.api_input.coupon_codes = _coupon_codes;
        OrderDetail.api_input.goods = _goods;
        OrderDetail.api_input.order_type = _order_type;
        OrderDetail.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(OrderDetail.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": OrderDetail.api_target, "api_token": "1" };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            console.log(msg);
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    OrderDetail.LoadOrderInfo(msg)
                }
                else {
                    //backurl = PageUrlConfig.BackTo();
                    //Message.ShowToPage(msg.resultMessage, backurl, 4000, "");
                    ShowMesaage(msg.resultMessage);
                    Message.Operate('', "divAlert");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    //显示订单内容
    LoadOrderInfo: function (msg) {
        Message.Operate('', "divAlert");
        //OrderDetail.LoadMoney(msg);
        OrderDetail.LoadPayType(msg);
        OrderDetail.CheckCanPinTuan();
    },
    //显示金额
    LoadMoney: function (moneymsg) {
        _pay_money = moneymsg.pay_money;
        _cash_money = moneymsg.cash_back;
    },
    //显示支付类型
    LoadPayType: function (paymsg) {
        //获得缓存的支付方式
        var selpayType = "";
        if (localStorage["selpaytype"] != null && localStorage["selpaytype"] != "") {
            selpayType = localStorage["selpaytype"];
            $("#divweixin").hide();
            $("#divalipay").hide();
            if (IsInWeiXin.check()) {
                switch (selpayType) {
                    case "divweixin":
                        $("#divweixin").show().find("div[class=radio]").addClass("on");
                        _pay_type = g_pay_Type.WXpay;
                        break;
                }
            }
            else {
                switch (selpayType) {
                    case "divalipay":
                        $("#divalipay").show().find("div[class=radio]").addClass("on");
                        _pay_type = g_pay_Type.Alipay;
                        break;
                }
            }
        }
        else {
            if (IsInWeiXin.check()) {
                $("#divweixin").show().find("div[class=radio]").addClass("on");
                _pay_type = g_pay_Type.WXpay;
            }
            else {
                $("#divalipay").show().find("div[class=radio]").addClass("on");
                _pay_type = g_pay_Type.Alipay;
            }
        }
        //_fapiaonr = paymsg.bills;
        //_fapiaobillRemark = paymsg.billRemark;
    },
    CheckCanPinTuan: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=iscanpin&Num=" + OrderConfirmPin.Num + "&endTime=" + OrderConfirmPin.EndTime + "&eventCode=" + OrderConfirmPin.EventCode,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    ShowMesaage(g_const_API_Message["107001"]);
                    $("#btnSubmit").unbind().css("background", "#666666");
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    CheckAddress: function (pid) {
        var api_input = { "picWidth": 0, "productCode": pid, "buyerType": "", "version": 1.0 };
        var s_api_input = JSON.stringify(api_input);
        var api_target = "com_cmall_familyhas_api_ApiGetEventSkuInfoNew";
        var api_token = g_const_api_token.Unwanted;
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            api_token = g_const_api_token.Wanted;
        }
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": api_token };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                var address = msg.addressList;
                if (address.length > 0 && _provinces != "") {
                    var isSuccess = false;
                    $(address).each(function () {
                        var citys = this.cityList;
                        $(citys).each(function () {
                            var cityName = this.cityName;
                            if (_provinces.indexOf(cityName) != -1) {
                                {
                                    isSuccess = true;
                                    return false;
                                }
                            }
                        });
                    });
                    if (!isSuccess) {
                        ShowMesaage(g_const_API_Message["107002"]);
                    }
                }
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};
var OrderCreate = {
    api_target: "com_cmall_familyhas_api_APiCreateOrder ",
    api_input: { "check_pay_money": "", "buyer_address_id": "", "buyer_address_code": "", "goods": [], "buyer_mobile": "", "pay_type": "", "buyer_address": "", "billInfo": [], "app_vision": "1.0.0", "buyer_name": "", "order_type": "", "coupon_codes": "", "order_souce": "", "channelId": "", "os": "" },
    CreateToJYH: function () {
        Message.ShowLoading("订单努力提交中", "divAlert");
        if ($("#spaddressdetail").html().length == 0) {
            ShowMesaage(g_const_API_Message["100030"]);
            Message.Operate('', "divAlert");
            return;
        }
        if (_pay_type.length == 0) {
            ShowMesaage(g_const_API_Message["100031"]);
            Message.Operate('', "divAlert");
            return;
        }
        OrderCreate.api_input.check_pay_money = _pay_money;
        OrderCreate.api_input.buyer_address_id = _addressid;
        OrderCreate.api_input.buyer_address_code = _area_code;
        OrderCreate.api_input.goods = _goods;
        OrderCreate.api_input.buyer_mobile = $("#spaddressphone").text();
        OrderCreate.api_input.pay_type = _pay_type;
        OrderCreate.api_input.buyer_address = _addressStreet;
        OrderCreate.api_input.billInfo = _fapiao;
        OrderCreate.api_input.buyer_name = $("#spaddressuser").text();
        OrderCreate.api_input.order_type = _order_type;
        OrderCreate.api_input.coupon_codes = _coupon_codes;
        OrderCreate.api_input.order_souce = _order_souce;
        OrderCreate.api_input.channelId = g_const_ChannelID;
        OrderCreate.api_input.app_vision = "1.0.0";
        OrderCreate.api_input.os = "";
        if (of_status == "1") {
            if (localStorage[g_const_localStorage.OrderFrom] != null) {
                if (localStorage[g_const_localStorage.OrderFrom] != "") {
                    OrderCreate.api_input.app_vision = localStorage[g_const_localStorage.OrderFrom];
                }
            }
            if (localStorage[g_const_localStorage.OrderFromParam] != null) {
                if (localStorage[g_const_localStorage.OrderFromParam] != "") {
                    OrderCreate.api_input.os = localStorage[g_const_localStorage.OrderFromParam];
                }
            }
        }


        var s_api_input = JSON.stringify(OrderCreate.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": OrderCreate.api_target, "api_token": "1" };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            console.log(msg);
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    Message.Operate('', "divAlert");
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    OrderCreate.Pin(msg);

                }
                else {
                    ShowMesaage(msg.resultMessage);
                    Message.Operate('', "divAlert");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["100029"]);
            Message.Operate('', "divAlert");
        });
    },
    Record_From: function (paymsg) {
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
                            "&orderno=" + escape(paymsg.order_code),
                    beforeSend: function () { },//发送数据之前
                    complete: function () { },//接收数据完毕
                    success: function (data) {
                    }
                });
            }
        }

        //爱德
        if (OrderFrom_1 == Merchant1.Code) {
            try {
                productCodeList = productCodeList.substring(2);
                productNameList = productNameList.substring(2);
                productPriceList = productPriceList.substring(2);
                productNumberList = productNumberList.substring(2);
                //处理爱德数据
                Merchant1.productid = productCodeList.split('||')[0];
                Merchant1.productname = productNameList.split('||')[0];
                Merchant1.productprice = productPriceList.split('||')[0];
                Merchant1.orderid = paymsg.order_code;
                Merchant1.orderprice = _pay_money;//paymsg.order_money;
                Merchant1.RecordValid(Merchant1.RecordOrder);
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);

            }
        }
            //处理领克特
        else if (OrderFrom_1 == Merchant_LKT.Code) {
            try {
                //处理领克特
                Merchant_LKT.order_code = paymsg.order_code;
                //$.each(paymsg.orderSellerList, function (i, n) {
                //    Merchant_LKT.product_code += '||' + n.productCode;
                //    Merchant_LKT.product_price += '||' + n.price;
                //    Merchant_LKT.product_count += '||' + n.number;
                //    Merchant_LKT.product_cd += '||' + n.productCode;
                //})
                Merchant_LKT.product_code = productCodeList;
                Merchant_LKT.product_price = productPriceList;
                Merchant_LKT.product_count = productNumberList;
                Merchant_LKT.product_cd = productCodeList;
                Merchant_LKT.order_code = paymsg.order_code;
                Merchant_LKT.RecordOrder();
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);

            }
        }
            //多麦--订单推送
        else if (localStorage[g_const_localStorage.OrderFrom] == Merchant_duomai.Code && localStorage[g_const_localStorage.OrderFromRefer] != "") {
            try {
                //多麦--订单推送
                Merchant_duomai.order_sn = paymsg.order_code;//订单编号
                Merchant_duomai.order_time = Merchant1.GetNowTime();//用户下单时间
                if (parseFloat(duomai_manjianPrice) > 0) {
                    //对于满减的订单，此参数值为满减的金额；如若没有满减，则传0
                    Merchant_duomai.discount_amount = duomai_manjianPrice;//优惠金额=应付总金额-实际支付金额
                    Merchant_duomai.orders_price = (parseFloat(duomai_manjianPrice) + parseFloat(_pay_money)).toFixed(2);//订单金额包含满减金额
                }
                else {
                    Merchant_duomai.discount_amount = "0";
                    Merchant_duomai.orders_price = _pay_money;//订单金额包含满减金额

                }
                Merchant_duomai.order_status = "0";//订单状态,目前-1表示无效，0表示未支付状态，其它直接给出状态描述，或者使用1、2、3这样的正整数

                //一个订单，多个商品时，每个商品属性都用“|”分隔多个，
                Merchant_duomai.goods_id = duomai_goods_id;//商品编号
                Merchant_duomai.goods_name = duomai_goods_name;//商品名称
                Merchant_duomai.goods_price = duomai_goods_price;//商品单价
                Merchant_duomai.goods_ta = duomai_goods_ta;//商品数量
                Merchant_duomai.goods_cate = duomai_goods_cate;//商品分类编号
                Merchant_duomai.totalPrice = duomai_totalPrice;//商品总净金额，商品总价减去此件商品使用的优惠券/现金券等其他非实付金额
                Merchant_duomai.RecordOrder();
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);
            }

        }
        else {
            //一般订单
            OrderCreate.GoToPay(paymsg.order_code);
        }
    },
    GoToPay: function (order_code) {
        //跳转支付页面
        //清除缓存支付方式
        localStorage["selpaytype"] = "";
        localStorage[g_const_localStorage.OrderConfirm] = "";
        localStorage[g_const_localStorage.CouponCodes] = "";
        localStorage[g_const_localStorage.OrderAddress] = null;

        OrderCreate.ToPay(order_code);

    },
    //显示支付类型
    //ToPay: function (paymsg) {
    ToPay: function (order_code) {
        localStorage[g_const_localStorage.FaPiao] = "";
        _orderid = order_code;
        switch (_pay_type) {
            case g_pay_Type.Alipay:
                if (_pay_money > 0) {
                    window.location.replace(g_Alipay_url + _orderid + "/4497153900010001");
                }
                else {
                    window.location.replace("/Order/OrderSuccess.html?paytype=alipay&orderid=" + _orderid + "&t=" + Math.random());
                }
                break;
            case g_pay_Type.Getpay:
                window.location.replace("/Order/OrderSuccess.html?paytype=getpay&orderid=" + _orderid + "&t=" + Math.random());
                break;
            case g_pay_Type.WXpay:
                if (_pay_money > 0) {
                    OrderCreate.WxPay(_pay_money);
                }
                else {
                    window.location.replace("/Order/OrderSuccess.html?paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
                }
                break;
        }
    },
    WxPay: function (total_fee) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=wxpay&total_fee=" + total_fee + "&orderid=" + _orderid,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            _wxJsApiParam = msg
            Message.Operate('', "divAlert");
            callpay();
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Pin: function (msg) {
        var order_code = msg.order_code;
        var json = {
            "EventCode": GetQueryString("eid"),
            "PhoneNo": "",
            "ProductCode": _goods[0].product_code,
            "SkuCode": _goods[0].sku_code,
            "PayPrice": _pay_money,
            "SellingPrice": _pay_money,
            "CreateTime": "",
            "PayTime": "",
            "Status": "1",
            "PayStatus": "1",
            "OrderCode": msg.order_code,
            "ReceiverAddress": $("#spaddressdetail").text() + " " + $("#spaddressuser").text() + " " + $("spaddressphone").text(),
        };
        console.log(JSON.stringify(json));
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=pin&num=" + _num + "&endtime=" + _endTime + "&json=" + JSON.stringify(json),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            console.log(msg);
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    OrderCreate.GoToPay(order_code);
                    // ShowMesaage(g_const_API_Message[msg.resultcode]);
                }
                else {
                    ShowMesaage(msg.resultmessage);
                }
            } else {
                ShowMesaage(g_const_API_Message[msg.resultcode]);
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
         //  alert(res.err_msg);
         if (res.err_msg == "get_brand_wcpay_request:ok") {
             window.location.replace("/Order/OrderSuccess.html?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
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
             window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
     }
     );
}

//在线支付包含的支付方式
var onlinePayType = {
    api_target: "com_cmall_familyhas_api_ApiPaymentTypeAll",
    api_input: { "order_code": "" },

    getList: function () {
        //赋值
        onlinePayType.api_input.order_code = $("#hid_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": onlinePayType.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {
            console.log(msg);
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val() + "&order_money=" + $("#hid_order_money").val())
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                onlinePayType.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (result) {
        //支付方式
        var all_pay_type = "";
        //判断是否在为新内置浏览器
        var sel = "curr";
        $.each(result.paymentTypeAll, function (i, n) {
            switch (n) {
                case g_pay_Type.Alipay:
                    if (IsInWeiXin.check() == false) {
                        all_pay_type += "<dd id=\"selalipay\" onclick=\"javascript: $('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#alpayicq').attr('class', 'curr');$('#hid_selpaytype').val('alipay');\" ><em class=\"alipay\"></em>支付宝<a id=\"alpayicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                        if (sel != "") {
                            $("#hid_selpaytype").val("alipay");
                            sel = "";
                        }
                    }
                    break;
                case g_pay_Type.WXpay:
                    all_pay_type += "<dd id=\"selweixin\" onclick=\"javascript:$('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#weixinicq').attr('class', 'curr');$('#hid_selpaytype').val('weixin');\" ><em class=\"weixin\"></em>微信支付<a id=\"weixinicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                    if (sel != "") {
                        $("#hid_selpaytype").val("weixin");
                        sel = "";
                    }
                    break;
            }
        });
        $("#payGate").html(all_pay_type);

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

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