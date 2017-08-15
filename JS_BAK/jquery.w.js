/**
 * @ 
 * @ Date: 2015-08-04
 * @ Author: w
 * @
 */
$(function () {

    /* @ 顶部搜索框 */
    $(window).on('scroll', function () {
        var endScroll=100;
        var header = $('.header');
        var scrollBtn = $('.scroll-top');
        var top = document.body.scrollTop;
        var scale=top/endScroll;
        if(scale >= 1){
            scale=1
        }
        header.css('background', 'rgba(220, 15, 80, ' + scale + ')');
        //top <= 50 && header.removeAttr('style');
        top >= 750 ? scrollBtn.show() : scrollBtn.hide();
    });

    /* @ 返回顶部 */
    $('.scroll-top').on('click', function () {
        document.body.scrollTop = 0;
        $(this).hide();
    });

    /* @ 商品推荐 
    if ($('#touch-wrap').length) {
        touchInit();
    }
    function touchInit() {
        var iWidth = $(window).innerWidth();
        var wrap = $('.touch-wrap');
        var goodsWrap = $('.goods-recomd');
        var aLi = goodsWrap.find('li');
        aLi.css({
            'width': Math.ceil(iWidth / 3)
        });
        wrap.css({
            'width': iWidth,
        });
        goodsWrap.css({
            'width': Math.ceil(aLi.outerWidth()) * aLi.length
        });
        var myscroll = new iScroll("touch-wrap", {
            hScrollbar: false,
            vScrollbar: false
        });
    }
    */

    /* @ 全部订单下拉 */
    $('.order-menu').on('click', function () {
        var _this = $(this);
        var parentChild = _this.parent();
        var listChild = parentChild.find('.order-menu-list');
        listChild.is(':hidden') ? listChild.show() : listChild.hide();
        listChild.is(':hidden') ? _this.removeClass('menu-curr') : _this.addClass('menu-curr');
    });

    /* @ 修改密码 */
    $('.pass-clear').on('click', function () {
        var parent = $(this).parent();
        var input = parent.find('input');
        input.val('').focus();
    });
    $('.show-password').on('click', function () {
        var _this = $(this);
        var parent = $(this).parent();
        var input = parent.find('input');
        if (!_this.hasClass('show-pw-c')) {
            _this.addClass('show-pw-c');
            input.attr('type', 'text');
        } else {
            _this.removeClass('show-pw-c');
            input.attr('type', 'password');
        }
    });

    /* @ 优惠劵  */
    $('.coupon-tab').on('click', 'li', function () {
        var _this = $(this);
        var index = _this.index();
        var couponArea = $('.coupon-area');
        _this.addClass('curr').siblings().removeClass('curr');
        couponArea.css('display', 'none').eq(index).css('display', 'block');
    });

    /* @ 优惠劵使用说明  */
    $('.coupon-btn').on('click', function () {
        var _this = $(this);
        var nextChild = _this.next();
        _this.addClass('curr');
        nextChild.is(':hidden') ? nextChild.show() && _this.addClass('curr') : nextChild.hide() && _this.removeClass('curr');
    });

    /* @ 首页焦点图 
    $('.swipe-slide').swipeSlide({
       continuousScroll:true,
       speed : 3000,
       transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
       callback : function(i){
           $('.swipe-num').children().eq(i).addClass('curr').siblings().removeClass('curr');
       }
    });
    */

    /* @ 引导页 */
    var item;
    item = sessionStorage.getItem('val');
    if (!item && $('.mask')[0]) {
        document.body.scrollTop = 0;
        if (GetQueryString("from") != "adks" && GetQueryString("from") != "linktech") {
            $('.guide-app').show();
            $('.mask').show();
            $('.mask,.guide-app').on('touchmove', function (event) {
                event.preventDefault();
            });
        }
        
        $('.guide-close').on('click', function () { 
            var el = $(this);
            if (window.sessionStorage) {
                sessionStorage.setItem('val', '1');
            }
            el.parent().remove();
            $('.mask').remove();
            Merchant1.RecordContine();
            if (localStorage[g_const_localStorage.OrderFrom] != null) {
                if (localStorage[g_const_localStorage.OrderFrom] != "") {
                    Merchant1.RecordPageAct(localStorage[g_const_localStorage.OrderFrom], "_continue");
                }
            }
        })
    }
});