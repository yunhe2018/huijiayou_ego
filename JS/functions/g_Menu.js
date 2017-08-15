(function () {
    var menu = [];
    menu.push('<ul class="b_nav clearfix">');
    menu.push('<li onclick="g_const_PageURL.GoTo(g_const_PageURL.Index);" id="nav_home"><div class="b_nav_pic bpic1"></div><div class="b_nav_txt">首页</div></li>');
    menu.push('<li onclick="g_const_PageURL.GoTo(g_const_PageURL.MyTuan);" id="nav_mytuan"><div class="b_nav_pic bpic2"></div><div class="b_nav_txt">我的团</div></li>');
    menu.push('<li onclick="g_const_PageURL.GoTo(g_const_PageURL.MyOrder_List);" id="nav_myorder"><div class="b_nav_pic bpic3"></div><div class="b_nav_txt">我的订单</div></li>');
    menu.push('<li onclick="g_const_PageURL.GoTo(g_const_PageURL.MyAccount);" id="nav_member"><div class="b_nav_pic bpic4"></div><div class="b_nav_txt">个人中心</div></li>');
    menu.push('</ul>');
    document.write(menu.join(""));
})();