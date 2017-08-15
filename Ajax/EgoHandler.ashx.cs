using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Configuration;
using System.Web.SessionState;
using com.hjy.ego.BusinessLayer;
using com.hjy.ego.EntityFacade;
using com.hjy.ego.FrameWork;
using com.hjy.ego.QueryFacade;
using com.hjy.ego.BusinessLayer.JYHAPI;
using com.hjy.ego.BusinessLayer.IndexMessage;
using com.hjy.ego.EntityFacade.ShowOrder;
using System.IO;
using com.hjy.ego.EntityFacade.Json;
using System.Data;
using com.hjy.ego.QueryFacade.Ego;
using com.hjy.ego.BusinessLayer.Members;
using com.hjy.member.BusinessLayer;
using com.hjy.member.QueryFacade;
using com.hjy.member.EntityFacade;

namespace WebUI.Ajax
{
    /// <summary>
    /// EgoHandler 的摘要说明
    /// </summary>
    public class EgoHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string orderno = "";
            string PageSize = "10";
            EGO_Order_List order;

            OrderEgoBLL orderBLL = new OrderEgoBLL();
            IndexMessageBLL IndexMessageBLL = new IndexMessageBLL();

            Project_ShowOrder ShowOrder = null;
            Project_ShowOrderBLL ShowOrderBLL = new Project_ShowOrderBLL();
            ResultPacket res = new ResultPacket();

            context.Response.Buffer = true;
            context.Response.ExpiresAbsolute = DateTime.Now.AddDays(-1);
            context.Response.AddHeader("pragma", "no-cache");
            context.Response.AddHeader("cache-control", "");
            context.Response.CacheControl = "no-cache";
            context.Response.ContentType = "application/x-www-form-urlencoded";
            string jsonData = string.Empty;
            #region 页索引
            int pageIndex = 0;
            try
            {
                if (!string.IsNullOrEmpty(context.Request["pi"]))
                {
                    int.TryParse(context.Request["pi"], out pageIndex);
                }
            }
            catch (Exception ex)
            {

            }
            #endregion
            #region 页大小
            int pageSize = int.Parse(ConfigurationManager.AppSettings["DefaultPageSize"]);
            try
            {
                if (!string.IsNullOrEmpty(context.Request["ps"]))
                {
                    int.TryParse(context.Request["ps"], out pageSize);
                }
            }
            catch (Exception ex)
            {

            }
            #endregion
            #region 排序方式
            string orderCol = "SortID";
            string orderType = "desc";
            try
            {
                switch (context.Request["ot"])
                {
                    case "0":
                        //正序
                        orderType = "asc";
                        break;
                    case "1":
                        //倒序
                        orderType = "desc";
                        break;
                    default:
                        orderType = "desc";
                        break;
                }
            }
            catch (Exception ex)
            {

            }

