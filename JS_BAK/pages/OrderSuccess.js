$(document).ready(function () {
    pagetype = "succ";
    orderid = GetQueryString("orderid");
    OrderInfo.LoadData();
    $("#btnOrderDetail").click(function () {
        window.location.replace(g_const_PageURL.MyOrder_detail + "?oid=" + orderid + "&t=" + Math.random());
    });
});

var OrderSuccess = {
    LoadOrderInfo: function (paymsg) {
        $("#orderNo").html(paymsg.orderno);
        $("#payMoney").html(paymsg.totalmoney);
        $("#btnBack").click(function () {
            var par = "perid=" + paymsg.periodnum + "&pid=" + paymsg.productid;
            g_const_PageURL.GoTo(g_const_PageURL.GoodsDetail, par);
        });
    },
};