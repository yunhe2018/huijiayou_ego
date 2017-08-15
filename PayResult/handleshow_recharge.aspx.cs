using com.hjy.ego.BusinessLayer;
using com.hjy.ego.EntityFacade;
using com.hjy.ego.FrameWork;
using com.hjy.ego.QueryFacade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebUI.PayResult
{
    public partial class handleshow_recharge : System.Web.UI.Page
    {

        protected string ChzMoney = "0";
        public string backurl = "";
        public static string ShowResult = "";
        public static string OrderNo = "";

        RequestCollection rc = new RequestCollection();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

                //{ reurl}?c_succmark ={ c_succmark}
                //&resultmsg ={ resultmsg}
                //&c_order ={ c_order}
                //&c_mid ={ c_mid}
                //&orderid ={ orderid}

                string merchantid = INITools.GetIniKeyValue("MobileCZ", "merchantid");

                PaygateBLL paydll = new PaygateBLL();
                string showstr = "";
                //ResultPacket resultpackge = paydll.DoVerify(Request.Params);
                //if (!resultpackge.IsError)
                //{

                if (Request.Params["c_order"] == null)
                {
                    ShowResult = "<h2>无效的充值订单信息</h2>";
                }
                else
                {
                    OrderNo = Request.Params["c_order"];
                    if (Request.Params["c_succmark"] != "Y")
                    {

                        // ShowResult = "支付失败";
                        Response.Redirect("/Account/Recharge.html?tost=t", true);
                        return;
                    }
                    else
                    {
                        Response.Redirect("/Order/RechargeSuccess.html?orderid=" + OrderNo, true);
                        return;
                    }
                }
            }
        }

        private void SetMac(string Signtype)
        {
            string[] src = new string[rc.Keys.Length];
            for (int i = 0; i < rc.Keys.Length; i++)
            {
                src[i] = rc[i].Trim();
            }
            var srcordered = src.OrderBy(s => s);
            string mac = "";
            if (Signtype == "MD5")
            {
                mac = string.Join("", srcordered) + INITools.GetIniKeyValue("MobileCZ", "MD5_key").Trim();
                rc.Set("mac", DESHelper.ComputeMD5Hash(mac));
            }
            else
            {
                mac = string.Join("", srcordered);
                rc.Set("mac", RSAHelper.SignWithSHA1(INITools.GetIniKeyValue("MobileCZ", "RSA_private_key").Trim(), mac));
            }
        }
    }
}