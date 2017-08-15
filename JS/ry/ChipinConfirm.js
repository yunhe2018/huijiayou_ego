
var _wxJsApiParam = "";
var _orderNo = "";
var payMoney = 0;
var OrderTotalMoney = 0;
var sumchipin_sit;
var currperiodnumstatus_sit;
var chipinlast_sit;

$(function () {
    if (GetQueryString("resultmsg") != "") {
        var msggg = decodeURI(GetQueryString("resultmsg"));
        try{
            msggg=JSON.parse(msggg);
        }
        catch(e){}
        if (!(msggg.errMsg == undefined)) {
            orderConfirm.ShowMesaage("付款失败啦！"+msggg.errMsg);
        }
        else {
            //orderConfirm.ShowMesaage(decodeURI(GetQueryString("resultmsg")));
            orderConfirm.ShowMesaage("付款成功");
        }
    }
    orderConfirm.Init();
    
});

var orderConfirm = {
    //当前期状态
    currliststatus: 0,
    //最后投注ID[作废]
    lastchipinid: 0,
    //未显示过的投注[作废]
    noshowchipin: [],
    //当前期队员
    teamuser: [],
    //根目录地址
    headpicRootPath: "/act/ry/",
    //团队赔率
    teampv: 0,
    //mvp赔率
    mvppv: 0,
    leftteamid: 0,
    rightteamid: 0,
    leftteamname: 0,
    rightteamname: 0,
    Init: function () {
        //UserLogin.Check(orderConfirm.InitEvent);
        orderConfirm.checklogin(orderConfirm.InitEvent);
        //获取当前期
        orderConfirm.Loadcurrperiodnum();

    },
    OrderForm: {
        pv:0,
        periodnum: 0,
        playtype: 0,
        content: 0,
        paymoney: 1,
        paygate: "762",
        paygatetype: "3",
        IpAddress: "",
        chipinobj:""
    },
    InitEvent: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
        };
        //左队赢
        $("#btn_leftteamwin").on("click", function () {
            orderConfirm.SelPayMoney("team", orderConfirm.leftteamid, orderConfirm.leftteamname);
        });
        //右队赢
        $("#btn_rightteamwin").on("click", function () {
            orderConfirm.SelPayMoney("team", orderConfirm.rightteamid, orderConfirm.rightteamname);
        });

        //支付
        $("#btn_pay").on("click", function () {
            $("#btn_pay").hide();
            $("#btn_pay_wait").show();
            //orderConfirm.createchipin();
            orderConfirm.checklogin(orderConfirm.createchipin);
        });
        //我的投注
        $("#show_mychipin").on("click", function () {
            $("#img_head").attr("src","img/tabelHead01.jpg");
            //$("#tbody_mychipin").html("");
            $("#table_sumchipin").hide();
            //orderConfirm.mychipin();
            orderConfirm.checklogin(orderConfirm.mychipin);

        });
        //投注统计
        $("#show_sumchipin").on("click", function () {
            $("#img_head").attr("src","img/tabelHead02.jpg");
            //$("#tbody_sumchipin").html("");
            $("#table_mychipin").hide();
            orderConfirm.sumchipin();
            //orderConfirm.checklogin(orderConfirm.sumchipin);

        });

        //选择投注金额
        $("#selpaymoney li").off("click").on("click", function () {
            //去除全部选中
            $("#selpaymoney li").each(function(){
                $(this).html("<img src=\"" + orderConfirm.headpicRootPath + "img/" + $(this).attr("id") + ".png\" />");
            });
            //选中
            $(this).html("<img src=\"" + orderConfirm.headpicRootPath + "img/" + $(this).attr("id") + "_curr.png\" />");
            orderConfirm.OrderForm.paymoney = parseFloat($(this).attr("paymoney")).toFixed(2);
        });

        //关闭弹层
        $(".close").on("click", function () {
            $("#btn_pay").show();
            $("#btn_pay_wait").hide();

            $("#div_selmoney").hide()
        });

        
    },
    PayType: "",
    //SelectPayType: function (obj) {
    //    $(obj).show().find("div[class=radio]").addClass("on");
    //},
    //检查登录
    ShowMesaage: function (message) {
        $(".tip span").html(message);
        $(".tip span").fadeIn(1000);

        window.setTimeout(function () {
            $(".tip span").fadeOut(3000);
        }, 3000);
    },
    checklogin: function (callback) {
        if (typeof (callback) == "function") {
            UserLogin.Check(callback);
        }
    },
    //获取当前期
    Loadcurrperiodnum: function () {

        var purl = g_tz_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=sellperiod",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            orderConfirm.OrderForm.periodnum = msg.periodnum;
            orderConfirm.currliststatus = msg.status;
            //读取本期队信息
            orderConfirm.LoadTeam();

            //停止销售后，停止定时器
            if (parseInt(orderConfirm.currliststatus) < 10) {
                currperiodnumstatus_sit = window.setTimeout(orderConfirm.Loadcurrperiodnum, 3000);
            }

        });
        request.fail(function (jqXHR, textStatus) {
            orderConfirm.ShowMesaage(g_const_API_Message["7001"]);
        });

    },
    //读取本期队信息
    LoadTeam: function () {

        var purl = g_tz_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getteam&periodnum=" + orderConfirm.OrderForm.periodnum,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            //保存队员信息
            orderConfirm.teamuser = msg;
            //组织页面显示
            var leftteam = "";
            var rightteam = "";
            var teamid_t = 0;
            var otherteam = false;
            var headpic = "";

            $.each(msg.teamuserlist, function (i, n) {
                orderConfirm.teampv = n.teampv;
                orderConfirm.mvppv = n.mvppv;
                headpic = orderConfirm.headpicRootPath + "headpic/" + n.headpic;
                if (i > 0 && parseInt(teamid_t) != parseInt(n.team_id) || otherteam) {
                    otherteam = true;
                    orderConfirm.rightteamid = n.team_id;
                    orderConfirm.rightteamname = n.teamname;
                    rightteam += "<li><div class=\"pic\"><img src=\"" + headpic + "\" /></div>"
                    + "<div class=\"name\"><label>" + n.name + "</label><span>ID：" + n.gameid + "</span></div>"
                    + "<div class=\"ya\" onclick=\"orderConfirm.SelPayMoney('mvp', '" + n.user_id + "', '" + n.name + "');\">押 MVP</div></li>";

                }
                else {
                    orderConfirm.leftteamid = n.team_id;
                    orderConfirm.leftteamname = n.teamname;
                    leftteam += "<li><div class=\"pic\"><img src=\"" + headpic + "\" /></div>"
                        + "<div class=\"name\"><label>" + n.name + "</label><span>ID：" + n.gameid + "</span></div>"
                        + "<div class=\"ya\" onclick=\"orderConfirm.SelPayMoney('mvp', '" + n.user_id + "', '" + n.name + "');\">押 MVP</div></li>";
                }

                teamid_t = n.team_id;
            });
            $("#leftteamuser").html(leftteam);
            $("#rightteamuser").html(rightteam);

            //我的投注
            if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
                if (!($("#table_mychipin").is(":hidden"))) {
                    orderConfirm.mychipin();
                }
            }

        });
        request.fail(function (jqXHR, textStatus) {
            orderConfirm.ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //获取当前期最后投注
    chipinlast: function () {
        var purl = g_tz_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=chipinlast",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            //获取投注内容
            var showname = "";
            $.each(orderConfirm.teamuser, function (i, n) {
                switch(msg.playtype){
                    case "1"://整队赢
                        if (msg.content == n.team_id) {
                            showname = n.teamname;
                        }
                        break;
                    case "2"://mvp
                        if (msg.content == n.user_id) {
                            showname = n.name;
                        }
                        break;
                }
            });
            if (msg.phone.length == 11) {
                var phone = msg.phone.Substring(0, 3) + "****" + msg.phone.Substring(7, 4)
                $("#chipinlast").html(phone + "：押" + showname + " " + msg.paymoney + " 元");
                $("#chipinlast").show();
            }
            //3秒后隐藏
            window.setTimeout($("#chipinlast").hide(), 3000);

            if (parseInt(orderConfirm.currliststatus) < 10) {
                chipinlast_sit = window.setTimeout(orderConfirm.chipinlast, 3000);
            }

        });
        request.fail(function (jqXHR, textStatus) {
            orderConfirm.ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //获取我的投注
    mychipin: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
            return;
        }
        var purl = g_tz_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=chipinlist&periodnum=" + orderConfirm.OrderForm.periodnum,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            //获取投注内容
            var showmychipin = "";
            $.each(msg, function (i, n) {
                var showname = "";
                var pv = 0;
                $.each(orderConfirm.teamuser, function (ii, nn) {
                    switch (msg.playtype) {
                        case "1"://整队赢
                            pv = orderConfirm.teampv;
                            if (msg.content == nn.team_id) {
                                showname = nn.teamname;
                            }
                            break;
                        case "2"://mvp
                            pv = orderConfirm.mvp;
                            if (msg.content == nn.user_id) {
                                showname = nn.name;
                            }
                            break;
                    }
                });
                showmychipin += "<tr><td>" + showname + "</td>"
                        +"<td>"+parseInt(n.paymoney)+"</td>"
                        + "<td>1:"+pv+"</td>"
                        + "<td>" + n.payendtime + "</td></tr>";
            });
            $("#tbody_mychipin").html(showmychipin);
            $("#table_mychipin").show();
        });
        request.fail(function (jqXHR, textStatus) {
            orderConfirm.ShowMesaage(g_const_API_Message["7001"]);
        });

    },
    //获取投注统计
    sumchipin: function () {
        var purl = g_tz_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=chipinsum&periodnum=" + orderConfirm.OrderForm.periodnum,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            //获取投注内容
            var totlepaymoney = 0;
            var showmychipin = "";
            $.each(msg.chipinsum, function (i, n) {
                showmychipin += "<tr><td>" + n.rowno + "</td><td>" + n.name + "</td>"
                        + "<td>" + n.con + "</td>"
                        + "<td>" + parseInt(n.pay) + "</td></tr>";
                totlepaymoney += parseInt(n.pay);
            });
            $("#tbody_sumchipin").html(showmychipin);

            if ($("#table_mychipin").is(":hidden")) {
                $("#table_sumchipin").show();
                $("#table_mychipin").hide();
            }

            //显示总投注额
            $("#p_totalchipoinmoney").html("￥" + totlepaymoney);
            if (parseInt(orderConfirm.currliststatus) < 10) {

                sumchipin_sit = window.setTimeout(orderConfirm.sumchipin, 5000);
            }

        });
        request.fail(function (jqXHR, textStatus) {
            orderConfirm.ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //判断期状态
    checkperiodstatus:function(){
        if (orderConfirm.currliststatus != "1") {
            switch (orderConfirm.currliststatus) {
                case 1:
                    return false
                    break;
                case 0:
                    orderConfirm.ShowMesaage("还未开始，请耐心等待！");
                    return true;
                    break;
                case 5:
                    orderConfirm.ShowMesaage("暂停投注，请耐心等待！");
                    return true;
                    break;
                case 10:
                case 15:
                case 20:
                case 30:
                case 40:
                    orderConfirm.ShowMesaage("投注结束啦！");
                    return true;
                    break;
            }
            return true;
        }
    },
    //选取投注金额
    SelPayMoney: function (playtype, contentid, showname) {
        if (orderConfirm.checkperiodstatus()) {
            return;
        }

        orderConfirm.OrderForm.content = contentid;
        orderConfirm.OrderForm.chipinobj = escape(showname);

        switch (playtype) {
            case "team":
                orderConfirm.OrderForm.playtype = 1;
                orderConfirm.OrderForm.pv = orderConfirm.teampv;
                break;
            case "mvp":
                orderConfirm.OrderForm.playtype = 2;
                orderConfirm.OrderForm.pv = orderConfirm.mvppv;
                break;
        }
        $("#selname").html(showname);
        $("#selpv").html("1 : "+orderConfirm.OrderForm.pv);
        $("#div_selmoney").show();
    },
    //投注
    createchipin: function () {
        if (orderConfirm.checkperiodstatus()) {
            return;
        }

        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
            return;
        }

        if (isNaN(orderConfirm.OrderForm.paymoney) || parseFloat(orderConfirm.OrderForm.paymoney)<=0) {
            orderConfirm.ShowMesaage("请选择投注金额");
            $("#btn_pay").show();
            $("#btn_pay_wait").hide();

            return false;
        }
        //只有微信支付
        //orderConfirm.OrderForm.paygate = orderConfirm.OrderForm.PayGate;
        //orderConfirm.OrderForm.paygatetype = orderConfirm.OrderForm.PayGateType;
        //if (orderConfirm.OrderForm.paymoney < 1) {
        //    orderConfirm.ShowMesaage("订单金额最小为1元");
        //    return false;
        //}
        //try {
        //    //搜狐接口获得客户端IP 
        //    var ILData_group = returnCitySN["cid"] + "|" + returnCitySN["cip"] + "|" + returnCitySN["cname"] //城市ID+“|”+IP+“|”+所在地名称;
        //    orderConfirm.OrderForm.IpAddress = ILData_group;
        //} catch (e) {
        //    orderConfirm.OrderForm.IpAddress = "";
        //}
        var param = "";
        for (var i in orderConfirm.OrderForm) {
            var v = orderConfirm.OrderForm[i];
            param += "&" + i + "=" + v;
        }
        var purl = g_tz_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=createchipin" + param,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode == "0") {
                if (IsInWeiXin.check()) {
                        //if ($("#hid_wxpaytype").val() == "1") {
                        //    //本地jsapi处理
                        //    _wxJsApiParam = JSON.parse(msg.resultmessage).jsapiparam;
                        //    Message.Operate('', "divAlert");
                        //    callpay();
                        //}
                        //else {
                        //跳转网关处理
                        window.location.replace(msg.resultmessage)
                        //}
                }
                else {
                    orderConfirm.ShowMesaage("请在微信客户端中打开！");
                    //暂不支持支付宝
                    //window.location.replace(msg.resultmessage);
                }
            }
            //else if (msg.resultcode == "88")//已支付订单
            //{
            //    window.location.replace("/Order/OrderSuccess.html?paytype=wxpay&orderid=" + _orderNo + "&t=" + Math.random());
            //}
            else {
                $("#btn_pay").show();
                $("#btn_pay_wait").hide();

                orderConfirm.ShowMesaage(msg.resultmessage);
            }

            //if (msg.resultCode) {
            //    orderConfirm.ShowMesaage(msg.resultMessage);
            //} else {
            //    var orderCode = msg.OrderNo;
            //    _orderNo = orderCode;
            //    orderConfirm.GoPay(orderCode);
            //}
        });
        request.fail(function (jqXHR, textStatus) {
            $("#btn_pay").show();
            $("#btn_pay_wait").hide();

            orderConfirm.ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //提交网关
    GoPay: function (orderNo) {
        var purl = g_tz_api_url;//"/Ajax/rhHandler.ashx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=&OrderNo=" + orderNo,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode == "0") {
                if (IsInWeiXin.check()) {
                    //if ($("#hid_wxpaytype").val() == "1") {
                    //    //本地jsapi处理
                    //    _wxJsApiParam = JSON.parse(msg.resultmessage).jsapiparam;
                    //    Message.Operate('', "divAlert");
                    //    callpay();
                    //}
                    //else {
                        //跳转网关处理
                        window.location.replace(msg.resultmessage)
                    //}

                }
                else {
                    window.location.replace(msg.resultmessage);
                }
                orderConfirm.ClearCoupon();
            }
            else {
                $("#btn_pay").show();
                $("#btn_pay_wait").hide();

                orderConfirm.ShowMesaage(msg.resultmessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            $("#btn_pay").show();
            $("#btn_pay_wait").hide();

            orderConfirm.ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

