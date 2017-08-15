function SetHtmlByDate() {
    Guide.Main();
}

var Guide = {
    Main: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getguideconfig&shopid=hjy",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            
                
                    var sp_flag = 0;
                    var img_flag = 0;
                  //  $('.mask').show();
                    $.each(actlist.ResultTable, function (k, o) {
                        if ((GetQueryString("from") == o.merchantcode || localStorage[g_const_localStorage.OrderFrom] == o.merchantcode)
                            && (localStorage[g_const_localStorage.Card_Key] == undefined || o.cardflag.indexOf(localStorage[g_const_localStorage.Card_Key]) > -1 || o.cardflag.length == 0)) {
                            if ($("#sp_guide")) {
                                if (o.divtitle == "" && msg.list.length > 0) {
                                    $("#sp_guide").html(msg.list[0].TitleStr);
                                }
                                else {
                                    $("#sp_guide").html(o.divtitle);
                                }
                                if (o.divshow == "1" && $("#div_app")) {
                                    $("#div_app").show();
                                }
                                sp_flag = 1;
                            }
                            if ($("#img_guide")) {
                                if (o.img_div == "") {
                                var item;
                                item = sessionStorage.getItem('val');
                                if (!item) {
                                    if ($('.hongbao').length>0) {
                                        document.body.scrollTop = 0;
                                        $('.hongbao').show();
                                    }
                                    else {
                                        $('.hongbao').hide();
                                        $('.mask').hide();
                                    }
                                }

                                }
                                else {
                                    $('.mask').show();
                                    $("#img_guide").attr("src", g_merchant_Act_Host + o.img_div);
                                    $('#img_guide').show();
                                }
                                img_flag = 1;
                            }
                            return false;
                        }
                    });
                if (msg.list.length > 0) {
                    if ($("#sp_guide")) {
                        if (sp_flag == 0 && msg.list[0].TitleStr) {
                            $("#sp_guide").html(msg.list[0].TitleStr);
                        }
                    }
                    if ($("#img_guide")) {
                        if (img_flag == 0) {

                            if (msg.list[0].ImgPath) {
                            //    $('.mask').show();
                                $("#img_guide").attr("src", msg.list[0].ImgPath);
                            }
                            else {
                                $('.mask,.guide-app').hide();
                            }
                        }
                    }
            }
                else {
                    if (img_flag == 0) {
                        $('.mask,.guide-app').hide();
                    }
                }
            try {
                //判断是否有App指导价js文件
                if (!(goodsapppricelist == undefined)) {
                    //localStorage["goodsapppricelist"] = "";
                    if (!(goodsapppricelist.ResultTable == undefined) && goodsapppricelist.ResultTable != "") {
                        localStorage["goodsapppricelist"] = goodsapppricelist;

                        $.each(goodsapppricelist.ResultTable, function (i, n) {
                            if (GetQueryString("pid").indexOf(n.goodscode) > -1) {
                                $("#sp_guide_smg").html(n.appprice);
                            }
                        });
                    }
                }
            }
            catch (e) { }
        });

        request.fail(function (jqXHR, textStatus) {
        });
    },
};