<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="award.aspx.cs" Inherits="WebUI.Act.ry.award" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table style="width: 100%;">
            <tr>
                <td>&nbsp;</td>
                <td>开奖设定</td>
            </tr>
            <tr>
                <td>期号</td>
                <td><asp:TextBox ID="txtPeriodNum" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>胜队</td>
                <td><asp:TextBox ID="txtTeam" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>MVP</td>
                <td><asp:TextBox ID="txtMvp" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td></td>
                <td><asp:Button ID="btnAward" runat="server" Text="开  奖" OnClick="btnAward_Click" /></td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
