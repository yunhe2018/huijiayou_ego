$(document).ready(function () {

    if (!localStorage.getItem(g_const_localStorage.StoreDistrict)) {
        Address_All.GetList();
    }

    UserLogin.Check(Address_Info.GetList);
    $("#btnNewaddress,#btnNotNewaddress").click(function () {
        if (_addressmax <= _addresstotal) {
            ShowMesaage(g_const_API_Message["100038"] + _addressmax);
        }
        else {
            //保存返回URL
            PageUrlConfig.SetUrl(g_const_PageURL.AddressEdit + "?addressid=0&oid=" + GetQueryString("oid") + "&login=" + UserLogin.LoginStatus + "&t=" + Math.random());
            window.location.replace(g_const_PageURL.AddressEdit + "?addressid=0&oid=" + GetQueryString("oid") + "&login=" + UserLogin.LoginStatus + "&t=" + Math.random());
        }
    });
    $("#btnBack").click(function () {
        if (localStorage["fromOrderDetail"] != "1") {

        }
        else {
            //localStorage[g_const_localStorage.OrderAddress] = Address_Update.api_input.id;
            var par = 'oid=' + GetQueryString("oid");
            g_const_PageURL.GoTo(g_const_PageURL.MyOrder_detail, par);
        }
    });
});

function DeleteAddress(addressid) {
    Message.ShowConfirm("确定删除该收货地址？", "", "divAlert", "确定", "Address_Del.DeleteByID('" + addressid + "')", "取消");
}
var _addressmax = 50;