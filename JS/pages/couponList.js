var couponList = {
    yishiyongguo:0,
    Init: function () {
        couponList.getData("getcoupons");
        //未使用优惠卷
        $("#li_weishiyong").on("click", function () {
            couponList.getData("getcoupons");
            $("#li_lishi").removeClass("curr");
            $("#li_weishiyong").attr("class", "curr");
            $("#section_weishiyong,#section_lishi").hide();
            $("#ul_lishi").removeClass("no");
            couponList.renderHtml(couponList.data);
        });
        //历史优惠卷
        $("#li_lishi").on("click", function () {
            couponList.getData("getcouponsexpire");
            $("#li_weishiyong").removeClass("curr");
            $("#li_lishi").attr("class", "curr");
            $("#section_weishiyong,#section_lishi").hide();
            couponList.renderHtml(couponList.HistoryData);
            $("#ul_lishi").addClass("no");
            $("#ul_lishi img").attr("src", "/img/w_img/yhq_top_no.jpg");
        });
    },
    getData: function (type) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=" +type,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.ResultCode) {
                if (msg.ResultCode == "99") {
                    PageUrlConfig.SetUrl();
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
                else {
                    ShowMesaage(msg.Description);
                }
            } else {
                if (msg.resultCode) {
                    if (msg.resultCode == "99" && couponList.HistoryData.length == 0) {
                        $("#section_weishiyong").show();
                    }
                }
                else {
                    if (msg.resultcode == g_const_Success_Code) {
                        couponList.loadResult(msg.couponlist);
                    }
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    HistoryData: [],
    data: [],
    loadResult: function (list) {
        couponList.data = [];
        couponList.HistoryData = [];
        console.log(list);
        $(list).each(function () {
            switch (this.canuse) {
                case "1"://已经领取待使用
                case "3"://已退回待使用
                    if (couponList.isExpired(this)) {
                        couponList.HistoryData.push($.extend(this, { isExpired: 1 }));
                    }
                    else {
                        couponList.data.push($.extend(this, { isExpired: 0 }));
                    }
                    break;
                case "2"://已使用
                    couponList.HistoryData.push($.extend(this, { isExpired: 1 }));
                    break;
                case "4"://已冻结（作废）
                    couponList.HistoryData.push($.extend(this, { isExpired: 1 }));
                    break;
            }
        });
        couponList.renderHtml(couponList.data);
    },
    renderHtml: function (data) {
        if (data.length > 0) {
            console.log(data);
            $("#ul_lishi").empty();
            var html = [];
            couponList.yishiyongguo = 0;
            $(data).each(function () {
                html = [];
                html.push('<li class="coupon-history"><img src="/img/w_img/yhq_top.jpg">');
                if ((this.canuse == "1" || this.canuse == "3") && this.isExpired == 0) {
                    html.push(' <div class="coupon-info apply clearfix" onclick="couponList.GoTo(\'' + this.urltype + '\',\'' + this.url + '\')">');
                }
                else {
                    couponList.yishiyongguo++;
                    html.push(' <div class="coupon-info apply clearfix">');
                }
                html.push('<div class="coupon-price"><span><i>¥</i>' + this.price + '</span><em>' + (this.usepricemin == 0 ? "不限" : ('满' + this.usepricemin + '元可用')) + '</em></div>');
                html.push('<h1 class="coupon-txt">' + this.title + '</h1>');
                html.push(' <p class="coupon-time"><span>生效期：</span>' + this.date_info_begin + '</p>');
                html.push(' <p class="coupon-time"><span>有效至：</span>' + this.date_info_end + '</p>');
                html.push(' </div>');
                if (this.description) {
                    var arrDes = unescape(this.description).split('|');
                    var desHtml = [];
                    $(arrDes).each(function () {
                        desHtml.push('<p>' + this + '</p>');
                    });
                    html.push('<div id="1_0" class="coupon-caption" style="display:block"><a class="coupon-btn"></a><div class="p_1_0" id="p_1_0">' + desHtml.join("") + '</div></div>');
                }
                else {
                    html.push('<div id="1_0" class="coupon-caption" style="display:block"><a style="height: 6px; width: 10px;display: block;margin: 7px auto;"></a><div class="p_1_0" id="p_1_0">&nbsp;</div></div>');
                }
                //html.push('<div class="radio"><input type="radio" name="zhifu" value="weixin"></div>');
                if (this.canuse == "2" || this.canuse == "4") {
                    html.push('<div class="old"></div>');
                }
                if ((this.canuse == "1" || this.canuse == "3") && this.isExpired == 1) {
                    html.push('<div class="beoverdue"></div>')
                }
                html.push('</li>');
                $("#ul_lishi").append(html.join(''));
            });
            //................显示/隐藏优惠券使用说明
            $('.coupon-btn').click(function () {
                $(this).siblings('.p_1_0').toggle();
                $(this).toggleClass("curr");
            });
            $("#section_lishi").show();
        }
        else {
            $("#section_weishiyong").show();
        }
    },
    isExpired: function (item) {
        var dateNow = new Date().getTime();
        var date_last = Date.Parse(item.date_info_end);
        var ts = dateNow - date_last.getTime();
        if (ts < 0) {
            return false;
        }
        else {
            return true;
        }
    },
    GoTo: function (t, u) {
        switch (t) {
            case "1":
                g_const_PageURL.GoTo(g_const_PageURL.Index);
                break;
            case "2":
                couponList.LoadGoToNewPeriod(u);
                break;
            case "3":
                window.location.href = u;
                break;
            default:
                g_const_PageURL.GoTo(g_const_PageURL.Index);
                break;
        }
    },
    LoadGoToNewPeriod: function (pid) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getnewperiod&pid=" + pid,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {
                g_const_PageURL.GoTo(g_const_PageURL.Index);
            } else {
                if (msg.newPeriodNum == 0) {
                    g_const_PageURL.GoTo(g_const_PageURL.Index);
                }
                else {
                    var par = "perid=" + msg.newPeriodNum + "&pid=" + pid;
                    g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
}