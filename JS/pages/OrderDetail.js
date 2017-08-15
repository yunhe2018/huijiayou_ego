var orderDetail = {
    SharePic: "",
    SetWXShare: function () {
        if (IsInWeiXin.check()) {
            var phoneno = "";
            var shareurl = "http://" + window.location.host;
            var shareparam = "";
            //shareparam += "pid=" + Product_Detail.api_input.productCode;
            //shareparam += "&fromshare=" + g_const_YesOrNo.YES.toString();
            shareparam += "&_r=" + Math.random().toString();
            //var smember = localStorage[g_const_localStorage.Member];
            //var member = null;
            //if (typeof (smember) != "undefined") {
            //    member = JSON.parse(smember);
            //}
            //if (member != null)
            //    shareparam += "&wxPhone=" + encodeURIComponent(member.Member.phone);
            WX_JSAPI.wx = wx;
            WX_JSAPI.wxparam.debug = false;
            WX_JSAPI.dataUrl = "";
            WX_JSAPI.desc = "别说我没告诉你，在惠家有1元就能中大奖！我是幸运帝，为1元夺宝代言";
            WX_JSAPI.imgUrl = orderDetail.SharePic;
            WX_JSAPI.link = shareurl + "?" + shareparam;
            WX_JSAPI.title = "好人品，看这里！我1元中大奖啦！不要羡慕和掌声~";
            WX_JSAPI.type = "";
            WX_JSAPI.LoadParam(g_const_wx_AllShare);
        }
    },
    LoadWxShareGuide: function () {
        if (IsInWeiXin.check()) {
            $("#wxShareGuide").show();
            $("#btnKnow").off("click").on("click", function () {
                $("#wxShareGuide").hide();
            });
            orderDetail.SetWXShare();
        }
    },
    Init: function () {
        UserLogin.Check(orderDetail.LoadOrderData);
    },
    ShowKeFu: function () {
        $("#btnKeFu").show().on("click", function () {
            Message.ShowConfirm("提示", "确定拨打电话" + g_const_Phone.sh + "？", "fbox_ftel", "呼叫", "orderDetail.KuFuPhone", "取消");
        });
        if ($("#btnConfirm").is(":hidden")) {
            $("#btn_back").show();
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
                data: "t=" + Math.random() + "&action=getorderdetail&oid=" + orderDetail.OrderNo+"&aid="+GetQueryString("aid"),
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
        var orderStatus = g_const_ego_orderStatus.getText(data.orderstatus, data.paygate, data.paygatetype, data.hjyorderstatus, data.cashawardstatus);
        //if (data.orderstatus == g_const_ego_orderStatus.RefundSucc && (data.totalmoney - data.couponmoney - data.accountmoney) == 0) {
        //    orderStatus = "退款成功";
        //}
        $("#orderStatusText").html('<label class="lab_01">订单状态:  </label><b>' + orderStatus + '</b>');
        $("#orderNo").html(data.orderno);
        $("#orderTime").html(data.ordertime);
        $("#involveTime").html(data.ordertime);
        //if ((data.totalmoney - data.accountmoney - data.couponmoney) == 0) {
        //    $("#orderTotalMoney").html(parseInt(data.totalmoney) + "夺宝币").show();
        //    $("#orderPayMoney").html(parseInt(data.accountmoney) + "夺宝币");
        //}
        //else {
        $("#orderPayMoney").html(parseInt(data.totalmoney - data.couponmoney) + "夺宝币");
        $("#orderTotalMoney").html(parseInt(data.totalmoney) + "夺宝币").show();
        //}
        if (data.couponmoney > 0) {
            $("#couponName").html(data.coupontitle + ":").parent().show();
            $("#couponMoney").html("-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;￥" + data.couponmoney);
        }
        $("#btnGoodsDetail").on("click", function () {
            var par = "perid=" + data.periodnum + "&pid=" + data.productid;
            g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
        });
        orderDetail.LoadGoodsInfo(data);
        orderDetail.LoadPayType(data);
        orderDetail.LoadState(data);

        if (!($(".share") == undefined)) {
            $(".share").on("click", function () {
                //APP中的分享
                SetWXShare(g_const_share_orderdetail_title, g_const_share_orderdetail_desc, g_const_share_pic, g_const_share_orderdetail_gourl + "?perid=" + data.periodnum + "&pid=" + data.productid);
            });
            if ((CheckMachine.versions.android || (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad)) && !CheckMachine.versions.inWeiXin) {
                var clientType = GetClientType();
                //if (clientType == ClientType.JYH_Android || clientType == ClientType.JYH_iOS) {
                if (clientType == ClientType.JYH_iOS) {
                    $(".share").show();
                }
                else {
                    $(".share").hide();

                }
            }
            else {
                $(".share").hide();
                if (CheckMachine.versions.inWeiXin) {
                    SetWXShare(g_const_share_orderdetail_title, g_const_share_orderdetail_desc, g_const_share_pic, g_const_share_orderdetail_gourl + "?perid=" + data.periodnum + "&pid=" + data.productid);
                }


            }
        }

    },
    LoadPayType: function (data) {
        console.log(data);
        if (parseInt(data.couponmoney) == 0 && (data.totalmoney - data.accountmoney) == 0) {
            $("#payTypeName").html("余额支付");
        }
        else {
            $("#payTypeName").html(g_pay_ment.getPayTypeText(data.paygate, data.paygatetype));
        }
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
                $("#btnConfirm").show().off("click").on("click", function () {
                    if (orderDetail.AddressId == "") {
                        ShowMesaage("请填写收货地址");
                        return false;
                    }
                    orderDetail.ConfirmAward(data);
                });
                $("#btn_back").show();
                break;
            case g_const_ego_orderStatus.GetSucc://领宝成功
                orderDetail.LoadGetSuccAddress(data);
                orderDetail.LoadWinInfo(data);
                orderDetail.ShowKeFu();
                //orderDetail.LoadLogisticsInfo(data);

                //暂时隐藏“晒单”按钮
                $("#btnShaiDan").hide();
                if (data.hjyorderstatus == g_const_orderStatus.YSH || data.hjyorderstatus == g_const_orderStatus.JYCG) {
                    //晒单功能放开后，此功能放开
                    $("#btnShaiDan").show().off("click").on("click", function () {
                        //跳转至发布晒单页
                        PageUrlConfig.SetUrl();
                        g_const_PageURL.GoTo(g_const_PageURL.ShowOrder_Add, "orderid=" + data.orderid);
                    });
                }
                $("#btn_back").show();
                // orderDetail.LoadWxShareGuide();
                if (data.hjyorderstatus == g_const_orderStatus.DSH) {
                    $("#btnReceive").show().off("click").on("click", function () {
                        $("#btnReceive").hide();
                        MyOrder_List_qrsh.api_input.order_code = data.hjyordercode;
                        orderDetail.ReceiveAward();
                        //MyOrder_List_qrsh.GetList();
                        
                    });
                }
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
    //获取物流信息
    LoadLogisticsInfo: function (data) {
        var hjyOrderNo = data.hjyorderno;
        var html = ['<div class="wuliuInfo_pre"><span></span></div><div class="wuliuInfo_pre_b"></div>']
        if (hjyOrderNo) {
            var api_orderdetal_target = "com_cmall_familyhas_api_ApiOrderDetails";
            var api_orderdetal_input = { "order_code": hjyOrderNo };
            var s_api_input = JSON.stringify(api_orderdetal_input);
            var obj_data = { "api_input": s_api_input, "api_target": api_orderdetal_target, "api_token": g_const_api_token.Wanted };
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
                        PageUrlConfig.SetUrl();
                        g_const_PageURL.GoTo(g_const_PageURL.Login);
                        return;
                    }
                    if (msg.resultcode != g_const_Success_Code_IN) {
                        ShowMesaage(msg.resultmessage);
                        return;
                    }
                }
                if (msg.resultCode == g_const_Success_Code) {
                    if (msg.apiHomeOrderTrackingListResult.length > 0) {
                        // msg.yc_delivergoods_user_name 送货商名称
                        //msg.yc_express_num 运单号
                        $.each(msg.apiHomeOrderTrackingListResult, function (i, n) {
                            //<b>010-23298934</b>
                            if (i == 0) {
                                html.push('<p>' + n.orderTrackContent + '</p><p>' + n.yc_dis_time + '</p>');
                            }
                        });
                    }
                    else {
                        html.push('<p>暂无物流信息</p>');
                    }
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
        else {
            html.push('<p>暂无物流信息</p><p></p>');
        }
        $("#logisticInfo").html(html.join(""));
        //$("#logistic").show().on("click", function () {
        //    var par = 'order_code=' + hjyOrderNo;
        //    g_const_PageURL.GoTo(g_const_PageURL.MyOrder_List_ckwl, par);
        //});
    },
    ConfirmAward: function (data) {
        var param = "&pid=" + data.productid + "&perid=" + data.periodnum + "&oid=" + data.orderno + "&addressid=" + orderDetail.AddressId + "&bname=" + $("#hidRealName").val() + "&baddress=" + $("#fullAddress").html() + "&code=" + $("#areaCode").val() + "&phone=" + $("#addressPhone").html();
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
                    $("#involveCount").html(msg[0].ChipinNum + "份");

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
    ReceiveAward: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=receiveaward&ordercode=" + MyOrder_List_qrsh.api_input.order_code,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                MyOrder_List_qrsh.GetList();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
           // ShowMesaage(g_const_API_Message["7001"]);
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
                        if (this.buyerphone == winBuyPhone && this.cashawardstatus!=11) {
                            chipinnum += parseInt(this.chipinnum);
                        }
                    });
                    var memberInfo = getMemberInfo(winBuyPhone);
                    $("#luckyCode").html(awardcode);
                    $("#luckyUser").html(memberInfo.nickname);
                    $("#luckyCount").html(chipinnum + "份");
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
//我的订单列表--确认收货
var MyOrder_List_qrsh = {
    api_target: "com_cmall_familyhas_api_ApiConfirmReceiveForFamily",
    api_input: { "order_code": "" },
    GetList: function () {
        //赋值
       // MyOrder_List_qrsh.api_input.order_code = $("#sel_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(MyOrder_List_qrsh.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_List_qrsh.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
               // orderDetail.ReceiveAward();
                //重新加载页面
                orderDetail.Init();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};
