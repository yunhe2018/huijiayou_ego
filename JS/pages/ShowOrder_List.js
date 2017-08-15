//滑动屏幕加载数据
var _PageNo = 0;
var _stop = true;
var OrderStr = "";
var _paytype = ""

var scrollHandler = function () {
    //隐藏下拉回调层
    $("#div_scrolldown").hide();

    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop())+10;
    if ($(document).height() <= totalheight) {
        if (_stop == true) {
            var jiazai = false;

            if ((parseInt($("#sel_nextPage").val()) + 1) <= parseInt($("#hid_sumpage").val())) {
                jiazai = true;
            }

            if (jiazai) {
                $("#waitdiv").show();
                _stop = false;
                _PageNo = (parseInt(_PageNo) + 1).toString();
                $("#sel_nextPage").val(_PageNo);
                //加载下页
                ShowOrderList.GetShowOrder();
                if ((parseFloat($(window).scrollTop()) / parseFloat($(window).height())) >= 3) {
                    //显示“至顶部”
                    $('.scroll-top').show();
                }
                else {
                    $('.scroll-top').hide();
                }
            }
            //else {
            //    //没有下一页了
            //    $("#div_nomore").show();
            //    //2秒后隐藏
            //    setTimeout($("#div_nomore").hide(), 3000);

            //}
        }
        else {
            $("#waitdiv").hide();
        }
    }
    else {
        $("#waitdiv").hide();
    }
};

/*页面加载*/
$(document).ready(function () {

   
    UseAppFangFa.CaoZuo("refresh", "", "true");

    fontSize();
    window.onresize = function () { fontSize(); };

    //个人时传手机号，不传则显示全部
    if (GetQueryString("seemy") != "") {
        UserLogin.Check(ShowOrderList.GetShowOrder);
        $("#goback").show();

        $("#daohangmenu").hide();
    }
    else {
        /*从数据库获取订单信息*/
        ShowOrderList.GetShowOrder();
        $("#goback").hide();
    }


    //返回
    $(".back").on("click", function () {
        Merchant_Group.Back();
    });
    //返回顶部
    $('.scroll-top').on('click', function () {
        document.body.scrollTop = 0;
        $(this).hide();
    });

    var clientType = GetClientType();
    if (!(clientType == ClientType.JYH_Android || clientType == ClientType.JYH_iOS)) {
        //下拉重新加载
        ScrollReload.Listen("div_ShowOrder_List", "div_scrolldown", "ShowOrderlist", "6", ShowOrderList.ScollDownCallBack);

    }
    
    //上拉加载
    $(window).scroll(scrollHandler);

    ///*设置微信中的分享内容*/
    //try{
    //    SetWXShare("1元夺宝是假的？带你揭晓真面目", "生活不止有远方，还有惠家有1元夺宝的真实体验", g_const_share_pic);
    //}
    //catch(e){

    //}

    if (!($(".share") == undefined)) {
        $(".share").on("click", function () {
            //APP中的分享
            SetWXShare(g_const_share_showorderlist_title, g_const_share_showorderlist_desc, g_const_share_pic);
        });
        if ((CheckMachine.versions.android || (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad)) && !CheckMachine.versions.inWeiXin) {
            var clientType = GetClientType();
            if (clientType == ClientType.JYH_Android || clientType == ClientType.JYH_iOS) {
                if (GetQueryString("seemy") != "") {
                    $("#goback").show();
                }
                else {
                    $("#goback").hide();
                }
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

            }
        }
        else {
            $(".share").hide();
            if (CheckMachine.versions.inWeiXin) {
                $("#addrHeader").hide();
                SetWXShare(g_const_share_showorderlist_title, g_const_share_showorderlist_desc, g_const_share_pic);
               
            }

        }
    }

    

});


//自适应rem初始化设置
function fontSize() {
    try{
        if (document.documentElement.clientWidth < 640) { //initial-scale=0.5是缩小一倍后适应屏幕宽。
            document.documentElement.style.fontSize = 10 * (document.documentElement.clientWidth / 320) + 'px';
        } else {
            document.documentElement.style.fontSize = '20px';
        }
    }
    catch(e){
    
    }
}


