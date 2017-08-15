

//logo图
var imgfileControls_tp = {
    //
    fileImg1: { name: "控件1", id: "imgfile1_tp", picture: "", imgshowcontrolID: "imgfile1_imgshowUrl" },
    fileImg2: { name: "控件2", id: "imgfile2_tp", picture: "", imgshowcontrolID: "imgfile2_imgshowUrl" },
    fileImg3: { name: "控件3", id: "imgfile3_tp", picture: "", imgshowcontrolID: "imgfile3_imgshowUrl" },
    fileImg4: { name: "控件4", id: "imgfile4_tp", picture: "", imgshowcontrolID: "imgfile4_imgshowUrl" },
    fileImg5: { name: "控件5", id: "imgfile5_tp", picture: "", imgshowcontrolID: "imgfile5_imgshowUrl" },
    fileImg6: { name: "控件6", id: "imgfile6_tp", picture: "", imgshowcontrolID: "imgfile6_imgshowUrl" },
    //查找
    find: function (ControlID) {
        for (var k in imgfileControls_tp) {
            var pl = imgfileControls_tp[k];
            if (pl.id == ControlID)
                return pl;
        }
        return null;
    },
    //查找可用控件，返回id
    findfree: function () {
        for (var k in imgfileControls_tp) {
            var pl = imgfileControls_tp[k];
            if (pl.picture == "")
                return pl.id;
        }
        return null;
    },

    //删除picture时默认值的控件
    clear: function (allClear) {
        for (var k in imgfileControls_tp) {
            var pl = imgfileControls_tp[k];
            if (allClear) {
                //强制清除
                Upload.DelImg(imgfileControls_tp, pl.id, 'tp')
            }
            else {

                if (pl.picture == "asdfghjhjklkjhh_tp") {
                    Upload.DelImg(imgfileControls_tp, pl.id, 'tp')
                }
            }
        }
        return null;
    },
};

/*页面加载*/
$(document).ready(function () {
    //UserLogin.Check();
    //if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
    //    PageUrlConfig.SetUrl();
    //    g_const_PageURL.GoTo(g_const_PageURL.Login);
    //}

    if (!($(".ui-loader ui-corner-all ui-body-a ui-loader-default") == undefined)) {
        $(".ui-loader ui-corner-all ui-body-a ui-loader-default").hide();
    }
    //返回
    $(".back").on("click", function () {
        Merchant_Group.Back();
    });
    //订单ID
    $("#hid_OrderID").val(GetQueryString("orderid"));

    /*上传图片，1：增加图片显示控件*/
    $("#li_uploadimg_tp").on("click", function () {
        imgfileControls_tp.clear();
        //获得可用控件id
        var fileid = imgfileControls_tp.findfree();

        if (fileid == undefined) {
            ShowMesaage("达到数量上限，请先删除不需要的图片！");
            return;
        }
        else {
            $("#hid_freeimg_id_tp").val(fileid);
            //新增控件
            var temp_html = "<li id=\"li_" + fileid + "\" style=\"display:none;\"><form id=\"" + fileid + "_formImg\" method=\"post\" action=\"/Ajax/API.aspx?action=uploadimg&fileid=" + fileid + "\" enctype=\"multipart/form-data\">"
                + "<div style=\"display:none;\"><input type=\"file\" name=\"" + fileid + "\" id=\"" + fileid + "\" value=\"\"  onchange=\"Upload.UpLoadImg(imgfileControls_tp,'" + fileid + "_formImg', '" + fileid + "', '" + fileid + "_imgshowUrl');\" style=\"\"></div>"
                + "</form>"
                + "<div><img src=\"/img/portrait.png\" data-url=\"\" id=\"" + fileid + "_imgshowUrl\" alt=\"\"></div>"
                + "<b class=\"deletPic\" onclick=\"Upload.DelImg(imgfileControls_tp,'" + fileid + "','tp')\"></b></li>";

            $("#li_uploadimg_tp").before(temp_html);

            //初始值，避免点击取消后出现重名
            var tt = imgfileControls_tp.find(fileid);
            if (tt != null) {
                tt.picture = "asdfghjhjklkjhh_tp";
            }

            //选择图片，自动执行click事件
            $("#" + fileid).trigger("click");

        }

        //不能上传图片时隐藏
        fileid = imgfileControls_tp.findfree();

        if (fileid == undefined) {
            $("#li_uploadimg_tp").hide();
            return;
        }
    });

    /*判断晒单内容不能大于500汉字*/
    $("#memo").on("input propertychange", function () {
        var memo = $("#memo").val();
            var yy = GetByteLen(memo,false)
            if (yy > 500) {
                $("#memo").val(memo.substring(0, 500));
                $("#span_zinum").html("500");
            }
            else {
                $("#span_zinum").html(yy);
            }
    });

    /*判断晒单内容不能大于500汉字*/
    $("#title").on("input propertychange", function () {
        var title = $("#title").val();
        var yy = GetByteLen(title, false)
        if (yy > 20) {
            $("#title").val(title.substring(0, 20));
        }
    });

    /*保存信息*/
    $("#btn_save").on("click", function () {
        ShowOrder.Check();
    });

    /*从数据库获取订单信息*/
    ShowOrder.GetOrderByID();
    /*获取敏感词【每24小时更新一次】*/
    ShowOrder.GetSensitiveWord();

});


