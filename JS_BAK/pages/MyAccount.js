$(document).ready(function () {
    $("#li_AddressList").on("tap", function () {
        //保存下一页用于返回的url
        PageUrlConfig.SetUrl();
        localStorage["fromOrderConfirm"] = "0";
        window.location.replace(g_const_PageURL.AddressList+ "?t=" + Math.random());
    });

    $("#li_ResetPassword").on("tap", function () {
        //保存下一页用于返回的url
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random();

    });

    $("#li_NickName").on("tap", function () {
        //保存下一页用于返回的url
        PageUrlConfig.SetUrl();
        window.location.replace(g_const_PageURL.MyNickName + "?t=" + Math.random());
    });

    $("#go-back").on("tap", function () {
        window.location.replace(g_const_PageURL.AccountIndex + "?t=" + Math.random());

    });
    MemberInfo.GetList();
});

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
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    UserRELogin.login(g_const_PageURL.MyAccount)
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

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
        $("#img_headpic").attr("src", g_GetMemberPictrue(result.headPhoto));
        if (result.nickName!="") {
            $("#span_nickname").html(result.nickName);
        }
        else {
            $("#span_nickname").html(g_const_API_Message["106007"]);
        }
    },
}