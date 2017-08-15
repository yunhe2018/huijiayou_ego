$(function () {
    //自适应rem初始化设置
    function fontSize() {
        var calculateFontSize = (10 * (document.documentElement.clientWidth / 320) + 'px');
        if (document.documentElement.clientWidth < 640) {
            document.documentElement.style.fontSize = calculateFontSize;
            return false;
        } else if (document.documentElement.clientWidth < 1280) {
            document.documentElement.style.fontSize = "20px";
            return false;
        }
        if (document.documentElement.clientWidth < 1280) {
            document.documentElement.style.fontSize = calculateFontSize;
            return false;
        }
        else {
            document.documentElement.style.fontSize = "40px";
            return false;
        }
    }
    fontSize();
    window.onresize = function () { fontSize(); };
    UserLogin.Check(GetCouponCout);
});
function GetCouponCout() {
    if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
        return false;
    }
    else {
        if ($("#tipNew").length > 0) {
            var request = $.ajax({
                url: g_ego_api_url,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=getcoupons",
                dataType: g_APIResponseDataType
            });
            request.done(function (msg) {
                if (msg.ResultCode) {
                } else {
                    if (msg.resultCode) {
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
                            if (counter > 0) {
                                $("#tipNew").html(counter).show();
                            }
                        }
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    }
}
function CutPhone(phone) {
    if (phone && isMobile(phone)) {
        var newPhone = "";
        newPhone = phone.substr(0, 3) + "*****" + phone.substr(8, 3);
        return newPhone;
    }
    return phone;
}
var getMemberInfo = function (mobileNo) {
    var cutMobileNo = CutPhone(mobileNo);
    var memberInfo = { nickname: cutMobileNo, avatar: g_member_Pic };
    if (memlist) {
        $(memlist.ResultTable).each(function () {
            if (this.mobile == mobileNo) {
                memberInfo.nickname = this.nickname || cutMobileNo;
                memberInfo.avatar = this.avatar || g_member_Pic;
                return false;
            }
        });
    }
    return memberInfo;
};