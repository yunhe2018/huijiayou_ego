var Page_Index = {
    SharePic: "",
    SetWXShare: function () {
        if (IsInWeiXin.check()) {
            var phoneno = "";
            var shareurl = "http://" + window.location.host + window.location.pathname;
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
            WX_JSAPI.desc = "1块钱也能买iphone6s？！挤啥挤~给我加个塞儿~";
            WX_JSAPI.imgUrl = Page_Index.SharePic;
            WX_JSAPI.link = shareurl + "?" + shareparam;
            WX_JSAPI.title = "一元夺宝";
            WX_JSAPI.type = "";
            WX_JSAPI.LoadParam(g_const_wx_AllShare);
        }
    },
    Init: function () {
        if (!($(".share") == undefined)) {
            $(".share").on("click", function () {
                //APP中的分享
                SetWXShare(g_const_share_index_title, g_const_share_index_desc, g_const_share_index_pic);
            });
            if ((CheckMachine.versions.android || (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad)) && !CheckMachine.versions.inWeiXin) {
                var clientType = GetClientType();
                if (clientType == ClientType.JYH_Android || clientType == ClientType.JYH_iOS) {
                    if (clientType == ClientType.JYH_iOS) {
                        $(".share").show();
                    }
                    else {
                        $(".share").show();

                    }
                    //显示首页头部
                    $(".div_appclosewindow").show();

                }
                else {
                    $(".share").hide();
                    //隐藏首页头部
                    $(".div_appclosewindow").hide();
                }

            }
            else {
                $(".share").hide();
                //隐藏首页头部
                $(".div_appclosewindow").hide();

            }
        }

        //App嵌入时显示“关闭窗口”
        UseAppFangFa.ShowCloseBtn('div_appclosewindow');


        //公告展示
        Page_Index.LoadTop();
        Page_Index.IndexMessage();
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

        $("div.con").scroll(function (e) {
            $('html,body').css({ "scrollTop": '0px' });
        });
        Page_Index.LoadGuide();
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
                if (msg.RowsCount == 0) {
                    if ($("#dataList li").length == 0) {
                        $("#noResult").show();
                    }
                    else {
                        $("#dataInfo").show();
                    }
                }
                else {
                    Page_Index.PageCount = parseInt((msg.RowsCount + Page_Index.PageSize - 1) / Page_Index.PageSize);
                    Page_Index.LoadResult(msg.ResultTable);
                    $("#theLast").show();
                    $("#dataInfo").show();
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
            Page_Index.LoadData();
        });
    },
    LoadResult: function (list) {
        var html = [];
        $(list).each(function () {
            if (Page_Index.SharePic == "") {
                Page_Index.SharePic = (this.listimg || g_goods_Pic);
            }
            html = [];
            var process = (parseFloat(this.chipinnum || "0") / parseFloat(this.sellprice)) * 100;
            html.push('<li style="height: auto;" onclick="Page_Index.LoadGoodsDetail(\'' + this.periodnum + '\',\'' + this.id + '\');"> <a>');
            html.push('  <div class="ann_img"><img src="' + (this.listimg || g_goods_Pic) + '"></div> ');
            html.push('  <h3 class="ann_con">第' + this.periodnum + '期 ' + this.productname + '</h3>');
            html.push(' <div class="pro_box"><div class="pro" style="width:' + process + '%"></div></div>');
            html.push(' <div class="clearfix"><p class="pro_jd" style="float:left;">' + this.sellprice + '份/</p><p class="pro_jd" style="float:left;color:#0090ff;margin-right:1rem;">剩余' + (this.sellprice - this.chipinnum) + '</p></div>');
            html.push('  <div class="qiang_a_wrap"><div class="qiang_a">立即抢</div></div>');
            html.push('</a></li>')
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
        $("#bannerList").empty();
        var html = [];
        if (typeof bannerlist != "undefined" && bannerlist != undefined && bannerlist != "undefined" && bannerlist != null && bannerlist != "null") {
            $(bannerlist.ResultTable).each(function (i) {
                var begin = Date.Parse(this.begintime);
                var end = Date.Parse(this.endtime);
                var date_now = new Date();
                if (date_now >= begin && date_now <= end) {
                    switch (this.cztype) {
                        case "1"://链接
                            html.push('<div class="swiper-slide"><a href="' + this.czmemo + '"><img src="' + (this.logo || g_brand_Pic) + '" alt="一元夺宝"/></a></div>');
                            break;
                        case "2"://商品
                            var stringhtml = Page_Index.GetNewPeriodHtml(this.czmemo);
                            if (stringhtml) {
                                html.push('<div class="swiper-slide"><a onclick="g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail,\'' + stringhtml + '\');"><img src="' + (this.logo || g_brand_Pic) + '" alt="一元夺宝"/></a></div>');
                            }
                            if (stringhtml == "") {
                                html.push('<div class="swiper-slide"><a href="javascript:void(0);"><img src="' + (this.logo || g_brand_Pic) + '" alt="一元夺宝"/></a></div>');
                            }
                            break;
                        case "99"://无操作
                            html.push('<div class="swiper-slide"><a href="javascript:void(0);"><img src="' + (this.logo || g_brand_Pic) + '" alt="一元夺宝"/></a></div>');
                            break;
                    }
                }
            });
            $("#bannerList").html(html.join(""));
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                width: window.innerWidth,
                centeredSlides: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false
            });
        }
    },
    LoadGuide: function () {
        try {
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
        }
        catch (e) {
            $(".yg_mask").hide();
        }
        $(".yg_dialog_close").on("click", function () {
            $(".yg_mask").hide();
        });

    },
    AwardOrderNo: "",
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
                if (msg.ResultCode) {
                    return false;
                } else {
                    var orderList = msg.orderList;
                    if (orderList.length > 0) {
                        try {

                            var awardOrder = window.localStorage.getItem("AwardOrder");
                            Page_Index.AwardOrderNo = orderList[0].orderno
                            if (Page_Index.AwardOrderNo && Page_Index.AwardOrderNo != awardOrder) {
                                // $("#orderNo").html(orderNo);
                                $("#awardOrder").show();
                                $("#gotoOrderDetail").on("click", function () {
                                    var par = "oid=" + Page_Index.AwardOrderNo;
                                    g_const_PageURL.GoTo(g_const_PageURL.MyOrder_detail, par);
                                });
                                $(".yg_dialog_close").on("click", function () {
                                    $("#awardOrder").hide();
                                });

                                window.localStorage.setItem("AwardOrder", Page_Index.AwardOrderNo);
                            }
                        }
                        catch (e) {
                            $("#awardOrder").hide();
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
    },
    GetNewPeriodHtml: function (sku) {
        var result = "";
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getnewperiodbysku&sku=" + sku,
            dataType: g_APIResponseDataType,
            async: false
        });
        request.done(function (msg) {
            if (msg.newPeriodNum != 0) {
                result = 'perid=' + msg.newPeriodNum + '&pid=' + msg.productID;
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
        return result;
    },
    /*首页公告*/
    IndexMessage: function () {

        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=GetIndexMessage",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            //console.log(msg);
            var li = "";
            if (msg.reaultcode == "1") {
                var rows = 0;
                $.each(msg.ResultTable, function (i, n) {

                    if (n.type == "award") {
                        //中奖信息
                        if (n.nickname == "") {
                            var memberInfo = getMemberInfo(n.buyerphone);
                            li += "<li class=\"clearfix\" onclick=\"Page_Index.LoadGoodsDetail('" + n.periodnum + "','" + n.productid + "');\"><span class=\"eg_notice_pic\"><img src=\"img/eg_notice.png\"></span><span class=\"eg_notice_con\">恭喜<i>" + memberInfo.nickname + "</i>获得" + n.productname + "</span></li>"
                        }
                        else {
                            li += "<li class=\"clearfix\" onclick=\"Page_Index.LoadGoodsDetail('" + n.periodnum + "','" + n.productid + "');\"><span class=\"eg_notice_pic\"><img src=\"img/eg_notice.png\"></span><span class=\"eg_notice_con\">恭喜<i>" + n.nickname + "</i>获得" + n.productname + "</span></li>"

                        }
                        rows++;
                    }
                    else if (n.type == "gonggao") {
                        //公告
                        switch (n.cztype) {
                            case "99"://无操作
                                li += "<li class=\"clearfix\"><span class=\"eg_notice_pic\"><img src=\"" + (n.logo || '/img/eg_notice.png') + "\"></span><span class=\"eg_notice_con\">" + n.title + "</span></li>"
                                break;
                            case "1"://链接
                                li += "<li class=\"clearfix\" onclick=\"Page_Index.GoTo('" + n.czmemo + "')\"><span class=\"eg_notice_pic\"><img src=\"" + (n.logo || '/img/eg_notice.png') + "\"></span><span class=\"eg_notice_con\">" + n.title + "</span></li>"
                                break;
                            case "2"://弹层
                                li += "<li class=\"clearfix\" onclick=\"Page_Index.ShowGongGao('" + n.title + "','" + n.czmemo + "')\"><span class=\"eg_notice_pic\"><img src=\"" + (n.logo || '/img/eg_notice.png') + "\"></span><span class=\"eg_notice_con\">" + n.title + "</span></li>"
                                break;
                        }
                        rows++;
                    }
                });
                $("#hid_gonggaonum").val(rows);
                if (li != "") {
                    $("#ul_indexmessage").html(li);
                    $("#div_indexmessage").show();

                    setInterval('Page_Index.GongGaoAutoScroll("#div_indexmessage")', 5000)
                }
                else {
                    $("#ul_indexmessage").html("");
                    $("#div_indexmessage").hide();
                }


            }
            else {
                $("#div_indexmessage").hide();
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });

    },
    /*跳转链接*/
    GoTo: function (url) {
        if (url != "") {
            location.href = url;
        }
    },
    /*公告弹层*/
    ShowGongGao: function (title, memo) {
        if (title != "" && memo != "") {
            $("html,body").css({ "overflow": "hidden" });
            //<b class=\"noticeDialog_close\" onclick=\"Page_Index.CloseGongGao()\"></b>
            var str = "<div class=\"noticeDialog\"><h3>" + title + "</h3><div class=\"con\">" + memo + "</div></div>";
            $("#div_noticeDialog").html(str);
            $("div.noticeDialog,h3,div.con").on("click", function () {
                return false;
            });
            $("#div_noticeDialog").show();
        }
    },
    /*公告弹层关闭*/
    CloseGongGao: function () {
        $("html,body").css({ "overflow": "" });
        $("#div_noticeDialog").hide();
        $("#div_noticeDialog").html("");
    },
    /*公告自动滚动*/
    GongGaoAutoScroll: function (obj) {
        if (parseInt($("#hid_gonggaonum").val()) > 1 && $("#hid_stop").val() == "0") {
            $(obj).find("#ul_indexmessage").animate({

                marginTop: "-3rem"

            }, 500, function () {

                $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);

            });
        }

    },
    //mouseOver: function () {
    //    $("#hid_stop").val("1");
    //},
    //mouseOut: function () {
    //    $("#hid_stop").val("0");
    //},
};
