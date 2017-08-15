var MyOrders = {
    Init: function () {
        UserLogin.Check(MyOrders.LoadData);
    },
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
                data: "t=" + Math.random() + "&action=myorders",
                dataType: g_APIResponseDataType
            });

            request.done(function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Error_Code.UnLogin) {
                        PageUrlConfig.SetUrl();
                        g_const_PageURL.GoTo(g_const_PageURL.Login);
                    }
                } else {
                    MyOrders.LoadResult(msg.orderList);
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    },
    LoadResult: function (data) {
        $("#orderList").empty();
        if (data.length > 0) {
            var html = [];
            console.log(data);
            $(data).each(function () {
                html.push('<li class="order_atate_details"><div class="order_state"><label class="lab_01">订单编号:  </label><b>' + this.orderno + '</b><div class="order_state_tip">' + g_const_ego_orderStatus.getText(this.orderstatus, this.paygate, this.paygatetype) + '</div></div>');
                html.push('<div class="order_details clearfix" onclick="MyOrders.GoToOrderDetail(\'' + this.orderno + '\')"><div class="order_img fl"><img src="' + (this.listimg || g_goods_Pic) + '"></div><div class="order_txt fl"><p class="order_txt_nm">' + this.productname + '</p><p class="qi">第' + this.periodnum + '期</p></div></div>');
                html.push('<div class="order_list_btm"><label class="lab_01">实付款:  </label><b>' + this.totalmoney + '</b>');
                if (this.newperiodnum != "") {
                    html.push('<div class="btm_btn" onclick="MyOrders.GoToNewPeriod(\'' + this.newperiodnum + '\',\'' + this.productid + '\')">继续抢购</div>');
                }
                if (this.orderstatus == "3") {
                    html.push('<div class="btm_btn" onclick="MyOrders.GoPay(\'' + this.orderno + '\')">去支付</div>');
                }
                html.push('</div></li>');
            });
            $("#orderList").html(html.join("")).show();
        }
        else {
            $("#noResult").show();
        }
    },
    GoToOrderDetail: function (oid) {
        var par = "oid=" + oid;
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
};
