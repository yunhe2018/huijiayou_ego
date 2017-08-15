$(document).ready(function () {
    
    GroupPhone.Main();

});


function up_urlparam(sKey) {
    var sReturn = "";
    var sUrl = window.location.href;

    var sParams = (sUrl.indexOf("?") != -1) ? sUrl.split('?')[1].split('&') : '';
    for (var i = 0, j = sParams.length; i < j; i++) {

        var sKv = sParams[i].split("=");
        if (sKv[0] == sKey) {
            sReturn = sKv[1];
            break;
        }
    }

    return sReturn;
}

/*登录*/
var GroupPhone = {
    /*来源*/
    from: "",
    /*目的*/
    to: "",
    /*手机号*/
    mobile: "",
    /*请求时间*/
    t: "",
    /*验签串*/
    mac: "",
    /*获取url传参*/
    up_urlparam:function(sKey) {
        var sReturn = "";
        var sUrl = window.location.href;

        var sParams = (sUrl.indexOf("?") != -1) ? sUrl.split('?')[1].split('&') : '';
        for (var i = 0, j = sParams.length; i < j; i++) {

            var sKv = sParams[i].split("=");
            if (sKv[0] == sKey) {
                //sReturn = sKv[1];
                sReturn = unescape(sKv[1]);
                break;
            }
        }

        return sReturn;
    },
    /*关闭窗口[只适用于web请求]*/
    CloseWin:function() {
        window.opener = null;
        window.open('', '_self');
        window.close();
    },

    /*获取参数+验签+登录*/
    Main: function () {
        //获取目的url
        GroupPhone.to = GetQueryString("to");

        //获取来源
        

        if (CheckMachine.versions.android) {
            GroupPhone.from = "android";
            //安卓
            //window.share.getDataToJs(0)是安卓提供的获取手机号的方法						
            var androidInfo = window.share.getDataToJs(0);
            var info = eval('(' + androidInfo + ')');
            //本地保存
            GroupPhone.mobile = info.mobilephone;
            if (GroupPhone.mobile != "") {
                GroupPhone.AutoLogin();
            }

        }
        else if (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad) {
            GroupPhone.from = "ios";
            //IOS
            //OCModel.getDataToJs(0)是IOS提供的获取手机号的方法				
            var iosInfo = OCModel.getDataToJs(0);
			alert(iosInfo.mobilephone);
            //本地保存
            GroupPhone.mobile = iosInfo.mobilephone;
            if (GroupPhone.mobile != "") {
                GroupPhone.AutoLogin();
            }
        }
        else {
            //web
            GroupPhone.from = "web";
            GroupPhone.mobile = GetQueryString("p");
            GroupPhone.t = GetQueryString("tt");
            GroupPhone.mac = GetQueryString("mac");

            GroupPhone.AutoLogin();
        }

        
    },
    /*自动登录*/
    AutoLogin: function () {
		//alert(g_INAPIUTL);
		//alert(GroupPhone.from);
		//alert(GroupPhone.mobile);
		//alert(GroupPhone.t);
		//alert(GroupPhone.mac);
		
        var purl = g_INAPIUTL;//"/Ajax/API.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phoneloginauto&type=" + GroupPhone.from+ "&phoneno=" + GroupPhone.mobile + "&tt=" + GroupPhone.t + "&mac=" + GroupPhone.mac,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
			alert(msg.resultmessage);
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    //UserLogin.Load_Result(JSON.parse(msg.resultmessage));
                    GroupPhone.GoTo();
                }
                else {
                    //不能自动登录（验签失败或来源页没有登录）
                    //ShowMesaage(msg.resultmessage);
                    //ShowMesaageCallback(msg.resultmessage, GroupPhone.CloseWin(), 5000);
                    GroupPhone.GoTo();
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
        //g_APIUTL_User
    },
    /*跳转*/
    GoTo: function () {
        var tourl = GroupPhone.to;
		//注意：frd=yes表示ios不拦截跳转，必须有
        if (tourl == "") {
            tourl = g_const_PageURL.Index+"?frd=yes";
        }
        else {
            if (tourl.indexOf("?") > -1) {
                tourl += "&frd=yes&ttt=" + Math.random();
            }
            else {
                tourl += "?frd=yes&ttt=" + Math.random();
            }
        }
		
		UserLogin.Check123();
        
		//tourl="ACCOUNT/MyOrders.html"
		alert(tourl);
		window.location.replace(tourl);
		//window.location.href=tourl;
    },
};

/*APP登录后，调用的通知方法*/
function appBackInfoToFun(info) {
    //获取来源
    

    if (CheckMachine.versions.android)
    {
        GroupPhone.from = "android";
        GroupPhone.mobile = info.mobilephone;
    }
    else if (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad)
    {
        GroupPhone.from = "ios";
        GroupPhone.mobile = info.mobilephone;
    }
    
    if (GroupPhone.mobile!="") {
        //自动登录
        GroupPhone.AutoLogin();
    }

}
