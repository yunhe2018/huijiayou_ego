var verifyFlag = g_const_SMSPic_Flag;
var smstype = 2
$(document).ready(function () {
    if (verifyFlag == 1) {
        $("#li_Verify").show();
        $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");

    }
    else {
        $("#li_Verify").hide();
        $("#Verify_codeImag").attr("src", "");
    }
    if (GetQueryString("gobackurl") != "") {
        $("#gobackurl").val(GetQueryString("gobackurl"));
    }
    $("#btnToLogin").unbind();
    $("#txtPhoneNo,#txtValidCode,#txtPicCode").on("input paste", function () {
        if ($("#txtPhoneNo").val().length > 0 || $("#txtValidCode").val().length > 0 || $("#txtPicCode").val().length > 0) {
            $("#btnToLogin").css({ "background": "#f6123d" });
            $("#btnToLogin").on("click", function () {
                if ($("#txtPhoneNo").val().length == 0) {
                    ShowMesaage(g_const_API_Message["100023"]);
                    return;
                }
                if (!isMobile($("#txtPhoneNo").val())) {
                    ShowMesaage(g_const_API_Message["7902"]);
                    return;
                }
                if ($("#txtValidCode").val().length == 0) {
                    ShowMesaage(g_const_API_Message["7802"]);
                    return;
                }
                UserLogin.PhoneLogin();
            });
        }
        else {
            $("#btnToLogin").css({ "background": "#cccccc" })
            $("#btnToLogin").unbind();
        }
    });

    //微信登录
    $("#weixin_login").click(function () {
        window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&gobackurlaa=" + $("#gobackurl").val());
    });
    $("#btnCode").on("click", function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "loginvalidcode";
        var piccode = $("#txtPicCode").val();
        if (verifyFlag == 1) {
            if (piccode.length == 0) {
                ShowMesaage(g_const_API_Message["8904"]);
                return;
            }
        }
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCodeImgEx(action, phoneNo, piccode, smstype);
    });

    //返回
    $(".back").on("click", function () {
        //history.back();
        window.location.replace(g_const_PageURL.Login + "?t=" + Math.random());
    });
    //协议
    $("#span_xy").on("click", function () {
        window.location.replace(g_const_PageURL.xieyi + "?t=" + Math.random());
    });


    //输入显示清除内容
    $("#txtPhoneNo").on("click", function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtPhoneNo").val() != "") {
            $("#d_close_tel").show();
        }
        else {
            $("#d_close_tel").hide();
        }
    });

    $("#txtPhoneNo").on("click", function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtPhoneNo").val() != "") {
            $("#d_close_tel").show();
        }
        else {
            $("#d_close_tel").hide();
        }
    });

    //点击清除
    $("#d_close_tel").on("click", function () {
        $("#txtPhoneNo").val("");
        $("#d_close_tel").hide();
    });


    //输入显示清除内容
    $("#txtValidCode").keyup(function () {
        if ($("#txtValidCode").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    $("#txtValidCode").on("click", function () {
        if ($("#txtValidCode").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    //点击清除
    $("#d_close").on("click", function () {
        $("#txtValidCode").val("");
        $("#d_close").hide();
    });

    $("#txtPhoneNo").focus();
});
//编辑地址信息
var UserLogin = {
    Main: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=userlogin&username=" + String.Replace($("#txtLogin").val()) + "&password=" + String.Replace($("#txtPass").val()),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (IsInWeiXin.check()) {
                    WeiXinLogin.Check(UserLogin.Load_Result);
                }
                else {
                    // UserLogin.Load_Result();
                    WeiXinLogin.Check(UserLogin.Load_Result);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    PhoneLogin: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phonelogin&phoneno=" + $("#txtPhoneNo").val() + "&validcode=" + $("#txtValidCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    //if (IsInWeiXin.check()) {
                    //    WeiXinLogin.Check(UserLogin.Load_Result);
                    //}
                    //else {
                    //    // UserLogin.Load_Result();
                    //    WeiXinLogin.Check(UserLogin.Load_Result);
                    //}
                    //if (msg.resultmessage.length > 0) {
                    //    localStorage[g_const_localStorage.Member] = msg.resultmessage;
                    //}
                    UserLogin.Load_Result(JSON.parse(msg.resultmessage));
                }
                else {
                    ShowMesaage(msg.resultmessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (msg) {
        // ShowMesaage(g_const_API_Message["100025"]);
        // Message.ShowAlert(g_const_API_Message[100025], g_const_API_Message[100040], "divAlert", "我知道啦", "UserLogin.Load_Page");
        msg.returnurl = PageUrlConfig.BackTo();
        var str_loginjs = JSON.stringify(msg);
        g_type_loginjs.Execute(str_loginjs);
    },
    Load_Page: function () {
        var pageurl = PageUrlConfig.BackTo();
        Message.ShowToPage(g_const_API_Message["100025"], pageurl, 2000, "");
    },
};
