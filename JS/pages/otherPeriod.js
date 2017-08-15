var otherPeriod = {
    GoodsId: GetQueryString("pid"),
    Init: function () {
        otherPeriod.LoadData();
    },
    LoadData: function () {
        var purl = g_ego_api_url;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getotherperiod&pid=" + otherPeriod.GoodsId,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultCode) {

            } else {
                otherPeriod.LoadResult(msg);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (data) {
        $("#otherPeriods").empty();
        var l = data.otherPeriods.length;
        if (l > 0) {
            var html = [];
            var count = 0;
            var memberInfo = "";
            $(data.otherPeriods).each(function () {
                //10销售中//20销售截止//25失败，30开奖中，40成功
                if (this.status == "25" || this.status == "30" || this.status == "20") {
                    html.push('<li class="qi_01" onclick="otherPeriod.GoToProductDetail(\'' + this.periodnum + '\',\'' + otherPeriod.GoodsId + '\');"><label class="qi_num fl">第' + this.periodnum + '期</label><span class="qi_tip fr">' + otherPeriod.getText(this.status) + '</span><b class="qi_see"></b></li>');
                    ++count;
                }
                else if (this.status == "40") {
                    memberInfo = getMemberInfo(this.buyerphone);
                    html.push('<li class="qi_02" onclick="otherPeriod.GoToProductDetail(\'' + this.periodnum + '\',\'' + otherPeriod.GoodsId + '\')"><div class="qi_top"><label class="qi_num fl">第' + this.periodnum + '期</label><span class="qi_time fr">揭晓时间：' + this.openawardtime + '</span></div><div class="qi_describe"><p><label>幸运用户: 　</label><span>' + memberInfo.nickname + '</span></p><p><label>幸运号码: 　</label><span class="qi_blue">' + this.awardcode + '</span></p><p><label>参与份数: 　</label><span>' + this.chipinnum + '份</span></p><b class="qi_de_poi"></b></div></li>');
                    ++count;
                }
            });
            if (count > 0) {
                $("#otherPeriods").html(html.join("")).show();
            }
            else {
                $("#noResult").show();
            }
        }
        else {
            $("#noResult").show();
        }
    },
    getText: function (status) {
        switch (status) {
            case "25":
                return "该期未达到总需份数，夺宝失败";
            case "30":
                return "揭晓中请耐心等待";
            case "20":
                return "揭晓中请耐心等待";
        }
    },
    GoToProductDetail: function (perid, pid) {
        var par = "perid=" + perid + "&pid=" + pid;
        g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
    },
};