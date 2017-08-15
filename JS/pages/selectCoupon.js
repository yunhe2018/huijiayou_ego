var couponList = {
    Init: function (OrderTotalMoney, GoodsId) {
        if (!(OrderTotalMoney == undefined) && !(GoodsId == undefined)) {
            couponList.getData(OrderTotalMoney, GoodsId);
        }
        else {
            couponList.getData();
        }
        //选择
        $("#btnConfirm").on("click", function () {
            var check = $(".radio input[type=radio]:checked");
            var coupon = "";
            if (check.length > 0) {
                coupon = { no: $(check).attr("cno"), p: $(check).attr("price"), lid: $(check).attr("lid") };
            }
            else {
                coupon = { no: "0", p: "0", lid: "0" };
            }
            localStorage["SelectCoupon"] = JSON.stringify(coupon);
            localStorage["fromSelectCoupon"] = "1";
            window.location.replace(g_const_PageURL.OrderConfirm);
        });
    },
    getData: function (OrderTotalMoney, GoodsId) {
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
                    PageUrlConfig.SetUrl();
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
                else {
                    ShowMesaage(msg.Description);
                }
            } else {
                if (msg.resultCode) {
                    if (msg.resultCode == "99") {
                        $("#section_weishiyong").show();
                    }
                }
                else {
                    if (msg.resultcode == g_const_Success_Code) {
                        if (!(OrderTotalMoney == undefined) && !(GoodsId == undefined)) {
                            couponList.loadResult(msg.couponlist, OrderTotalMoney, GoodsId);
                        }
                        else {
                            couponList.loadResult(msg.couponlist);
                        }
                    }
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    loadResult: function (list, OrderTotalMoney, GoodsId) {
        $(list).each(function () {
            if (!(OrderTotalMoney == undefined) && !(GoodsId == undefined)) {

                if ((this.canuse == "1" || this.canuse == "3")
                                   && (this.usepricemin == 0 || parseFloat(this.usepricemin) <= OrderTotalMoney)
                                   && My_DateCheck.CheckEX('<=', Date.parse(this.date_info_begin.replace(/-/g, "/")))
                                   && My_DateCheck.CheckEX('>', Date.parse(this.date_info_end.replace(/-/g, "/")))
                                   ) {

                    if (this.userproudct_ids != "") {
                        //支持商品
                        var userproudct_ids = "," + this.userproudct_ids + ",";
                        if (userproudct_ids.indexOf(GoodsId) > -1) {
                            couponList.Data.push(this);
                        }
                    }
                    else if (this.nouserproudct_ids != "") {
                        //不支持商品
                        var nouserproudct_ids = "," + this.nouserproudct_ids + ",";
                        if (nouserproudct_ids.indexOf(GoodsId) == -1) {
                            couponList.Data.push(this);
                        }
                    }
                    else {
                        couponList.Data.push(this);
                    }
                }
            }
            else {
                if ((this.canuse == "1" || this.canuse == "3")
                    && My_DateCheck.CheckEX('<=', Date.parse(this.date_info_begin.replace(/-/g, "/")))
                    && My_DateCheck.CheckEX('>', Date.parse(this.date_info_end.replace(/-/g, "/")))
                    )
                {
                    couponList.Data.push(this);
                }

            }
        });
        couponList.renderHtml(couponList.Data);
    },
    Data: [],
    renderHtml: function (data) {
        console.log(data);
        if (data.length > 0) {
            $("#ul_lishi").empty();
            var html = [];
            $(data).each(function () {
                html = [];
                html.push('<li class="coupon-history"><img src="/img/w_img/yhq_top.jpg">');
                html.push(' <div class="coupon-info apply clearfix" name="selectCoupon">');
                html.push('  <div class="coupon-price"><span><i>¥</i>' + this.price + '</span><em>' + (this.usepricemin == 0 ? "不限" : ('满' + this.usepricemin + '元可用')) + '</em></div>');
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
                html.push('<div class="radio"><input type="radio" cno="' + this.coupon_code + '" lid="' + this.id + '" price="' + this.price + '" name="zhifu" value="weixin"></div>');
                html.push('</li>');
                if (localStorage["payMoney"]) {
                    if (this.usepricemin == 0 || parseFloat(this.usepricemin) <= parseFloat(localStorage["payMoney"])) {
                        if (this.userproudct_ids.length <= 0) {
                            $("#ul_lishi").append(html.join(''));
                        }
                        else {
                            var useProducts = this.userproudct_ids.split(',');
                            if (localStorage["pid"]) {
                                if ($.inArray(localStorage["pid"], useProducts) > -1) {
                                    $("#ul_lishi").append(html.join(''));
                                }
                                else {
                                    $("#cannotuse").append(html.join(''));
                                }
                            }
                            else {
                                $("#cannotuse").append(html.join(''));
                            }
                        }
                    }
                    else {
                        $("#cannotuse").append(html.join(''));
                    }
                }
            });

            if ($("#cannotuse li").length > 0) {
                $("#cannotuseInfo").show();
                $("#cannotuse img").attr("src", '/img/w_img/yhq_top_no.jpg');
            }
            //................显示/隐藏优惠券使用说明
            $('.coupon-btn').click(function () {
                $(this).siblings('.p_1_0').toggle();
                $(this).toggleClass("curr");
            });
            $('#ul_lishi .radio').click(function () {
                $('.radio input[type=radio]').prop("checked", false);
                if ($(this).hasClass("on")) {
                    $('.radio').removeClass('on');
                    $(this).removeClass('on');
                    $(this).find('input[type=radio]').prop('checked', false);
                }
                else {
                    $('.radio').removeClass('on');
                    $(this).addClass('on');
                    $(this).find('input[type=radio]').prop('checked', true);
                }
            });
            $('#ul_lishi div[name=selectCoupon]').on("click", function () {
                $('.radio input[type=radio]').prop("checked", false);
                var radio = $(this).parent().find('input[type=radio]');
                if ($(radio).parent().hasClass('on')) {
                    $('.radio').removeClass('on');
                    $(radio).parent().removeClass('on');
                    $(radio).prop('checked', false);
                }
                else {
                    $('.radio').removeClass('on');
                    $(radio).parent().addClass('on');
                    $(radio).prop('checked', true);
                }
            });
            if (localStorage["SelectCoupon"]) {
                var selectCoupon = JSON.parse(localStorage["SelectCoupon"]);
                var check = $('input[type=radio][lid=' + selectCoupon.lid + ']');
                if (check.length > 0) {
                    $(check).prop("checked", true);
                    $(check).parent().addClass("on");
                }
            }
            $("#btn_back").show();
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