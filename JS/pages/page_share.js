/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../shareGoodsDetail.js" />

$(document).on("ready", function () {
    page_Share.Init();
});
var page_Share = {
    Init: function () {
        $(".btn-close").on("click", function () {
            $(".top").css("display", "none");
            $("#ifr").css("top", "0px");
        });
        var strsrc = decodeURIComponent(GetQueryString("wxLink"));
        if (strsrc == "") {
            strsrc = "about:blank";
        }
        else {
            if (strsrc.indexOf("fromshare") == -1) {
                if (strsrc.indexOf("?") == -1)
                    strsrc += "?fromshare=" + g_const_YesOrNo.YES.toString();
                else
                    strsrc += "&fromshare=" + g_const_YesOrNo.YES.toString();
            }
        }
            
        var strTitle = decodeURIComponent(GetQueryString("wxTilte"));
        if (strTitle == "") {
            strTitle = "惠家有购物商城";
        }
        var wxPhone = decodeURIComponent(GetQueryString("wxPhone"));
        var strPhone = wxPhone;
        if (wxPhone != "") {
            try{
                strPhone = Base64.base64decode(wxPhone);
                if (strPhone.length == 11) {
                    strPhone = strPhone.substr(0, 3) + "****" + strPhone.substr(7, 4);
                }               
            }
            catch (e) {
                console.log("手机号解密失败。" + e);
                strPhone = "";
            }
        }
        //分享描述
        var wx_sc = decodeURIComponent(GetQueryString("wx_sc"));
        //分享图形
        var wx_si = decodeURIComponent(GetQueryString("wx_si"));

        $("#sharephone").text(strPhone);
        $("#ifr").attr("src", strsrc);
        $("title").text(strTitle);

        page_Share.SetWXShare(strTitle, wx_sc, wx_si)

        $(".rspan a").on("click", function () {            
            window.location = g_const_PageURL.Lqfxtq_Op + "?t=" + Math.random() + "&sharephone=" + GetQueryString("wxPhone");
        });
        $(".lspan a").on("click", function () {
            openApp();
        });
    },
    //设定微信分享按钮
    SetWXShare: function (
        //分享标题
        wxTilte,
        //分享描述
        wx_sc,
        //分享图形
        wx_si       
        ) {
        if (IsInWeiXin.check()) {
            try{
                WX_JSAPI.wx = wx;
                WX_JSAPI.wxparam.debug = false;
                WX_JSAPI.dataUrl = "";
                WX_JSAPI.desc = wx_sc.trim()==""?wxTilte:wx_sc;
                WX_JSAPI.imgUrl = wx_si.trim() == "" ? g_goods_Pic : wx_si;
                WX_JSAPI.link = page_Share.GetShareLink();
                WX_JSAPI.title = wxTilte;
                WX_JSAPI.type = g_const_wx_share_type.link;
                WX_JSAPI.LoadParam(g_const_wx_AllShare);
            }
            catch (e) {
                //alert(e);
                console.log(e);
            }
           
        }
    },
    //获取分享链接
    GetShareLink: function () {
        var shareurl = "http://" + window.location.host + "/share.html";
        var shareparams = "wxLink=" + GetQueryString("wxLink");
        shareparams += "&wxTilte=" + GetQueryString("wxTilte");
        shareparams += "&wxPhone=" + GetQueryString("wxPhone");
        shareparams += "&wx_sc=" + GetQueryString("wx_sc");
        shareparams += "&wx_si=" + GetQueryString("wx_si");
        return shareurl + "?" + shareparams;
    },
};