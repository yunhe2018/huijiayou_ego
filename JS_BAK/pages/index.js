var Page_Index = {
    SharePic:"",
    SetWXShare: function () {
        if (IsInWeiXin.check()) {
            var phoneno = "";
            var shareurl = "http://" + window.location.host + window.location.pathname;
            var shareparam = "" ;
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
            WX_JSAPI.desc = "谁再说我out我跟谁急，瞅你那损色，我没玩过的多了，这算老几...";
            WX_JSAPI.imgUrl = Page_Index.SharePic;
            WX_JSAPI.link = shareurl + "?" + shareparam;
            WX_JSAPI.title = "一元夺宝";
            WX_JSAPI.type = "";
            WX_JSAPI.LoadParam(g_const_wx_AllShare);
        }
    },
    ///*判断是否需要自动登录*/
    //autologin:function(){
    //    //if (GetQueryString("autologin")=="1") {
    //    //    GroupPhone.Main();
    //    //}
    //},
    Init: function () {
        //判断是否需要自动登录
       // Page_Index.autologin();
UserLogin.Check123();
	   
	   
        Page_Index.LoadGuide();
        Page_Index.LoadTop();
        Page_Index.LoadData();
        Page_Index.BindEvent();
        UserLogin.Check(Page_Index.LoadAwardTip);
        $(".top_nav li").on("click", function () {
            $(this).css("color", "#f6123d").siblings().css("color", "#333");
            $("#sortMark").attr("class", "");
            var sort = "1";
            if ($(this).data("sort") == "3") {
                $(this).data("desc") == "0" ? $(this).data("desc", "1") : $(this).data("desc", "0");
                sort = $(this).data("desc");
                if ($(this).data("desc") == "0") {
                    $("#sortMark").attr("class", "pepo_count");
                }
                else {
                    $("#sortMark").attr("class", "pepo_count active");
                }
            }
            Page_Index.SortType = $(this).data("sort");
            Page_Index.Sort = sort;
            Page_Index.PageIndex = 0;
            $("#dataList").empty();
            Page_Index.LoadData();
        });
    },
    //chipinnum 人气;progress 进度;salestarttime 最新;sellprice 总须人数;   
    SortType: "",
    //0 正序 1倒序
    Sort: "1",
    PageSize: 20,
    PageIndex: 0,
    PageCount: 1,
    LoadData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=index&ot=" + Page_Index.Sort + "&oc=" + Page_Index.SortType + "&pi=" + Page_Index.PageIndex + "&ps=" + Page_Index.PageSize,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                Page_Index.PageCount = parseInt((msg.RowsCount + Page_Index.PageSize - 1) / Page_Index.PageSize);
                Page_Index.LoadResult(msg.ResultTable);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (list) {
        var html = [];
        $(list).each(function () {
            if (Page_Index.SharePic=="") {
                Page_Index.SharePic = (this.listimg || g_goods_Pic);
            }
            html = [];
            html.push('<li class="clearfix" onclick="Page_Index.LoadGoodsDetail(\'' + this.periodnum + '\',\'' + this.id + '\');"> <a>');
            html.push('<div class="yi_pic"><img src="' + (this.listimg || g_goods_Pic) + '" /></div>');
            html.push('<div class="pro_detail">');
            html.push('<p class="pro_detail_con">第' + this.periodnum + '期 ' + this.productname + '</p>');
            html.push('<div class="pro_box"><div class="pro" style="width:' + (this.progress || 0) + '%"></div></div>');
            html.push('<div>');
            html.push('<p class="pro_jd" style="float:left;">总需' + this.sellprice + '人次/</p>');
            html.push('<p class="pro_jd" style="float:left;color:#0090ff;margin-right:1rem;">剩余' + (this.sellprice - this.chipinnum) + '</p>');
            html.push('</div>');
            html.push('</div><div class="qiang_a"></div></a></li>')
            $("#dataList").append(html.join(""));
        });
        Page_Index.SetWXShare();
    },
    BindEvent: function () {
        var winHeight = $(window).height();
        $(window).on("scroll", function () {
            var el = $(this);
            var iScrollTop = el.scrollTop();
            if ((iScrollTop + winHeight) >= winHeight) {
                ++Page_Index.PageIndex;
                if (Page_Index.PageIndex <= Page_Index.PageCount) {
                    Page_Index.LoadData();
                }
            }
        });
        //$('html,body').animate({ scrollTop: '0px' }, 300, function () {
        //    $(".to_top").hide();
        //});
    },
    LoadGoodsDetail: function (perid, pid) {
        var par = "perid=" + perid + "&pid=" + pid;
        g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
    },
    LoadTop: function () {
        //var purl = g_ego_api_url;
        //var request = $.ajax({
        //    url: purl,
        //    cache: false,
        //    method: g_APIMethod,
        //    data: "t=" + Math.random() + "&action=getBanner",
        //    dataType: g_APIResponseDataType
        //});
        //request.done(function (msg) {
        //    if (msg.resultCode) {

        //    } else {
        //        $("#bannerList").empty();
        //        var html = [];
        //        var bannerList = msg;
        //        $(bannerList).each(function () {
        //            html.push('<div class="swiper-slide"><a onclick="g_const_PageURL.GoTo(g_const_PageURL.CommonProblem);"><img src="' + (this.picUrl || g_brand_Pic) + '" /></a></div>');
        //        });
        //        $("#bannerList").html(html.join(""));
        //        $("#dataList").css({ "margin-top": ($(".yy_top").height() + 10) + "px" });
        //    }
        //});
        //request.fail(function (jqXHR, textStatus) {
        //    ShowMesaage(g_const_API_Message["7001"]);
        //});
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable: true,
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false
        });
    },
    LoadGuide: function () {
        var guide = window.localStorage.getItem("guide");
        if (!guide) {
            $(".yg_dialog_go").on("click", function () {
                //var par = "";// "perid=" + perid + "&pid=" + pid;
                //g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
                $(".yg_mask").hide();
            });
            $(".yg_dialog_tip").html("某商品价值20元，共20个参与好吗");
            $("#guid").show();
            window.localStorage.setItem("guide", "guided");
        }
        $(".yg_dialog_close").on("click", function () {
            $(".yg_mask").hide();
        });
    },
    LoadAwardTip: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            return false;
        } else {
            var purl = g_ego_api_url;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=awardOrders",
                dataType: g_APIResponseDataType
            });
            request.done(function (msg) {
                console.log(msg);
                if (msg.ResultCode) {
                    return false;
                } else {
                    var orderList = msg.orderList;
                    if (orderList.length > 0) {
                        var orderNo = orderList[0].orderno;
                        var awardOrder = window.localStorage.getItem("AwardOrder");
                        if (!awardOrder && awardOrder != orderNo) {
                            // $("#orderNo").html(orderNo);
                            $("#awardOrder").show();
                            $("#gotoOrderDetail").on("click", function () {
                                var par = "oid=" + orderNo;
                                g_const_PageURL.GoTo(g_const_PageURL.MyOrder_detail, par);
                            });
                            $(".yg_dialog_close").on("click", function () {
                                $("#awardOrder").hide();
                            });
                            window.localStorage.setItem("AwardOrder", orderNo);
                        }
                    }
                    else {
                        return false;
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    }
};