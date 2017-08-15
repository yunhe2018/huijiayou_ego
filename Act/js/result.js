$(document).ready(function () {
    if (GetQueryString("type") == 0) {
        $("#img_result").attr("src", "/Act/img/h0.jpg");
    }
    else if (GetQueryString("type") == 1) {
        $("#img_result").attr("src", "/Act/img/h1.jpg");
    }
    else if (GetQueryString("type") == 2) {
        $("#img_result").attr("src", "/Act/img/h2.jpg");
    }
    $("#btn_result").on('click', function () {
        alert(123);
    });
});