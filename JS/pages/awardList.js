var awardList = {
    Init: function () {
        UseAppFangFa.CaoZuo("refresh","","true");
        awardList.LoadData();

        var winHeight = $(window).height();
        $(window).on("scroll", function () {
            var el = $(this);
            var iScrollTop = el.scrollTop();
            if (iScrollTop + winHeight + 110 >= winHeight * (awardList.PageIndex + 2)) {
                ++awardList.PageIndex;
                awardList.LoadData();
            }
        });
    },
    Data: "",
    SysTime: "",
    LoadData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getawardlist&pi=" + awardList.PageIndex + "&ps=" + awardList.PageSize,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                //$("#resultList").empty();
                awardList.PageRecord = msg.AwardList.length;
                //awardList.PageCount = parseInt((msg.RecordCount + awardList.PageSize - 1) / awardList.PageSize);
                awardList.Data = msg.AwardList;
                awardList.SysTime = msg.systime;
                if (awardList.PageRecord == 0) {
                    $(window).on("scroll", function () {
                        return false;
                    });
                    $("#theLast").show();
                }
                awardList.LoadResult();
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    PageSize: 10,
    PageIndex: 0,
    PageCount: 1,
    PageRecord: 0,
    Timer: [],
    LoadResult: function () {
        if (awardList.PageRecord > 0) {
            var html = [];
            var memberInfo = "";
            for (var i = 0; i < awardList.Data.length ; i++) {
                html = [];
                var item = awardList.Data[i];
                if (item) {
                    //过滤中奖成功但是没有购买数量的数据
                    if (item.status == "40" && item.chipinnum == "") {
                        html.push("");
                    }
                    else {
                        html.push('<li onclick="awardList.GoToProductDetail(\'' + item.periodnum + '\',\'' + item.productid + '\')"><a href="javascript:void(0);">');
                        html.push(' <div class="ann_img"><img src="' + (item.listimg || g_goods_Pic) + '"></div>');
                        html.push(' <h3 class="ann_con">第' + item.periodnum + '期 ' + item.productname + '</h3>');
                        html.push('<p><label>期号: </label><span>' + item.periodnum + '</span></p>');
                        //揭奖
                        if (item.status == "40") {
                            memberInfo = getMemberInfo(item.buyerphone);
                            if (item.nickname == "") {
                                html.push('<p class="hdpp"><label>获得用户: </label><span>' + memberInfo.nickname + '</span></p>');
                            }
                            else {
                                html.push('<p class="hdpp"><label>获得用户: </label><span>' + item.nickname + '</span></p>');
                            }
                            html.push('<p><label>幸运号码: </label><span>' + item.awardcode + '</span></p>');
                            html.push(' <p class="jnnum"><label>参与次数: </label><span>' + (item.chipinnum || 0) + '</span></p>');
                            //item.openawardtime.substring(0, item.openawardtime.lastIndexOf(":"))
                            html.push(' <p class="jxTime"><label>揭晓时间: </label><span>' + item.openawardtime + '</span></p>');
                        }
                        else {
                            html.push(' <div class="ann_time"><p class="ann_time_con">即将揭晓</p><div class="lastTime" id="last_' + item.periodnum + '_' + item.productid + '"></div></div>');
                        }
                        html.push('</a></li>');
                    }
                    $("#resultList").append(html.join(""));
                    if (item.status != "40") {
                        var date_last = Date.Parse(item.openawardtime);
                        var date_now = Date.Parse(awardList.SysTime);
                        var ts = date_last.getTime() - date_now.getTime();
                        var objTimer = $('#last_' + item.periodnum + '_' + item.productid);
                        if (ts > 0 && objTimer.length > 0) {
                            awardList.SetLeftTimeHtml(item.openawardtime, objTimer);
                        }
                        else {
                            $(objTimer).css("font-size", "18px").html("点击查看中奖信息").on("click", function () {
                                window.location.reload();
                            });
                        }
                    }
                }
            }
        }
        else {
            if (awardList.PageIndex == 0) {
                $("#noResult").show();
            }
        }
    },
    GoToProductDetail: function (perid, pid) {
        var par = "perid=" + perid + "&pid=" + pid;
        g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
    },
    SetLeftTimeHtml: function (endTime, objTimer) {
        var date_last = Date.Parse(endTime);
        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              
        if (ts > 0) {
            var minutes = Math.floor(ts / g_const_minutes);
            var leftmillionseconds = ts % g_const_minutes;
            var seconds = Math.floor(leftmillionseconds / g_const_seconds);
            leftmillionseconds = leftmillionseconds % g_const_seconds;

            var millseconds = parseInt((leftmillionseconds / 100).toString());

            var minutestring = "0" + minutes.toString();
            minutestring = minutestring.substr(minutestring.length - 2, 2);

            var secondstring = "0" + seconds.toString();
            secondstring = secondstring.substr(secondstring.length - 2, 2);

            if (minutes == 0 && seconds == 0) {
                awardList.NotifyPeriodAwardService();
                $(objTimer).css("font-size", "18px").html("点击查看中奖信息").on("click", function () {
                    window.location.reload();
                });
            }
            else {
                $(objTimer).html(minutestring + ":" + secondstring + "." + millseconds);
                window.setTimeout(function () {
                    awardList.SetLeftTimeHtml(endTime, objTimer);
                });
            }
        }
        else {
            awardList.NotifyPeriodAwardService();
            $(objTimer).css("font-size", "18px").html("点击查看中奖信息").on("click", function () {
                window.location.reload();
            });
        }
    },
    NotifyPeriodAwardService: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=NotifyPeriodAwardService",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode == "1") {
                // window.location.reload(); // ShowMesaage("正在计算开奖信息，请稍等，请刷新页面");
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
};