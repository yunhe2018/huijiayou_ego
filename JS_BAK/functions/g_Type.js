/// <reference path="g_Const.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../ShortURL.js" />

/*类型定义*/
var Message = {
    ShowToPage: function (message, pageurl, time, str_callback, setbackurl) {
        var backurl = window.location.href;
        if (str_callback != "") {
            if (backurl.indexOf("?") != -1) {
                backurl += "&callback=" + encodeURIComponent(str_callback);
            }
            else {
                backurl += "callback=" + encodeURIComponent(str_callback);
            }
        }

        if (setbackurl) {
            backurl = setbackurl;
        }
        localStorage[g_const_localStorage.BackURL] = backurl;
        PageUrlConfig.SetUrl(backurl);

        if (message != "") {
            ShowMesaage(message);
        }
        setTimeout("window.location.replace(\"" + pageurl + "\");", time);
    },
    //加载层（消息，显示控件）
    ShowLoading: function (message, divid) {
        $("#" + divid).html('');
        var body = "";
        body += "<div id=\"pageloading\" class=\"wrap-wait\">";
        body += "<div class=\"img\">";
        body += "<img src=\"/img/waiting.gif\" alt=\"\" />";
        body += "</div>";
        body += "<p>" + message + "<br />...</p>";
        body += "</div>";
        body += "<div id=\"mask\" style=\"display:block;\">&nbsp;</div>";

        $("#" + divid).html(body);
    },
    //确认提示层（消息，换行消息，显示控件，确定文字，确定操作，取消文字，取消操作[不传默认关闭层]）
    ShowConfirm: function (message, messageother, divid, yesstr, operateYes, nostr, operateNo) {
        $("#" + divid).html('');
        var body = "";
        body += "<div class=\"fbox ftel\">";
        body += "<div class=\"sc jxtx\"><span>" + message + "</span>" + messageother + "</div>";
        body += "<div class=\"btns\">";
        body += "<a onclick=\"Message.Operate(" + operateNo + ",'" + divid + "')\">" + nostr + "</a><a class=\"ok\" onclick=\"Message.Operate(" + operateYes + ",'" + divid + "')\">" + yesstr + "</a>";
        body += "</div>";
        body += "</div>";
        body += "<div id=\"mask\" style=\"z-index:100;\">&nbsp;</div>";
        $("#" + divid).html(body);
        $("#mask").show();
    },
    //普通提示层（消息，换行消息，显示控件，确定文字，确定操作[不传默认关闭层]）
    ShowAlert: function (message, messageother, divid, yesstr, operateYes) {
        $("#" + divid).html('');
        var body = "";
        body += "<div class=\"fbox ftel\">";
        body += "<div class=\"sc jxtx\"><span>" + message + "</span>" + messageother + "</div>";
        body += "<div class=\"btns\">";
        body += "<a class=\"ok2\" onclick=\"Message.Operate(" + operateYes + ",'" + divid + "')\">" + yesstr + "</a>";
        body += "</div>";
        body += "</div>";
        body += "<div id=\"mask\" style=\"z-index:100;\">&nbsp;</div>";
        $("#" + divid).html(body);
    },
    Operate: function (callback, divid) {
        if (typeof (callback) == "function") {
            callback();
        }
        $("#mask").hide();
        $("#" + divid).html('');
    },
};

//判断是否为微信浏览器
var IsInWeiXin = {
    check: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
};
//判断是否为安卓客户端APP浏览器
var IsInAndroidAPP = {
    check: function (window) {
        try {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/hjy-android/i) == 'hjy-android') {
                return true;
            } else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    },
};

//检测登录
var UserLogin = {
    Check: function (callback) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checklogin",
            dataType: "json"
        });
        request.done(function (msg) {
            //登录状态 0 未登录； 1 已登录
            if (msg.resultcode == g_const_Success_Code_IN) {
                UserLogin.LoginStatus = g_const_YesOrNo.YES;
                UserLogin.LoginName = msg.resultmessage;
            }
            else {
                UserLogin.LoginStatus = g_const_YesOrNo.NO;
            }
            if (typeof (callback) == "function")
                callback();
        });

        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
        });
    },
	Check123: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checklogin",
            dataType: "json"
        });
        request.done(function (msg) {
            //登录状态 0 未登录； 1 已登录
			
            if (msg.resultcode == g_const_Success_Code_IN) {
                UserLogin.LoginStatus = g_const_YesOrNo.YES;
                UserLogin.LoginName = msg.resultmessage;
            }
            else {
                UserLogin.LoginStatus = g_const_YesOrNo.NO;
            }
			alert("resultcode");
            alert(msg.resultcode);
			
        });

        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoginStatus: 0,
    LoginName: "",
};
//设定当前页面路径
//localStorage[g_const_localStorage.BackURL] = location.href;

