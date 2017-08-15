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

/*三方来源自动登录*/
var GroupPhone = {
    /*是否需要跳转*/
    canlocationhref: true,
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
    Init: function (canlocationhref) {
        GroupPhone.canlocationhref = canlocationhref;
        GroupPhone.from = "";
        GroupPhone.mobile ="";
        GroupPhone.t = "";
        GroupPhone.mac = "";
        GroupPhone.Main();
    },
    /*获取参数+验签+登录*/
    Main: function () {
        //获取目的url
        GroupPhone.to = GetQueryString("to");
        GroupPhone.from = GetQueryString("hxfrom");

		
        //获取来源
        if( GroupPhone.from == "web"){
			alert("web");
            //web
            GroupPhone.from = "web";
            GroupPhone.mobile = GetQueryString("p");
            GroupPhone.t = GetQueryString("tt");
            GroupPhone.mac = GetQueryString("mac");

            GroupPhone.AutoLogin();

        }
        else if (CheckMachine.versions.android && !CheckMachine.versions.inWeiXin) {
			alert("android");
            GroupPhone.from = "android";
            //安卓
            try {
                //window.share.getDataToJs(0)是安卓提供的获取手机号的方法						
                var androidInfo = window.share.getDataToJs(0);
                var info = eval('(' + androidInfo + ')');
                //本地保存
                GroupPhone.mobile = info.mobilephone;
            }
            catch (e) {
                //GroupPhone.from = "web";
                //GroupPhone.AutoLogin();
				alert(e);
            }
            if (GroupPhone.mobile != "") {
                GroupPhone.AutoLogin();
            }

        }
        else if ((CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad) && !CheckMachine.versions.inWeiXin) {
           alert("ios");
		   GroupPhone.from = "ios";
            //IOS
            try {
                //OCModel.getDataToJs(0)是IOS提供的获取手机号的方法				
                var iosInfo = OCModel.getDataToJs(0);
                //本地保存
                GroupPhone.mobile = iosInfo.mobilephone;
            }
            catch (e) {
                //GroupPhone.from = "web";
                //GroupPhone.AutoLogin();
            }
            if (GroupPhone.mobile != "") {
                GroupPhone.AutoLogin();
            }
        }

    },
    /*自动登录*/
    AutoLogin: function () {
        var purl = g_INAPIUTL;//"/Ajax/API.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phoneloginauto&type=" + GroupPhone.from+ "&phoneno=" + GroupPhone.mobile + "&tt=" + GroupPhone.t + "&mac=" + GroupPhone.mac,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
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
            try{
                //关闭窗口
                UseAppFangFa.CaoZuo('close');
            }
            catch(e){
            
            }
        });
        //g_APIUTL_User
    },
    /*跳转*/
    GoTo: function () {
        var tourl = GroupPhone.to;
         
        if (tourl == "") {

            tourl = g_const_PageURL.Index + "?frd=yes";
        }
        else {
            if (tourl.indexOf("?") > -1) {
                tourl += "&frd=yes&ttt=" + Math.random();
            }
            else {
                tourl += "?frd=yes&ttt=" + Math.random();
            }
        }

        if (GroupPhone.canlocationhref) {
            window.location.replace(tourl);
        }
    },
};

/*APP登录后，调用的通知方法*/
function appBackInfoToFun(info) {
    //获取来源
    if (info == "-1") {
        //关闭窗口
        UseAppFangFa.CaoZuo('close');
    }
    else {
        try {
            if (CheckMachine.versions.android && !CheckMachine.versions.inWeiXin) {

                //正常登陆
                GroupPhone.from = "android";
                GroupPhone.mobile = info.mobilephone;


            }
            else if ((CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad) && !CheckMachine.versions.inWeiXin) {

                GroupPhone.from = "ios";
                GroupPhone.mobile = info.mobilephone;
            }
            //自动登录
            GroupPhone.AutoLogin();
        }
        catch (e) {
            //关闭窗口
            UseAppFangFa.CaoZuo('close');

        }
    }

    

}

