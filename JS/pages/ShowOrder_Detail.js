/*页面加载*/
$(document).ready(function () {
    //返回
    $(".back").on("click", function () {
        if (localStorage.getItem(g_const_localStorage.PagePathList) != null) {
            g_const_PagePathList = localStorage.getItem(g_const_localStorage.PagePathList).split(',');
        }
        if (g_const_PagePathList[g_const_PagePathList.length - 1].indexOf("ShowOrder_add.html") > -1) {
            window.location.replace(PageUrlConfig.BackTo(2));
        }
        else {
            window.location.replace(PageUrlConfig.BackTo());
        }
    });
    //晒单ID
    $("#hid_ShowOrderID").val(GetQueryString("ShowOrderID"));

    /*设置微信中的分享内容*/
    //try {
    //    SetWXShare("万万没想到，人品还能这么用！", "心得", g_const_share_pic);
    //}
    //catch (e) {

    //}
    if (!($(".share") == undefined)) {
        $(".share").on("click", function () {
            //APP中的分享
            SetWXShare(g_const_share_showorderdetail_title, g_const_share_showorderdetail_desc, g_const_share_pic);
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
                SetWXShare(g_const_share_showorderdetail_title, g_const_share_showorderdetail_desc, g_const_share_pic);
            }

        }
    }

    /*从数据库获取订单信息*/
    ShowOrderDetail.GetShowOrderByID();

});

/*主方法*/
var ShowOrderDetail = {
    /*查询详情*/
    GetShowOrderByID: function () {

        if ($("#hid_ShowOrderID").val() == "" || $("#hid_ShowOrderID").val() == "0" || isNaN($("#hid_ShowOrderID").val())) {
            Merchant_Group.Back();
        }
        else {
            //获取订单信息
            $.ajax({
                type: "POST",//用POST方式传输
                dataType: "json",//数据格式:JSON
                url: g_ego_api_url,//目标地址
                data: "t=" + Math.random() +
                     "&action=GetShowOrderByID" +
                     "&id=" + $("#hid_ShowOrderID").val(),
                success: function (json) {
                    //json = JSON.parse(json);
                    if (json.resultcode == 1) {
                        var msg = json.resultmessage[0];
                        if (msg.content_check == 100) {
                            ShowMesaage("晒单信息未通过审核！");
                            setTimeout(Merchant_Group.Back(), 3000);
                        }
                        else {
                            //头像
                            if (msg.buyernicknameavatar == "") {
                                $("#img_head").attr("src", g_const_default_head);
                            }
                            else {
                                $("#img_head").attr("src", msg.buyernicknameavatar);
                            }
                            //昵称
                            var buyernickname = msg.buyernickname;
                            if (buyernickname == "") {
                                //电话
                                var tel = msg.buyerphone;
                                if (tel.length >= 6) {
                                    tel = tel.substring(0, 3) + "*****" + tel.substring(tel.length - 3, 3);
                                }
                                buyernickname = tel;
                            }
                            $("#span_info_tel").html(buyernickname);

                            //商品信息【第二期 苹果iPhone6 金色63G】
                            var Product = "第" + msg.periodnum + "期 " + msg.productname;
                            $("#span_Product").html(Product);
                            //创建时间
                            $("#span_info_time").html(msg.awardcreatetime);
                            //参与次数
                            $("#i_canyu").html(msg.chipinnum);
                            //幸运号码
                            $("#i_awardcode").html(msg.awardcode);
                            //揭晓时间
                            $("#i_awardtime").html(msg.awardcreatetime);
                            //标题
                            $("#div_Content").append("<h3>" + unescape(msg.title.replace("?","")) + "</h3>");
                            //内容
                            $("#div_Content").append("<p>" + unescape(msg.memo) + "</p>");

                            var showpic = "";
                            if (msg.pic_check == "0" || msg.pic_check == "10") {

                                //图片
                                var pic = msg.pic.split('|');
                                $.each(pic, function (index, n) {
                                    if (n != "") {
                                        if (n.indexOf(g_const_pic_ym) == -1) {
                                            n = g_const_pic_ym + n;
                                        }
                                        $("#div_Content").append("<img src=" + n + ">");
                                    }
                                });
                            }
                        }
                    }
                    else {
                        ShowMesaage("未发现晒单信息");
                        
                        setTimeout(Merchant_Group.Back(), 3000);

                    }
                }
            });
        }
    },
};





