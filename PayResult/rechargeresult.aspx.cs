


using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using com.hjy.ego.BusinessLayer;
using com.hjy.ego.FrameWork;
using com.hjy.ego.EntityFacade;
using com.hjy.ego.QueryFacade;
using com.hjy.member.EntityFacade;
using com.hjy.member.BusinessLayer;

namespace WebUI.PayResult
{
    //支付网关支付成功后的通知地址，修改订单状态为“支付成功”
    public partial class rechargeresult : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string returl = "";
            string errstr = "";
            bool isok = false;
            EGO_Pay_ReceiveLogDAL ReceiveLogDAL = new EGO_Pay_ReceiveLogDAL();
            EGO_Pay_ReceiveLog ReceiveLog = new EGO_Pay_ReceiveLog();

            PaygateBLL paydll = new PaygateBLL();
            ResultPacket resultpage = paydll.DoVerify(Request.Params);

            string ReceiveData = "c_mid=" + Request.Params["c_mid"] + "&c_order=" + Request.Params["c_order"] + "&c_orderamount=" + Request.Params["c_orderamount"] + "&c_ymd=" + Request.Params["c_ymd"] + "&c_transnum=" + Request.Params["c_transnum"] + "&c_succmark=" + Request.Params["c_succmark"] + "&c_cause=" + Request.Params["c_cause"] + "&c_moneytype=" + Request.Params["c_moneytype"] + "&dealtime=" + Request.Params["dealtime"] + "&c_memo1=" + Request.Params["c_memo1"] + "&c_memo2=" + Request.Params["c_memo2"] + "&c_signstr=" + Request.Params["c_signstr"] + "&c_paygate=" + Request.Params["c_paygate"] + "&c_version=" + Request.Params["c_version"];

            ReceiveLog.TradeType = "chz";
            ReceiveLog.TradeDesp = "支付网关通知";
            ReceiveLog.ReceiveData = ReceiveData; //;Request.Params.ToString();
            ReceiveLog.Receivetime = DateTime.Now;
            ReceiveLog.OrderNo = Request.Params["c_order"];
            ReceiveLogDAL.Insert(ReceiveLog);

            if (resultpage.IsError)
            {
                #region 记录用户操作日志
                //try
                //{
                //    memlog.Status = FC_Members_Log.EnumLogStatus.Fail;
                //    memlog.MemID = 0;// Order_List.MemID;
                //    memlog.MerchantID ="00";
                //    memlog.Memo = "支付网关返回失败失败，描述：" + resultpage.Description;
                //    memlog.SessionID = "";
                //    memlog.IP = GetIP.GetRequestIP();
                //    memlog.RequestSerialNo = "";
                //    memlog.ResultMessage = "支付网关返回失败，描述：" + resultpage.Description;
                //    memlog.TradeMerchantID = "00"; // System.Utils.Common.INI.IniReadvalue("System", "MerchantID", _inifile);
                //    new FC_Members_LogDAL().Insert(memlog);
                //}
                //catch
                //{
                //}

                #endregion  
                //Response.Redirect("/Account/Recharge.html?tost=t");
               // returl = ReturnUrl(1, "");
                // Response.Redirect("", true);
                returl = ReturnUrl(0, resultpage.Description);
            }
            else
            {
                resultpage = new CardChzBLL().doChzResult(Request["c_order"], decimal.Parse(Request["c_orderamount"]));
                if (resultpage.IsError)
                {
                   // Response.Redirect("/Account/Recharge.html?tost=t");
                    returl = ReturnUrl(0, resultpage.Description);
                }
                else
                {
                    returl = ReturnUrl(1, INITools.GetIniKeyValue("paygate", "handleurl_recharge_ego"));
                }
            }

            ReceiveLog.ResponseData = returl;
            ReceiveLog.ResponseTime = DateTime.Now;
            if (resultpage.IsError)
            {
                ReceiveLog.ResultCode = "0";
            }
            else
            {
                ReceiveLog.ResultCode = "1";
            }
            if (isok)
            {
                ReceiveLog.ResultMessage = "通知成功，发起充值成功";
            }
            else {
                ReceiveLog.ResultMessage = "通知成功，增加充值日志异常,描述：" + errstr;
                //向综合后台增加日志
                ProjectLogBLL.NotifyProjectLog("通知成功，增加充值日志异常,描述：" + errstr, "pay_result_err");
            }
            ReceiveLogDAL.Update(ReceiveLog);

            Response.Write(returl);
        }

        private string ReturnUrl(byte result, string reURL)
        {
            return string.Format("<result>{0}</result><reURL>{1}</reURL>", result, reURL);
        }
    }
}
