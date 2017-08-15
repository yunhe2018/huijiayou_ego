var login = "";
$(document).ready(function () {
    UserLogin.Check(Account.LoadInfo);

    if (IsDebug) {
        //清空本地缓存
        $(".copyright").on("click", function (e) {
            localStorage.clear();
            UserInfo.UploadCart();
            // alert("清空localStorage成功");
        });
    }
    $("#btnloginout").click(function () {
        if (localStorage.getItem(g_const_localStorage.IsnewReg) == 1) {
            Message.ShowConfirm("确定不修改密码直接退出吗？", "设置密码后可以直接提现哦", "divAlert", "确定", "UserInfo.UploadCart", "设置密码", "Account.SetPassword");
        }
        else {
            Message.ShowConfirm("确定要退出登录吗？", "", "divAlert", "确定", "UserInfo.UploadCart", "取消");
        }

    });
});
var Account = {
    LoadInfo: function () {
        var body = "";
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            $("#headPic").attr("src", g_member_Pic);
            $("#userName").html("登录/注册");
            $("#userName,.personPic").on("click", function () {
                PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            });
        }
        else {
            MemberInfo.GetList();
        }
        Message.Operate('', "divAlert");
    },
    SetPassword: function () {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random();
    }
};
var MemberInfo = {
    api_target: "com_cmall_familyhas_api_ApiMemberInfoCf",
    api_input: {},
    api_response: {},
    GetList: function () {
        var s_api_input = JSON.stringify(MemberInfo.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MemberInfo.api_target, "api_token": g_const_api_token.Wanted };
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
                MemberInfo.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (result) {
        if (result.nickName.length > 0) {
            $("#userName").html("Hi," + result.nickName);
        }
        else {
            $("#userName").html("Hi," + r(UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)));
        }
        if (result.headPhoto.length > 0) {
            $("#headPic").attr("src", result.headPhoto);
        }
        else {
            $("#headPic").attr("src", g_member_Pic);
        }
        $("#loginOut").show().on("click", function () {
            UserInfo.Logout();
        });
    },
}

var IchsyInfo = {
    api_target: "com_cmall_groupcenter_account_api_ApiAccountByMobile",
    api_input: { "mobile": "" },
    GetMoney: function () {
        IchsyInfo.api_input.mobile = UserLogin.LoginName;
        var s_api_input = JSON.stringify(IchsyInfo.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": IchsyInfo.api_target, "api_token": 1 };
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
                IchsyInfo.Load_List(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_List: function (msg) {
        $("#divIchsyMoney").html("<em>￥" + msg.withdrawMoney + "</em>");
    },

};


var UserInfo = {
    UploadCart: function () {
        //退出登录中
        $("#atcHead").attr("class", "portrait-hd");
        body = "<p class=\"user-index-login\">退出登录中，请稍候</p>";
        $("#divUser").html(body);
        $("#btnloginout").hide();

        Message.ShowLoading("退出登录中，请稍候", "divAlert");
    },
    Logout: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=userlogout",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code) {
                UserInfo.Load_List(msg);
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_List: function (msg) {
        UserLogin.LoginStatus = g_const_YesOrNo.NO;
        g_const_localStorage.Member = null;
        var OrderFrom = '';
        var OrderFromParam = '';
        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                OrderFrom = localStorage[g_const_localStorage.OrderFrom];
            }
        }
        if (localStorage[g_const_localStorage.OrderFromParam] != null) {
            if (localStorage[g_const_localStorage.OrderFromParam] != "") {
                OrderFromParam = localStorage[g_const_localStorage.OrderFromParam];
            }
        }
        localStorage.clear();
        if (OrderFrom != '') {
            localStorage[g_const_localStorage.OrderFrom] = OrderFrom;
        }
        if (OrderFromParam != '') {
            localStorage[g_const_localStorage.OrderFromParam] = OrderFromParam;
        }
        location.reload();
    },

};