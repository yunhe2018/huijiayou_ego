var _storedistrict;
var _provincelist;
var _citylist;
var _districtlist;
var _addresstotal = 0;
var _idNumber = "";
var _userName = "";

var Address_All = {
    api_target: "com_cmall_familyhas_api_ApiForGetStoreDistrict",
    api_input: { "version": 1.0 },
    GetList: function (callback) {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                localStorage[g_const_localStorage.StoreDistrict] = JSON.stringify(msg);
                if (typeof (callback) == "function")
                    callback();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_List: function () {
        Address_Edit.Set_Province();
    },

};
//新增地址信息
var Address_Add = {
    api_input: { "phone": "", "areaCode": "", "address": "", "name": "", "province": "", "isDefault": "", "idNumber": "" },
    AddInfo: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressadd&api_input=" + s_api_input + "&validcode=" + $("#txtValidCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code.toString()) {
                    if (msg.resultcode == "916421182") {
                        Message.ShowAlert("您的身份证曾被海关退回", "为确保下单成功，请核对身份证！", "divAlert", "确定");
                    }
                    else {
                        ShowMesaage(msg.resultmessage);
                        Message.Operate('', "divAlert");
                    }
                }
                else {
                    Address_Add.Load_Result(msg);
                    Message.Operate('', "divAlert");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    Load_Result: function (msg) {
        if (msg.resultmessage == "isnew") {
            localStorage[g_const_localStorage.IsnewReg] = 1;
            g_type_loginjs.Member.phone = Address_Add.api_input.phone;
            localStorage[g_const_localStorage.Member] = JSON.stringify(g_type_loginjs);
            if (IsInWeiXin.check()) {
                Address_Add.Load_WxInfo();
            }
            else {
                if (localStorage["fromOrderDetail"] != "1") {
                    var backurl = PageUrlConfig.BackTo(1);
                    Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
                }
                else {
                    //localStorage[g_const_localStorage.OrderAddress] = Address_Update.api_input.id;
                    var par = 'oid=' + GetQueryString("oid");
                    g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
                }

            }
        }
        else {
            if (localStorage["fromOrderDetail"] != "1") {
                localStorage[g_const_localStorage.IsnewReg] = 0;
                var backurl = PageUrlConfig.BackTo(1);
                Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
            }
            else {
                var par = 'oid=' + GetQueryString("oid");
                g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
            }

        }
    },
    Load_WxInfo: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getwxopenidbyphone&phone_no=" + Address_Add.api_input.phone,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode != g_const_Success_Code_IN) {
                //去获得微信ID
                var wxUrl = g_const_PageURL.OrderConfirmPin + "?t=" + Math.random() + "&showwxpaytitle=1&eid=" + GetQueryString("eid");
                window.location.replace(g_const_PageURL.OauthLogin + "?oauthtype=WeiXin&returnurl=" + encodeURIComponent(wxUrl) + "&scope=b");
            }
            else {
                if (localStorage["fromOrderDetail"] != "1") {
                    var backurl = PageUrlConfig.BackTo(1);
                    Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
                }
                else {
                    localStorage[g_const_localStorage.OrderAddress] = Address_Update.api_input.id;
                    var par = 'oid=' + GetQueryString("oid");
                    g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};
//编辑地址信息
var Address_Update = {
    api_input: { "id": "", "mobile": "", "areaCode": "", "street": "", "name": "", "provinces": "", "isdefault": "", "idNumber": "" },
    EditInfo: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressedit&api_input=" + s_api_input + "&validcode=" + $("#txtValidCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code.toString()) {
                    if (msg.resultcode == "916421182") {
                        Message.ShowAlert("您的身份证曾被海关退回", "为确保下单成功，请核对身份证！", "divAlert", "确定");
                    }
                    else {
                        ShowMesaage(msg.resultmessage);
                        Message.Operate('', "divAlert");
                    }
                    return;
                }
                else {
                    Address_Update.Load_Result();
                    Message.Operate('', "divAlert");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    Load_Result: function () {
        if (localStorage["fromOrderDetail"] != "1") {
            var backurl = PageUrlConfig.BackTo(1);
            Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
        }
        else {
            localStorage[g_const_localStorage.OrderAddress] = Address_Update.api_input.id;
            var par = 'oid=' + GetQueryString("oid");
            g_const_PageURL.GoTo(g_const_PageURL.AddressList, par);
        }
    },
};


//根据ID获取地址
var Address_Info = {
    GetByID: function (addressid) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getaddressbyid&addressid=" + addressid,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                Address_Info.SetAddressInfo(msg);
            }
            else {
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SetAddressInfo: function (result) {
        $("#txtUserName").val(result.name);
        _userName = result.name;
        $("#txtPhoneNo").val(result.mobile);
        $("#txtAddressDetail").val(result.street);
        if (result.idNumber != "") {
            _idNumber = result.idNumber
            $("#txtIDNumber").val((result.idNumber.substr(0, 4) + (result.idNumber.length > 0 ? "**********" : "") + result.idNumber.substr(14)));

        }

        isDefault = result.isdefault;
        if (isDefault == 0) {
            $("#ft_default_address").show();//("class", "address-default");
        }
        else {
            $("#ft_default_address").hide();//.attr("class", "address-default curr");
        }

        Address_Info.SetProvincesInfo(result.provinces);
    },
    SetProvincesInfo: function (result) {
        var selectid = 0;
        $("#selProv option").each(function () {
            if (result.indexOf($(this).text()) > -1) {
                selectid = $(this).val();
                $.each(_provincelist, function (i, n) {
                    if (n.provinceID == selectid) {
                        Address_Edit.Set_City(n.cityList, result);
                        return false;
                    }
                });
            }
        });
        $("#selProv").val(selectid);
    },
    SetCitysInfo: function (result) {
        var selectid = 0;
        $("#selCity option").each(function () {
            if (Address_Info.GetDistricts == 0) {
                if (result.indexOf($(this).text()) > -1) {
                    selectid = $(this).val();
                    $.each(_citylist, function (i, n) {
                        if (n.cityID == selectid) {
                            Address_Edit.Set_District(n.districtList, result);
                            return false;
                        }
                    });
                }
            }
        });
        $("#selCity").val(selectid);
    },
    GetDistricts: 0,
    SetDistrictsInfo: function (result) {
        var selectid = 0;
        $("#selDistrict option").each(function () {
            if (result.indexOf($(this).text()) > -1) {
                selectid = $(this).val();
                Address_Info.GetDistricts = 1;
                return false;
            }
        });
        $("#selDistrict").val(selectid);
    },
    api_input: {},
    api_target: "com_cmall_newscenter_beauty_api_GetAddress",
    GetList: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            PageUrlConfig.SetUrl();
            g_const_PageURL.GoTo(g_const_PageURL.Login);
        }
        else {
            var s_api_input = JSON.stringify(this.api_input);
            var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
            var purl = g_INAPIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=addresslist",
                dataType: g_APIResponseDataType
            });

            request.done(function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Error_Code.UnLogin) {
                        PageUrlConfig.SetUrl();
                        Message.ShowToPage("", g_const_PageURL.Login, 2000, "");
                        return;
                    }
                    if (msg.adress == undefined || msg.adress == "undefined") {
                        _addresstotal = 0;
                        $("#atcList").hide();
                        $("#atcListNull").show();
                        //PageUrlConfig.SetUrl(g_const_PageURL.AddressEdit + "?addressid=0&oid=" + GetQueryString("oid") + "&login=" + UserLogin.LoginStatus + "&t=" + Math.random());
                        //window.location.replace(g_const_PageURL.AddressEdit + "?addressid=0&oid=" + GetQueryString("oid") + "&login=" + UserLogin.LoginStatus + "&t=" + Math.random());
                    }
                }
                if (msg.resultCode == g_const_Success_Code) {
                    Address_Info.LoadResult(msg.adress);
                    _addresstotal = msg.adress.length;
                }
                else {
                    //ShowMesaage(msg.resultMessage);
                }
            });

            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    },
    LoadResult: function (result) {
        if (result.length > 0) {
            var body = "";
            var body_common = "";
            var body_default = "";
            var body_lastused = "";
            $.each(result, function (i, n) {
                if (n.isdefault == "1") {
                    if (localStorage.getItem(g_const_localStorage.OrderAddress) != null && n.id == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                        body_default += '<li class="clearfix"><div class="radio on" onclick="Address_Info.OrderAddress(\'' + n.id + '\',this);"><input type="radio" name="zhifu" value="zhifubao" checked="checked" /></div> <div class="addrInfo">';
                    }
                    else {
                        body_default += '<li class="clearfix"><div class="radio" onclick="Address_Info.OrderAddress(\'' + n.id + '\',this);" style="color:red;background:none;">默认</div> <div onclick="Address_Info.OrderAddress(\'' + n.id + '\',this);" class="addrInfo">';
                    }
                    body_default += '<p>' + n.name + '</p>'
                    body_default += '<p>' + n.mobile + '</p>'
                    body_default += '<p>' + n.provinces + n.street + '</p>'
                    body_default += "</div>";
                    body_default += ' <div class="addr_edit" onclick="Address_Info.EditAddress(\'' + g_const_PageURL.AddressEdit + "?addressid=" + n.id + "&login=" + UserLogin.LoginStatus + "&oid=" + GetQueryString("oid") + '\');">编辑</div>'
                    body_default += "</li>";
                }
                else if (localStorage.getItem(g_const_localStorage.OrderAddress) != null && n.id == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                    body_lastused += '<li class="clearfix"><div class="radio on" onclick="Address_Info.OrderAddress(\'' + n.id + '\',this);"><input type="radio" name="zhifu" value="zhifubao" checked="checked" /></div> <div onclick="Address_Info.OrderAddress(\'' + n.id + '\',this);" class="addrInfo">';
                    body_lastused += '<p>' + n.name + '</p>'
                    body_lastused += '<p>' + n.mobile + '</p>'
                    body_lastused += '<p>' + n.provinces + n.street + '</p>'
                    body_lastused += "</div>";
                    body_lastused += ' <div class="addr_edit" onclick="Address_Info.EditAddress(\'' + g_const_PageURL.AddressEdit + "?addressid=" + n.id + "&login=" + UserLogin.LoginStatus + "&oid=" + GetQueryString("oid") + '\');">编辑</div>'
                    body_lastused += "</li>";
                }
                else {
                    body_common += '<li class="clearfix"><div class="radio" onclick="Address_Info.OrderAddress(\'' + n.id + '\',this);"><input type="radio" name="zhifu" value="zhifubao"  /></div> <div class="addrInfo" onclick="Address_Info.OrderAddress(\'' + n.id + '\',this);">';
                    body_common += '<p>' + n.name + '</p>'
                    body_common += '<p>' + n.mobile + '</p>'
                    body_common += '<p>' + n.provinces + n.street + '</p>'
                    body_common += "</div>";
                    body_common += ' <div class="addr_edit" onclick="Address_Info.EditAddress(\'' + g_const_PageURL.AddressEdit + "?addressid=" + n.id + "&login=" + UserLogin.LoginStatus + "&oid=" + GetQueryString("oid") + '\');">编辑</div>'
                    body_common += "</li>";
                }
            });
            body = body_default + body_lastused + body_common;
            $("#atcList").html(body).show();

            if (localStorage["fromOrderConfirm"] == "0") {
                $("#atcList .radio,.radio on").css("background", "none");
            }
            $("#atcListNull").hide();
        }
        else {
            $("#atcList").hide();
            $("#atcListNull").show();
        }
    },
    OrderAddress: function (addressid, obj) {
        if (localStorage["fromOrderDetail"] == "1") {
            localStorage[g_const_localStorage.OrderAddress] = addressid;
            var par = 'oid=' + GetQueryString("oid");
            g_const_PageURL.GoTo(g_const_PageURL.MyOrder_detail, par);
        }
        else {
            localStorage[g_const_localStorage.OrderAddress] = addressid;
            $(".radio").removeClass("on");
            $(obj).find(".radio").addClass("on");
            //PageUrlConfig.SetUrl(g_const_PageURL.AddressList);
            //window.location.replace(g_const_PageURL.AddressEdit + "?addressid=" + addressid + "&login=" + UserLogin.LoginStatus);
        }
    },
    EditAddress: function (addressURL) {
        //保存下一页用于返回的url
        PageUrlConfig.SetUrl(addressURL);
        window.location.replace(addressURL + "&t=" + Math.random());
        return false;
    },

};


var Address_Del = {
    api_input: { "address": "" },
    api_target: "com_cmall_newscenter_beauty_api_AddressDeleteApi",
    DeleteByID: function (addressid) {
        Address_Del.api_input.address = addressid;
        var s_api_input = JSON.stringify(Address_Del.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_Del.api_target, "api_token": "1" };
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
                Address_Del.LoadResult(msg);
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
            if (Address_Del.api_input.address == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                localStorage[g_const_localStorage.OrderAddress] = 0;
            }
        }
        Address_Info.GetList();
    },
};
var Address_Default = {
    api_input: { "address": "" },
    api_target: "com_cmall_newscenter_beauty_api_AddressSelectApi",
    SetByID: function (addressid) {
        Address_Default.api_input.address = addressid;
        var s_api_input = JSON.stringify(Address_Default.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_Default.api_target, "api_token": "1" };
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
                Address_Default.LoadResult(msg);
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
        $("#ft_default_address").hide();
        ShowMesaage(g_const_API_Message["100006"]);
    },
};