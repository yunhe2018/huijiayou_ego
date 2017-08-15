//短信类型
var smstype = "18";
//兑换类型
var typecode = 0;
//兑换号码
var exchangecode = '';
//推广商户
var merchantcode = '';
$(document).ready(function () {
    
    var timer;
    clearInterval(timer);
    timer = setInterval(function () {
        $('.waiting_bf span').toggleClass("w_red");
    }, 230)
    if (localStorage["actlist"] == null) {
        var DateNow = new Date().getTime();
        var DateStart = new Date().getTime();
        var DateEnd = new Date().getTime();
        localStorage["actlist"] = "";
        $.each(actlist.ResultTable, function (i, n) {
            if (GetQueryString("from") == n.merchantcode && (n.cardflag.indexOf(GetQueryString("cardkey")) > -1 || n.cardflag.length == 0)) {
                DateStart = new Date(n.starttime.replace(/-/g, "/"));
                DateEnd = new Date(n.endtime.replace(/-/g, "/"));
                if (DateNow > DateStart && DateNow < DateEnd) {
                    localStorage["actlist"] = JSON.stringify(n);
                    return false;
                }

            }
        });
    }
    if (localStorage["actlist"] != "") {
        actObj = JSON.parse(localStorage["actlist"]);
        //if (actObj.linkurl.indexOf('?') > -1) {
        //    url_web = actObj.linkurl + "&from=" + $("#hidmerchant").val() + "&t=" + Math.random();
        //}
        //else {
        //    url_web = actObj.linkurl + "?from=" + $("#hidmerchant").val() + "&t=" + Math.random();
        //}
        smstype = actObj.smstype;
        $.each(actObj.actstype.split('|'), function (i, n) {
            $("#" + n.split('@')[0]).html(n.split('@')[1]);
        });
        merchantcode = actObj.merchantcode;
        typecode = actObj.apitype;
        exchangecode = actObj.couponcode;
    }
    else {
       // location.replace("/index.html");
    }
    //merchantcode = GetQueryString("from");
    //typecode = GetQueryString("type");
    //exchangecode = GetQueryString("code");

    if (document.getElementById('position')) {
        var bullets = document.getElementById('position').getElementsByTagName('span');
        window.uiejSwipe = new Swipe(document.getElementById('swipe'), {
            startSlide: 0,
            speed: 400,
            auto: 2000,
            continuous: true,
            disableScroll: true,
            stopPropagation: false,
            callback: function (pos) {
                try {
                    var i = bullets.length;
                    while (i--) {
                        bullets[i].className = '';
                    }
                    bullets[pos].className = 'on';
                } catch (e) {
                }
            },
            transitionEnd: function (index, elem) { }
        });
    }



    var timer = null;
    $("#btnCode").on('click', function () {
        if (Send_ValidCode.sendingtime > 0) {
            return;
        }
        var tel = $("#txt_phone_1").val();
        if (tel.length == 0) {
            ShowMesaage(g_const_API_Message["107901"]);
            return;
        }
        if (!isMobile(tel)) {
            ShowMesaage(g_const_API_Message["107902"]);
            return;
        }
        var piccode = $("#txtPicCode").val();
        if (piccode.length == 0) {
            ShowMesaage(g_const_API_Message["8904"]);
            return;
        }
        
        if (localStorage["ValidCodeTime"]) {
            var oldtime = localStorage["ValidCodeTime"];
            var newtime = new Date().getTime();
            var check = newtime - oldtime;
            if (check < 0 * 1000) {
                ShowMesaage("发送短信太频繁");
                return;
            }
        }
        localStorage["ValidCodeTime"] = new Date().getTime();
        var action = "couponcodeexchange";
        Send_ValidCode.MerchantID = merchantcode;
        Send_ValidCode.SendCodeImgEx(action, tel, piccode, smstype);
    });

});

//带验证码兑换
function CouponCodeExchange() {
    var tel = $("#txt_phone_1").val();
    var code = $("#txt_code").val();
    if (tel.length == 0) {
        ShowMesaage(g_const_API_Message["107901"]);
        return;
    }
    if (!isMobile(tel)) {
        ShowMesaage(g_const_API_Message["107902"]);
        return;
    }
    if (code.length == 0) {
        ShowMesaage(g_const_API_Message["107802"]);
        return;
    }
    ShowLoading("优惠券兑换中", "divAlert");
    Merchant1.RecordPageAct(merchantcode, "_exchange");
    Register.PhoneNo = tel;
    Register.ValidCode = code;
    Register.PhoneRegisterCode();
}

function ShowLoading(message, divid) {
    $("#" + divid).html('');
    var body = "";
    body += "<div class=\"waiting_bf_mask\">";
    body += "<div class=\"waiting_bf\">";
    body += "<span class=\"w_red\"></span>";
    body += "<span class=\"\"></span>";
    body += "</div></div>";
    $("#" + divid).html(body);
}

//跳转活动页面
function CloseAct() {
    if (IsInWeiXin.check()) {
        var retstr = merchantcode;
        if ($("#hidcardid").val() != "") {
            CouponCodeExchange.CheckAPI();
        }
        window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&returnurl=" + GetReturnParam() + "&isreg=1");
    }
    else {
        window.location.replace(url_web);
    }
}
//获得微信跳转参数
function GetReturnParam() {
    var retstr = merchantcode + "|" + $("#hidcardkey").val();
    if ($("#hidcardid").val() != "") {
        retstr = $("#hidcardid").val();
    }
    return retstr;
}

function ResultApp() {
    //  Merchant1.RecordPageAct($("#hidmerchant").val(), "_openapp");
    openApp();
}



//注册
var Register = {
    PhoneNo: "",
    ValidCode: "",
    PhoneRegisterCode: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phonereg_exchange_code&phoneno=" + Register.PhoneNo + "&validcode=" + Register.ValidCode + "&mercode=" + merchantcode + "&smstype=" + smstype + "&gettype=" + typecode + "&exchangecode=" + exchangecode,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == "1") {
                    window.location.replace("ok.htm?type=0");
                }
                else if (msg.resultcode == "98") {
                    window.location.replace("ok.htm?type=1");
                }
                else if (msg.resultcode == "99") {
                    window.location.replace("ok.htm?type=2");
                }
                else {
                    Message.Operate('', "divAlert");
                    ShowMesaage(msg.resultmessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //flag.innerHTML = g_const_API_Message["7001"];
            //flag.style.display = 'block';
            Message.Operate('', "divAlert");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};