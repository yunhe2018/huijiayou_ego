var addressid = "";
var login = "";
var isDefault = 0;

$(document).ready(function () {
    addressid = GetQueryString("addressid");
    login = GetQueryString("login");
    if (login == "1") {
        $("#liCode").hide();
        $("#btnCode").hide();
    }
    else {
        $("#liCode").show();
        $("#btnCode").show();
        addressid = "0";
    }
    if (localStorage.getItem(g_const_localStorage.StoreDistrict)) {
        Address_Edit.Set_Province();
    }
    else {
        Address_All.GetList(Address_All.Load_List);
    }
    if (addressid == "0") {
        // $("#spDefault").show();
        $("#ft_default_address").hide();
        $("#btnDel").hide();
        $("#title").html(' <a class="back" id="btnBack"></a>新增收货地址');
    }
    else {
        //  $("#spDefault").hide();
        $("#ft_default_address").show();
        $("#btnDel").show();
        $("#title").html('<a class="back" id="btnBack"></a>编辑收货地址');
    }
    $("#selProv").change(function () {
        var selectid = $(this).val();
        $.each(_provincelist, function (i, n) {
            if (n.provinceID == selectid) {
                Address_Edit.Set_City(n.cityList);
            }
        });
    });
    $("#selCity").change(function () {
        var selectid = $(this).val();
        $.each(_citylist, function (i, n) {
            if (n.cityID == selectid) {
                Address_Edit.Set_District(n.districtList);
            }
        });
        //District_List.api_input.id = $(this).val();
        //District_List.GetList();
    });
    $("#btnSave").click(function () {
        if ($("#txtUserName").val().length == 0) {
            ShowMesaage(g_const_API_Message["100007"]);
            return;
        }
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if ($("#txtValidCode").val().length == 0 && login == "0") {
            ShowMesaage(g_const_API_Message["7802"]);
            return;
        }
        //判断省
        if ($("#selProv").val() == "0") {
            ShowMesaage(g_const_API_Message["100041"]);
            return;
        }
        //判断市
        if ($("#selCity").val() == "0") {
            ShowMesaage(g_const_API_Message["100042"]);
            return;
        }
        //判断区
        if ($("#selDistrict").val() == "0") {
            ShowMesaage(g_const_API_Message["100009"]);
            return;
        }
        if ($("#txtAddressDetail").val().length == 0) {
            ShowMesaage(g_const_API_Message["100010"]);
            return;
        }
        if ($("#txtUserName").val().length < 2 || $("#txtUserName").val().length > 10) {
            ShowMesaage(g_const_API_Message["100011"]);
            return;
        }
        if (!isMobile($("#txtPhoneNo").val())) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        if ($("#txtAddressDetail").val().length < 5 || $("#txtAddressDetail").val().length > 40) {
            ShowMesaage(g_const_API_Message["100012"]);
            return;
        }
        if ($("#txtIDNumber").val().indexOf("*") == -1) {
            _idNumber = $("#txtIDNumber").val();
        }
        // Message.ShowLoading("收货地址信息提交中", "divAlert");
        if (addressid != "0") {
            Address_Update.api_input.id = addressid;
            Address_Update.api_input.mobile = $("#txtPhoneNo").val();
            Address_Update.api_input.areaCode = $("#selDistrict").val();
            Address_Update.api_input.street = String.Replace($("#txtAddressDetail").val());
            Address_Update.api_input.name = String.Replace($("#txtUserName").val());
            Address_Update.api_input.provinces = $("#selProv").find("option:selected").text() +
                                            $("#selCity").find("option:selected").text() +
                                            $("#selDistrict").find("option:selected").text();
            Address_Update.api_input.idNumber = String.Replace(_idNumber);
            Address_Update.api_input.isdefault = isDefault;
            Address_Update.EditInfo();
        }
        else {
            Address_Add.api_input.phone = $("#txtPhoneNo").val();
            Address_Add.api_input.areaCode = $("#selDistrict").val();
            Address_Add.api_input.address = String.Replace($("#txtAddressDetail").val());
            Address_Add.api_input.name = String.Replace($("#txtUserName").val());
            Address_Add.api_input.province = $("#selProv").find("option:selected").text() +
                                            $("#selCity").find("option:selected").text() +
                                            $("#selDistrict").find("option:selected").text();
            Address_Add.api_input.idNumber = String.Replace(_idNumber);
            Address_Add.api_input.isDefault = isDefault;
            Address_Add.AddInfo();
        }
    });
    $("#btnCode").click(function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "addressvalidcode";
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCode(action, phoneNo);
    });

    $("#btnBack").click(function () {
        Message.ShowConfirm("放弃填写的内容吗？", "", "divAlert", "放弃", "Address_Edit.GoBack", "继续填写");
    });
    $("#spDefault").click(function () {
        //if (addressid!="0") {
        //  //  Address_Default.SetByID(addressid);
        //    isDefault = 1;
        //    $("#spDefault").attr("class", "address-default curr");
        //}
        //else {
        if (isDefault == 0) {
            isDefault = 1;
            $("#spDefault").attr("class", "address-default curr");
        }
        else {
            isDefault = 0;
            $("#spDefault").attr("class", "address-default");
        }
        //}
    });
});
function DeleteAddress() {
    Message.ShowConfirm("确定删除该收货地址？", "", "divAlert", "确定", "Address_EditDel.DeleteByID('" + addressid + "')", "取消");
}
function ChangeUserName() {
    if (_userName != "" && _userName != $("#txtUserName").val()) {
        $("#txtIDNumber").val("");
    }

}
function ClearUserName() {
    if ($("#txtUserName").val() == "") {
        $("#txtIDNumber").val("");
    }

}
var Address_EditDel = {
    api_input: { "address": "" },
    api_target: "com_cmall_newscenter_beauty_api_AddressDeleteApi",
    DeleteByID: function (addressid) {
        Address_EditDel.api_input.address = addressid;
        var s_api_input = JSON.stringify(Address_EditDel.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_EditDel.api_target, "api_token": "1" };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Message.ShowToPage("您还没有登陆或者已经超时.", g_const_PageURL.Login, 2000, "");
                    PageUrlConfig.SetUrl();
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, "");
                    return;
                }
            }
            if (msg.resultCode == g_const_Success_Code) {
                Address_EditDel.LoadResult(msg);
            }
            else {

                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (result) {
        if (localStorage.getItem(g_const_localStorage.OrderAddress) != null) {
            if (Address_EditDel.api_input.address == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                localStorage[g_const_localStorage.OrderAddress] = 0;
            }
        }
        var par = 'oid=' + GetQueryString("oid");
        g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
        // window.location.replace(PageUrlConfig.BackTo(1));
    },
};
function SetDefault() {
    Address_Default.SetByID(addressid);
}
function stime(count) {
    if (count == 0) {
        $('.submit button').attr('disabled', false).removeClass('curr');
        $('.submit button').removeClass('curr');
        $('.submit button').html('获取验证码');
        return false;
    } else {
        $('.submit button').attr('disabled', 'disabled').addClass('curr');
        $('.submit button').html(count + 's后可重发');
        $('.submit button').addClass('curr');
        count--;
    }
    setTimeout(function () {
        stime(count);
    }, 1000)
}
var Address_Edit = {
    GoBack: function () {
        if (localStorage["fromOrderDetail"] != "1") {
            var backurl = PageUrlConfig.BackTo(1);
            Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
        }
        else {
            //localStorage[g_const_localStorage.OrderAddress] = Address_Update.api_input.id;
            var par = 'oid=' + GetQueryString("oid");
            g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
        }
    },
    LoadInfo: function () {
        if (addressid != "0") {
            $("#spoperate").html("编辑");
            Address_Info.GetByID(addressid);
        }
        else {
            $("#spoperate").html("新增");
        }
    },
    Set_Province: function () {
        result = JSON.parse(localStorage.getItem(g_const_localStorage.StoreDistrict)).list
        _provincelist = result;
        var optionstring = "";
        optionstring += "<option value=\"0\">选择省份</option>";
        $("#selCity").html("<option value=\"0\">选择城市</option>");
        $("#selDistrict").html("<option value=\"0\">选择地区</option>");
        $.each(result, function (i, n) {
            optionstring += "<option value=\"" + n.provinceID + "\" >" + n.provinceName + "</option>";
        });
        $("#selProv").html(optionstring);
        Address_Edit.LoadInfo();
    },
    Set_City: function (result, address) {
        _citylist = result;
        var optionstring = "<option value=\"0\">选择城市</option>";
        $("#selDistrict").html("<option value=\"0\">选择地区</option>");
        $.each(result, function (i, n) {
            optionstring += "<option value=\"" + n.cityID + "\" >" + n.cityName + "</option>";
        });
        $("#selCity").html(optionstring);
        if (address) {
            Address_Info.SetCitysInfo(address);
        }
    },
    Set_District: function (result, address) {
        _districtlist = result;
        var optionstring = "<option value=\"0\">选择地区</option>";
        $.each(result, function (i, n) {
            optionstring += "<option value=\"" + n.districtID + "\" >" + n.district + "</option>";
        });
        $("#selDistrict").html(optionstring);
        if (address) {
            Address_Info.SetDistrictsInfo(address);
        }

    }
};