<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LoginOauth.aspx.cs" Inherits="WebUI.Account.LoginOauth" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="keywords" content=""/>
    <meta name="description" content=""/>
    <meta content="yes" name="apple-mobile-web-app-capable"/>
    <meta content="telephone=no" name="format-detection"/>
    <meta content="email=no" name="format-detection" />
    <meta name="author" content=""/>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
    <title>一元夺宝</title>
    <script src="/js/jquery-2.1.4.js"></script>

    <script src="/js/g_header.js"></script>
    <script src="/js/functions/g_Const.js"></script>
    <script src="/js/tost.js"></script>
    <script src="/js/JValidator.js"></script>
    <script src="/js/pages/ValidCodeBase.js"></script>
        <script src="../js/ShortURL.js"></script>
    <link rel="stylesheet" type="text/css" href="/css/base.css" />
    <link rel="stylesheet" type="text/css" href="/css/d_style.css" />

</head>
    <body class="bgceee">
        <form id="form_login" name="form_login" method="post">
            <input type="hidden" id="opreate" name="opreate" value="login" />
        <%
            if (!string.IsNullOrEmpty(this.Values["hide_postdata"]))
            {
        %>
            <input type="hidden" id="hide_postdata" name="hide_postdata" value="<%=this.Values["hide_postdata"] %>" />
            <%
            }
        %>
    <section class="container">
        <h1 class="d_back_hd"><a class="d_go_back"></a>用户绑定</h1>
        <article class="d_login">
            <div class="d_sure_wlan">请确保你的手机畅通，用于接受验证码短信</div>
            <ul class="d_register">
                <li><input id="text_mobile" type="tel" name="text_mobile" value="<%=this.Values["text_mobile"]%>" placeholder="请输入11位有效手机号"/><b id="d_close_tel" class="d_close_tel" style="display:none;"></b><a style="z-index:999" id="btnCode" class="d_get_code">获取验证码</a></li>
                <li><input id="text_captcha_mobile" type="tel" name="text_captcha_mobile" value="<%=this.Values["text_captcha_mobile"]%>" placeholder="请输入验证码"/><b id="d_close" class="d_close" style="display:none;"></b></li>
            </ul>
            <div class="d_login_btn">
                <a id ="btn_login" class="d_btn_dl" >立即绑定</a>
            </div>
        </article>
    </section>
            </form>
        <input type="hidden" id="hidWxOpenID" value="" runat="server" />
        <input type="hidden" id="hidshow" value="" runat="server" />
        <script src="/js/functions/g_Type.js"></script>
        <script src="../js/pages/LoginOauth.js"></script>
        <%=base.RenderScriptMessage("login_error") %>
        <script>            
            var str_loginjs = '<%=str_loginjs%>';
            g_type_loginjs.Execute(str_loginjs);
        </script>
        
        <script src="/js/g_footer.js"></script>
</body>
</html>
