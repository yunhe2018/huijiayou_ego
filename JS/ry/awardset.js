$(function () {
    //periodset.Init();
    $("#periodnum").on("focus", function () {
        awardset.InputFocus = true;
    });
    $("#periodnum").on("blur", function () {
        awardset.InputFocus = false;
        awardset.InputFinish();
    });
});
var awardset = {
    InputFocus:false,
    Data: "",
    SysTime: "",
    //检查期号是否输完
    InputFinish: function () {
        var periodnum = $("#periodnum").val();
        if (periodnum.trim() == "")
            return;
        if (periodnum.length !== 9) {
            //ShowMesaage("请填写正确手机号。");
            return false;
        }
        if (isNaN(Number(periodnum))) {
            ShowMesaage("请填写正确期号");
            return false;
        }

        //查询本期队信息
        awardset.GetTeam();
    },
    /*获取队信息*/
    GetTeam: function () {
        var periodnum = $("#periodnum").val();
        if(isNaN(periodnum)){
            ShowMesaage("期号错误");
        }
        var purl = g_tz_api_url;//"/Ajax/rhHandler.ashx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getteam&periodnum="+periodnum,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            var tablebody = "";
            $.each(msg.alllist, function (i, n) {
            });
            $("#table_periodnum").html(tablebody);
            //Message.Operate("", "div_Load");
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    CaoZuo: function (periodnum, status) {
        var teampv = 0;
        if ($("#" + periodnum + "_teampv") == undefined) {
            ShowMesaage("请填写" + periodnum + "期整队赢赔率!");
            return false;
        }
        if (isNaN($("#" + periodnum + "_teampv").val())) {
            ShowMesaage(periodnum + "期整队赢赔率错误");
            return false;
        }
        teampv = parseFloat($("#" + periodnum + "_teampv").val()).toFixed(2);
        var mvppv = 0;
        if ($("#" + periodnum + "_mvppv") == undefined) {
            ShowMesaage("请填写" + periodnum + "期MVP赔率!");
            return false;
        }
        if (isNaN($("#" + periodnum + "_mvppv").val())) {
            ShowMesaage(periodnum + "期MVP赔率错误");
            return false;
        }
        mvppv = parseFloat($("#" + periodnum + "_mvppv").val()).toFixed(2);
        if (teampv <= 0) {
            ShowMesaage("请填写" + periodnum + "期整队赢赔率【需大于0】!");
            return false;
        }
        if (mvppv <= 0) {
            ShowMesaage("请填写" + periodnum + "期MVP赔率【需大于0】!");
            return false;
        }

        var purl = "/Ajax/rhHandler.ashx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=periodnumset&periodnum=" + periodnum + "&status=" + status,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (int.parseInt(n.resultcode) > 0) {
                ShowMesaage(n.resultmessage);
            }
            else {
                ShowMesaage(n.resultmessage);
                periodset.LoadData();
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};