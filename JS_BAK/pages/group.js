var PageTitle = "";
$(document).ready(function () {
    if (GetQueryString("from") == g_const_Merchant_Group_Android || GetQueryString("from") == g_const_Merchant_Group_Ios) {
        if ($("#d_go_top")) {
            PageTitle = $("#d_go_top").attr("title");
            $("#d_go_top").hide();
        }
        if (GetQueryString("Title") == "") {
            $("#d_go_top").show();
        }
        if (GetQueryString("from") == g_const_Merchant_Group_Android) {
            window.notify.notifyOnAndroid("{\"type\":\"show_title\",\"obj\":{\"title\":\"" + PageTitle + "\"}}");
        }
        if (GetQueryString("from") == g_const_Merchant_Group_Ios) {
            //   window.location.href = "/group.html?hidePagehead&" + PageTitle;
        }
    }
});
    function LoadProductDetail(pid) {
        $.ajax({
                type: "POST",//用POST方式传输
                dataType: "json",//数据格式:JSON
                url: '/Ajax/API.aspx',//目标地址
                data: "t=" + Math.random() +
                    "&action=group_check",
                beforeSend: function () { },//发送数据之前
                complete: function () { },//接收数据完毕
                success: function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    if (CheckMachine.versions.android) {
                        window.notify.notifyOnAndroid("{\"type\":\"goodsdetail\",\"obj\":{\"pid\":\"" + pid + "\"}}");
                    }
                    else if (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad) {
                        window.location.href = "/group.html?pid//" + pid;
                }
                }
                else {
                    if (PageTitle == "TV直播") {
                        window.location.replace(g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, pid));
                    }
                    else {
                        PageUrlConfig.SetUrl();
                        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
                }
            }
                }
        }
    });
}