/*提示和验证*/
var ShowOrder_Check = {
    /*检验标题*/
    checkTitle: function () {
        var title = $("#title").val();
        if (title == "") {
            ShowMesaage("请写个标题!");
            $("#title").focus();
            return false;
        }
        var yy = GetByteLen(title,false)
        if (yy >20) {
            ShowMesaage("标题最多20个汉字!");
            $("#title").focus();
            return false;
        }
        return true;
    },
    /*检验图片*/
    checkPic: function () {
        //图片
        var tp_t = [];
        for (var k in imgfileControls_tp) {
            var pl = imgfileControls_tp[k];
            if (pl.picture != "" && !(pl.picture == undefined) && pl.picture != "asdfghjhjklkjhh_tp") {
                tp_t.push(pl.picture);
            }
        }
        if (tp_t.length == 0) {
            ShowMesaage("至少晒一张图片哦!");
            return false;
        }
        return true;
    },

    /*检验操作内容*/
    checkmemo: function () {
        var memo = $("#memo").val();
        if (memo == "") {
            ShowMesaage("快写点心得吧!");
            $("#心得").focus();
            return false;
        }
            var yy = GetByteLen(memo,false)
            if (yy > 500) {
                ShowMesaage("心得最多500个汉字!!");
                $("#memo").focus();
                return false;
            }
        return true;
    },
    
};

