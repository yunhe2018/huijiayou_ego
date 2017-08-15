var MyOrders = {
    Init: function () {
        UserLogin.Check(MyOrders.LoadData);
        $(window).on("scroll", function () {
            var bottom = $(document).height() - $(window).height() - $(window).scrollTop();
            if (bottom == 0 && $("#theLast").is(":hidden")) {
                ++MyOrders.PageIndex;
                MyOrders.LoadData();
            }
        });
    },
    PageSize: 10,
    PageIndex: 0,
    LoadData: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
        } else {
            var purl = g_ego_api_url;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=myawards&pi=" + MyOrders.PageIndex + "&ps=" + MyOrders.PageSize,
                dataType: g_APIResponseDataType
            });

            request.done(function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Error_Code.UnLogin) {
                        PageUrlConfig.SetUrl();
                        g_const_PageURL.GoTo(g_const_PageURL.Login);
                    }
                } else {
                    if (MyOrders.PageIndex == 0 && msg.orderList.length == 0) {
                        $("#noResult").show();
                    }
                    else {
                        MyOrders.LoadResult(msg.orderList);
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    },
    LoadResult: function (data) {
        $("#orderList").show();
        if (data.length > 0) {
            var html = [];
            $(data).each(function () {
                var orderStatus = g_const_ego_orderStatus.getText(this.orderstatus, this.paygate, this.paygatetype, this.hjyorderstatus, this.cashawardstatus);
                //if (this.orderstatus == g_const_ego_orderStatus.RefundSucc && (this.totalmoney - this.couponmoney - this.accountmoney) == 0) {
                //    orderStatus = "退款成功";
                //}
                var orderStatusClass = "";
                if (this.orderstatus == g_const_ego_orderStatus.UserCancel || this.orderstatus == g_const_ego_orderStatus.UnAward) {
                    orderStatusClass = "cl999";
                }
                html.push('<li class="order_atate_details"><div class="order_state"><label class="lab_01">订单编号:  </label><b>' + this.orderno + '</b><div class="order_state_tip ' + orderStatusClass + '">' + orderStatus + '</div></div>');
                html.push('<div class="order_details clearfix" onclick="MyOrders.GoToOrderDetail(\'' + this.orderno + '\',\'' + this.awardid + '\')"><div class="order_img fl"><img src="' + (this.listimg || g_goods_Pic) + '"></div><div class="order_txt fl"><p class="order_txt_nm">' + this.productname + '</p><p class="qi">第' + this.periodnum + '期</p></div></div>');
                html.push('<div class="order_list_btm"><label class="lab_01">实付款:  </label><b>' + (this.totalmoney - this.couponmoney).toFixed(0) + '</b>');
                if (this.newperiodnum != "") {
                    html.push('<div class="btm_btn" onclick="MyOrders.GoToNewPeriod(\'' + this.newperiodnum + '\',\'' + this.productid + '\')">继续抢购</div>');
                }
                //if (this.orderstatus == "50") {
                //    html.push('<div class="btm_btn" onclick="MyOrders.GoLogistics(\'' + this.orderno + '\')">查看物流</div>');
                //}
                //if (this.orderstatus == "3" || this.orderstatus == "0" || this.orderstatus == "1") {
                //    html.push('<div class="btm_btn" onclick="MyOrders.GoPay(\'' + this.orderno + '\')">去支付</div>');
                //}
                html.push('</div></li>');
            });
            $("#orderList").append(html.join(""));
        }
        else {
            $(window).on("scroll", function () {
                return false;
            });
            $("#theLast").show();
        }
    },
    GoToOrderDetail: function (oid,aid) {
        var par = "oid=" + oid + "&u=a" + "&aid=" + aid;
        g_const_PageURL.GoTo(g_const_PageURL.MyOrder_detail, par);
    },
    GoToOrderConfirm: function (perid, pid, sid) {
        var par = "perid=" + perid + "&pid=" + pid + "&sid=" + sid + "&num=1";
        g_const_PageURL.GoTo(g_const_PageURL.OrderConfirm, par);
    },
    GoToNewPeriod: function (newperiodNum, pid) {
        var par = "perid=" + newperiodNum + "&pid=" + pid;
        g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
    },
    GoPay: function (orderNo) {
        var par = "order_code=" + orderNo;
        g_const_PageURL.GoTo(g_const_PageURL.MyOrder_pay, par);
    },
    GoLogistics: function (orderNo) {
        var par = "order_code=" + orderNo;
        g_const_PageURL.GoTo(g_const_PageURL.MyOrder_List_ckwl, par);
    },
};
