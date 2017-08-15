using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using com.hjy.ego.FrameWork;
using com.hjy.ego.BusinessLayer;
using com.hjy.ego.EntityFacade.Json;
using System.Web;
using com.hjy.ego.EntityFacade;
using com.hjy.ego.BusinessLayer.WxPayAPI;
using System.Configuration;
using System.Text;
using System.IO;

namespace com.ichsy.jyh.WebTouch.Ajax
{
    public partial class API : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            string outString = "";
            string yqStr = "";
            string qst = "";
            string phoneno = "";
            bool isallok = false;

            double LoginMaxSecond = 120;
            double TotalSeconds = 0;
            string LoginMD5_key = "";
            DateTime ddd = new DateTime();
            bool wxdebug = false;
            EGO_Order_List order;
            OrderEgoBLL orderBLL = new OrderEgoBLL();
            string orderno = "";
            string fileName = "";

            Json_Response_Base.UploadPic_resultPackage jrb = new Json_Response_Base.UploadPic_resultPackage();


            if (!bool.TryParse(Request["debug"] ?? "", out wxdebug))
                wxdebug = false;
            try
            {
                ResultPacket rp = new ResultPacket();
                Json_Response_Base.resultPackage jrp = new Json_Response_Base.resultPackage();
                switch (Request["action"])
                {
                    //收货地址验证码
                    case "addressvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], JYH_SMSCode.EnumSMSTradeType.SaveAddress);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //收货地址验证码
                    case "loginvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.PhoneLogin, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //收货地址验证码
                    case "oauthvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], JYH_SMSCode.EnumSMSTradeType.BindMobileAndMobileReg);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机注册验证码
                    case "registervalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.PhoneRegister, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //重新设置密码
                    case "passwordreset":
                        phoneno = Session["UserName"] == null ? (Request["phoneno"] ?? "") : Session["UserName"].ToString();
                        jrp = new LoginBLL().ResetPassWord(phoneno, Request["validcode"], Request["password"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //重置密码验证码
                    case "resetpasswordvalidcode":
                        phoneno = Session["UserName"] == null ? (Request["mobileno"] ?? "") : Session["UserName"].ToString();
                        rp = SMSBll.MakeSMSCodeAndSend(phoneno, (int)JYH_SMSCode.EnumSMSTradeType.PasswordReset, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机注册验证码
                    case "lqfxtqvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.LQFXTQ, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //用户登录
                    case "userlogin":
                        try
                        {
                            jrp = new LoginBLL().CheckLogin(Request["username"], Request["password"]);
                            outString = JsonHelper.ToJsonString(jrp);

                            if (jrp.resultcode == "1")
                            {
                                try
                                {
                                    //保存用户信息至本地
                                    new LoginBLL().SyncJYHMemberInfo(Request["password"], "wap");
                                }
                                catch (Exception exd)
                                {
                                    //记录异常
                                    ProjectLogBLL.NotifyProjectLog(string.Format("一元购-保存用户信息至本地--异常：{0}", exd.ToString()), "active：API.asp的" + Request["action"]);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            jrp.resultcode = "98";
                            jrp.resultmessage = ex.ToString();
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        break;
                    //手机登录
                    case "phonelogin":
                        jrp = new LoginBLL().CheckPhoneLogin(Request["phoneno"], Request["validcode"]);
                        if (jrp.resultcode == "1")
                        {
                            try
                            {
                                //保存用户信息至本地
                                new LoginBLL().SyncJYHMemberInfo("", "wap");
                            }
                            catch (Exception exd)
                            {
                                //记录异常
                                ProjectLogBLL.NotifyProjectLog(string.Format("一元购-保存用户信息至本地--异常：{0}", exd.ToString()), "active：API.asp的" + Request["action"]);
                            }
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //只使用手机号直接登录,from=web的需要验签，安卓和ios直接登录
                    case "phoneloginauto":
                        if (Request["type"] == "web")
                        {
                            try
                            {
                                //测试
                                //jrp = new LoginBLL().CheckPhoneLoginApp(Request["phoneno"]);
                                //outString = JsonHelper.ToJsonString(jrp);



                                //验签
                                if (Request["phoneno"] != null && Request["tt"] != null && Request["mac"] != null)
                                {
                                    //判断时间是否自有效期内
                                    LoginMaxSecond = INITools.GetIniKeyValue("autologinurl", "LoginMaxSecond") == "" ? 0 : double.Parse(INITools.GetIniKeyValue("autologinurl", "LoginMaxSecond"));// ConfigurationManager.AppSettings["LoginMaxSecond"] == null ? 120 : double.Parse(ConfigurationManager.AppSettings["LoginMaxSecond"].ToString());

                                    qst = Request["tt"];
                                    if (qst == "")
                                    {
                                        jrp.resultcode = "99";
                                        jrp.resultmessage = "缺少参数";

                                    }
                                    else
                                    {
                                        TimeSpan ts = DateTime.Now - DateTime.Parse("1970-1-1");
                                        TotalSeconds = ts.TotalSeconds;
                                        TotalSeconds = TotalSeconds - double.Parse(qst);

                                        if (TotalSeconds >= LoginMaxSecond || TotalSeconds < 0)
                                        {
                                            jrp.resultcode = "99";
                                            jrp.resultmessage = "已失效";

                                        }
                                        else
                                        {
                                            LoginMD5_key = INITools.GetIniKeyValue("autologinurl", "LoginMD5_key") == "" ? "" : INITools.GetIniKeyValue("autologinurl", "LoginMD5_key");
                                            yqStr = Request["phoneno"] + qst + LoginMD5_key;
                                            //验签通过
                                            if (DESHelper.Md5(yqStr) == Request["mac"].ToString())
                                            {
                                                //判断是否有手机号
                                                if (Request["phoneno"] != "")
                                                {
                                                }
                                                else
                                                {
                                                    jrp.resultcode = "99";
                                                    jrp.resultmessage = "缺少手机号";

                                                }
                                            }
                                            else
                                            {
                                                jrp.resultcode = "99";
                                                jrp.resultmessage = "签名错误";
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    jrp.resultcode = "99";
                                    jrp.resultmessage = "缺少参数";
                                }
                            }
                            catch (Exception edf) {
                                jrp.resultcode = "99";
                                jrp.resultmessage = "程序异常";

                            }

                            if (jrp.resultcode != "99")
                            {
                                //登录
                                jrp = new LoginBLL().CheckPhoneLoginApp(Request["phoneno"]);
                                if (jrp.resultcode == "1")
                                {
                                    try
                                    {
                                        //保存用户信息至本地
                                        new LoginBLL().SyncJYHMemberInfo("","wap");
                                    }
                                    catch (Exception exd)
                                    {
                                        //记录异常
                                        ProjectLogBLL.NotifyProjectLog(string.Format("一元购-保存用户信息至本地--web登录--异常：{0}", exd.ToString()), "active：API.asp的" + Request["action"]);
                                    }
                                }

                                outString = JsonHelper.ToJsonString(jrp);

                            }
                            else {
                                //用户注销
                                try
                                {
                                    new LoginBLL().UserLoginOut();
                                }
                                catch (Exception sse) {

                                }

                            }
                        }
                        else
                        {
                            jrp = new LoginBLL().CheckPhoneLoginApp(Request["phoneno"]);
                            if (jrp.resultcode == "1")
                            {
                                try
                                {
                                    //保存用户信息至本地
                                    new LoginBLL().SyncJYHMemberInfo("", "wap");
                                }
                                catch (Exception exd)
                                {
                                    //记录异常
                                    ProjectLogBLL.NotifyProjectLog(string.Format("一元购-保存用户信息至本地--APP登录--异常：{0}", exd.ToString()), "active：API.asp的" + Request["action"]);
                                }
                            }

                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //用户注销
                    case "userlogout":
                        jrp = new LoginBLL().UserLoginOut();
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机注册
                    case "phonereg":
                        jrp = new LoginBLL().CheckPhoneReg(Request["phoneno"], Request["validcode"], Request["password"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "phonereg_lqfxtq":
                        jrp = new LoginBLL().CheckPhoneReg(Request["phoneno"], Request["validcode"], Request["password"], JYH_SMSCode.EnumSMSTradeType.LQFXTQ, Request["sharephone"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //检测是否登录
                    case "checklogin":
                        jrp = new LoginBLL().CheckLoginSession();
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机登录
                    case "phoneexist":
                        if (LoginBLL.CheckPhoneExist(Request["phoneno"]))
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已存在";
                        }
                        else
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "不存在";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //获取地址列表
                    case "addresslist":
                        string addressList = "";
                        rp = new OrderBLL().GetAddressList(out addressList);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = addressList;
                        }
                        break;
                    //新增收货地址
                    case "addressadd":
                        rp = new OrderBLL().AddAddressForOrder(Request["api_input"], Request["validcode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //修改收货地址
                    case "addressedit":
                        rp = new OrderBLL().EditAddressForOrder(Request["api_input"], Request["validcode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //根据id获得地址
                    case "getaddressbyid":
                        string addressByID = "";
                        rp = new OrderBLL().GetAddressByID(Request["addressid"], out addressByID);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = addressByID;
                            if (outString == "")
                            {
                                jrp.resultcode = "1000";
                                jrp.resultmessage = "收货地址已删除，请重新设置收货地址";
                                outString = JsonHelper.ToJsonString(jrp);
                            }

                        }
                        break;
                    //获取默认收货地址
                    case "addressdefault":
                        string addressDetail = "";
                        rp = new OrderBLL().GetAddressDefault(out addressDetail);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = addressDetail;
                            if (outString == "")
                            {
                                jrp.resultcode = "1000";
                                jrp.resultmessage = "收货地址已删除，请重新设置收货地址";
                                outString = JsonHelper.ToJsonString(jrp);
                            }

                        }
                        break;
                    case "merchant_check":
                        Merchant_PageBLL checkBll = new Merchant_PageBLL();
                        foreach (string key in Request.Form.Keys)
                        {
                            checkBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key]));
                        }
                        string from = Request["merchantcode"].ToString();
                        if (!string.IsNullOrEmpty(from))
                        {
                            outString = checkBll.NotifyMerchantApiData();
                            if (outString == "-1")
                            {
                                from = "";
                            }
                            else
                            {
                                if (JsonHelper.JsonToObject<Json_Response_Base.resultPackage>(outString).resultcode != "1")
                                {
                                    from = "";
                                }
                            }
                        }
                        checkBll.CheckMerchantValid(Request["host"].ToString(), Request["refer"].ToString(), from);
                        if (Session["MerchantID_HJY"] != null)
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = from;
                        }
                        else
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已失效";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //获取拼团信息
                    case "getpininfo":
                        string pinInfo = "";
                        rp = new PinBLL().GetPinListByEventCode(Request["eid"].ToString(), out pinInfo);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = pinInfo;
                        }
                        break;
                    //获取我的团信息
                    case "mytuans":
                        string myTuans = "";
                        rp = new PinBLL().GetMyTuans(out myTuans);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = myTuans;
                        }
                        break;
                    //获取我的订单
                    case "myorders":
                        string myOrders = "";
                        rp = new PinBLL().GetMyOrders(out myOrders);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = myOrders;
                        }
                        break;
                    //获取我的订单详情
                    case "myorderdetail":
                        string myOrderDetail = "";
                        rp = new PinBLL().GetMyOrderDetail(Request.Form["oid"], out myOrderDetail);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = myOrderDetail;
                        }
                        break;
                    //获取活动订单
                    case "eventorders":
                        string eventOrders = "";
                        rp = new PinBLL().GetEventOrdersByEventCode(Request.Form["eid"], out eventOrders);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = eventOrders;
                        }
                        break;
                    //参加拼团
                    case "pin":
                        var num = int.Parse(Request.Form["num"]);
                        var endTime = DateTime.Parse(Request.Form["endTime"].ToString());
                        rp = new PinBLL().Pin(num, endTime, Request.Form["json"].ToString());
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //监测是否可以参加拼团
                    case "iscanpin":
                        rp = new PinBLL().IsCanPin(int.Parse(Request.Form["Num"].ToString()), DateTime.Parse(Request.Form["endTime"].ToString()), Request.Form["eventCode"].ToString());
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //更新拼团状态
                    case "updatetuanstatus":
                        rp = new PinBLL().UpdatePinTuanStatus(Request.Form["eventCode"].ToString(), (JYH_Pin_List.EnumTuanStatus)(int.Parse(Request.Form["status"])));
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //更新支付状态
                    case "updatepaystatus":
                        rp = new PinBLL().UpdatePayStatus(Request.Form["order_code"].ToString(), (JYH_Pin_Detail.EnumPayStatus)(int.Parse(Request.Form["status"])));
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "wxpay"://不经过支付网关
                        try
                        {
                            JsApiPay jsApiPay = new JsApiPay(this);
                            jsApiPay.openid = Session["wxPayOpenid"].ToString();//"oz1WBs_FPv5qbh1cyyoN9fzNZgUw";
                            jsApiPay.total_fee = (int)(decimal.Parse(Request["total_fee"].ToString()) * 100);
                            jsApiPay.orderid = Request["orderid"];
                            WxPayData unifiedOrderResult = jsApiPay.GetUnifiedOrderResult();
                            outString = jsApiPay.GetJsApiParameters();
                            FileHelper.WriteLogFile(Server.MapPath("log"), "wxOpenid", jsApiPay.openid);
                        }
                        catch (Exception ex)
                        {
                            FileHelper.WriteLogFile(Server.MapPath("log"), "wxOpenid", ex.ToString());
                        }
                        break;
                    case "test":
                        rp = new PinBLL().Request_ApiBySendList(0, 0);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    ///*创建订单*/
                    //case "createorder":
                    //    order = new EGO_Order_List();
                    //    order.ProductID = int.Parse(Request["ProductID"]);
                    //    order.PeriodNum = int.Parse(Request["PeriodNum"]);
                    //    order.OrderNo = RunProcedure.Exec_CreateSerialNo(10001);
                    //    order.OrderTime = DateTime.Now;
                    //    order.BuyerPhone = HttpContext.Current.Session["UserName"].ToString();
                    //    order.ChipinNum =int.Parse(Request["ChipinNum"]);;
                    //    order.Status =EGO_Order_List.EnumOrderStatus.Init;
                    //    order.TotalMoney =decimal.Parse(Request["TotalMoney"]);
                    //    order.PayGate =(EnumPaygate)int.Parse(Request["PayGate"]);
                    //    order.PayGateType =(EnumPaygateType)int.Parse(Request["PayGateType"]);
                    //    if (orderBLL.Insert(order))
                    //    {
                    //        outString = order.OrderNo;
                    //    }
                    //    else {
                    //        outString = "";
                    //    }
                    //    break;
                    ///*使用支付网关支付*/
                    //case "gotopayment":
                    //    //取得支付网关的参数
                    //    orderno = Request["OrderNo"] ?? "";
                    //    order = OrderBLL.GetOrderInfo(orderno);
                    //    if (order.PayGate == EnumPaygate.WeiXin_JSAPI)
                    //    {
                    //        //微信JSAPI
                    //        if (order.OpenID != "")
                    //        {
                    //            order.OpenID = Session["wxPayOpenid"].ToString();
                    //            outString = PaygateBLL.GoToPayMent(order);

                    //        }
                    //        else {
                    //            outString = "";
                    //        }
                    //    }
                    //    else
                    //    {
                    //        //支付宝
                    //        outString = PaygateBLL.GoToPayMent(order);
                    //    }
                    //    break;
                    case "wxshare"://微信内JSAPI分享
                        WX_JSAPI_Config jaapiconfig = new WX_JSAPI_Config();
                        jaapiconfig.resultcode = "0";
                        jaapiconfig.resultmessage = "操作成功";
                        string jsApiList = Request["jsApiList"] ?? "";
                        string url = Request["surl"] ?? "";
                        if (jsApiList == "")
                        {
                            jaapiconfig.resultcode = "1";
                            jaapiconfig.resultmessage = "要调用的接口不能为空";
                        }

                        else if (url == "")
                        {
                            jaapiconfig.resultcode = "2";
                            jaapiconfig.resultmessage = "当前页面的url不能为空";
                        }
                        else
                        {
                            WX_JSAPI_Ticket_Response ticket = WxJsApiData.GetJsApiTicket("jsapi");
                            if (ticket == null)
                            {
                                jaapiconfig.resultcode = "3";
                                jaapiconfig.resultmessage = "获取ticket失败.";
                            }
                            else
                            {
                                jaapiconfig.appId = WxPayConfig.APPID;
                                jaapiconfig.debug = wxdebug;
                                jaapiconfig.jsApiList = jsApiList.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                                jaapiconfig.nonceStr = WxPayApi.GenerateNonceStr();
                                jaapiconfig.timestamp = WxPayApi.GenerateTimeStamp();
                                jaapiconfig.ticket = ticket.ticket;
                                jaapiconfig.url = url;
                                jaapiconfig.signature = WxJsApiData.getSign(jaapiconfig);
                            }

                        }
                        outString = JsonHelper.ToJsonString(jaapiconfig);
                        break;
                    #region 上传图片*
                    /*上传图片*/
                    case "uploadimg":


                        //====使用服务器物理路径，可实现上传========================================

                        //获取图片控件
                        string file_ID =Request["fileid"];//.Split('|');
                                                                   //string return_img_path = "";
                        var file =Request.Files[file_ID];
                        //var file =Request.Files[0];
                        //上传图片文件路径【通过虚拟目录获得对应的物理地址,虚拟目录地址需指向文件服务器的共享路径】
                        string temp_filePath = ConfigurationManager.AppSettings["UploadIMG"];
                        //图片上传物理路径（当前服务器上）
                        string filePath = new System.Web.UI.Page().Server.MapPath(temp_filePath);

                        ////图片上传物理路径（相对于文件服务器的地址）
                        //string filePath = ConfigurationManager.AppSettings["UploadIMG"];

                        int maxSize = 0;
                        string path = "";
                        if (file == null)
                        {
                            outString = "{\"resultCode\":\"1\",\"resultMessage\":\"请上传图片信息！\"}";
                        }
                        fileName = file.FileName;
                        string aaa = Encoding.UTF8.GetString(Encoding.Default.GetBytes(file.FileName));
                        string exName = "";
                        if (Path.GetExtension(aaa) == "")
                        {
                            exName = fileName.Substring(fileName.LastIndexOf('?')).Replace("?", ".");
                        }
                        else
                        {
                            exName = fileName.Substring(fileName.LastIndexOf('.'));
                        }

                        if (exName == "")
                        {
                            exName = "." + fileName.Substring(fileName.Length - 3, 3);
                        }
                        //重命名
                        //int seed = Guid.NewGuid().GetHashCode();
                        //var random = new System.Random(seed);
                        string newFileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + "" + RandHelper.Next(100000, 999999);
                        if (Directory.Exists(filePath) == false)
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        path = filePath + "\\" + newFileName + exName;
                        file.SaveAs(path);
                        //图片访问路径
                        string baseurl = "";
                        if (Request["saveFullPath"] != null)
                        {
                            baseurl = ConfigurationManager.AppSettings["UploadIMG_YM"];//Request.Url.Scheme + "://" + Request.Url.Host + ":" + Request.Url.Port;
                        }
                        jrb.resultmessage = baseurl + ConfigurationManager.AppSettings["UploadIMG_Path"] + newFileName + exName;
                        jrb.resultcode = "1";
                        outString = JsonHelper.ToJsonString(jrb);
                        break;
                    #endregion

                    case "group_back":
                        if (Session["group_back"] != null)
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "正常";
                        }
                        else
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已失效";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "merchant_page":

                        if (Session["MerchantID_HJY"] != null || (!string.IsNullOrEmpty(Request["recordact"])))
                        {
                            Merchant_PageBLL pageBll = new Merchant_PageBLL();
                            foreach (string key in Request.Form.Keys)
                            {
                                pageBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key]));
                            }

                            outString = pageBll.NotifyMerchantApiData();
                            if (outString == "-1")
                            {
                                jrp.resultcode = "99";
                                jrp.resultmessage = "通知失败";
                                outString = JsonHelper.ToJsonString(jrp);
                            }
                        }
                        else
                        {
                            if (Request["recordact"].ToString() != "")
                            {

                            }
                            jrp.resultcode = "98";
                            jrp.resultmessage = "已失效";
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                ProjectLogBLL.NotifyProjectLog(string.Format("异常:{0}", ex.ToString()), "api-" + Request["action"]);
            }
            Response.Write(outString);
        }

        /// <summary>
        /// 获取支付宝GET过来通知消息，并以“参数名=参数值”的形式组成数组
        /// </summary>
        /// <returns>request回来的信息组成的数组</returns>
        public SortedDictionary<string, string> GetRequestGet()
        {
            int i = 0;
            SortedDictionary<string, string> sArray = new SortedDictionary<string, string>();
            NameValueCollection coll;
            //Load Form variables into NameValueCollection variable.
            coll = Request.QueryString;

            // Get names of all forms into a string array.
            String[] requestItem = coll.AllKeys;

            for (i = 0; i < requestItem.Length; i++)
            {
                sArray.Add(requestItem[i], Request.QueryString[requestItem[i]]);
            }

            return sArray;
        }
    }
}