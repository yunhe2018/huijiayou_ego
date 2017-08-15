/// <reference path="g_header.js" />
/// <reference path="functions/g_Type.js" />
/// <reference path="functions/g_Const.js" />
/// <reference path="jquery-2.1.4.js" />

if (!IsDebug) {
    var _hmt = _hmt || [];
    (function () {
        //百度统计
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?b561840922b7efbaf5720b43eccaed3c";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
        //百度竞价
        var hm1 = document.createElement("script");
        hm1.src = "//hm.baidu.com/hm.js?05634cc220f874c4eb61a399d90d296b";
        var s1 = document.getElementsByTagName("script")[0];
        s1.parentNode.insertBefore(hm1, s1);
    })();
    var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://"); document.write(unescape("%3Cspan id='cnzz_stat_icon_1256669490'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "w.cnzz.com/q_stat.php%3Fid%3D1256669490' type='text/javascript'%3E%3C/script%3E"));
}
$(document).ready(function () {
    var url = location.pathname + location.search;
    if (localStorage.getItem(g_const_localStorage.PagePathList) != null && localStorage.getItem(g_const_localStorage.PagePathList).length > 0) {
        g_const_PagePathList = localStorage.getItem(g_const_localStorage.PagePathList).split(',');
    }
    if (g_const_PagePathList[g_const_PagePathList.length - 1] == url && (!(g_const_PagePathList[g_const_PagePathList.length - 1] == "/index.html" || g_const_PagePathList[g_const_PagePathList.length - 1] == "/"))) {
        g_const_PagePathList.pop();
        localStorage[g_const_localStorage.PagePathList] = g_const_PagePathList;
    }
});

//如果来自与分享，则隐藏页面导航
try{
    if (GetQueryString("fromshare") == g_const_YesOrNo.YES.toString()) {
        $("header").css("display", "none");
    }
}
catch (e) {
    console.log("g_footer设定分享功能报错："+e);
}