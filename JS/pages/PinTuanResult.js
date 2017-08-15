var PinTuanResult = {
    EventCode: GetQueryString("eid"),
    //1位参团成功使用，0为查看团状态使用
    IsOrder: GetQueryString("s"),
    Status: 0,
    PurchaseNum: 0,
    EndTime: "",
    Timer: "",
    PaySuccessCount: 0,
    Init: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getpininfo&eid=" + PinTuanResult.EventCode,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    ShowMesaage(g_const_API_Message[msg.resultcode]);
                }
            } else {
                PinTuanResult.Status = msg._status;
                g_type_tuanInfo.api_input.listEventCode = [PinTuanResult.EventCode];
                g_type_tuanInfo.LoadData(PinTuanResult.LoadPinGoodInfo);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadPinGoodInfo: function (list) {
        if (list.length > 0) {
            var data = list[0];
            var html = [];
            html.push('<div class="goodImg">');
            html.push('<img src="' + (data.mainpicUrl || g_goods_Pic) + '">');
            html.push('<div class="zutuanMask" id="mask">' + g_const_tuanStatus.getText(parseInt(PinTuanResult.Status)) + '</div>');
            html.push(' </div><div class="goodtxt">');
            html.push('<p class="text2">' + data.skuName + '</p>');
            html.push('<p class="price">' + data.purchaseNum + '人成团</p>');
            html.push('<p class="price3">￥' + data.favorablePrice.toFixed(2) + ' 元</p>');
            html.push('</div>');
            $("#goodInfo").html(html.join(""));
            PinTuanResult.PurchaseNum = data.purchaseNum;
            PinTuanResult.EndTime = data.endTime;
            PinTuanResult.LoadEventOrders();
        }
    },
    CheckCanPinTuan: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=iscanpin&Num=" + PinTuanResult.PurchaseNum + "&endTime=" + PinTuanResult.EndTime + "&eventCode=" + PinTuanResult.EventCode,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
                if (msg.resultcode != g_const_Success_Code) {
                    ShowMesaage(g_const_API_Message[msg.resultcode]);
                }
            } else {
                MyTuans.LoadResult(msg);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadEventOrders: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=eventorders&eid=" + PinTuanResult.EventCode,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    ShowMesaage(g_const_API_Message[msg.resultcode]);
                }
            } else {
                PinTuanResult.LoadMembersInfo(msg);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadMembersInfo: function (msg) {
        if (msg.length > 0) {
            PinTuanResult.PaySuccessCount = msg.length;
            var tuanzhang = msg[0];
            $("#tuanZhang").attr("src", g_member_Pic);
            $("#startDate").html(new Date(parseInt(tuanzhang._createtime.slice(6, 19))).Format("yyyy-MM-dd hh:mm:ss") + " 开团");
            var html = [];
            for (var i = 0; i < PinTuanResult.PurchaseNum; i++) {
                var huiyuan = msg[i];
                if (huiyuan) {
                    html.push('<li><img src="' + g_member_Pic + '" /><div class="have"></div></li>');
                }
                else {
                    html.push('<li><!--img src="" /--><div class="tuanState"></div> </li>');
                }
            }
            $("#tuanYuan").html(html.join(""));
            var status = parseInt(PinTuanResult.Status);
            var text = g_const_tuanStatus.getText(status);
            var description = g_const_tuanStatus.getDescription(status);

            switch (parseInt(PinTuanResult.Status)) {
                //组团未开始
                case g_const_tuanStatus.TuanNot:
                    $("#progressInfo li").removeClass("curr");
                    $("#progressBar li").removeClass("curr");
                    break;
                    //组团进行中
                case g_const_tuanStatus.Tuaning:
                    $("#leftTime").show();
                    var leftNum = PinTuanResult.PurchaseNum - msg.length;
                    PinTuanResult.Timer = self.setInterval(PinTuanResult.ShowLeftTime, g_const_seconds, leftNum);
                    $("#status").hide();
                    $("#txtDescription").html(description);
                    $("#btnEvent")
                    if (PinTuanResult.IsOrder == "1") {
                        $("#mask").hide();
                    }
                    //更新进度条
                    $("#progressInfo").find("li:eq(2)").addClass("curr").siblings().removeClass("curr");
                    $("#progressBar").find("li:eq(2)").find("i").addClass("curr").siblings().removeClass("curr");
                    break;
                    //组团成功
                case g_const_tuanStatus.TuanSuccess:
                    $("#status").html(text).hide();
                    $("#mask").html(text).css("background", "rgba(0,0,0,0.6)");
                    $("#leftTime").hide();
                    $("#txtDescription").html(description);
                    $("#btnEvent")
                    //更新进度条
                    $("#progressInfo").find("li:eq(3)").addClass("curr").siblings().removeClass("curr");
                    $("#progressBar").find("li:eq(3)").find("i").addClass("curr").siblings().removeClass("curr");
                    break;
                    //组团失败
                case g_const_tuanStatus.TuanFail:
                    $("#status").html(text).show();
                    $("#mask").html(text).css("background", "rgba(0,0,0,0.6)");
                    $("#leftTime").hide();
                    $("#txtDescription").html(description);
                    $("#btnEvent")
                    $("#progressInfo li").removeClass("curr");
                    $("#progressBar li").removeClass("curr");
                    break;
            }
        }

    },
    CancelTuan: function () {
        if (parseInt(PinTuanResult.Status) == g_const_tuanStatus.Tuaning) {
            var purl = g_INAPIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=updatetuanstatus&status=" + g_const_tuanStatus.TuanFail + "&eventCode=" + PinTuanResult.EventCode,
                dataType: g_APIResponseDataType
            });

            request.done(function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Success_Code) {
                        var text = g_const_tuanStatus.getText(g_const_tuanStatus.TuanFail);
                        var description = g_const_tuanStatus.getDescription(g_const_tuanStatus.TuanFail);
                        $("#status").html(text).show();
                        $("#mask").html(text).css("background", "rgba(0,0,0,0.6)");
                        $("#leftTime").hide();
                        $("#txtDescription").html(description);
                        $("#btnEvent")
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
        else {
            return false;
        }
    },
    SuccessTuan: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=updatetuanstatus&status=" + g_const_tuanStatus.TuanSuccess + "&eventCode=" + PinTuanResult.EventCode,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    var text = g_const_tuanStatus.getText(g_const_tuanStatus.TuanSuccess);
                    var description = g_const_tuanStatus.getDescription(g_const_tuanStatus.TuanSuccess);
                    $("#status").html(text).show();
                    $("#mask").html(text).css("background", "rgba(0,0,0,0.6)");
                    $("#leftTime").hide();
                    $("#txtDescription").html(description);
                    $("#btnEvent")
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*倒计时*/
    ShowLeftTime: function (num) {
        if (PinTuanResult.PaySuccessCount != PinTuanResult.PurchaseNum) {
            var date_last = Date.Parse(PinTuanResult.EndTime);
            var date_now = new Date();
            var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              
            if (ts > 0) {
                var hours = Math.floor(ts / g_const_hours);
                var leftmillionseconds = ts % g_const_hours;
                var minutes = Math.floor(leftmillionseconds / g_const_minutes);
                leftmillionseconds = leftmillionseconds % g_const_minutes;
                var seconds = Math.floor(leftmillionseconds / g_const_seconds);

                var hourstring = "0" + hours.toString();
                hourstring = hourstring.substr(hourstring.length - 2, 2);
                var minutestring = "0" + minutes.toString();
                minutestring = minutestring.substr(minutestring.length - 2, 2);

                var secondstring = "0" + seconds.toString();
                secondstring = secondstring.substr(secondstring.length - 2, 2);
                if (num > 0) {
                    $("#leftTime").html('还差' + num + '人！剩余<i>' + hourstring + '</i>:<i>' + minutestring + '</i>:<i>' + secondstring + '</i>结束');
                }
                else if (num == 0) {
                    $("#leftTime").html('还差' + PinTuanResult.PayInitCount + '人未支付！剩余<i>' + hourstring + '</i>:<i>' + minutestring + '</i>:<i>' + secondstring + '</i>结束');
                }
                if (hours == 0 && minutes == 0 && seconds == 0) {
                    self.clearInterval(PinTuanResult.Timer);
                    var text = g_const_tuanStatus.getText(g_const_tuanStatus.TuanFail);
                    $("#status").html(text).show();
                    $("#mask").html(text).css("background", "rgba(0,0,0,0.6)");
                    $("#leftTime").hide();

                    //时间到调用拼团失败方法
                    PinTuanResult.CancelTuan();
                }
            }
            else {
                self.clearInterval(PinTuanResult.Timer);
                var text = g_const_tuanStatus.getText(g_const_tuanStatus.TuanFail);
                $("#status").html(text).show();
                $("#mask").html(text).css("background", "rgba(0,0,0,0.6)");
                $("#leftTime").hide();
                //时间到调用拼团失败方法
                PinTuanResult.CancelTuan();
            }
        }
        else {
            PinTuanResult.SuccessTuan();
        }
    },
};