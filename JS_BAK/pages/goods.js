var goods = {
    GoodsId: GetQueryString("pid"),
    PeriodsId: GetQueryString("perid"),
    TotalCount: 0,
    LeftCount: 0,
    Unit: 1,
    Init: function () {
        goods.LoadGoodsData();
    },
    LoadGoodsData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getGoodsInfo&pid=" + goods.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                goods.Unit = msg.UnitPrice;
                $("#selectCount").val(goods.Unit).data("min", goods.Unit);
                var pcList = msg.DetailImg;
                var html = [];
                $(pcList.split(',')).each(function () {
                    if (this) {
                        html.push('<div class="swiper-slide"><img src="' + this + '" / onerror="goods.GoodsImgError(this);"></div>');
                        //html.push('<div class="swiper-slide"><img src="/img/yy_good.jpg" / onerror="goods.GoodsImgError(this);"></div>');

                    }
                });
                $("#pcList").html(html.join(""));
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    paginationClickable: true,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 2500,
                    autoplayDisableOnInteraction: false
                });
                goods.TotalCount = msg.SellPrice
                goods.LoadRecord();
                $("#title").html('第' + goods.PeriodsId + '期 ' + msg.ProductName);
                if (msg.PromotionTitle) {
                    $("#promotionTitle").html(msg.PromotionTitle).show();
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GoodsImgError: function (obj) {
        $(obj).attr("src", g_goods_Pic);
        $(obj).unbind();
    },
    //加载进度条
    LoadProgress: function () {
        $("#progressBar").css({ "width": "0%" });
        var total = goods.TotalCount;
        var left = goods.LeftCount;
        $("#totalCount").html("总需" + total + "人次");
        $("#leftCount").html(left == 0 ? "已满" : ("剩余" + left + "人次"));
        $("#progressBar").css({ "width": (left == 0 ? 100 : ((total - left) / total) * 100) + "%" });
        $("#fastSelects span").on("click", function () {
            $(this).addClass("on").siblings().removeClass("on");
            var num = $(this).attr("num");
            if (parseInt(num) > goods.LeftCount) {
                ShowMesaage("超过最大参与次数");
                $("#selectCount").val(goods.LeftCount);
            }
            else {
                $("#selectCount").val(num);
            }
        });
        UserLogin.Check(goods.LoadEgoInfo);
    },
    Timer: "",
    //加载本期信息
    LoadEgoInfo: function () {
        goods.LoadEgoState();
    },
    //加载本期状态信息
    LoadEgoState: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            $("#goodsInfo").css({ "padding-bottom": "3rem" });
            $("#LoginInfo").show();
            $("#btnLogin").on("click", function () {
                PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            });
        }
        else {
            goods.LoadMyCode();
        }

        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getperiod&perid=" + goods.PeriodsId + "&pid=" + goods.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                var egostate = msg.Status;
                switch (egostate) {
                    case g_const_lotteryStatus.SellIng:
                        goods.LoadEgoInit(msg);
                        break;
                    case g_const_lotteryStatus.SellEnd:
                        goods.LoadEgoDisclose(msg.OpenAwardTime);
                        break;
                    case g_const_lotteryStatus.OpenSucc:
                        goods.LoadEgoSuccess();
                        break;
                    case g_const_lotteryStatus.OpenFail:
                        $("#goodsInfo").css({ "padding-bottom": "1rem" });
                        goods.LoadEgoFail();
                        break;
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //人数未满
    LoadEgoInit: function (msg) {
        //获取有效时间
        var stopTime = msg.SaleStopTime;
        var endTime = new Date(stopTime).Format("yyyy-MM-dd hh:mm:ss");
        $("#expireDate").html("本期有效期至：" + endTime).show();

        //阻止事件冒泡
        $("#btnOperate").html("<span>立即参与</span>").show().on("click", function () {
            $("#selectPop").show();
        });
        $(".gd_dialog,.gdd_partNum,.gd_num_as,.gd_count,label").on("click", function () {
            return false;
        });
        $("#selectPop").on("click", function () {
            $("#selectPop").hide();
        });

        var max = parseInt($("#selectCount").data("max"));
        var min = parseInt($("#selectCount").data("min"));
        $("#reduce").on("click", function () {
            var count = parseInt($("#selectCount").val());
            if (count > goods.Unit) {
                count -= goods.Unit;
                $("#selectCount").val(count);
            }
            return false;
        });
        $("#plus").on("click", function () {
            var count = parseInt($("#selectCount").val());
            if (count < max || max == 0) {
                count += goods.Unit
                $("#selectCount").val(count);
            }
            return false;
        });

        $("#selectCount").on('input paste', function (n) {
            var count = $(this).val();
            var length = count.length;
            for (var i = 0; i < length; i++) {
                var item = count[i];
                if (!isIntegerOrNull(item) || item == " ") {
                    $(this).val(count.replace(item, ""));
                    return false;
                }
            }
            return false;
        });
        $("#btnConfirm").on("click", function () {
            if ($("#selectCount").val().length == 0 || $("#selectCount").val() == "0") {
                ShowMesaage("请确认参与次数");
                return false;
            }
            if (parseInt($("#selectCount").val()) > goods.LeftCount) {
                ShowMesaage("超过最大参与次数");
                return false;
            }
            var par = "?perid=" + goods.PeriodsId + "&pid=" + goods.GoodsId + "&num=" + $("#selectCount").val();
            if (IsInWeiXin.check()) {
                var wxUrl = g_const_PageURL.OrderConfirm + par;
                WxInfo.GetPayID(wxUrl);
            }
            if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                var backUrl = g_const_PageURL.OrderConfirm + "?t=" + new Date().getTime() + "&" + par;
                PageUrlConfig.SetUrl(backUrl);
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            }
            else {
                //跳转下单页面
                g_const_PageURL.GoTo(g_const_PageURL.OrderConfirm, par);
            }
            return false;
        });
    },
    //开奖成功
    LoadEgoSuccess: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getwininfo&perid=" + goods.PeriodsId + "&pid=" + goods.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                if (msg.winInfo.length > 0) {
                    var winBuyPhone = "";
                    var awardcode = "";
                    var chipinnum = 0;
                    $(msg.winInfo).each(function () {
                        if (this.orderstatus == "40" || this.orderstatus == "45" || this.orderstatus == "50") {
                            winBuyPhone = this.buyerphone;
                            awardcode = this.awardcode;
                            return false;
                        }
                    });
                    $(msg.winInfo).each(function () {
                        if (this.buyerphone == winBuyPhone) {
                            chipinnum += parseInt(this.chipinnum);
                        }
                    });
                    $("#userName").html(CutPhone(winBuyPhone));
                    $("#count").html(chipinnum + "次");
                    $("#luckyCode").html(awardcode);
                    $("#luckyMan").show();
                }
            }
            goods.LoadGoToNewPeriod();
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //开奖中
    LoadEgoDisclose: function (endTime) {
        endTime = new Date(endTime).Format("yyyy-MM-dd hh:mm:ss");

        var date_last = Date.Parse(endTime);
        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();
        if (ts > 0) {
            $("#timmer").html(goods.GetLeftTimeHtml(endTime));
            goods.Timer = self.setInterval(function () {
                $("#timmer").html(goods.GetLeftTimeHtml(endTime));
            }, g_const_seconds);
            $("#disclose").show();
        }
        else {
            $("#disclose").hide();
            $("#discloseTitleBtn").show();
            goods.NotifyPeriodAwardService();
        }
        goods.LoadGoToNewPeriod();

    },
    //开奖失败
    LoadEgoFail: function () {
        $("#tip").show().find("span").attr("class", "").css({ "color": "#f6123d" }).html("该期未达到总需人次，夺宝失败");
        goods.LoadGoToNewPeriod();
    },
    //加载我购买的中奖码
    LoadMyCode: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getMyCodes&perid=" + goods.PeriodsId + "&pid=" + goods.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                var codeList = msg;
                var html = [];
                var l = codeList.length;
                if (l > 0) {
                    var total = 0;
                    $(codeList).each(function () {
                        total += this.ChipinNum;
                    });
                    $("#MyNumTip").show().find("span").attr("class", "can").html("本期您参与了" + total + "次");
                    if (total > 3) {
                        html.push('<b class="partNums_open" data-state="close" id="myCodeList"></b>');
                    }
                    html.push("<label>参与号码:</label>");
                    $(codeList).each(function () {
                        $(this.ChipinCodeList.split(',')).each(function () {
                            if (this) {
                                html.push('<span>' + this + '</span>');
                            }
                        });
                    });
                    $("#myCode").html(html.join("")).show();
                    $("#myCode span:eq(0)").css({ "margin-left": "0.3rem" });
                    if (total > 3) {
                        $("#myCode").css({ "overflow": "hidden", "height": "0.7rem" });
                    }
                    //绑定事件
                    $("#myCodeList").on("click", function () {
                        var state = $(this).data("state");
                        if (state == "close") {
                            $("#myCode").css({ "overflow": "hidden", "height": "auto" });
                            $(this).data("state", "open").css({ "transform": "rotate(180deg)" });
                        } else {
                            $("#myCode").css({ "overflow": "hidden", "height": "0.7rem" });
                            $(this).data("state", "close").css({ "transform": "rotate(0deg)" });
                        }
                    });
                } else {
                    $("#MyNumTip").show().find("span").attr("class", "").html("您未参与本期抢宝活动");
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //加载参与记录
    LoadRecord: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getRecord&pid=" + goods.GoodsId + "&perid=" + goods.PeriodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
            } else {
                var arrRecord = msg;
                var html = [];
                var canyuCount = 0;
                if (arrRecord.length > 0) {
                    html.push('  <div class="pic_con"><span class="pic_con_lt">所有参与记录</span></div>');
                    $(arrRecord).each(function () {
                        canyuCount += this.Num;
                        html.push('<div class="partNum"><p>参与' + this.Num + '人次</p><div class="t_t clearfix"><span class="part_tel">' + CutPhone(this.UserName) + '</span><span class="part_time">' + this.Time + '</span></div></div>');
                    });
                }
                else {
                    html.push('  <div class="pic_con"><span class="pic_con_lt">暂时没有参与记录</span></div>')
                }
                goods.LeftCount = goods.TotalCount - canyuCount;
                $("#selectCount").data("max", goods.LeftCount);
                goods.LoadProgress();
                $("#recordList").prepend(html.join(""));
                $(".partNum:last").addClass("no");
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*倒计时*/
    GetLeftTimeHtml: function (endTime) {
        var date_last = Date.Parse(endTime);
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

            if (hours == 0 && minutes == 0 && seconds == 0) {
                self.clearInterval(goods.Timer);
                goods.NotifyPeriodAwardService();
                $("#disclose").hide();
                $("#discloseTitleBtn").show();
            }
            else {
                return hourstring + ":" + minutestring + ":" + secondstring;
            }
        }
        else {
            self.clearInterval(goods.Timer);
            goods.NotifyPeriodAwardService();
            $("#disclose").hide();
            $("#discloseTitleBtn").show();
        }
    },
    //获取有效期
    GetExpireDateHtml: function (endTime) {
        var date_last = Date.Parse(endTime);
        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              
        if (ts > 0) {

            var days = Math.floor(ts / g_const_days);
            var leftmillionseconds = ts % g_const_days;

            var hours = Math.floor(leftmillionseconds / g_const_hours);

            if (days == 0 && hours == 0) {
                return "";
            }
            else {
                if (days == 0 && hours != 0) {
                    return "(有效期" + hours + "时)";
                }
                return "(有效期" + days + "天" + hours + "时)";
            }
        }
        else {
            return "";
        }
    },
    LoadGoToNewPeriod: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getnewperiod&pid=" + goods.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                if (msg.newPeriodNum == 0) {
                    $("#btnOperate").hide();
                }
                else {
                    $("#btnOperate").html("<span>前往最新期</span>").show().on("click", function () {
                        var par = "perid=" + msg.newPeriodNum + "&pid=" + goods.GoodsId;
                        g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
                    });
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    IsTheLastPeriod: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getnewperiod&pid=" + goods.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
                return false;
            } else {
                if (msg.newPeriodNum == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
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
}