//Session失效，重新登录
var UserRELogin = {
    login: function (callbackURL) {
        localStorage[g_const_localStorage.BackURL] = callbackURL;

        //ShowMesaage(g_const_API_Message["100001"]);
        setTimeout("window.location.replace(\"" + g_const_PageURL.Login + "?t=" + Math.random() + "\");", 500);
    },
};
var g_type_api = {
    /*接口地址*/
    api_url: g_APIUTL,
    /*接口名*/
    api_target: "",
    /*输入参数*/
    api_input: {},
    /*是否需要token*/
    api_token: g_const_api_token.Unwanted,
    /*接口响应包*/
    api_response: {},
    /*调用接口*/
    LoadData: function (callback, str_callback) {
        var s_api_input = JSON.stringify(g_type_api.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": g_type_api.api_target };
        if (g_type_api.api_token == g_const_api_token.Wanted)
            obj_data = { "api_input": s_api_input, "api_target": g_type_api.api_target, "api_token": g_const_api_token.Wanted };

        var request = $.ajax({
            url: g_type_api.api_url,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            g_type_api.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                if (typeof (callback) == "function")
                    callback(msg);
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Message.ShowToPage("您还没有登陆或者已经超时.", g_const_PageURL.Login, 2000, str_callback);
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, str_callback);
                    return;
                }
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });

    }
}

/*下拉刷新*/
var ScrollReload = {
    //增加监听（监听滚动的DIV的ID，显示加载中文字DIV的ID，来源Key【用于更新不同来源页面上次刷新的时间】，滚动的距离[不需要判断距离传0]，回调执行的方法）
    Listen: function (ScrollInDivId, ShowMessDivId, FromKey, length_number, callback) {
        var tagId = ScrollInDivId;
        var pressX = 0, pressY = 0;
        var obj = document.getElementById(tagId);//$(tagId);
        obj.addEventListener('touchmove', function (event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                var spanX = touch.pageX - pressX;
                var spanY = touch.pageY - pressY;
                var direct = "none";
                if (Math.abs(spanX) > Math.abs(spanY)) {
                    //水平方向
                    if (spanX > 0) {
                        direct = "right";//向右
                        //do right function
                    } else {
                        direct = "left";//向左
                        //do left function
                    }
                } else {
                    //垂直方向
                    if (spanY > 0 && $(window).scrollTop() == 0) {
                        direct = "down";//向下

                        if (spanY > parseInt(length_number)) {
                            $("#" + ShowMessDivId).show();

                            //获取上次刷新时间
                            var proTime = "";
                            FromKey = "LastReloadTime_" + FromKey;
                            if (localStorage[FromKey] == null) {
                                //localStorage.setItem(g_const_localStorage.OrderConfirm, JSON.stringify({ "GoodsInfoForAdd": [{ "sku_num": 2, "area_code": "", "product_code": "120903", "sku_code": "120903" }] }))
                                proTime = getNowFormatDate();
                                localStorage[FromKey] = proTime;
                            }
                            else {
                                proTime = localStorage[FromKey];
                            }

                            //localStorage[FromKey] = JSON.stringify(objhistorys);

                            //显示层内容
                            var showStr = "<div class=\"d_refresh\">"
                                            + "<div class=\"d_refresh_div\">"
                                                + "<div>下拉可以刷新</div>"
                                                + "<div  class=\"d_cfs9\">上次刷新时间：" + proTime + "</div>"
                                            + "</div>"
                                        + "</div>";
                            $("#" + ShowMessDivId).html(showStr);

                            //更新上次刷新时间
                            localStorage[FromKey] = getNowFormatDate();

                            //执行回调
                            ScrollReload.CallbackDown(callback);
                        }
                        else {
                            $("#" + ShowMessDivId).hide();
                        }

                    } else {
                        direct = "up";//向上
                        //do up function

                        //隐藏下拉层
                        $("#" + ShowMessDivId).hide();
                    }
                }
                // 把元素放在手指所在的位置
                touchMove.value = direct + "(" + spanX + ';' + spanY + ")";
            }
        }, false);
        obj.addEventListener('touchstart', function (event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                // 把元素放在手指所在的位置
                pressX = touch.pageX;
                pressY = touch.pageY;
                touchStart.value = pressX + ';' + pressY;
            }
        }, false);
        obj.addEventListener('touchend', function (event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                //var touch = event.targetTouches[0];
                //// 把元素放在手指所在的位置
                //touchEnd.value=touch.pageX + ';' + touch.pageY;

            }
        }, false);
    },
    //回调下拉方法
    CallbackDown: function (callback) {
        if (typeof (callback) == "function") {
            callback();
        }
    },
};

