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
    public partial class handleshow_new : System.Web.UI.Page
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
                    hid_orderno.Value = OrderNo;
                    if (Request.Params["c_succmark"] != "Y")
                    {

                        ShowResult = "支付失败";
                        //Response.Redirect("/Order/OrderDetail.html?oid="+ OrderNo, true);
                        return;

                    }
                    else
                    {
                        Response.Redirect("/Order/OrderSuccess.html?orderid=" + OrderNo, true);
                        return;
                        //EGO_Order_ListDAL Order_ListDAL = new EGO_Order_ListDAL();
                        //EGO_Order_List Order_List = Order_ListDAL.GetModel(Request["c_order"]);
                        //if (Order_List == null)
                        //{
                        //    ShowResult = "<h2>无效的充值订单信息</h2>";
                        //}
                        //else
                        //{

                        //    if (Order_List.TotalMoney != decimal.Parse(Request["c_orderamount"]))
                        //    {
                        //        ShowResult = "<h2>订单金额不一致</h2>";
                        //    }
                        //    else
                        //    {

                        //        //获得商品信息
                        //        EGO_Product_ListDAL DAL = new EGO_Product_ListDAL();
                        //        EGO_Product_List Product_model = DAL.GetModel(Order_List.ProductID);

                        //        StringBuilder res = new StringBuilder();

                        //        if (Order_List.Status == EGO_Order_List.EnumOrderStatus.Payed)
                        //        {
                        //            showstr = "支付成功，等待分配号码";
                        //            res.AppendFormat("<h2>{3}</h2><p>订单号：{0}，</p><p>选择商品：{1},</p><p>实际支付：{2}元</p><p></p>", Order_List.OrderNo, Product_model.ProductName, Order_List.TotalMoney.ToString("0.00"), showstr);
                        //        }
                        //        else if (Order_List.Status == EGO_Order_List.EnumOrderStatus.Paying)
                        //        {
                        //            //resultpackge.Description = "订单支付成功，充值进行中";
                        //            showstr = "订单中";
                        //            res.AppendFormat("<h2>{3}</h2><p>订单号：{0}，</p><p>选择商品：{1},</p><p>支付金额：{2}元</p><p></p>", Order_List.OrderNo, Product_model.ProductName, Order_List.TotalMoney.ToString("0.00"), showstr);

                        //        }
                        //        else
                        //        {
                        //            //resultpackge.Description = "订单支付成功，充值进行中";
                        //            showstr = EnumHelper.GetEnumCNNameFromEnum(typeof(EGO_Order_List.EnumOrderStatus), Order_List.Status);
                        //            res.AppendFormat("<h2>{3}</h2><p>订单号：{0}，</p><p>选择商品：{1},</p><p>支付金额：{2}元</p><p></p>", Order_List.OrderNo, Product_model.ProductName, Order_List.TotalMoney.ToString("0.00"), showstr);
                        //        }
                        //        ShowResult = res.ToString();
                        //    }
                        //}
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