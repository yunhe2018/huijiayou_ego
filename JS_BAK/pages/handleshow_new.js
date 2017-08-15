$(document).ready(function () {

    //返回
    $("#go-back").click(function () {
        window.location.replace(g_const_PageURL.Index);
    });

});

function goDetail() {

    window.location.replace(g_const_PageURL.MyOrder_detail + "?oid=" + $("#hid_orderno").val());

}