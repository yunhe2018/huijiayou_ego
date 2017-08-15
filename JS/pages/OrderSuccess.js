$(document).ready(function () {
    pagetype = "succ";
    orderid = GetQueryString("orderid");
    PageUrlConfig.SetUrl(g_const_PageURL.MyOrder_List);
    OrderInfo.LoadData();
    $("#btnOrderDetail").click(function () {
        window.location.replace(g_const_PageURL.MyOrder_detail + "?oid=" + orderid + "&t=" + Math.random());
    });
});

var OrderSuccess = {
    LoadOrderInfo: function (paymsg) {
        $("#orderNo").html(paymsg.orderno);
        $("#payMoney").html(parseInt(paymsg.totalmoney) + "夺宝币");
        $("#btnBack").click(function () {
            var par = "perid=" + paymsg.periodnum + "&pid=" + paymsg.productid;
            var url = g_const_PageURL.GoodsDetail + "?" + par + "&t=" + new Date().getTime()
            window.location.replace(url);
            //g_const_PageURL.GoTo(, par);
        });
    },
};