/*主方法*/
var ShowOrderList = {
    /*按页码加载*/
    GetShowOrder: function () {
        if (GetQueryString("seemy") != "") {
            if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                PageUrlConfig.SetUrl();
                g_const_PageURL.GoTo(g_const_PageURL.Login);
            }
            else {
                $("#phone").val(UserLogin.LoginName);
            }
        }
        $("#div_scrolldown").hide();


        _stop = false;
        if (_PageNo>0 && _PageNo >= parseInt($("#hid_sumpage").val())) {
            //没有下一页了
            $("#div_nomore").show();
            //2秒后隐藏
            setTimeout($("#div_nomore").hide(), 2000);
        }
        else {
            $("#waitdiv").hide();
            //获取订单信息
            $.ajax({
                type: "POST",//用POST方式传输
                dataType: "json",//数据格式:JSON
                url: g_ego_api_url,//目标地址
                data: "t=" + Math.random() +
                        "&action=GetShowOrderListByPageNo" +
                        "&phone=" + $("#phone").val() +
                        "&PageSize=10"+
                        "&PageNo=" + _PageNo,
                success: function (json) {
                    //json = JSON.parse(json);
                    if (json.resultcode == 1) {
                        if (json.sumpage > 0) {
                            //记录总页数
                            $("#hid_sumpage").val(json.sumpage);


                            var liStr = "";
                            $.each(json.resultmessage, function (i, msg) {

                                //头像
                                var head = "";
                                if (msg.buyernicknameavatar == "") {
                                    head = g_const_default_head;
                                }
                                else {
                                    head = msg.buyernicknameavatar;
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
                                //标题
                                var title = unescape(msg.title);
                                //内容
                                var memo = unescape(msg.memo);
                                //晒单时间
                                var createtime = unescape(msg.createtime);

                                //图片
                                var showpic = "";
                                if (msg.pic_check == "0" || msg.pic_check == "10") {

                                    var pic = msg.pic.split('|');
                                    if (pic.length > 0) {
                                        showpic = "<ul class=\"shaidan_info_pic clearfix\">"
                                        $.each(pic, function (index, n) {
                                            if (index < 3 && n!="") {
                                                if (n.indexOf(g_const_pic_ym) == -1) {
                                                    n = g_const_pic_ym + n;
                                                }
                                                showpic += "<li><div><img id=\"img_" + msg.id + "_" + index + "\" src=\"" + n + "\" /></div></li>";
                                            }
                                        });
                                        showpic += "</ul>";
                                    }
                                }
                                else {

                                }

                                //组织显示内容
                                liStr = "<li class=\"clearfix\" >"
                                    + "<div class=\"shaidan_head\">"
                                        + "<img src=\"" + head + "\" />"
                                    + "</div>"
                                    + "<div class=\"shaidan_info\" onclick=\"ShowOrderList.GoToDetail("+msg.id+")\">"
                                        + "<div class=\"shaidan_info_01 clearfix\"><span class=\"tel\">" + buyernickname + "</span><span class=\"date\">" + createtime + "</span></div>"
                                        + "<h3>" + title + "</h3>"
                                        + "<p class=\"shaidan_info_02\">" + memo + "</p>"
                                        + showpic
                                    + "</div></li>";

                                $("#ul_showlist").append(liStr);
                                ////第3页后显示返回头部
                                //if (_PageNo >= 3) {
                                //    $(".scroll-top").show();
                                //}
                                //else {
                                //    $(".scroll-top").hide();
                                //}
                                $("#div_noone").hide();
                                $("#ul_showlist").show();

                            });
                        }
                        else {
                            //无晒单
                            $("#ul_showlist").hide();
                            $("#div_noone").show();
                        }
                    }
                    else {
                        //接口异常，显示无晒单
                        $("#ul_showlist").hide();
                        $("#div_noone").show();
                    }

                    if (!($(".ui-loader ui-corner-all ui-body-a ui-loader-default") == undefined)) {
                        $(".ui-loader ui-corner-all ui-body-a ui-loader-default").hide();
                    }
                    $("#waitdiv").hide();

                    //可以加载下一页标志
                    _stop = true;
                    

                }
            });
        }
    },
    /*跳转详情*/
    GoToDetail: function (id) {
        //if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
        //    PageUrlConfig.SetUrl();
        //    g_const_PageURL.GoTo(g_const_PageURL.Login);
        //}
        //else {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.ShowOrder_Detail, "ShowOrderID=" + id);
        //}
    },
    //下拉回调
    ScollDownCallBack: function (resultlist) {
        //重新查询默认第一页
        $("#sel_nextPage").val("1")
        _PageNo = 0;
        //可以加载下一页标志
        _stop = true;
        $("#waitdiv").hide();
        $("#div_scrolldown").hide();
        $("#div_nomore").hide();
        if (!($(".ui-loader ui-corner-all ui-body-a ui-loader-default") == undefined)) {
            $(".ui-loader ui-corner-all ui-body-a ui-loader-default").hide();
        }
        
        //清空内容
        $("#ul_showlist").html("");
        ShowOrderList.GetShowOrder();

    },
    ////根据图片宽高调整css
    //Autopic: function (imgid,img_url) {
    //    // 创建对象
    //    var img = new Image();
    //    // 改变图片的src
    //    img.src = img_url;

    //    // 定时执行获取宽高
    //    var check = function () {
    //        // 只要任何一方大于0
    //        // 表示已经服务器已经返回宽高
    //        if (img.width > 0 || img.height > 0) {
    //            //var diff = new Date().getTime() - start_time;
    //            //document.body.innerHTML += '<div>from:<span style="color:red;">check</span> : width:' + img.width + ',height:' + img.height + ', time:' + diff + 'ms</div>';

    //            if (img.width > img.height) {
    //                $("#" + imgid).prop('style', 'width=');
    //            }
    //            else {

    //            }
    //            clearInterval(set);
    //        }
    //    };
    //    //定时器
    //    var set = setInterval(ShowOrderList.Autopic, 40);

    //    // 加载完成获取宽高
    //    img.onload = function () {
    //        //var diff = new Date().getTime() - start_time;
    //        //document.body.innerHTML += '<div>from:<span style="color:blue">onload</span> : width:' + img.width + ',height:' + img.height + ', time:' + diff + 'ms</div>';
    //    };
    //}
};





