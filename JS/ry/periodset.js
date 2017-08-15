$(function () {
    periodset.Init();
});
var periodset = {
    Init: function () {
        //获取期信息
        periodset.LoadData();
    },
    Data: "",
    SysTime: "",
    LoadData: function () {
        var purl = g_tz_api_url;//"/Ajax/rhHandler.ashx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=periodlist",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            var tablebody = "";
            $.each(msg.alllist, function (i, n) {
                var status = n.status;
                var btn = "<td align=\"center\"></td><td align=\"center\"></td><td align=\"center\"></td>";
                switch (status) {
                    case "0"://待投注;
                        status = "待投注";
                        btn = "<td align=\"center\"><a onclick=\"pv.set('" + n.periodnum + "')\">设置赔率</a></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','1')\">开始投注</a></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','5')\">暂停投注</a></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','10')\">停止投注</a></td>";
                        break;
                    case "1"://开始投注
                        status = "开始投注";
                        btn = "<td align=\"center\"><a onclick=\"pv.set('" + n.periodnum + "')\">设置赔率</a></td><td align=\"center\"></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','5')\">暂停投注</a></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','10')\">停止投注</a></td>";
                        break;
                    case "5"://暂停投注;
                        status = "暂停投注";
                        btn = "<td align=\"center\"><a onclick=\"pv.set('" + n.periodnum + "')\">设置赔率</a></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','1')\">开始投注</a></td><td align=\"center\"></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','10')\">停止投注</a></td>";
                        break;
                    case "10"://停止投注
                        status = "停止投注";
                        btn = "<td align=\"center\"><a onclick=\"pv.set('" + n.periodnum + "')\">设置赔率</a></td><td align=\"center\"></td><td align=\"center\"><a onclick=\"CaoZuo.Do('" + n.periodnum + "','5')\">暂停投注</a></td><td align=\"center\"></td>";
                        break;
                    case "20":
                        status = "开奖中";
                        break;
                    case "30":
                        status = "待派奖";
                        break;
                    case "40":
                        status = "派奖完毕";
                        break;
                }
                if (i == 0) {
                    tablebody += "<tr><td width=\"150px\" align=\"center\">期号</td><td width=\"200px\" align=\"center\">状态</td><td>整队赢赔率</td><td>MVP赔率</td><td width=\"500px\" colspan=\"4\" align=\"center\">操作</td></tr>";
                }
                tablebody += "<tr><td align=\"center\">" + n.periodnum + "</td><td align=\"center\">" + status + "</td>" + n.periodnum + "<td>1：<input type=\"text\" id=\"" + n.periodnum + "_teampv\" value=\"" + n.teampv + "\"></td><td>1：<input type=\"text\" id=\"" + n.periodnum + "_mvppv\" value=\"" + n.mvppv + "\"></td>" + btn + "</tr>";
            });
            $("#table_periodnum").html(tablebody);
            //Message.Operate("", "div_Load");
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    CaoZuo: function (periodnum, status) {
        var teampv=0;
        if ($("#" + periodnum + "_teampv") == undefined) {
            ShowMesaage("请填写"+periodnum+"期整队赢赔率!");
            return false;
        }
        if (isNaN($("#" + periodnum + "_teampv").val())) {
            ShowMesaage( periodnum + "期整队赢赔率错误");
            return false;
        }
        teampv = parseFloat($("#" + periodnum + "_teampv").val()).toFixed(2);
        var mvppv = 0;
        if ($("#" + periodnum + "_mvppv") == undefined) {
            ShowMesaage("请填写" + periodnum + "期MVP赔率!");
            return false;
        }
        if (isNaN($("#" + periodnum + "_mvppv").val())) {
            ShowMesaage(periodnum + "期MVP赔率错误");
            return false;
        }
        mvppv = parseFloat($("#" + periodnum + "_mvppv").val()).toFixed(2);
        if (teampv <= 0) {
            ShowMesaage("请填写" + periodnum + "期整队赢赔率【需大于0】!");
            return false;
        }
        if (mvppv <= 0) {
            ShowMesaage("请填写" + periodnum + "期MVP赔率【需大于0】!");
            return false;
        }

        var purl = "/Ajax/rhHandler.ashx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=periodnumset&periodnum=" + periodnum + "&status=" + status,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (int.parseInt(n.resultcode) > 0) {
                ShowMesaage(n.resultmessage);
            }
            else {
                ShowMesaage(n.resultmessage);
                periodset.LoadData();
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SetLeftTimeHtml: function (endTime, objTimer) {
        //var date_last = Date.Parse(endTime);
        //var date_now = new Date();
        //var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              
        //if (ts > 0) {
        //    var minutes = Math.floor(ts / g_const_minutes);
        //    var leftmillionseconds = ts % g_const_minutes;
        //    var seconds = Math.floor(leftmillionseconds / g_const_seconds);
        //    leftmillionseconds = leftmillionseconds % g_const_seconds;

        //    var millseconds = parseInt((leftmillionseconds / 100).toString());

        //    var minutestring = "0" + minutes.toString();
        //    minutestring = minutestring.substr(minutestring.length - 2, 2);

        //    var secondstring = "0" + seconds.toString();
        //    secondstring = secondstring.substr(secondstring.length - 2, 2);

        //    if (minutes == 0 && seconds == 0) {
        //        awardList.NotifyPeriodAwardService();
        //        $(objTimer).css("font-size", "18px").html("点击查看中奖信息").on("click", function () {
        //            window.location.reload();
        //        });
        //    }
        //    else {
        //        $(objTimer).html(minutestring + ":" + secondstring + "." + millseconds);
        //        window.setTimeout(function () {
        //            awardList.SetLeftTimeHtml(endTime, objTimer);
        //        });
        //    }
        //}
        //else {
        //    awardList.NotifyPeriodAwardService();
        //    $(objTimer).css("font-size", "18px").html("点击查看中奖信息").on("click", function () {
        //        window.location.reload();
        //    });
        //}
    },
};
/*更新期状态*/
var CaoZuo = {
    Do: function (periodnum, status) {
        var purl = g_tz_api_url;//"/Ajax/rhHandler.ashx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=periodnumset&periodnum=" + periodnum + "&status=" + status,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (parseInt(msg.resultcode) > 0) {
                ShowMesaage(msg.resultmessage);
            }
            else {
                ShowMesaage(msg.resultmessage);
                periodset.LoadData();
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

/*设置赔率*/
var pv = {
    set: function (periodnum) {
        var teampv=0;
        if ($("#" + periodnum + "_teampv") == undefined) {
            ShowMesaage("请填写"+periodnum+"期整队赢赔率!");
            return false;
        }
        if (isNaN($("#" + periodnum + "_teampv").val())) {
            ShowMesaage( periodnum + "期整队赢赔率错误");
            return false;
        }
        teampv = parseFloat($("#" + periodnum + "_teampv").val()).toFixed(2);
        var mvppv = 0;
        if ($("#" + periodnum + "_mvppv") == undefined) {
            ShowMesaage("请填写" + periodnum + "期MVP赔率!");
            return false;
        }
        if (isNaN($("#" + periodnum + "_mvppv").val())) {
            ShowMesaage(periodnum + "期MVP赔率错误");
            return false;
        }
        mvppv = parseFloat($("#" + periodnum + "_mvppv").val()).toFixed(2);

        var purl = g_tz_api_url;//"/Ajax/rhHandler.ashx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=pvset&periodnum=" + periodnum + "&teamwinpv=" + teampv + "&mvppv=" + mvppv,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (parseInt(msg.resultcode) > 0) {
                ShowMesaage(msg.resultmessage);
            }
            else {
                ShowMesaage(msg.resultmessage);
                periodset.LoadData();
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};