/*置顶的显示与隐藏*/
var objTop = {
    Start: function (objtop) {
        $(window).on("touchstart", objTop.OnTouchStart);
        $(window).on("touchmove", objTop.OnTouchMove);
        //$(window).on("touchend", objTop.OnTouchEnd);
        objTop.oTop = objtop;
        objTop.oTop.css("display", "none");
        objTop.oTop.on("click", function (e) {
            //$(e.target).css("display", "none");
            objTop.oTop.css("display", "none");
            window.scrollTo(0, 0);
        });
    },
    oTop: {},
    StartY: 0,
    OnTouchStart: function (e) {
        var objthis = e.target;
        objTop.StartY = $(objthis).offset().top;


    },
    OnTouchMove: function (e) {
        var i_body_hegiht = $("body").height();
        var i_scroll_height = $(document).scrollTop();
        var i_window_height = window.screen.availHeight;
        if (i_scroll_height >= i_window_height * 3)
            objTop.oTop.css("display", "block");
        else {
            objTop.oTop.css("display", "none");
        }

    },
    OnTouchEnd: function (e) {
        var i_body_hegiht = $("body").height();
        var i_scroll_height = $(document).scrollTop();
        var i_window_height = window.screen.availHeight;
        if (i_scroll_height >= i_window_height * 3)
            objTop.oTop.css("display", "block");
        else {
            objTop.oTop.css("display", "none");
        }
    },
    End: function () {
        $(window).off("touchstart", objTop.OnTouchStart);
        $(window).off("touchmove", objTop.OnTouchMove);
        //$(window).off("touchend", objTop.OnTouchEnd);
    }
}

//检测登录
var WeiXinLogin = {
    Check: function (callback) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getwxopenid",
            dataType: "json"
        });
        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                WeiXinLogin.WeiXinStatus = g_const_YesOrNo.YES;
                WeiXinLogin.WeiXinName = msg.resultmessage;
            }
            else {
                WeiXinLogin.WeiXinStatus = g_const_YesOrNo.NO;
                if (localStorage[g_const_localStorage.Member]) {
                    WeiXinLogin.WeiXinName = (JSON.parse(localStorage[g_const_localStorage.Member]).Member).uid;
                }
            }
            // if (WeiXinLogin.WeiXinName.length == 0) {
            //var pageurl="";
            //if (localStorage.getItem(g_const_localStorage.BackURL).length > 0) {
            //    pageurl = localStorage.getItem(g_const_localStorage.BackURL);
            //}
            //else {
            //    pageurl = "/";
            //}
            //    location = "/Account/OauthLogin.aspx?oauthtype=WeiXin";
            //    return;
            //}
            if (typeof (callback) == "function")
                callback();
        });

        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    WeiXinStatus: 0,
    WeiXinName: "",
};

/*Base64编码和解码*/
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
var Base64 = {

    /** 
     * base64编码 
     * @param {Object} str 
     */
    base64encode: function (str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },
    /** 
     * base64解码 
     * @param {Object} str 
     */
    base64decode: function (str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c1 == -1);
            if (c1 == -1)
                break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c2 == -1);
            if (c2 == -1)
                break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            }
            while (i < len && c3 == -1);
            if (c3 == -1)
                break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            }
            while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    },
    /** 
     * utf16转utf8 
     * @param {Object} str 
     */
    utf16to8: function (str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            }
            else
                if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
                else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
        }
        return out;
    },
    /** 
     * utf8转utf16 
     * @param {Object} str 
     */
    utf8to16: function (str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx  
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx  
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx10xx xxxx10xx xxxx  
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    },
};

