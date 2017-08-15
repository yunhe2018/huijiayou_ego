var TuanProductDetail = {
    EventCode: GetQueryString("eid"),
    Init: function () {
        g_type_tuanInfo.api_input.eventCoe = TuanProductDetail.EventCode;
        g_type_tuanInfo.LoadData(TuanProductDetail.LoadResult);
    },
    LoadResult: function (data) {
        if (data.length > 0) {
            var item = data[0];
            console.log(item);
            if (item) {
                var swiper = [];
                if (item.pcPicList.length > 0) {
                    $(item.pcPicList).each(function () {
                        swiper.push('<div class="swiper-slide"><a><img src="' + this + '" /></a></div>');
                    });
                }
                else {
                    swiper.push('<div class="swiper-slide"><a><img src="' + (item.mainpicUrl || g_goods_Pic) + '" /></a></div>');
                }
                $("#swiperList").html(swiper.join(""));
                $("#skuName").html(item.skuName);
                $("#descriptionText").html(item.description.descriptionInfo);
                $("#price").html(item.sellingPrice.toFixed(2));
                $("#saleNum").html(item.fictitionSales);
                $("#salePrice").html(item.favorablePrice.toFixed(2) + "/件");


                $("#descriptionImg").empty();
                if (item.description.descriptionPic) {
                    var arr = item.description.descriptionPic.split('|');
                    var arrImgs = [];
                    $(arr).each(function () {
                        if (this != "") {
                            arrImgs.push('<img src="' + this + '" alt="' + item.skuName + '" title="' + item.skuName + '" />');
                        }
                    });
                    $("#descriptionImg").html(arrImgs.join(''));
                }
                //初始化swiper
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    paginationClickable: true,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 2500,
                    autoplayDisableOnInteraction: false
                });
            }
        }
    },
    CreateOrder: function () {
        var par = "eid=" + TuanProductDetail.EventCode;
        UserLogin.Check(function () {
            console.log(UserLogin.LoginStatus);
            if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
                if (IsInWeiXin.check()) {
                    var wxUrl = g_const_PageURL.OrderConfirmPin + "?t=" + Math.random() + "&showwxpaytitle=1&eid=" + TuanProductDetail.EventCode;
                    WxInfo.GetPayID(wxUrl);
                }
                else {
                    g_const_PageURL.GoTo(g_const_PageURL.OrderConfirmPin, par);
                }
                localStorage["fromOrderConfirm"] = "1";
            }
            else {
                g_const_PageURL.GoTo(g_const_PageURL.AddressEdit, par);
                localStorage["fromOrderConfirm"] = "1";
            }
        });

    }
};