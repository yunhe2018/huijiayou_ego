var login = "";
$(document).ready(function () {
    if (IsInWeiXin.check()) {
        $("div.addrHeader").hide();
    }

    UserLogin.Check(Account.LoadInfo);
});
var Account = {
    LoadInfo: function () {
        var body = "";
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            $("#headPic").attr("src", g_member_Pic);
            $("#userName").html("登录/注册");
            $(".personHeader").on("click", function () {
                PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            });
        }
        else {
            MemberInfo.GetList();
            MemberInfo.GetBalance();
            
        }
        $("#myOrdershow").on("click", function (e) {
            //if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //    PageUrlConfig.SetUrl();
            //    g_const_PageURL.GoTo(g_const_PageURL.Login);
            //}
            //else {
              //  PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.ShowOrder_List, "seemy=1");
            //}
        });
        Message.Operate('', "divAlert");
    },
    SetPassword: function () {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random();
    },
    ContactKeFu: function (obj) {
        if (CheckMachine.versions.ios && !CheckMachine.versions.inWeiXin) {
            window.location.href = "tel:" + g_const_Phone.sh;
        }
        else if (CheckMachine.versions.android && !CheckMachine.versions.inWeiXin) {
            Message.ShowAlert("提示", "客服电话：" + g_const_Phone.sh, "fbox_ftel", "确定", "Account.ReturnFalse");
        }
        else {
            Message.ShowConfirm("提示", "确定拨打电话" + g_const_Phone.sh + "？", "fbox_ftel", "呼叫", "Account.KuFuPhone", "取消");
        }
    },
    ReturnFalse: function () {
        return false;
    },
    KuFuPhone: function () {
        if (IsInWeiXin.check()) {
            window.location.href = "tel:" + g_const_Phone.sh;//+ "mp.weixin.qq.com";
        }
        else {
            window.location.href = "tel:" + g_const_Phone.sh;
        }
    }
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
        if (result.NickName && result.NickName.length > 0) {
            $("#userName").html(result.NickName);
        }
        else {
            $("#userName").html((UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)));
        }
        if (result.HeadPic && result.HeadPic.length > 0) {
            $("#headPic").attr("src", result.HeadPic);
        }
        else {
            // $("#headPic").attr("src", g_member_Pic);
            MemberInfo.GetPhone();
        }
        //if (result.nickName.length > 0) {
        //    $("#userName").html("Hi," + result.nickName);
        //}
        //else {
        //    $("#userName").html("Hi," + (UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)));
        //}
        //if (result.headPhoto.length > 0) {
        //    $("#headPic").attr("src", result.headPhoto);
        //}
        //else {
        //    $("#headPic").attr("src", g_member_Pic);
        //}

        $(".personPic02,.persontxt02").on("click", function () {
            g_const_PageURL.GoTo(g_const_PageURL.MyAccountInfo);
        });
        MemberInfo.LoadCouponCount();
        //$("#loginOut").show().on("click", function () {
        //    UserInfo.Logout();
        //});
    },
    LoadCouponCount: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getcoupons",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.ResultCode) {
                if (msg.ResultCode == "99") {
                    ShowMesaageCallback(msg.Description, function () {
                        PageUrlConfig.SetUrl();
                        g_const_PageURL.GoTo(g_const_PageURL.Login);
                    }, 2000);
                }
                else {
                    ShowMesaage(msg.Description);
                }
            } else {
                if (msg.resultCode) {
                    if (msg.resultCode == "99") {
                        $("#couponCount").html(0 + "张");
                    }
                }
                else {
                    if (msg.resultcode == g_const_Success_Code) {
                        var counter = 0;
                        $(msg.couponlist).each(function () {
                            var dateNow = new Date().getTime();
                            var date_last = Date.Parse(this.date_info_end);
                            var ts = dateNow - date_last.getTime();
                            if ((this.canuse == "1" || this.canuse == "3") && ts < 0) {
                                ++counter;
                            }
                        });
                        $("#couponCount").html(counter + "张");
                        if (counter > 0) {
                            $("#newCoupon").show();
                        }
                    }
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetBalance: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getbalance",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    $("#balance").html(parseInt(msg.allBalance));
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
}
var UserInfo = {
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