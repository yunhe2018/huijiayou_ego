var MyTuans = {
    Init: function () {
        MyTuans.LoadData();
    },
    LoadData: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=mytuans",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    g_const_PageURL.GoTo(g_const_PageURL.Login);
                }
            } else {
                MyTuans.LoadResult(msg);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (data) {
        if (data.length > 0) {
            $("#noResult").hide();
            $("#resultList").empty().show();
            var listEvenCode = [];
            var listPars = [];
            $(data).each(function () {
                var par = {
                    Status: this._status,
                    OrderCode: this._orderCode,
                    EventCode: this._eventcode
                };
                listPars.push(par);
                listEvenCode.push(this._eventcode);
            });
            g_type_tuanInfo.api_input.listEventCode = listEvenCode;
            g_type_tuanInfo.LoadData(MyTuans.LoadTuanInfo, listPars);
        }
        else {
            $("#resultList").hide();
            $("#noResult").show();
        }
    },
    LoadTuanInfo: function (list, pars) {
        $("#resultList").empty();
        if (list.length > 0) {
            for (var i in pars) {
                var par = pars[i];
                var data = MyTuans.FindPinInfo(list, par.EventCode);
                var html = [];
                html.push("<li>");
                html.push('<div class="goodInfo clearfix"><div class="goodImg">');
                html.push('<img src="' + (data.mainpicUrl || g_goods_Pic) + '">');
                html.push(' </div><div class="goodtxt">');
                html.push('<p class="text2">' + data.skuName + '</p>');
                html.push('<p class="price">' + data.purchaseNum + '人成团</p>');
                html.push('<p class="price3">￥' + data.favorablePrice.toFixed(2) + ' 元</p>');
                html.push('</div></div>');
                html.push('<div class="orderBtn clearfix">');
                if (par.Status == 1) {
                    html.push(' <span class="tuanfail"></span>');
                }
                else {
                    html.push(' <span class="tuanfail">' + g_const_tuanStatus.getText(par.Status) + '</span>');
                    html.push(' <a onclick="MyTuans.LoadPinTuanResult(\'' + data.eventCode + '\');">查看团详情</a> </div>');
                }
                //html.push(' <a onclick="MyTuans.LoadOrderDetail(\'' + par.OrderCode + '\');" class="first">查看订单详情</a>');

                html.push("</li>");
                //if (html.length > 0) {
                $("#resultList").append(html.join(""));
                //}
                //else {
                //    $("#resultList").hide();
                //    $("#noResult").show();
                //}
            }
        }
    },
    LoadPinTuanResult: function (eid) {
        var par = "eid=" + eid;
        g_const_PageURL.GoTo(g_const_PageURL.PinTuanResult, par);
    },
    LoadOrderDetail: function (eid) {
        var par = "oid=" + eid;
        g_const_PageURL.GoTo(g_const_PageURL.MyOrder_detail, par);
    },
    FindPinInfo: function (list, eid) {
        for (var i in list) {
            var item = list[i];
            if (item.eventCode == eid) {
                return item;
            }
        }
        return "";
    },

};