            #endregion
            StringBuilder conditionList = new StringBuilder();
            #region 条件查询
            int succ = 0;
            switch (context.Request["action"])
            {
                case "index":
                    #region 排序类型
                    switch (context.Request["oc"])
                    {
                        case "0":
                            //人气
                            orderCol = "chipinnum";
                            break;
                        case "1":
                            //进度
                            orderCol = "progress";
                            break;
                        case "2":
                            //最新
                            orderCol = "salestarttime";
                            break;
                        case "3":
                            //总须人数
                            orderCol = "sellprice";
                            break;
                        default:
                            orderCol = "SortID";
                            break;
                    }

                    #endregion

                    ProductEgoBLL productBll = new ProductEgoBLL();
                    jsonData = productBll.GetDataSetByPage(pageIndex, pageSize, orderCol, orderType, conditionList.ToString());
                    break;
                case "history":
                    #region 排序类型
                    orderCol = "salestarttime";
                    #endregion

                    PeriodEgoBLL periodBll = new PeriodEgoBLL();
                    jsonData = periodBll.GetDataSetByPage(pageIndex, pageSize, orderCol, orderType, conditionList.ToString());
                    break;
                case "award":
                    #region 排序类型
                    //最新
                    orderCol = "salestarttime";
                    #endregion

                    //PeriodEgoBLL periodBll = new PeriodEgoBLL();
                    //jsonData = periodBll.GetDataSetByPage(pageIndex, pageSize, orderCol, orderType, conditionList.ToString());
                    break;
                case "getBanner":
                    jsonData = "[{\"picUrl\":\"/img/mpic1.jpg\"},{\"picUrl\":\"/img/mpic1.jpg\"}]";   //"[{\"picUrl\":\"\"},{\"picUrl\":\"\"}]";
                    break;
                //获取商品信息
                case "getGoodsInfo":
                    jsonData = new ProductEgoBLL().GetGoodsInfoBy(int.Parse(context.Request["pid"]));
                    break;
                //获取我的中奖码
                case "getMyCodes":
                    jsonData = new OrderEgoBLL().GetMyCodes(int.Parse(context.Request["perid"]), int.Parse(context.Request["pid"]), context.Request["ono"]);
                    break;
                //获取参与记录
                case "getRecord":
                    int pIndex = int.Parse(context.Request["pi"]);
                    int pSize = int.Parse(context.Request["ps"]);
                    jsonData = new OrderEgoBLL().GetRecord(context.Request["perid"], context.Request["pid"], pIndex, pSize);
                    break;
                //获取参与次数
                case "getRecordCount":
                    jsonData = new OrderEgoBLL().GetRecordCount(context.Request["perid"], context.Request["pid"]);
                    break;
                //获取期信息
                case "getperiod":
                    jsonData = new PeriodEgoBLL().GetPeriodBy(int.Parse(context.Request["perid"]), int.Parse(context.Request["pid"]));
                    break;
                //获取我的订单列表
                case "myorders":
                    pIndex = int.Parse(context.Request["pi"]);
                    pSize = int.Parse(context.Request["ps"]);
                    jsonData = new OrderEgoBLL().GetMyOrders(pIndex, pSize);
                    break;
                //获取我的中奖记录列表
                case "myawards":
                    pIndex = int.Parse(context.Request["pi"]);
                    pSize = int.Parse(context.Request["ps"]);
                    jsonData = new OrderEgoBLL().GetMyAwards(pIndex, pSize);
                    break;
                //获取订单详情
                case "getorderdetail":
                    jsonData = new OrderEgoBLL().GetOrderDetail(context.Request["oid"]);
                    break;
                //获取中奖信息
                case "getwininfo":
                    jsonData = new OrderEgoBLL().GetWinInfo(int.Parse(context.Request["perid"]), int.Parse(context.Request["pid"]));
                    break;
                //获取往期揭露
                case "getotherperiod":
                    jsonData = new PeriodEgoBLL().GetOtherPeriodBy(int.Parse(context.Request["pid"]));
                    break;
                //获取最新揭晓
                case "getawardlist":
                    pIndex = int.Parse(context.Request["pi"]);
                    pSize = int.Parse(context.Request["ps"]);
                    jsonData = new PeriodEgoBLL().GetAwardList(pIndex, pSize);
                    break;
                //获取查看记录详情
                case "getluckDetail":
                    jsonData = new OrderEgoBLL().GetGetLuckDetail(context.Request["perid"], context.Request["pid"], int.Parse(context.Request["record"]));
                    break;
                //获取最新一期的期号
                case "getnewperiod":
                    jsonData = new PeriodEgoBLL().GetNewPeriodBy(int.Parse(context.Request["pid"]));
                    break;
                case "getnewperiodbysku":
                    jsonData = new PeriodEgoBLL().GetNewPeriodBySku(context.Request["sku"]);
                    break;
                //获取领奖成功的jyhOrderNo
                case "getjyhorder":
                    jsonData = new PeriodEgoBLL().GetJYHOrderNoBy(context.Request["orderno"]);
                    break;
                //获取用户信息
                case "getmemberinfo":
                    jsonData = new LoginBLL().GetMemberInfo();
                    break;
                //更新昵称
                case "savenickname":
                    var nickName = context.Request["nickname"];
                    jsonData = new FC_MembersBLL().SaveNickName(nickName);
                    break;
                //获取优惠卷
                case "getcoupons":
                    jsonData = new CouponEgoBLL().GetCoupons();
                    break;
                //使用优惠卷
                case "usecoupon":
                    string counponNo = context.Request["counponno"];
                    jsonData = new CouponEgoBLL().UseCoupons(counponNo);
                    break;
                //获取用户余额
                case "getbalance":
                    jsonData = new FC_MembersBLL().GetAllBalance();
                    break;
                //确认领奖
                case "confirmAward":
                    var addressId = context.Request["addressid"];
                    var buyerName = context.Request["bname"];
                    var buyerAddress = context.Request["baddress"];
                    var addressCode = context.Request["code"];
                    var pid = int.Parse(context.Request["pid"]);
                    var perid = int.Parse(context.Request["perid"]);
                    var orderNo = context.Request["oid"];
                    jsonData = new AwardEgoBLL().ConfirmAward(perid, pid, addressId, buyerName, buyerAddress, addressCode, orderNo);
                    break;
                //通知开奖服务
                case "NotifyPeriodAwardService":

                    try
                    {
                        BaseUDPClient udpE = new BaseUDPClient();
                        udpE.Command = 6;
                        udpE.EncryptKey = ConfigurationManager.AppSettings["UDPSecretKey_4"];
                        udpE.RemoteIP = ConfigurationManager.AppSettings["UDPServerIP_4"];
                        udpE.RemotePort = int.Parse(ConfigurationManager.AppSettings["UDPServerPort_4"]);
                        udpE.Execute();

                        jsonData = "{\"resultCode\":\"1\",\"resultMessage\":\"已经通知开奖服务\"}";
                    }
                    catch (Exception ex)
                    {
                        jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"通知开奖服务异常\"}";
                    }
                    break;
                case "awardOrders":
                    jsonData = new OrderEgoBLL().GetMyAwardOrders();
                    break;
                /*在线充值*/
                case "recharge":
                    if (HttpContext.Current.Session["UserToken"] == null)
                    {
                        jsonData = "{\"resultCode\":\"999\",\"resultMessage\":\"连接超时，请重新登录\"}";
                    }
                    else
                    {
                        var mobelNo = HttpContext.Current.Session["UserName"].ToString();
                        var zmember = new FC_MembersBLL().GetMemberByMobileNo(mobelNo);
                        if (zmember != null)
                        {
                            orderNo = "";
                            decimal rechargeMoney = decimal.Parse(context.Request["TotalMoney"]);
                            int payGate = int.Parse(context.Request["PayGate"]);
                            EnumPaygateType payGateType = (EnumPaygateType)int.Parse(context.Request["PayGateType"]);
                            ResultPacket result = new CardChzBLL().doChzDeposit(payGate, rechargeMoney, zmember.ID, payGateType, out orderNo);
                            if (result.IsError)
                            {
                                jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"创建订单失败，请稍候再试\"}";

                            }
                            else
                            {
                                jsonData = "{\"OrderNo\":\"" + orderNo + "\"}";
                            }
                        }
                        else
                        {
                            jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"未查找到用户信息\"}";
                        }
                    }
                    break;
                /*获取充值记录*/
                case "getrechargerecord":
                    pIndex = int.Parse(context.Request["pi"]);
                    pSize = int.Parse(context.Request["ps"]);
                    jsonData = new CardChzBLL().GetRechargeRecord(pIndex, pSize);
                    break;
                /*获取使用记录*/
                case "getuserecord":
                    pIndex = int.Parse(context.Request["pi"]);
                    pSize = int.Parse(context.Request["ps"]);
                    jsonData = new CardChzBLL().GetUseRecord(pIndex, pSize);
                    break;
                /*获取使用记录*/
                case "getrechargeorder":
                    orderno = context.Request["OrderNo"] ?? "";
                    var rechargeOrderD = new CardChzBLL().GetRechargeOrder(orderno);
                    if (rechargeOrderD == null)
                    {
                        jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"未查找到订单信息\"}";
                    }
                    else
                    {
                        jsonData = "{\"RechargeMoney\":\"" + rechargeOrderD.OrderMoney + "\"}";
                    }
                    break;

                /*创建订单*/
                case "createorder":
                    order = new EGO_Order_List();
                    order.ProductID = int.Parse(context.Request["ProductID"]);
                    order.PeriodNum = int.Parse(context.Request["PeriodNum"]);
                    order.OrderNo = com.hjy.ego.FrameWork.RunProcedure.Exec_CreateSerialNo(10001);
                    order.OrderTime = DateTime.Now;
                    order.BuyerPhone = HttpContext.Current.Session["UserName"].ToString(); /*context.Request["PhoneNo"];*///
                    order.ChipinNum = int.Parse(context.Request["ChipinNum"]);
                    order.IPAddress = context.Request["IpAddress"];
                    order.Status = EGO_Order_List.EnumOrderStatus.Init;
                    order.ChipinCodeList = "";
                    order.OpenID = "";
                    order.TotalMoney = decimal.Parse(context.Request["TotalMoney"]);
                    order.PayGate = (EnumPaygate)int.Parse(context.Request["PayGate"]);
                    order.PayGateType = (EnumPaygateType)int.Parse(context.Request["PayGateType"]);
                    order.RebatMoney = 0;
                    order.RebatCount = 0;

                    order.AccountMoney = decimal.Parse(context.Request["Balance"]);
                    var member = new FC_MembersBLL().GetMember();
                    if (order.AccountMoney != 0)
                    {
                        if (member == null)
                        {
                            jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"不存在的用户信息\"}";
                            break;
                        }
                        else {
                            if (order.AccountMoney > member.AllBalance)
                            {
                                jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"使用金额超过账户余额\"}";
                                break;
                            }
                        }
                    }

                    order.CheckAwardKey = this.GetBaseNumByOrderTime(order.OrderTime);

                    if (!string.IsNullOrEmpty(context.Request["ListId"]) && context.Request["ListId"] != "0")
                    {
                        List<decimal> priceResult = new CouponEgoBLL().GetCouponPrice(context.Request["ListId"]);

                        DataTable couponList = new Coupon_ListDAL().GetCouponList(int.Parse(context.Request["ListId"]));
                        if (couponList.Rows.Count < 0)
                        {
                            jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"无效的优惠卷\"}";
                            break;
                        }
                        else
                        {
                            var status = int.Parse(couponList.Rows[0]["coupon_status"].ToString());
                            if (status == 2 || status == 4)
                            {
                                jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"优惠卷已经使用或者被冻结\"}";
                                break;
                            }
                            var startDate = DateTime.Parse(couponList.Rows[0]["date_info_begin"].ToString());
                            var endDate = DateTime.Parse(couponList.Rows[0]["date_info_end"].ToString());
                            if ((status == 1 || status == 3) && (DateTime.Now < startDate || DateTime.Now > endDate))
                            {
                                jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"优惠卷已过期或暂时不能使用\"}";
                                break;
                            }
                        }
                        if (priceResult != null && priceResult.Count >= 2)
                        {
                            if (priceResult[1] != 0 && order.TotalMoney < priceResult[1])
                            {
                                jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"创建订单失败，订单金额未达到优惠卷使用金额\"}";
                                break;
                            }
                            else
                            {
                                order.CouponMoney = priceResult[0];
                            }
                        }
                        else
                        {
                            order.CouponMoney = 0;
                        }
                    }
                    else
                    {
                        order.CouponMoney = 0;
                    }
                    if (!string.IsNullOrEmpty(context.Request["ListId"]) && context.Request["ListId"] != "0")
                    {
                        order.CouponListID = int.Parse(context.Request["ListId"]);
                    }
                    else
                    {
                        order.CouponListID = 0;
                    }
                    if (order.ChipinNum >= 1 && order.ChipinNum == order.TotalMoney)
                    {
                        DataAccess da = new DataAccess();
                        da.BeginTransaction();
                        try
                        {
                            int tradeLogiD = 0;
                            DateTime settleTime = DateTime.Now;
                            string centerSerialNo = "";
                            if (order.AccountMoney>0)
                            {
                                res = FC_Members_TradeLogDAL.Exec_SP_Chipin_DealMoney(member.ID, order.ProductID, order.PeriodNum, 0, 0, order.OrderNo, order.OrderTime.ToString("yyyyMMdd"), order.AccountMoney, "", "参与夺宝", ConfigurationManager.AppSettings["merchant_projectcode"], out tradeLogiD, out centerSerialNo, out settleTime); 
                            }
                            if (res.IsError)
                            {
                                jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"扣款失败\"}";
                                break;
                            }
                            else
                            {
                                order.MemberTradeLogID = tradeLogiD;
                                if (order.MemberTradeLogID>0)
                                {
                                    FC_Members_TradeLog tradeMod = new FC_Members_TradeLogDAL().GetObjectByID(tradeLogiD);
                                    order.CardBalance = tradeMod.CardBalanceChanged;
                                    order.AwardBalance = tradeMod.AwardBalanceChanged;
                                }
                                if (orderBLL.Insert(order, da))
                                {
                                    if (order.CouponListID != 0)
                                    {
                                        new CouponEgoBLL().SaveUseCouponInfo(order.CouponListID, order.ID, da);
                                    }

                                    jsonData = "{\"OrderNo\":\"" + order.OrderNo + "\"}";
                                }
                                else
                                {
                                    da.Rollback();
                                    jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"创建订单失败，请稍候再试\"}";
                                }
                            }
                            da.Commit();
                        }
                        catch (Exception ex)
                        {
                            da.Rollback();
                        }
                    }
                    else
                    {
                        jsonData = "{\"resultCode\":\"99\",\"resultMessage\":\"订单最小数量为1\"}";
                    }
                    break;
                /*使用支付网关支付*/
                case "gotopayment":
                    //取得支付网关的参数
                    try
                    {
                        orderno = context.Request["OrderNo"] ?? "";
                        //更新再次支付的支付方式
                        if (!string.IsNullOrEmpty(context.Request["PayGate"]) && !string.IsNullOrEmpty(context.Request["PayGateType"]))
                        {
                            OrderBLL.UpdatePayGate(orderno, int.Parse(context.Request["PayGate"]), int.Parse(context.Request["PayGateType"]));
                        }
                        order = OrderBLL.GetOrderInfo(orderno);
                        var realPayMoney = order.TotalMoney - order.CouponMoney - order.AccountMoney - order.RebatMoney;
                        if (realPayMoney == 0)
                        {
                            DataAccess da = new DataAccess();
                            da.BeginTransaction();
                            try
                            {
                                //网关支付成功
                                order.Status = EGO_Order_List.EnumOrderStatus.Payed;
                                order.Pay_ResponseTime = QueryBase.GetDataBaseDate();
                                order.PayGate_Pay_OrderNo = "";
                                int yy = new EGO_Order_ListDAL().UpdateForPayResult(order, da);

                                if (yy == 1)
                                {
                                    /*充值成功*/
                                    try
                                    {
                                        da.Commit();

                                        BaseUDPClient udp = new BaseUDPClient();
                                        udp.Command = 5;
                                        udp.EncryptKey = ConfigurationManager.AppSettings["UDPSecretKey_5"];
                                        udp.RemoteIP = ConfigurationManager.AppSettings["UDPServerIP_5"];
                                        udp.RemotePort = int.Parse(ConfigurationManager.AppSettings["UDPServerPort_5"]);
                                        udp.Execute();

                                    }
                                    catch (Exception exx)
                                    {
                                    }
                                }

                            }
                            catch (Exception ex)
                            {
                                da.Rollback();
                            }
                            jsonData = "{\"resultcode\":\"22\",\"resultmessage\":\"支付金额为0\"}";
                        }
                        else
                        {
                            if (order.PayGate == EnumPaygate.WeiXin_JSAPI || order.PayGate == EnumPaygate.WeiXin_App)
                            {
                                if (order.PayGate == EnumPaygate.WeiXin_App)
                                {
                                    order.OpenID = "";
                                }
                                else
                                {
                                    order.OpenID = context.Session["wxPayOpenid"].ToString();
                                }
                                jsonData = PaygateBLL.GoToPayMent(order);
                            }
                            else
                            {
                                //支付宝
                                jsonData = PaygateBLL.GoToPayMent(order);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"支付失败" + ex.Message + "\"}";
                    }
                    break;
                /*使用支付网关支付*/
                case "gotoreachargepayment":
                    //取得支付网关的参数
                    try
                    {
                        orderno = context.Request["OrderNo"] ?? "";

                        var rechargeOrder = new CardChzBLL().GetRechargeOrder(orderno);
                        string openID = "";
                        if (rechargeOrder.PayGate == 762 || rechargeOrder.PayGate == 763)
                        {

                            if (rechargeOrder.PayGate == 763)
                            {
                                openID = "";
                            }
                            else
                            {
                                openID = context.Session["wxPayOpenid"].ToString();
                            }
                            jsonData = PaygateBLL.GoToRechargePayMent(rechargeOrder, openID);
                        }
                        else
                        {
                            //支付宝
                            jsonData = PaygateBLL.GoToRechargePayMent(rechargeOrder, openID);
                        }
                    }
                    catch (Exception ex)
                    {
                        jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"支付失败" + ex.Message + "\"}";
                    }
                    break;
                /*微信充值方式 1：本地jsapi  2、跳转网关*/
                case "GetWxPayRetflag":
                    string tempWxPayType = INITools.GetIniKeyValue("paygate", "wx_pay_retflag") == null ? "2" : INITools.GetIniKeyValue("paygate", "wx_pay_retflag");
                    jsonData = "{\"payretflag\":\"" + tempWxPayType + "\"}";

                    break;
                /*首页功公告*/
                case "GetIndexMessage":
                    jsonData = IndexMessageBLL.GetIndexMessage(ConfigurationManager.AppSettings["TopAwardNum"], ConfigurationManager.AppSettings["UploadIMG_YM"]);

                    break;
                #region 晒单相关

                /*按订单ID查询必要信息*/
                case "GetOrderInfoByID":
                    if (!string.IsNullOrEmpty(context.Request["id"].Trim()))
                    {
                        //SQL
                        conditionList.Append("select BuyerPhone,isnull((select top 1 NickName from vw_JYH_Member_Info where ProjectCode='jyh_ego' and PhoneNo=a.BuyerPhone),'') as NickName");
                        conditionList.Append(",isnull((select top 1 Avatar from vw_JYH_Member_Info where ProjectCode='jyh_ego' and PhoneNo=a.BuyerPhone),'') as Avatar");
                        conditionList.AppendFormat(",isnull((select count(0) from vw_ShowOrder_all where order_list_id={0} and ProjectCode='jyh_ego'),0) as haveShowOrder");
                        conditionList.AppendFormat(" from vw_Order_List a where id={0}", context.Request["id"]);

                        try
                        {
                            jsonData = orderBLL.GetDataByTJ(conditionList.ToString());
                        }
                        catch (Exception exc)
                        {
                            jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"程序异常：" + exc.Message + "\"}";
                        }
                    }
                    else
                    {
                        jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"缺少参数\"}";
                    }

                    break;
                /*获取敏感词放入缓存*/
                case "Getsensitive_word":
                    //SQL
                    conditionList.Append("select sensitive_word from nc_sensitive_word");
                    try
                    {
                        jsonData = ShowOrderBLL.GetSensitiveWord(conditionList.ToString(), ConfigurationManager.AppSettings["ConnectString_mysql"]);
                    }
                    catch (Exception exc)
                    {
                        jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"程序异常：" + exc.Message + "\"}";
                    }

                    break;

                /*保存晒单*/
                case "SaveShowOrder":
                    //SQL
                    if (!string.IsNullOrEmpty(context.Request["orderid"].Trim())
                         && !string.IsNullOrEmpty(context.Request["title"].Trim())
                         && !string.IsNullOrEmpty(context.Request["memo"].Trim())
                         && !string.IsNullOrEmpty(context.Request["pic"].Trim())
                         && !string.IsNullOrEmpty(context.Request["Phone"].Trim())
                         && !string.IsNullOrEmpty(context.Request["NickName"].Trim())
                         && !string.IsNullOrEmpty(context.Request["Avatar"].Trim())
                        )
                    {
                        ShowOrder = new Project_ShowOrder();
                        ShowOrder.order_list_id = int.Parse(context.Request["orderid"].Trim());
                        ShowOrder.title = context.Request["title"].Trim();
                        ShowOrder.memo = context.Request["memo"].Trim();
                        ShowOrder.pic = context.Request["pic"].Trim();
                        ShowOrder.BuyerPhone = context.Request["Phone"].Trim();
                        ShowOrder.BuyerNickName = context.Request["NickName"].Trim();
                        ShowOrder.BuyerNickNameAvatar = context.Request["Avatar"].Trim();


                        try
                        {
                            if (ShowOrderBLL.Insert(ShowOrder))
                            {
                                jsonData = "{\"resultcode\":\"1\",\"resultmessage\":\"发布成功\"}";
                            }
                            else
                            {
                                jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"发布失败\"}";
                            }

                        }
                        catch (Exception exc)
                        {
                            jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"程序异常：" + exc.Message + "\"}";
                        }
                    }
                    else
                    {
                        jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"缺少参数\"}";
                    }


                    break;
                /*获取晒单详情*/
                case "GetShowOrderByID":
                    if (!string.IsNullOrEmpty(context.Request["id"].Trim()))
                    {
                        //SQL
                        conditionList.Append("select title,memo,pic,BuyerPhone,BuyerNickName,BuyerNickNameAvatar,createtime,content_check");
                        conditionList.Append(",isnull((select top 1 PeriodNum from vw_Order_List where id=a.order_list_id),'') as PeriodNum");
                        conditionList.Append(",isnull((select top 1 ProductName from vw_Product_List where id=(select top 1 ProductID from vw_Order_List where id=a.order_list_id)),'') as ProductName");
                        conditionList.Append(",isnull((select top 1 AwardCode from vw_Award_List where OrderNo=(select top 1 OrderNo from vw_Order_List where id=a.order_list_id)),'') as AwardCode");
                        conditionList.Append(",isnull((select top 1 convert(varchar(19), Createtime,120) from vw_Award_List where OrderNo=(select top 1 OrderNo from vw_Order_List where id=a.order_list_id)),'') as AwardCreatetime");
                        // conditionList.Append(",isnull((select top 1 AwardOrderCount from vw_Award_List where OrderNo=(select top 1 OrderNo from vw_Order_List where id=a.order_list_id)),0) as AwardOrderCount");
                        conditionList.Append(",isnull((select top 1 ChipinNum from vw_Order_List where id=a.order_list_id),0) as ChipinNum");
                        conditionList.AppendFormat(" from VW_Project_ShowOrder a where id={0} and  ProjectCode='jyh_ego'", context.Request["id"]);

                        try
                        {
                            jsonData = ShowOrderBLL.GetDataByTJ(conditionList.ToString());
                        }
                        catch (Exception exc)
                        {
                            jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"程序异常：" + exc.Message + "\"}";
                        }
                    }
                    else
                    {
                        jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"缺少参数\"}";
                    }

                    break;
                /*按页码获取未审核和通过审核晒单列表*/
                case "GetShowOrderListByPageNo":
                    if (!string.IsNullOrEmpty(context.Request["PageNo"].Trim()) && ValidateHelper.IsInteger(context.Request["PageNo"].Trim()))
                    {
                        //自动以pagesize
                        if (!string.IsNullOrEmpty(context.Request["PageSize"].Trim()) && ValidateHelper.IsInteger(context.Request["PageSize"].Trim()))
                        {
                            PageSize = context.Request["PageSize"].Trim();
                        }

                        conditionList.Append(" and content_check<=10 and ProjectCode='jyh_ego'");

                        try
                        {
                            StringBuilder strAddField = new StringBuilder();

                            jsonData = ShowOrderBLL.GetDataSetByPage(int.Parse(context.Request["PageNo"].Trim()), int.Parse(PageSize), strAddField.ToString(), "createtime", "desc", conditionList.ToString());
                        }
                        catch (Exception exc)
                        {
                            jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"程序异常：" + exc.Message + "\"}";
                        }
                    }
                    else
                    {
                        jsonData = "{\"resultcode\":\"99\",\"resultmessage\":\"缺少参数\"}";
                    }


                    break;
                    #endregion

            }
            #endregion
            context.Response.Write(jsonData);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        private string GetBaseNumByOrderTime(DateTime orderTime)
        {
            //生成开奖基本数字
            string millisecond = orderTime.Millisecond.ToString().PadLeft(3, '0');
            string hour = orderTime.Hour.ToString().PadLeft(2, '0');
            string minute = orderTime.Minute.ToString().PadLeft(2, '0');
            string second = orderTime.Second.ToString().PadLeft(2, '0');
            string num = hour + minute + second + millisecond;
            return num;
        }
    }
}