/*微信JSAPI*/
var WX_JSAPI = {
    /*分享标题*/
    title: "",
    /*分享链接*/
    link: "",
    /*分享图标*/
    imgUrl: "",
    /*分享描述*/
    desc: "",
    /*分享类型*/
    type: g_const_wx_share_type.link,
    /*如果type是music或video，则要提供数据链接，默认为空*/
    dataUrl: "",
    /*腾讯对象wx,请先赋值*/
    wx: null,
    IsTest: function () {
        if (GetQueryString("fromtest") == "1")
            return true;
        else
            return false;
    },
    /*JSAPI参数对象*/
    wxparam: {
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: 0, // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    },
    func_CallBack: function () { },
    /*从接口获取参数,参数jsApiList是要调用的接口名,多个逗号分隔*/
    LoadParam: function (jsApiList) {
        WX_JSAPI.jsApiList = jsApiList;
        var obj_data = { action: "wxshare", jsApiList: WX_JSAPI.jsApiList, surl: window.location.href, debug: WX_JSAPI.wxparam.debug };
        var request = $.ajax({
            url: g_INAPIUTL,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == "0") {
                WX_JSAPI.wxparam.appId = msg.appId;
                WX_JSAPI.wxparam.timestamp = msg.timestamp;
                WX_JSAPI.wxparam.nonceStr = msg.nonceStr;
                WX_JSAPI.wxparam.jsApiList = msg.jsApiList;
                WX_JSAPI.jsApiList = msg.jsApiList;
                WX_JSAPI.wxparam.signature = msg.signature;
                if (WX_JSAPI.IsTest()) {
                    $("#showlog").append("微信JSAPI基础配置接口发送的参数：<br>" + JSON.stringify(WX_JSAPI.wxparam) + "<br>");
                }
                WX_JSAPI.CallWeiXin();
            }
            else {
                if (WX_JSAPI.IsTest()) {
                    $("#showlog").append("微信JSAPI基础配置发生错误：<br>" + msg.resultmessage + "<br>");
                }
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage("调用接口出错!")
        });
    },
    LoadCardParam: function (cardid, openid, callback) {

        var obj_data = { action: "wxaddcard", wxcardid: cardid, debug: WX_JSAPI.wxparam.debug };
        var request = $.ajax({
            url: g_INAPIUTL,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == "0") {
                WX_JSAPI.cardList = msg.cardList;
                if (typeof (callback) == "function")
                    callback(msg);
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage("调用接口出错!")
        });
    },
    //卡券包
    cardList: [{}],
    /*调用微信接口,参数wx为腾讯wx对象*/
    CallWeiXin: function () {

        WX_JSAPI.wx.config(WX_JSAPI.wxparam);
        WX_JSAPI.wx.ready(WX_JSAPI.WX_Ready);
        WX_JSAPI.wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            ShowMesaage(JSON.stringify(res));
            //$("#showlog").append(JSON.stringify(res)+"<br>");
        });
    },
    /*jsApiList*/
    jsApiList: g_const_wx_AllShare,
    //微信卡券接口是否已经准备好
    IsCardReady: false,
    /*微信准备好后执行的函数*/
    WX_Ready: function () {
        //$("#showlog").text(JSON.stringify(WX_JSAPI.jsApiList));
        if (typeof (WX_JSAPI.func_CallBack) == "function")
            WX_JSAPI.func_CallBack();
        if (WX_JSAPI.jsApiList[0].toLowerCase().indexOf("share") != -1) {
            WX_JSAPI.WX_ShareReady();
        }
    },
    WX_Card_ID: "pjaSfwzyh75fjPRp1oMWgDnswf5s",
    WX_CardReady: function () {
        //测试环境的p-voTt1p_VGTGdPt0YAoOh6MUiOU 
        WX_JSAPI.LoadCardParam(WX_JSAPI.WX_Card_ID, "", function (msg) {
            if (WX_JSAPI.IsTest()) {
                $("#showlog").append("领取卡券发送的数据：<br>" + JSON.stringify(msg) + "<br>");
            }
            var objcard = {
                cardList: WX_JSAPI.cardList,
                success: function (res) {
                    if (WX_JSAPI.IsTest()) {
                        $("#showlog").append("领取卡券返回的数据：<br>" + JSON.stringify(res.cardList) + "<br>");
                    }
                }

            };
            WX_JSAPI.wx.addCard(objcard);
        });
    },
    WX_ShareReady: function () {
        var objdata = {
            title: WX_JSAPI.desc, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            ///*分享描述*/
            //desc: WX_JSAPI.desc,
            ///*分享类型*/
            //type: WX_JSAPI.type,
            ///*如果type是music或video，则要提供数据链接，默认为空*/
            //dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareTimeline);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareTimeline);
            }
        };

        WX_JSAPI.wx.onMenuShareTimeline(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareAppMessage);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareAppMessage);
            }
        };
        WX_JSAPI.wx.onMenuShareAppMessage(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareQQ);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareQQ);
            }
        };
        WX_JSAPI.wx.onMenuShareQQ(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareWeibo);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareWeibo);
            }
        };
        WX_JSAPI.wx.onMenuShareWeibo(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareQZone);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareQZone);
            }
        };
        WX_JSAPI.wx.onMenuShareQZone(objdata);
    },
    /*操作完成时回调的函数*/
    WX_Success: function (wx_jsapi_type) {
        Merchant1.RecordPageAct("wxshare", wx_jsapi_type);
    },
    /*操作取消时回调的函数*/
    WX_Cancel: function (wx_jsapi_type) {
        //ShowMesaage(wx_jsapi_type+"操作取消");
    }
};
var g_type_loginjs = {
    /*登陆会员信息*/
    Member: {
        Member: {
            /*账号绑定类型*/
            accounttype: g_const_accounttype.ICHSY,
            /*来源*/
            from: "",
            /*手机号*/
            phone: "",
            /*三方绑定唯一编号*/
            uid: ""
        }
    },
    /*登陆成功后要调用的方法数组*/
    calls: [],
    /*登陆成功后要转向的地址*/
    returnurl: "",
    /*登陆会员绑定信息到前台缓存*/
    SetMemberInfo: function () {
        try {
            localStorage[g_const_localStorage.Member] = JSON.stringify(g_type_loginjs.Member);
            return true;
        }
        catch (e) {
            //alert('本地缓存已满')
            localStorage.clear();
            g_type_cart.Upload(g_type_loginjs.AfterCartUpload);
            return false;
        }
    },
    /*执行*/
    Execute: function (str_loginjs) {
        if (str_loginjs != '') {
            $("body").css("display", "none");
            var loginjs;
            eval('loginjs=' + str_loginjs);
            g_type_loginjs.returnurl = loginjs.returnurl;
            g_type_loginjs.Member.Member = loginjs.Member;
            for (var k in loginjs.calls) {
                var call = loginjs.calls[k];
                eval(call);
            }
            g_type_loginjs.AfterCartUpload();
        }
    },
    /*同步购物车完成执行的操作*/
    AfterCartUpload: function (msg) {
        if (g_type_loginjs.SetMemberInfo()) {
            if (g_type_loginjs.returnurl != "") {
                var rurl = g_type_loginjs.returnurl;
                var r = rurl.split("^");
                var shortkey = r[0];
                if (typeof (ShortURL) != "undefined") {
                    for (var k in ShortURL) {
                        var shorturl = ShortURL[k];
                        if (shortkey.Trim() == shorturl.key.Trim()) {
                            rurl = shorturl.value;
                            break;
                        }
                    }
                }
                window.location.replace(rurl);
            }
        }
    }
};
//内部接口调用
var g_type_self_api = {
    /*接口地址*/
    api_url: g_INAPIUTL,
    /*接口响应包*/
    api_response: {},
    //是否异步
    api_async: true,
    /*调用接口*/
    LoadData: function (obj_data, callback, str_callback) {

        var request = $.ajax({
            url: g_type_self_api.api_url,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType,
            async: g_type_self_api.api_async
        });

        request.done(function (msg) {
            g_type_self_api.api_response = msg;
            if (msg.resultcode.toString() == g_const_Success_Code_IN.toString()) {
                if (typeof (callback) == "function")
                    callback(msg);
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, str_callback);
                    return;
                }
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
}
