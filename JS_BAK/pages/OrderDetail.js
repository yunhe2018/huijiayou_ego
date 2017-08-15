var orderDetail = {
    Init: function () {
        UserLogin.Check(orderDetail.LoadOrderData);
    },
    ShowKeFu: function () {
        $("#btnKeFu").show().on("click", function () {
            Message.ShowConfirm("提示", "确定拨打电话" + g_const_Phone.sh + "？", "fbox_ftel", "呼叫", "orderDetail.KuFuPhone", "取消");
        });
        if ($("#btnConfirm").is(":hidden")) {
            $("#btnKeFu").css({ bottom: "0.7rem" });
            $("#btn_back").css({ height: "4rem" }).show();
        }
    },
    OrderNo: GetQueryString("oid"),
    LoadOrderData: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
        }
        else {
            var purl = g_ego_api_url;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=getorderdetail&oid=" + orderDetail.OrderNo,
                dataType: g_APIResponseDataType
            });
            request.done(function (msg) {
                if (msg.orderDetail.length > 0) {
                    var data = msg.orderDetail[0];
                    orderDetail.LoadOrderDetail(data);
                }
                else {
                    ShowMesaage("订单有误，即将跳转到我的订单页");
                    window.setTimeout(function () {
                        g_const_PageURL.GoTo(g_const_PageURL.MyOrder_List);
                    }, 2000);
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    },
    //加载订单状态
    LoadOrderDetail: function (data) {
        $("#orderStatusText").html('<label class="lab_01">订单状态:  </label><b>' + g_const_ego_orderStatus.getText(data.orderstatus, data.paygate, data.paygatetype) + '</b>');
        $("#orderNo").html(data.orderno);
        $("#orderTime").html(data.ordertime);
        $("#involveTime").html(data.ordertime);
        $("#orderPayMoney").html(data.totalmoney);
        $("#btnGoodsDetail").on("click", function () {
            var par = "perid=" + data.periodnum + "&pid=" + data.productid;
            g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
        });
        orderDetail.LoadGoodsInfo(data);
        orderDetail.LoadPayType(data);
        orderDetail.LoadState(data);
    },
    LoadPayType: function (data) {
        $("#payTypeName").html(g_pay_ment.getPayTypeText(data.paygate, data.paygatetype));
    },
    LoadGoodsInfo: function (data) {
        $("#goodsImg").attr("src", (data.listimg || g_goods_Pic));
        $("#goodsName").html(data.productname);
        $("#periodNum").html("第" + data.periodnum + "期");
    },
    LoadState: function (data) {
        //订单状态
        switch (data.orderstatus) {
            case g_const_ego_orderStatus.Payed:
                $("#btn_back").hide();
                break;
            case g_const_ego_orderStatus.UserCancel://已取消
                $("#failText").show();
                $("#btn_back").hide();
                break;
            case g_const_ego_orderStatus.PaySucc://等待揭晓
                $("#btn_back").hide();
                break;
            case g_const_ego_orderStatus.AwardIng://揭晓中
                $("#discloseText").show();
                $("#btn_back").hide();
                break;
            case g_const_ego_orderStatus.UnAward://未中奖
                orderDetail.LoadWinInfo(data);
                $("#btn_back").hide();
                break;
            case g_const_ego_orderStatus.AwardSucc://夺宝成功
                orderDetail.LoadSelectAddress();
                orderDetail.LoadWinInfo(data);
                orderDetail.ShowKeFu();
                $("#btnConfirm").show().on("click", function () {
                    if (orderDetail.AddressId == "") {
                        ShowMesaage("请填写收货地址");
                        return false;
                    }
                    orderDetail.ConfirmAward(data);
                });
                $("#btnKeFu").css({ bottom: "4.7rem" });
                $("#btn_back").css({ height: "8rem" }).show();
                break;
            case g_const_ego_orderStatus.GetSucc://领宝成功
                orderDetail.LoadGetSuccAddress(data);
                orderDetail.LoadWinInfo(data);
                orderDetail.ShowKeFu();
                break;
            case g_const_ego_orderStatus.GetFail://领宝失败
                orderDetail.LoadWinInfo(data);
                orderDetail.ShowKeFu();
                $("#failText").show().html("您已放弃本期奖品领取<br />继续参与 更多奖品");
                break;
            case g_const_ego_orderStatus.RefundIng://退款中
                $("#periondEndText").show();
                orderDetail.ShowKeFu();
                break;
            case g_const_ego_orderStatus.RefundSucc://退款成功
                $("#periondEndText").show();
                orderDetail.ShowKeFu();
                break;
            case g_const_ego_orderStatus.RefundFail://退款失败
                $("#periondEndText").show();
                orderDetail.ShowKeFu();
                break;
        }
        orderDetail.LoadMyCode(data);
    },
    ConfirmAward: function (data) {
        var param = "&pid=" + data.productid + "&perid=" + data.periodnum + "&oid=" + data.orderno + "&addressid=" + orderDetail.AddressId + "&bname=" + $("#hidRealName").val() + "&baddress=" + $("#fullAddress").html() + "&code=" + $("#areaCode").val();
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=confirmAward" + param,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.ResultCode) {
                if (msg.ResultCode == "0") {
                    ShowMesaage(msg.Description);
                    window.setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                }
                else if (msg.ResultCode == "98") {
                    ShowMesaage(msg.Description);
                }
                else if (msg.ResultCode == "99") {
                    ShowMesaage(msg.Description);
                    window.setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //加载我购买的中奖码
    LoadMyCode: function (data) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getMyCodes&perid=" + data.periodnum + "&pid=" + data.productid + "&ono=" + orderDetail.OrderNo,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                if (msg.length > 0) {
                    var html = [];
                    //info
                    $("#involvePhone").html(msg[0].BuyerPhone);
                    $("#involveCount").html(msg[0].ChipinNum + "人次");

                    if (data.orderstatus == g_const_ego_orderStatus.Payed) {
                        //html.push("<label>参与号码:　</label>");
                        //html.push('<span onclick="window.location.reload();">点击查看参与号码</span>');
                        //$("#involveCode").hide().html(html.join("")).show().;
                        $("#involveInfo").show();
                        $("#canyuBtn").show();
                    }
                    else {

                        var codeList = msg[0].ChipinCodeList.split(',');
                        var l = codeList.length;
                        if (l > 0) {
                            //code
                            if (l > 3) {
                                html.push('<b class="partNums_open" data-state="close" id="myCodeList"></b>');
                            }
                            html.push("<label>参与号码:</label>");
                            $(codeList).each(function () {
                                html.push('<span>' + this + '</span>');
                            });
                            $("#involveCode").html(html.join("")).show();
                            $("#involveCode span:eq(0)").css({ "margin-left": "0.3rem" });
                            if (l > 3) {
                                $("#involveCode").css({ "height": "0.7rem" });
                            }
                            //绑定事件
                            $("#myCodeList").on("click", function () {
                                var state = $(this).data("state");
                                if (state == "close") {
                                    $("#involveCode").css({ "height": "auto" });
                                    $(this).data("state", "open").addClass("par_close");
                                } else {
                                    $("#involveCode").css({ "height": "0.7rem" });
                                    $(this).data("state", "close").removeClass("par_close");
                                }
                            });
                        }
                    }
                    $("#involveInfo").show();
                }
                else {
                    $("#tip").show().find("span").attr("class", "").html("您未参与本期抢宝活动！");
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadWinInfo: function (data) {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getwininfo&perid=" + data.periodnum + "&pid=" + data.productid,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                if (msg.winInfo.length > 0) {
                    var winBuyPhone = "";
                    var awardcode = "";
                    var chipinnum = 0;
                    var disClosetime = "";
                    $(msg.winInfo).each(function () {
                        if (this.orderstatus == "40" || this.orderstatus == "45" || this.orderstatus == "50") {
                            winBuyPhone = this.buyerphone;
                            awardcode = this.awardcode;
                            disClosetime = this.disclosetime;
                            return false;
                        }
                    });
                    $(msg.winInfo).each(function () {
                        if (this.buyerphone == winBuyPhone) {
                            chipinnum += parseInt(this.chipinnum);
                        }
                    });
                    $("#luckyCode").html(awardcode);
                    $("#luckyUser").html(CutPhone(winBuyPhone));
                    $("#luckyCount").html(chipinnum);
                    $("#discloseTime").html(disClosetime);
                    $("#winInfo").show();
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    AddressId: "",
    LoadSelectAddress: function () {
        orderDetail.AddressId = "";
        if (localStorage[g_const_localStorage.OrderAddress] != null) {
            orderDetail.AddressId = localStorage[g_const_localStorage.OrderAddress];
        }
        if (orderDetail.AddressId) {
            var purl = g_INAPIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=getaddressbyid&addressid=" + orderDetail.AddressId,
                dataType: "json"
            });
            request.done(function (msg) {
                if (msg.resultcode != g_const_Success_Code_IN) {
                    orderDetail.LoadAddressDefault();
                }
                else if (msg.resultcode == g_const_Success_Code_IN) {
                    if (msg.id) {
                        $("#realName").html(msg.name + '<span class="tel" id="addressPhone"></span>');
                        $("#hidRealName").val(msg.name);
                        $("#addressPhone").html(msg.mobile);
                        $("#fullAddress").html(msg.provinces + " " + msg.street);
                        $("#areaCode").val(msg.areaCode);
                        $("#address").show();
                        $("#address").on("click", function () {
                            localStorage["fromOrderDetail"] = '1';
                            var par = 'oid=' + GetQueryString("oid");
                            g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
                        });
                        localStorage[g_const_localStorage.OrderAddress] = msg.id;
                        orderDetail.AddressId = msg.id;
                        $("#selectAddress").hide();
                    }
                    else {
                        orderDetail.AddressId = "";
                        $("#selectAddress").show().on("click", function () {
                            localStorage["fromOrderDetail"] = '1';
                            var par = "oid=" + orderDetail.OrderNo;
                            g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
                        });
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
        else {
            orderDetail.LoadAddressDefault();
        }
    },
    LoadAddressDefault: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressdefault",
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode != g_const_Success_Code_IN) {
                //存在错误处理错误
                orderDetail.AddressId = "";
                $("#selectAddress").show().on("click", function () {
                    localStorage["fromOrderDetail"] = '1';
                    var par = "oid=" + orderDetail.OrderNo + "&login=1&addressid=0";
                    g_const_PageURL.GoTo(g_const_PageURL.AddressEdit, par);
                });
            }
            else if (msg.resultcode == g_const_Success_Code_IN) {
                if (msg.id) {
                    $("#realName").html(msg.name + '<span class="tel" id="addressPhone"></span>');
                    $("#hidRealName").val(msg.name);
                    $("#addressPhone").html(msg.mobile);
                    $("#fullAddress").html(msg.provinces + " " + msg.street);
                    $("#areaCode").val(msg.areaCode);
                    $("#address").show().on("click", function () {
                        localStorage["fromOrderDetail"] = '1';
                        var par = 'oid=' + GetQueryString("oid");
                        g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
                    });
                    localStorage[g_const_localStorage.OrderAddress] = msg.id;
                    orderDetail.AddressId = msg.id;
                    $("#selectAddress").hide();
                }
                else {
                    orderDetail.AddressId = "";
                    $("#selectAddress").show().on("click", function () {
                        localStorage["fromOrderDetail"] = '1';
                        var par = "oid=" + orderDetail.OrderNo + "&login=1&addressid=0";
                        g_const_PageURL.GoTo(g_const_PageURL.AddressEdit, par);
                    });
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadGetSuccAddress: function (data) {
        $("#realName").html(data.buyername + '<span class="tel" id="addressPhone"></span>');
        $("#hidRealName").val(data.buyername);
        $("#addressPhone").html(data.buyerphone);
        $("#fullAddress").html(data.buyeraddress);
        $("#areaCode").val(data.buyeraddresscode);
        $("#address").show();
        $("#addressPoint").removeClass("apoint");
    },
    KuFuPhone: function () {
        if (IsInWeiXin.check()) {
            window.location = "tel:" + g_const_Phone.sh + "mp.weixin.qq.com";
        }
        else {
            window.location = "tel:" + g_const_Phone.sh;
        }
    }
};