/*主方法*/
var ShowOrder = {
    //图片
    pic: "",
    //电话
    BuyerPhone: "",
    //昵称
    BuyerNickName: "",
    //头像
    BuyerNickNameAvatar: "",
    /*检查变量*/
    Check: function () {

        if (!ShowOrder_Check.checkTitle(false)) {
            $("#btn_save").show();
        }
        else if (!ShowOrder_Check.checkmemo(false)) {
            $("#btn_save").show();
        }
        //else if (!ShowOrder_Check.checkPic(false)) {
        //    $("#btn_save").show();
        //}
        else {
            //获取上传图片
            var tp_t = [];
            for (var k in imgfileControls_tp) {
                var pl = imgfileControls_tp[k];
                if (pl.picture != "" && !(pl.picture == undefined) && pl.picture != "asdfghjhjklkjhh_tp") {
                    tp_t.push(pl.picture);
                }
            }
            if (tp_t.length > 0) {
                ShowOrder.pic = tp_t.join('|');
            }
            else {
                //ShowMesaage("请上传商品图片!");
                //return false;
                //使用默认图标

            }
            //保存
            ShowOrder.Save();
        }
    },
    /*发布*/
    Save: function () {
        $("#btn_save").hide();
        var isallok = true;
        ////获取上传图片
        //tp_t = [];
        //for (var k in imgfileControls_tp) {
        //    var pl = imgfileControls_tp[k];
        //    if (pl.picture != "" && !(pl.picture == undefined) && pl.picture != "asdfghjhjklkjhh_tp") {
        //        tp_t.push(pl.picture);
        //    }
        //}
        //if (ShowOrder.pic=="") {
        //    ShowMesaage("至少晒一张图片哦!");
        //    isallok = false;
        //    $("#btn_save").show();
        //    return false;
        //}

        if (isallok) {
            var title = $("#title").val();
            var memo = $("#memo").val();
            //过滤关键字
            if (!(localStorage["SensitiveWord"] == undefined)) {
                var word = localStorage["SensitiveWord"].split('|');
                $.each(word, function (index, n) {
                    title = title.replace(n, '*');
                    memo = memo.replace(n, '*');
                });
            }


            $.ajax({
                type: "POST",//用POST方式传输
                dataType: "json",//数据格式:JSON
                url: g_ego_api_url,//目标地址
                data: "t=" + Math.random() +
                     "&action=SaveShowOrder" +
                     "&orderid=" + $("#hid_OrderID").val() +
                     "&title=" + title.replace(" ", "")+//escape(title.replace(" ", "")) +
                     "&memo=" +memo+// escape(memo) +
                     "&pic=" + ShowOrder.pic +
                     "&Phone=" + ShowOrder.BuyerPhone +
                     "&NickName=" + ShowOrder.BuyerNickName +
                     "&Avatar=" + ShowOrder.BuyerNickNameAvatar,
                success: function (json) {
                    //json = JSON.parse(json);
                    if (json.resultcode == 1) {
                        $("#btn_save").show();

                        ShowMesaage("发布成功!");
                        //跳转
                        setTimeout(g_const_PageURL.Replace(g_const_PageURL.MyOrder_List), 3000);
                    }
                    else {
                        ShowMesaage(json.resultmessage);
                        $("#btn_save").show();
                    }
                }
            });
        }
        else {
            $("#btn_save").show();

        }
    },
    /*查询订单信息*/
    GetOrderByID: function () {
        
        if ($("#hid_OrderID").val() == "" || $("#hid_OrderID").val() == "0" || isNaN($("#hid_OrderID").val())) {
            //location.replace("/account/ShowOrder_list.aspx");
            Merchant_Group.Back();

        }
        else {
            //获取订单信息
            $.ajax({
                type: "POST",//用POST方式传输
                dataType: "json",//数据格式:JSON
                url: g_ego_api_url,//目标地址
                data: "t=" + Math.random() +
                     "&action=GetOrderInfoByID" +
                     "&id=" + $("#hid_OrderID").val(),
                success: function (json) {
                    //json = JSON.parse(json);
                    if (json.resultcode == 1) {

                        if (json.resultmessage[0].haveshoworder > 0) {
                            ShowMesaage("您已经晒过单了!");
                            //跳转
                            //setTimeout(Merchant_Group.Back(), 3000);
                            setTimeout(g_const_PageURL.GoTo(g_const_PageURL.ShowOrder_Detail, "ShowOrderID=" + json.resultmessage[0].haveshoworder), 3000);

                        }
                        else {
                            var msg = json.resultmessage;
                            //保存BuyerPhone、BuyerNickName、BuyerNickNameAvatar
                            ShowOrder.BuyerPhone = msg[0].buyerphone;
                            ShowOrder.BuyerNickName = msg[0].nickname;
                            ShowOrder.BuyerNickNameAvatar = msg[0].avatar;
                        }
                    }
                    else {
                        ShowMesaage("查询订单信息失败");
                    }
                }
            });
        }
    },
    /*获取敏感词【每24小时更新一次】*/
    GetSensitiveWord: function () {
        var reSet = false;
        if (localStorage["SensitiveWord"] == undefined) {
            reSet = true;
        }
        else {
            if (!(localStorage["SensitiveWord_lasttime"] == undefined) && !(localStorage["SensitiveWord"] == undefined)) {
                //判断最后一次加载时间是否超过24小时
                var nows = Date.parse(new Date());
                var last = localStorage["SensitiveWord_lasttime"]
                if ((parseFloat(nows) - parseFloat(last))/(1000*60*60*24)>1) {
                    //超过一天
                    reSet = true;
                }
            }
        }
        if (reSet) {
            //获取订单信息
            $.ajax({
                type: "POST",//用POST方式传输
                dataType: "json",//数据格式:JSON
                url: g_ego_api_url,//目标地址
                data: "t=" + Math.random() +
                     "&action=Getsensitive_word",
                success: function (json) {
                    //json = JSON.parse(json);
                    if (json.resultcode == 1) {
                        var msg = json.resultmessage;
                        var sensitive_word = [];
                        $.each(msg, function (index, n) {
                            sensitive_word.push(n.sensitive_word);
                        });
                        var all_sensitive_word = sensitive_word.join('|');
                        localStorage["SensitiveWord"] = all_sensitive_word;
                        localStorage["SensitiveWord_lasttime"] = Date.parse(new Date());
                    }
                    else {
                        //ShowMesaage("查询订单信息失败");
                    }
                }
            });
        }
    },
    ///*读取logo图片*/
    //LoadLogoUrl: function (picNewUrl) {
    //    var fileid = imgfileControls_tp.findfree();
    //    if (fileid == undefined) {
    //        imgfileControls_tp.clear(true);
    //    }
    //    else {
    //        if (!(picNewUrl == undefined) && picNewUrl != "") {
    //            var picNewUrl_1 = picNewUrl;
    //            if (picNewUrl_1.indexOf(g_const_pic_ym) == -1) {
    //                picNewUrl_1 = g_const_pic_ym + picNewUrl;
    //            }
    //            //新增控件
    //            var html = "<li id=\"li_" + fileid + "\">"
    //                + "<img src=\"" + picNewUrl_1 + "\" url=\"" + picNewUrl_1 + "\" id=\"" + fileid + "_imgshowUrl\" alt=\"\">"
    //                + "<b class=\"deletPic\" onclick=\"Upload.DelImg(imgfileControls_tp,'" + fileid + "','tp')\"></b></li>";

    //            var tt = imgfileControls_tp.find(fileid);
    //            if (tt != null) {
    //                tt.picture = picNewUrl;
    //            }
    //            $("#li_uploadimg_tp").before(html);
    //            $("#li_uploadimg_tp").hide();
    //        }
    //    }
    //},

    ///*显示保存信息*/
    //ShowIndexLB: function (ret) {
    //    Loading(true);
    //    //标题
    //    //$("#title").val(ret._title);
    //    //操作类型
    //    $("#cztype").val(ret._cztype);
    //    //操作类型说明文字
    //    ShowOrder.ShowcztypeHelp();
    //    //操作内容
    //    $("#czmemo").val(unescape(ret._czmemo));
    //    //logo图片
    //    if (ret._logo != null && ret._logo != "") {
    //        IndexLB_Save.LoadLogoUrl(ret._logo);
    //    }
    //    //开始时间
    //    var NewDtime = new Date(parseInt(ret._begintime.slice(6, 19)));
    //    var bb = My_DateCheck.FormatDate(NewDtime);
    //    $("#BeginTime").val(bb);
    //    //结束时间
    //    NewDtime = new Date(parseInt(ret._endtime.slice(6, 19)));
    //    bb = My_DateCheck.FormatDate(NewDtime);
    //    $("#EndTime").val(bb);
    //    //优先级
    //    $("#sortid").val(ret._sortid);
    //    //状态
    //    $("#status").val(ret._status);
    //    loadinghide();

    //},

};





