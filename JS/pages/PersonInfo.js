$(document).ready(function () {
    UserLogin.Check(Account.LoadInfo);
});
var Account = {
    LoadInfo: function () {
        var body = "";
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
        }
        else {
            MemberInfo.GetList();
        }
        Message.Operate('', "divAlert");
    },
};
var MemberInfo = {
    api_target: "com_cmall_familyhas_api_ApiMemberInfoCf",
    api_input: {},
    api_response: {},
    GetPhone: function () {
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
                if (msg.headPhoto.length > 0) {
                    $("#headPic").attr("src", (msg.headPhoto));
                }
                else {
                    $("#headPic").attr("src", g_member_Pic);
                }
            }
            else {
                $("#headPic").attr("src", g_member_Pic);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            $("#headPic").attr("src", g_member_Pic);
        });
    },
    GetList: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getmemberinfo",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            console.log(msg);
            if (msg.resultCode) {
                PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            } else {
                MemberInfo.Load_Result(msg);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (result) {
        console.log(result);
        if (result.HeadPic && result.HeadPic.length > 0) {
            $("#headPic").attr("src", result.HeadPic);
        }
        else {
            //$("#headPic").attr("src", g_member_Pic);
            MemberInfo.GetPhone();
        }
        $("#userName").html((UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)));
        if (result.NickName && result.NickName.length > 0) {
            $("#nickName").html(result.NickName).css({ color: "#333" });
        }
        else {
            $("#nickName").html("去设置昵称");
        }
    },
}