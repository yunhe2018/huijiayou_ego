var old_nickname = '';
$(document).ready(function () {
    MemberInfo.GetSensitiveWord();
    $("#txtNickName").focus();
    $("#btnBack").click(function () {
        g_const_PageURL.GoTo(g_const_PageURL.MyAccountInfo);
    });

    $("#txtNickName").on("input propertychange", function () {
        if ($("#txtNickName").val() != "") {
            $("#d_close_name").show();
        }
        else {
            $("#d_close_name").hide();
        }
    });

    $('#txtNickName').click(function () {
        if ($("#txtNickName").val() != "") {
            $("#d_close_name").show();
        }
        else {
            $("#d_close_name").hide();
        }
    });
    //点击清除
    $("#d_close_name").click(function () {
        $("#txtNickName").val("");
        $("#d_close_name").hide();
    });


    $('#btnSave').click(function () {
        var nickName = $("#txtNickName").val();
        var isok = true;
        if (old_nickname == nickName) {
            ShowMesaage(g_const_API_Message["106006"]);
            isok = false;
            return;
        }
        //if (nickName.length < 2 || nickName.length > 7) {
        //    ShowMesaage(g_const_API_Message["106005"]);
        //    return;
        //}
        //for (var i = 0; i < nickName.length; i++) {
        //    if (!(isInteger(nickName.substr(i, 1))
        //    || isEnglishStr(nickName.substr(i, 1))
        //    || isEnglishStr(nickName.substr(i, 1))
        //    || isChinese(nickName.substr(i, 1))
        //    || nickName.toString().indexOf("-") > -1
        //    || nickName.toString().indexOf("_") > -1)) {
        //        ShowMesaage(g_const_API_Message["106005"]);
        //        return;
        //    }
        //}

        if (!checknamelength(nickName)) {
            ShowMesaage(g_const_API_Message["106005"]);
            isok = false;
            return;

        }
        //关键字检验
        $.each(sensitive_words, function (index, n) {
            if (nickName.indexOf(n.sensitive_word) > -1) {
                ShowMesaage(g_const_API_Message["106008"] + n.sensitive_word);
                isok = false;
                return;
            }

        });

        if (isok) {
            MemberInfo.NickName = nickName;
            MemberInfo.SaveNickName();
        }
    });
    MemberInfo.GetList();
});

function checknamelength(v) {
    var rx = /[A-Za-z\d-_]/i, rxcn = /[\u4e00-\u9fa5]/, num = 0, chr;
    for (var i = 0, j = v.length; i < j; i++) {
        chr = v.charAt(i);/////////
        if (rx.test(chr)) num += 1;
        else if (rxcn.test(chr)) num += 1;// num += 2;
        else return false;
    }
    if (num <2 || num > 10) return false;
    return true;
}

var sensitive_words = [];
var MemberInfo = {
    SaveNickNameMsg:"",
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
            if (msg.ResultCode) {
                PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            } else {
                if (msg.NickName && msg.NickName.length > 0) {
                    old_nickname = msg.NickName;
                    $("#txtNickName").val(old_nickname);

                    if ($("#txtNickName").val() != "") {
                        $("#d_close_name").show();
                    }
                    else {
                        $("#d_close_name").hide();
                    }

                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    NickName: "",
    SaveNickName: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=savenickname&nickname=" + MemberInfo.NickName,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
                if (msg.resultCode == "99") {
                    PageUrlConfig.SetUrl();
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
                else if (msg.resultCode == "1")
                {
                    MemberInfo.SaveNickNameMsg = msg;
                    //修改昵称完毕，领取优惠券
                    MemberInfo.GetCounpon(msg);
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*获取敏感词【每24小时更新一次】*/
    GetSensitiveWord: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=Getsensitive_word",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode == "1") {
                sensitive_words = msg.resultmessage;
            }
            else {
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*领取优惠券*/
    GetCounpon: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checkact_coupon_config",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            //无论成功还是失败，都继续进行
            var jg = ""; msg.resultMessage;
            if (msg.resultcode == "1") {
                jg = "已成功获得优惠券,系统正在努力发放中，请稍后查收"
            }
            else {
                jg = "";
            }
            jg = MemberInfo.SaveNickNameMsg.resultMessage + jg;

            ShowMesaageCallback(MemberInfo.SaveNickNameMsg.resultMessage, function () {
                g_const_PageURL.GoTo(g_const_PageURL.MyAccountInfo);
            }, 2000)
        });
        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
            ShowMesaageCallback(MemberInfo.SaveNickNameMsg.resultMessage, function () {
                g_const_PageURL.GoTo(g_const_PageURL.MyAccountInfo);
            }, 2000)
        });
    },
}