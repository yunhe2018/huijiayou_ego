
$(document).ready(function () {
    //返回
    $(".go-back").on("tap", function () {
        //alert("后退");
        //history.back();
        window.location.replace(PageUrlConfig.BackTo());
    });
    //获得传递的订单号
    $("#hid_order_code").val(GetQueryString("order_code"));
    //我的物流
    MyOrder_wl.GetList();
});
var slider = {};
slider.tag = $(document);
slider.index = 0;
slider.direction = "mid"
slider.sPoint = {};
slider.ePoint = {};
slider.isScrolling = 0;
slider.max = 0;
slider.touchStart = function () {
    slider.tag.on("touchstart", function (e) {
        slider.direction = "mid";
        slider.ePoint = {};
        slider.max = $("#expressTab").find("li").length;
        var touchS = e.originalEvent.targetTouches[0];
        slider.sPoint = { x: touchS.pageX, y: touchS.pageY };

        slider.tag.on("touchmove", function (e) {
            if (e.originalEvent.targetTouches > 1 || e.originalEvent.scale && e.originalEvent.scale !== 1) return;
            var touchM = e.originalEvent.targetTouches[0];
            slider.ePoint = { x: touchM.pageX - slider.sPoint.x, y: touchM.pageY - slider.sPoint.y };
            slider.isScrolling = Math.abs(slider.ePoint.x) < Math.abs(slider.ePoint.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
            if (slider.isScrolling === 0) {
                event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
                if (slider.ePoint.x > 0) {
                    slider.direction = "left";
                }
                if (slider.ePoint.x < 0) {
                    slider.direction = "right";
                }
            }
        });
        slider.tag.on("touchend", function (e) {
            if (slider.isScrolling === 0) { //当为水平滚动时
                //当偏移量大于10时执行
                var offset = Math.abs(slider.ePoint.x);
                var wid = $(window).width();
                var liL = $("#expressTab ul li:eq(0)").width();
                var l = parseInt(wid / liL);
                if (offset > 10) {
                    if (slider.direction == "right" && slider.index >= 0 && slider.index != slider.max) {
                        ++slider.index;
                        if (slider.index >= l && slider.index != slider.max) {
                            $("#expressTab").animate({ "left": "-" + ((slider.index + 1) * liL - wid) + "px" }, "slow");
                        }
                    }
                    if (slider.direction == "left" && slider.index <= slider.max && slider.index != 0) {
                        --slider.index;
                        if (slider.index < slider.max - l) {
                            $("#expressTab").animate({ "left": "-" + ((slider.index + 1) * liL - wid) + "px" }, "slow");
                            //$("#expressTab").animate({ "left": "0px" }, "slow");
                        }
                    }
                    if (slider.direction == "mid") {
                        return false;
                    }
                    if (slider.index >= 0 && slider.index < slider.max) {
                        $("#expressTab").find("li[data-num='" + slider.index + "']").addClass("curr").siblings().removeClass("curr");
                        MyOrder_wl.LoadOneSeparateOrderResult(MyOrder_wl.OrderTraceInfos[slider.index]);
                    }
                }
            }
            //解绑事件
            slider.tag.unbind("touchmove");
            slider.tag.unbind("touchend");
        });
    });
};
//我的订单--物流
var MyOrder_wl = {
    MyOrder_wl: PageNum = "0",
    //订单详情
    api_orderdetal_target: "com_cmall_familyhas_api_ApiOrderDetails",
    api_orderdetal_input: { "order_code": "" },
    GetList: function () {
        MyOrder_wl.api_orderdetal_input.order_code = $("#hid_order_code").val();
        var s_api_input = JSON.stringify(this.api_orderdetal_input);
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_wl.api_orderdetal_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_detail + "?order_code=" + $("#hid_order_code").val())
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyOrder_wl.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (msg) {
        if (msg.isSeparateOrder == "0") {
            MyOrder_wl.GetSeparateOrderList();
        }
        else {
            MyOrder_wl.LoadExpressResult(msg);
        }
    },
    LoadExpressResult: function (msg) {
        if (msg.apiHomeOrderTrackingListResult.length > 0) {
            $("#wl_name").html(msg.yc_delivergoods_user_name);
            $("#wl_ydbh").html(msg.yc_express_num);

            var bodyList = "<dt>物流跟踪</dt>";
            $.each(msg.apiHomeOrderTrackingListResult, function (i, n) {
                bodyList += "<dd class=\"curr\">"
                            + n.orderTrackContent + "<span>" + n.yc_dis_time + "</span></dd>";
            });
            $(".transport-info").html(bodyList);
        }
        else {
            MyOrder_wl.LoadNoExpressResult();
        }
    },

    api_target: "com_cmall_familyhas_api_ApiKJTOrderTrace",
    api_input: { "order_code": "" },
    GetSeparateOrderList: function () {
        MyOrder_wl.api_input.order_code = $("#hid_order_code").val();
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_wl.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_detail + "?order_code=" + $("#hid_order_code").val())
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyOrder_wl.LoadSeparateOrderResult(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    OrderTraceInfos: [],
    LoadSeparateOrderResult: function (msg) {
        var orderTraceInfos = msg.orderTraceInfos;
        MyOrder_wl.OrderTraceInfos = orderTraceInfos;
        var oLength = orderTraceInfos.length;
        if (oLength > 0) {
            if (oLength == 1) {
                var item = orderTraceInfos[0];
                MyOrder_wl.LoadOneSeparateOrderResult(item)
            }
            else {
                //获取屏幕宽度
                var wid = $(window).width();
                var liW = 0;
                if (oLength == 2 || oLength == 3) {
                    $("#expressTab ul").attr("style", "width:" + (wid + 1 * oLength) + "px;");
                    liW = wid / oLength;
                }
                else {
                    $("#expressTab ul").attr("style", "width:" + (wid / 3 * oLength + 1 * oLength) + "px;");
                    liW = wid / 3;
                }


                var html = "";
                $(orderTraceInfos).each(function (i) {
                    html += '<li data-num="' + i + '" class="' + (i == 0 ? "curr" : "") + '" style="width:' + liW + 'px;">包裹' + (i + 1) + '</li>';
                });
                $("#expressTab ul").html(html).parent().show();
                MyOrder_wl.LoadOneSeparateOrderResult(orderTraceInfos[0]);
                $("#expressTab li").on("click", function () {
                    var num = $(this).data("num");
                    $(this).addClass("curr").siblings().removeClass("curr");
                    var item = MyOrder_wl.OrderTraceInfos[num];
                    if (item.expressList) {
                        if (item.expressList.length > 0) {
                            MyOrder_wl.LoadOneSeparateOrderResult(item);
                        }
                        else {
                            MyOrder_wl.LoadNoExpressResult();
                        }
                    }
                    else {
                        MyOrder_wl.LoadNoExpressResult();
                    }
                });

                slider.touchStart();
            }
        }
        else {
            MyOrder_wl.LoadNoExpressResult();
        }
    },
    LoadOneSeparateOrderResult: function (item) {
        if (item.expressList) {
            $("#wl_name").html(item.logisticse_name);
            $("#wl_ydbh").html(item.waybill);

            var bodyList = "<dt>物流跟踪</dt>";
            $.each(item.expressList, function (i, n) {
                bodyList += "<dd class=\"curr\">"
                            + n.context + "<span>" + n.time + "</span></dd>";
            });
            $(".transport-info").html(bodyList);
            $("#transport_name").css("margin-top", "45px");
        }
        else {
            MyOrder_wl.LoadNoExpressResult();
        }
    },
    LoadNoExpressResult: function () {
        var showstr = "<dt>物流跟踪</dt><dd class=\"no-data\">暂无物流信息</dd>"
        $(".transport-info").html(showstr);
        $("#transport_name").hide();
        $("#div_space").hide();

        if (!$("#expressTab").is(":hidden")) {
            $(".my-order").css("margin-top", "45px");
        }
    }
};