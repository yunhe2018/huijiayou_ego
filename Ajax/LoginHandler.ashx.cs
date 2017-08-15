using System;
using System.Web;
using System.Web.SessionState;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;

namespace com.ichsy.jyh.WebTouch.Ajax
{
    /// <summary>
    /// LoginHandler 的摘要说明
    /// </summary>
    public class LoginHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            //不让浏览器缓存
            context.Response.Buffer = true;
            context.Response.ExpiresAbsolute = DateTime.Now.AddDays(-1);
            context.Response.AddHeader("pragma", "no-cache");
            context.Response.AddHeader("cache-control", "");
            context.Response.CacheControl = "no-cache";
            context.Response.ContentType = "text/plain";
            switch (context.Request["action"])
            {
                case "code":
                    int i;
                    Color clr;
                    int codeW = 80;
                    int codeH = 30;
                    int fontSize = 0x10;
                    string chkCode = string.Empty;
                    Color[] color = new Color[] { Color.Black, Color.Red, Color.Blue, Color.Green, Color.Orange, Color.Brown, Color.Brown, Color.DarkBlue };
                    string[] font = new string[] { "Times New Roman", "Verdana", "Arial", "Gungsuh", "Impact" };
                    char[] character = new char[] { 
            '2', '3', '4', '5', '6', '8', '9', 'a', 'b', 'd', 'e', 'f', 'h', 'k', 'm', 'n', 
            'r', 'x', 'y', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 
            'P', 'R', 'S', 'T', 'W', 'X', 'Y'
         };
                    Random rnd = new Random();
                    for (i = 0; i < 4; i++)
                    {
                        chkCode = chkCode + character[rnd.Next(character.Length)];
                    }
                    context.Session["dt_session_code"] = chkCode;
                    Bitmap bmp = new Bitmap(codeW, codeH);
                    Graphics g = Graphics.FromImage(bmp);
                    g.Clear(Color.White);
                    for (i = 0; i < 1; i++)
                    {
                        int x1 = rnd.Next(codeW);
                        int y1 = rnd.Next(codeH);
                        int x2 = rnd.Next(codeW);
                        int y2 = rnd.Next(codeH);
                        clr = color[rnd.Next(color.Length)];
                        g.DrawLine(new Pen(clr), x1, y1, x2, y2);
                    }
                    for (i = 0; i < chkCode.Length; i++)
                    {
                        string fnt = font[rnd.Next(font.Length)];
                        Font ft = new Font(fnt, (float)fontSize);
                        clr = color[rnd.Next(color.Length)];
                        g.DrawString(chkCode[i].ToString(), ft, new SolidBrush(clr), (float)((i * 18f) + 2f), (float)0f);
                    }
                    for (i = 0; i < 100; i++)
                    {
                        int x = rnd.Next(bmp.Width);
                        int y = rnd.Next(bmp.Height);
                        clr = color[rnd.Next(color.Length)];
                        bmp.SetPixel(x, y, clr);
                    }
                    context.Response.Buffer = true;
                    context.Response.ExpiresAbsolute = DateTime.Now.AddMilliseconds(0.0);
                    context.Response.Expires = 0;
                    context.Response.CacheControl = "no-cache";
                    context.Response.AppendHeader("Pragma", "No-Cache");
                    MemoryStream ms = new MemoryStream();
                    try
                    {
                        bmp.Save(ms, ImageFormat.Png);
                        context.Response.ClearContent();
                        context.Response.ContentType = "image/Png";
                        context.Response.BinaryWrite(ms.ToArray());
                    }
                    finally
                    {
                        bmp.Dispose();
                        g.Dispose();
                    }
                    break;
                //case "login":
                //    string Action = context.Request["action"];
                //    string user_Account = context.Request["user_Account"];
                //    string userPwd = context.Request["userPwd"];
                //    string code = context.Request["code"];
                //    if (context.Session["dt_session_code"] == null)
                //    {
                //        context.Response.Write("-1");
                //        context.Response.End();
                //    }
                //    if (code.ToLower() != context.Session["dt_session_code"].ToString().ToLower())
                //    {
                //        context.Response.Write("1");
                //        context.Response.End();
                //    }

                //    ResultPacket rp = new SYS_UserInfoBLL().CheckUserLogin(user_Account, userPwd);
                //    context.Response.Write(rp.ResultCode);
                //    context.Response.End();
                //    break;
                //case "logout":
                //    new SYS_UserInfoBLL().UserLogout();
                //    break;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}