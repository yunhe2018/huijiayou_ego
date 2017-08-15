window.onload = function () {
    //自适应rem初始化设置
    function fontSize() {
        var calculateFontSize = (10 * (document.documentElement.clientWidth / 320) + 'px');
        if (document.documentElement.clientWidth < 640) {
            document.documentElement.style.fontSize = calculateFontSize;
            return false;
        } else if (document.documentElement.clientWidth < 1280) {
            document.documentElement.style.fontSize = "20px";
            return false;
        }
        if (document.documentElement.clientWidth < 1280) {
            document.documentElement.style.fontSize = calculateFontSize;
            return false;
        }
        else {
            document.documentElement.style.fontSize = "40px";
            return false;
        }
    }
    fontSize();
    window.onresize = function () { fontSize(); };

    var winHeight = $(window).height();
    $(window).on("scroll", function () {
        var el = $(this);
        var iScrollTop = el.scrollTop();
        if ((iScrollTop + winHeight) >= winHeight * 3) {
            $(".to_top").show().on("click", function () {
                $('html,body').animate({ scrollTop: '0px' }, 300, function () {
                    $(".to_top").hide();
                });
            });
        }
        else {
            $(".to_top").hide();
        }
    });
}
function CutPhone(phone) {
    if (isMobile(phone)) {
        var newPhone = "";
        newPhone = phone.substr(0, 3) + "*****" + phone.substr(8, 3);
        return newPhone;
    }
    return phone;
}