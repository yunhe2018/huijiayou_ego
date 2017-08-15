var MyBalance = {
    Init: function () {

        //$("#nav_balance li").off("click").on("click", function () {
        //    $(this).addClass("curr").siblings().removeClass("curr");
        //    var t = $(this).data("t");
        //    $("#resultList").empty();
        //    $("#theLast").hide();
        //    MyBalance.PageIndex = 0;
        //    switch (t) {
        //        case "use":
        //            MyBalance.LoadUse();
        //            break;
        //        case "record":
        //            MyBalance.LoadRecord();
        //            break;
        //    }
        //});
        UserLogin.Check(MyBalance.LoadData);
        $(window).on("scroll", function () {
            var bottom = $(document).height() - $(window).height() - $(window).scrollTop();
            if (bottom == 0 && $("#theLast").is(":hidden")) {
                ++MyBalance.PageIndex;
                MyBalance.LoadRecord();
                //var t = $("#nav_balance .curr").data("t");
                //switch (t) {
                //    case "use":
                //        MyBalance.LoadUse();
                //        break;
                //    case "record":
                       
                //        break;
                //}
            }
        });
    },
    PageSize: 20,
    PageIndex: 0,
    LoadData: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
        } else {
            MyBalance.LoadRecord();
            MyBalance.LoadBalance();
        }
    },
    LoadRecord: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getrechargerecord&pi=" + MyBalance.PageIndex + "&ps=" + MyBalance.PageSize,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            console.log(msg);
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Error_Code.UnLogin) {
                    PageUrlConfig.SetUrl();
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
            } else {
                if (MyBalance.PageIndex == 0 && msg.rechargeList.length == 0) {
                    $("#noResultMsg").html("还没有充值记录~");
                    $("#noResult").show();
                }
                else {
                    MyBalance.LoadRecordResult(msg.rechargeList);
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadUse: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getuserecord&pi=" + MyBalance.PageIndex + "&ps=" + MyBalance.PageSize,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Error_Code.UnLogin) {
                    PageUrlConfig.SetUrl();
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
            } else {
                if (MyBalance.PageIndex == 0 && msg.rechargeList.length == 0) {
                    $("#noResultMsg").html("还没有使用记录~");
                    $("#noResult").show();
                }
                else {
                    MyBalance.LoadUseResult(msg.rechargeList);
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadBalance: function () {
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
    },
    LoadUseResult: function (data) {
        if (data.length > 0) {
            var html = [];
            $(data).each(function () {
                html.push('  <li>');
                html.push('   <p class="mode">' + MyBalance.GetUseInfo(this.memo, this.tradetype) + '</p>');
                html.push('   <p class="time">' + this.datetime + '</p>');
                if (this.moneydirect == "2") {
                    html.push('   <span>-' + parseInt(this.allbalancechanged) + '夺宝币</span>');
                }
                else {
                   
                    html.push('   <span>+' + parseInt(this.cardbalancechanged) + '夺宝币</span>');
                }

                html.push('   </li>');
            });
            $("#resultList").append(html.join('')).show();
            if (data.length < MyBalance.PageSize) {
                $("#resultList li:last").addClass("no_bord");
            }
        }
        else {
            $(window).on("scroll", function () {
                return false;
            });
            $("#theLast").show();
            $("#resultList li:last").addClass("no_bord");
        }
    },
    GetUseInfo: function (memo, t) {
        var info = "";
        switch (t) {
            case "5":
                info = "参与夺宝";
                break;
            case "20":
                info = memo;
                break;
            default:
                info = memo;
                break;
        }
        return info;
    },
    LoadRecordResult: function (data) {
        if (data.length > 0) {
            var html = [];
            $(data).each(function () {
                var state = "";
                switch (this.status) {
                    case "1":
                        state = "";
                        break;
                    default:
                        state = "green";
                }
                html.push('  <li>');
                html.push('   <p class="mode">' + g_pay_ment.getPayTypeText(this.paygate, this.paygatetype) + '<i class="' + state + '">' + this.memo + '</i></p>');
                html.push('   <p class="time">' + this.datetime + '</p>');
                if (this.moneydirect == "2") {
                    html.push('   <span>' + parseInt(this.allbalancechanged) + '夺宝币</span>');
                }
                else {
                    var awardchanged = '';
                    if (this.awardbalancechanged > 0) {
                        awardchanged = '赠' + parseInt(this.awardbalancechanged);
                    }
                    html.push('   <span>' + parseInt(this.allbalancechanged) + '夺宝币 ' + awardchanged + '</span>');
                }
                html.push('   </li>');
            });
            $("#resultList").append(html.join('')).show();
            if (data.length < MyBalance.PageSize) {
                $("#resultList li:last").addClass("no_bord");
            }
        }
        else {
            $(window).on("scroll", function () {
                return false;
            });
            $("#theLast").show();
            $("#resultList li:last").addClass("no_bord");
        }
    }
};
