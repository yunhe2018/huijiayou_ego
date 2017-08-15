$(document).ready(function () {

    if (document.referrer = "" || document.referrer.indexOf("login") > 0) {
        $("#gobackurl").val("");
    }
    else {
        $("#gobackurl").val(Base64.base64encode(document.referrer));
    }


    //微信登录
    $("#weixin_login").click(function () {
        //window.location.href = "/Account/OauthLogin.aspx?oauthtype=WeiXin&gobackurlaa=" + $("#gobackurl").val();
        window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&gobackurlaa=" + $("#gobackurl").val() + "&t=" + Math.random());

    });
    //密码登录
    $("#btnToLogin").click(function () {
        if ($("#txtLogin").val().length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile($("#txtLogin").val())) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        if ($("#txtPass").val().length == 0) {
            ShowMesaage(g_const_API_Message["7903"]);
            return;
        }
        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
            ShowMesaage(g_const_API_Message["7904"]);
            return;
        }
        UserLogin.Main()
    });
    //手机登录
    $("#btnPhoneLogin").click(function () {
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if ($("#txtValidCode").val().length == 0) {
            ShowMesaage(g_const_API_Message["7802"]);
            return;
        }
        UserLogin.PhoneLogin()
    });
    //获取验证码
    $("#btnCode").click(function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "loginvalidcode";
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCode(action, phoneNo);
    });
    //注册
    $("#btnReg").click(function () {
        //location.href = g_const_PageURL.Reg;
        window.location.href = g_const_PageURL.Reg + "?t=" + Math.random();

    });
    //手机注册
    $("#btnPhoneReg").click(function () {
        //location.href = g_const_PageURL.PhoneLogin + "?gobackurlaa=" + $("#gobackurl").val();
        window.location.href = g_const_PageURL.PhoneLogin + "?gobackurlaa=" + $("#gobackurl").val() + "&t=" + Math.random();

    });

    //忘记密码
    $("#btnForget").click(function () {
        //location.href = g_const_PageURL.ResetPassword;
        window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random();

    });

    //密码是否可见
    $("#d_emp").click(function () {
        if ($("#txtPass").attr("type") == "password") {
            //密码可见
            $("#txtPass").attr("type", "text");
            $("#d_emp").removeClass("d_emp");
        }
        else {
            //密码隐藏
            $("#txtPass").attr("type", "password");
            $("#d_emp").attr("class", "d_emp");
        }
    });
    //输入显示清除内容
    $("#txtLogin").keyup(function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtLogin").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    $("#txtLogin").click(function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtLogin").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    //点击清除
    $("#d_close").click(function () {
        $("#txtLogin").val("");
        $("#d_close").hide();
    });


    //输入显示清除内容
    $("#txtPass").keyup(function () {
        if ($("#txtPass").val() != "") {
            $("#d_close_psw").show();
        }
        else {
            $("#d_close_psw").hide();
        }

    });

    $("#txtPass").click(function () {
        if ($("#txtPass").val() != "") {
            $("#d_close_psw").show();
        }
        else {
            $("#d_close_psw").hide();
        }
    });


    //点击清除
    $("#d_close_psw").click(function () {
        $("#txtPass").val("");
        $("#d_close_psw").hide();
    });



    //取消操作
    $(".btns a").on("click", function (e) {
        var objthis = e.target;
        switch ($(objthis).attr("operate")) {
            case "yes":
                //返回提交前的页面
                if (localStorage.getItem(g_const_localStorage.BackURL).length > 0) {
                    pageurl = localStorage.getItem(g_const_localStorage.BackURL);
                }
                else {
                    pageurl = "/";
                }
                //location = pageurl;
                window.location.replace(pageurl);

                break;

        }

    });

    $("#txtLogin").focus();

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
                if (msg.resultcode == g_const_Success_Code) {
                    //if (IsInWeiXin.check()) {
                    //    WeiXinLogin.Check(UserLogin.Load_Result);
                    //}
                    //else {
                    UserLogin.Load_Result(JSON.parse(msg.resultmessage));
                    //WeiXinLogin.Check(UserLogin.Load_Result);
                    //}
                    //if (msg.resultmessage.length > 0) {
                    //    localStorage[g_const_localStorage.Member] = msg.resultmessage;
                    //}
                }
                else {
                    ShowMesaage(g_const_API_Message[msg.resultcode]);
                    // ShowMesaage(msg.resultmessage);
                    //alert(msg.resultmessage);
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
        msg.returnurl = PageUrlConfig.BackTo();
        var str_loginjs = JSON.stringify(msg);
        g_type_loginjs.Execute(str_loginjs);
    },
    Load_Result_Phone: function () {
        $("#mask").css("display", "block");
        $(".fbox.ftel").css("display", "");
    },
};
var Message = {
    ShowToPage: function (message, pageurl, time, str_callback) {
        ShowMesaage(message);
        setTimeout("window.location.replace( \"" + pageurl + "\");", time);

    }
};