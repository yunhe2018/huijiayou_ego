$(document).ready(function () {
    if (GetQueryString("type")==0) {
        $("#img_result").attr("src", "/Act/img/succ.png");
        $("#btn_result").html("下载一元夺宝APP，查看红包");
    }
    else if (GetQueryString("type") == 1) {
        $("#img_result").attr("src", "/Act/img/guo.png");
        $("#btn_result").html("下载一元夺宝APP，查看红包");
    }
    else if (GetQueryString("type") == 2) {
        $("#img_result").attr("src", "/Act/img/guang.png");
        $("#btn_result").html("下载一元夺宝APP");
    }
    $("#btn_result").on('click', function () {
        alert(123);
    });
});