<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="handleshow.aspx.cs" Inherits="WebUI.PayResult.handleshow" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="UTF-8">
    <title></title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="email=no" name="format-detection" />
	<meta charset="UTF-8">
<%--    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <link rel="stylesheet" href="/css/index.css">

    <script src="/JS/jquery-2.1.4.js"></script>
   
    <link href="/css/sbc.css" rel="stylesheet" />
    <script src="/JS/g_header.js"></script>

    <script src="/JS/functions/g_Const.js"></script>
    <script src="/JS/functions/g_Type.js"></script>
    <script src="/JS/tost.js"></script>
    <script src="/JS/focus.js"></script>--%>

    <script src="/js/cdn.js"></script>
    <script type="text/javascript">
        var staticlist = [["/css/style.css", "/css/index.css", "/css/sbc.css"], ["/js/jquery-2.1.4.js", "/js/jquery.mobile-1.4.5.js", "/JS/functions/g_Const.js", "/js/g_header.js", "/js/functions/g_Type.js", "/js/tost.js", "/js/g_footer.js", "/js/pages/handleshow.js"]];
    WriteStatic(staticlist);
    </script>


</head>
 <body class="ddbg">
<header><span id="go-back" class="fl jt"></span>抢购结果</header>
<div class="nodata2 pay-ok">
	<div class="img">
		<img src="/img/pay-ok.png" alt=""/>
	</div>
	<div class="txt_cen">
		<div>
            <%=ShowResult %>
		</div>
	</div>
	<a href="/Account/MyEGO_Order_List.html" class="btn">查看我的订单</a>
</div>

                     <!--底部-->
           <%-- <script src="/js/g_footer.js"></script>
            <script src="/js/pages/handleshow.js"></script>--%>

</body>
</html>
