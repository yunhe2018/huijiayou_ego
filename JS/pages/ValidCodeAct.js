//获取验证码
var Send_ValidCode = {
    MerchantID: "",
    sendingtime: 0,
    SendCodeImgEx: function (codeaction, phoneno, piccode, smstype) {
        var purl = g_INAPIUTL;
        
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=" + codeaction + "&mobileno=" + phoneno + "&piccode=" + piccode + "&smstype=" + smstype,
            dataType: "json"
        });

        request.done(function (msg) {

            if (msg.resultcode == g_const_Success_Code_IN) {
                Send_ValidCode.stime(g_const_ValidCodeTime);
                ShowMesaage(g_const_API_Message["7801"]);
            }
            else {
                ToggleCode("Verify_codeImag", '/Ajax/LoginHandler.ashx');
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    stime: function (count) {
        Send_ValidCode.sendingtime = count;
        if (count == 0) {
            $('#btnCode').attr("class", "quan-vali-btn");
            $('#btnCode').html('<i>获取验证码</i>');
            return false;
        } else {
            $('#btnCode').attr("class", "quan-vali-btn act");
            $('#btnCode').html('<i>重新发送(' + count + ')</i>');
            count--;
        }
        setTimeout(function () { Send_ValidCode.stime(count); }, 1000)
    },
};

//=============================切换验证码======================================
function ToggleCode(obj, codeurl) {
    //$("#txtCode").val("");
    $("#" + obj).attr("src", codeurl + "?action=code&time=" + Math.random());
}