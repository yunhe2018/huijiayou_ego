var luckyDetail = {
    PeriodsId: GetQueryString("perid"),
    GoodsId: GetQueryString("pid"),
    Init: function () {
        luckyDetail.LoadWinData();
    },
    LoadWinData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getwininfo&perid=" + luckyDetail.PeriodsId + "&pid=" + luckyDetail.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                var win = msg.winInfo[0];
                $("#luckyCode").html(win.awardcode);
                $("#baseNum").html("（数值A/商品所需次数）取余数+" + 10000001);
                luckyDetail.LoadDetail(win.awardordercount);
                luckyDetail.AbandonAwardCount();
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    AbandonAwardCount: function (awardordercount) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getabandoncount&pid=" + luckyDetail.GoodsId + "&perid=" + luckyDetail.PeriodsId,
            dataType: "text"
        });
        request.done(function (msg) {
            if (msg == "0") {
                $("#lblaward").html("本期揭晓号码:  ");
            }
            else {
                $("#lblaward").html("本期" + (parseInt(msg, 10) + 1) + "次揭晓号码:  ");
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadDetail: function (awardordercount) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getluckDetail&pid=" + luckyDetail.GoodsId + "&perid=" + luckyDetail.PeriodsId + "&record=" + awardordercount,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
            } else {
                $("#totalA").html('数值A=' + msg.NumA + '<a id="see_open">查看详情</a>');
                var html = [];
                $("#dataList").empty();
                var memberInfo = "";
                $(msg.DataList).each(function () {
                    memberInfo = getMemberInfo(this.UserName);
                    html.push('<li class="clearfix"><span class="join_time fl">' + this.Time + '</span><span class="join_code fl">' + this.Num + '</span><span class="join_name fr">' + memberInfo.nickname + '</span></li>');
                });
                $("#div_awardshow").html("数值A=该商品最后一个抢宝号码分配完毕时间点前，一元抢宝平台最后" + msg.DataList.length + "个参与时间相加求和");
                $("#dataList").html(html.join(""));
                $("#see_open").click(function () {
                    if ($(this).hasClass("see_close")) {
                        $(this).removeClass("see_close");
                        $(".joinUser").hide();
                    } else {
                        $(this).addClass("see_close");
                        $(".joinUser").show();
                    }
                })
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};