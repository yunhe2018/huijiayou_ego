<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="handleshow_new.aspx.cs" Inherits="WebUI.PayResult.handleshow_new" %>
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
    <script src="/JS/cdn.js"></script>
    <script type="text/javascript">
        var staticlist = [["/css/base.css", "/css/yiyuan.css"], ["/JS/jquery-2.1.4-min.js", "/JS/g_header.js", "/JS/functions/g_Const.js", "/JS/functions/g_Type.js", "/JS/g_index.js", "/JS/pages/handleshow_new.js"]];
        WriteStatic(staticlist);
    </script>


</head>
 <body>
     <input type="hidden" id="hid_orderno" value="" runat="server"/>
    <div class="subSucc_box">
        <div class="addrHeader">
            <a class="back" id="btnBack"></a>订单支付结果
        </div>
        <div class="subSucc"> <%=ShowResult %></div>
        <div class="list_01">
            <p><label class="lab_02">订单号码:  </label><b id="orderNo"><%=OrderNo %></b></p>
        </div>
        <div class="subSucc_btn">
            <a class="subSucc_btn_detail" onclick="goDetail()">订单详情</a>
            <a class="subSucc_btn_index" onclick="g_const_PageURL.GoTo(g_const_PageURL.Index);">夺宝首页</a>
        </div>
    </div>
    <script type="text/javascript">
        var staticlist = [[], ["/JS/pages/OrderSuccess.js", "/JS/pages/OrderBase.js", "/JS/pages/handleshow_new.js"]];
        WriteStatic(staticlist);
    </script>
</body>
</html>
