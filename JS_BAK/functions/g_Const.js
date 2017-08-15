/*常数(枚举)定义*/

/*用户类型*/
var g_const_buyerType = {
    /*注册会员*/"REGMEMBER": "4497469400050002",
    /*内购会员*/"SELFMEMBER": "4497469400050001"
};

/*成功码*/
var g_const_Success_Code = 1;
/*内部错误码*/
var g_const_Error_Code = {
    "UnLogin": "999",
    "NoAddress": "1000",
};
/*内部接口成功码*/
var g_const_Success_Code_IN = 0;

/*是否被收藏*/
var g_const_collectionProduct = {
    /*已收藏*/"YES": 1,
    /*未收藏*/"NO": 0
};

/*是否需要api_token*/
var g_const_api_token = {
    /*需要发送*/"Wanted": "1",
    /*不需要发送*/"Unwanted": ""
};
/*是否*/
var g_const_YesOrNo = {
    /*是*/"YES": 1,
    /*否*/"NO": 0
}
var g_const_seconds = 1000;
var g_const_minutes = g_const_seconds * 60;
var g_const_hours = g_const_minutes * 60;
var g_const_days = g_const_hours * 24;
var g_const_years = g_const_days * 365;
/*模板替换正则*/
var g_const_regex_template = /(?:\{\{)([a-zA-z][^\s\}]+)(?:\}\})/g;
/*LocalStorage名称定义*/
var g_const_localStorage = {
    /*立即购买商品列表*/
    "ImmediatelyBuy": "ImmediatelyBuy",
    /*订单确认(提交的购物列表)*/
    "OrderConfirm": "OrderConfirm",
    /*订单确认(提交的购物价格)*/
    "OrderPrice": "OrderPrice",
    /*立即购买的商品属性*/
    "GoodsInfo": "GoodsInfo",
    /*订单类型*/
    "OrderType": "OrderType",
    /*发票*/
    "FaPiao": "FaPiao",
    /*发票内容*/
    "FaPiaoNR": "FaPiaoNR",
    /*优惠券*/
    "CouponCodes": "CouponCodes",
    /*返回地址*/
    "BackURL": "BackURL",
    /*返回地址列表*/
    "BackURLList": "BackURLList",
    /*指定配置的返回地址*/
    "PageUrlConfig": "PageUrlConfig",
    /*页面路径*/
    "PagePathList": "PagePathList",
    /*购物车完整版*/
    "CartFull": "CartFull",
    /*浏览历史*/
    "History": "History",
    /*新注册用户标志*/
    "IsnewReg": "IsnewReg",
    /*优惠头条信息*/
    "CartSalesAdv": "CartSalesAdv",

    ///*来源和时间*/
    //"ScrollTime": "[]",

    /*地址三级联动的缓存*/
    "StoreDistrict": "StoreDistrict",
    //"JSAPI_Ticket": "JSAPI_Ticket",
    //"JSAPI_Access_token": "JSAPI_Access_token",
    "OrderAddress": "OrderAddress",
    /*限时抢购提醒商品缓存*/
    "FlashActive": "FlashActive",
    /*推广来源ID*/
    "OrderFrom": "OrderFrom",
    /*推广来源参数*/
    "OrderFromParam": "OrderFromParam",
    /*扫码购产品ID*/
    "SMG_ProductID": "SMG_ProductID",
    /*登陆会员信息*/
    "Member": "Member",//{Member:{"phone":"","uid":"","accounttype":0}}
    /*卡券ID*/
    "Card_Key": "Card_Key",
    //用户在商品详情页选择默认收货城市,例如：{cityID : "110100",cityName : "北京市"}
    "DefaultCity": "DefaultCity",
    /*推广来源时间*/
    "OrderFromTime": "OrderFromTime",
    /*推广来源url*/
    "OrderFromRefer": "OrderFromRefer",
};
/*账号绑定类型*/
var g_const_accounttype = {
    /*微信*/
    WeiXin: 13,
    /*微博*/
    WeiBo: 12,
    /*QQ*/
    QQ: 11,
    /*支付宝*/
    AliPay: 15,
    /*微公社*/
    ICHSY: 14
}

/*LocalStorage名称定义-- 结束*/

/*优惠卷状态[0：未使用；1：已使用；2：已过期]*/
var g_Coupon_Status = {
    /*未使用*/
    "CanUse": "0",
    /*已使用*/
    "Used": "1",
    /*已过期*/
    "Expired": "2"
};


/*订单类型定义*/
var g_order_Type = {
    /*试用订单*/
    "Try": "449715200003",
    /*闪购订单*/
    "Quick": "449715200004",
    /*普通订单*/
    "Common": "449715200005",
    /*内购订单*/
    "Inner": "449715200007",
    /*扫码购订单*/
    "QRCode": "449715200010",
    /*拼好货*/
    "PinTuan": "449715200013"
};
/*订单类型定义-- 结束*/

/*订单来源定义*/
var g_order_Souce = {
    /*微信订单*/
    "Weixin": "449715190006",
    /*扫码购订单*/
    "QRCode": "449715190007",
};
/*订单类型定义-- 结束*/


/*支付类型定义*/
var g_pay_Type = {
    /*在线支付*/
    "Online": "449716200001",
    /*支付宝*/
    "Alipay": "449746280003",
    /*货到付*/
    "Getpay": "449716200002",
    /*微信支付*/
    "WXpay": "449746280005",
    GetPayTypeText: function (PayType) {
        switch (PayType) {
            case g_pay_Type.Alipay:
                return "支付宝";
            case g_pay_Type.WXpay:
                return "微信支付";
            case g_pay_Type.Online:
                return "在线支付";
            case g_pay_Type.Getpay:
                return "货到付款";
            default:
                return "";
        }
    }
};
/*支付类型定义-- 结束*/

var g_pay_ment = {
    WxPay: { Paygate: "762", PaygateType: "3", PaygateAccount: "" },
    AliPay: { Paygate: "654", PaygateType: "1", PaygateAccount: "" },
    getPayTypeText: function (Paygate, PaygateType) {
        if ((Paygate == "654" || Paygate == "65") && PaygateType == "1") {
            return "支付宝支付";
        }
        if (Paygate == "762" && PaygateType == "3") {
            return "微信支付";
        }
    },
};
/*发票类型*/
var g_const_bill_Type = {
    /*普通发票*/
    "Normal": "449746310001",
    /*增值税发票*/
    "ZengZhi": "449746310002",
    /*不开发票*/
    "NotNeed": "0"
};
/*默认产品图片*/
var g_goods_Pic = "http://wap-family.syserver.ichsy.com/cfamily/resources/cfamily/zzz_js/monthSales_bg.png";
/*默认品牌特惠图片*/
var g_brand_Pic = "http://wap-family.syserver.ichsy.com/cfamily/resources/cfamily/zzz_js/bg.png";
/*默认会员头像图片*/
var g_member_Pic = "http://win.image.ichsy.com/hjypin/img/w_img/portrait.png";
/*‘显示更多’链接类型*/
var g_const_showmoreLinktype = {
    /*超链接*/
    "URL": "4497471600020001",
    /*关键字搜索*/
    "KeyWordSearch": "4497471600020002",
    /*商品分类*/
    "ProductType": "4497471600020003",
    /*商品详情*/
    "ProductDetail": "4497471600020004",
    //显示浮层 
    ShowLayer: "4497471600020005",
    //抽奖
    Award: "4497471600020006"
};
/*是否显示更多*/
var g_const_isShowmore = {
    /*是*/
    "YES": "449746250001",
    /*否*/
    "NO": "449746250002",
    /*未知*/
    "Unknown": ""
};
/*订单状态编号
4497153900010001	下单成功-未付款
4497153900010002	下单成功-未发货
4497153900010003	已发货（待收货）
4497153900010004	已收货(目前系统中  已收货 就是 交易成功)
4497153900010005	交易成功
4497153900010006	交易失败(交易关闭)
*/
var g_const_orderStatus = {
    "DFK": "4497153900010001",
    "DFH": "4497153900010002",
    "DSH": "4497153900010003",
    "YSH": "4497153900010004",
    "JYCG": "4497153900010005",
    "JYSB": "4497153900010006"
};

var g_const_mobilecz_orderStatus = {
    "DZF": "DZF",//待付款
    "ZFCG": "ZFCG",//支付成功
    "DCZ": "DCZ",//待充值
    "CZCG": "CZCG",//充值成功
    "CZSB": "CZSB"//充值失败
};
var g_const_ego_orderStatus = {
    //初始化
    "Init": "0",
    //支付中
    "Paying": "1",
    //已支付
    "Payed": "2",
    //支付失败
    "Fail": "3",
    //已取消
    "UserCancel": "5",
    //等待揭晓
    "PaySucc": "10",
    //退款中
    "RefundIng": "15",
    //退款失败
    "RefundFail": "16",
    //退款成功
    "RefundSucc": "20",
    //揭晓中
    "AwardIng": "30",
    //未中奖
    "UnAward": "35",
    //夺宝成功
    "AwardSucc": "40",
    //领宝失败
    "GetFail": "45",
    //领宝成功
    "GetSucc": "50",
    getText: function (status, paygate, paygatetype) {
        switch (status) {
            case g_const_ego_orderStatus.Init://初始化
                return "初始化";
            case g_const_ego_orderStatus.Paying://支付中
                return "支付中";
            case g_const_ego_orderStatus.Payed://已支付
                return "已支付";
            case g_const_ego_orderStatus.Fail://支付失败
                return "支付失败";
            case g_const_ego_orderStatus.UserCancel://已取消
                return "已取消";
            case g_const_ego_orderStatus.PaySucc://等待揭晓
                return "等待揭晓";
            case g_const_ego_orderStatus.RefundIng://退款中
                return "退款中";
            case g_const_ego_orderStatus.RefundFail://退款失败
                return "退款中";
            case g_const_ego_orderStatus.RefundSucc://退款成功
                if (paygate && paygate == "654") {
                    return "已退回支付宝";
                }
                if (paygate && paygate == "762") {
                    return "已退回微信";
                }
                return "退款成功";
            case g_const_ego_orderStatus.AwardIng://揭晓中
                return "揭晓中";
            case g_const_ego_orderStatus.UnAward://未中奖
                return "未中奖";
            case g_const_ego_orderStatus.AwardSucc://夺宝成功
                return "夺宝成功";
            case g_const_ego_orderStatus.GetFail://领宝失败
                return "领宝失败";
            case g_const_ego_orderStatus.GetSucc://领宝成功
                return "领宝成功";

        }
    },
};

/*支付宝支付地址*/
var g_Alipay_url = "http://qhbeta-cfamily.qhw.yshqi.com/cfamily/payOrder/";
/*TV购物排序*/
var g_const_tvlive_sort = {
    /*正序*/
    "ASC": "0",
    /*倒序*/
    "DESC": "1"
}
;
/*商品状态*/
var g_const_productStatus = {
    /*上架*/"Common": "4497153900060002",
    /*售罄*/"SaleOver": "4497471600050002"
};
/*最大历史记录数量*/
var g_const_MaxHistoryCount = 50;

/*活动类型类型*/
var g_const_ActivityType = {
    /*今日新品*/
    "Todaynew": "467703130008000100040001",
    /*品牌特惠*/
    "BrandPreference": "467703130008000100030001",
    /*海外购*/
    "ImportProduct": "467703130008000100090001",
};
/*活动类型类型*/
var g_const_ActivityName = {
    /*今日新品*/
    "Todaynew": "今日新品",
    /*品牌特惠*/
    "BrandPreference": "品牌特惠",
    /*海外购*/
    "ImportProduct": "海外购",
};
/*最大历史记录数量*/
var g_const_MaxScroll = 1000;

/*我的优惠卷查询类型类型*/
var g_const_couponLocation = {
    /*0代表未使用优惠券，*/
    "NoUse": "0",
    /*1代表历史优惠券*/
    "Used": "1",
};

/*跳转页面集合*/
var g_const_PageURL = {
    /*首页*/
    "Index": "/Index.html",
    /*图文详情页*/
    "GoodsDetailTeletext": "/Goods/GoodsDetailTeletext.html",
    /*详情页*/
    "GoodsDetail": "/Goods/GoodsDetail.html",
    /*往期揭晓*/
    "OtherPeriod": "/Goods/OtherPeriod.html",
    /*常见问题*/
    "CommonProblem": "/CommonProblem.html",
    /*查看详情*/
    "LuckyDetail": "/Goods/LuckyDetail.html",
    /*普通登录页*/
    "Login": "/Account/login.html",
    /*授权登陆发起页*/
    "OauthLogin": "/Account/OauthLogin.aspx",
    /*注册页*/
    "Reg": "/Account/Register.html",
    /*手机登录页*/
    "PhoneLogin": "/Account/PhoneLogin.html",
    /*支付成功页*/
    "OrderSuccess": "/order/OrderSuccess.html",
    /*支付失败页*/
    "OrderFail": "/order/OrderFail.html",
    /*订单确认页*/
    "OrderConfirm": "/OC.htm",
    /*订单确认前置页*/
    "PreOrderConfirm": "/Order/PreOrderConfirm.html",
    /*账户中心*/
    "AccountIndex": "/Account/index.html",
    /*我的账户中心*/
    "MyAccount": "/Account/Personal.html",
    /*我的昵称*/
    "MyNickName": "/Account/MyNickName.html",
    /*我的订单*/
    "MyOrder_List": "/Account/MyOrders.html",
    /*我的订单--订单详情*/
    "MyOrder_detail": "/Order/OrderDetail.html",
    /*我的订单--订单物流*/
    "MyOrder_List_ckwl": "/Account/MyOrder_List_ckwl.html",
    /*我的订单--订单支付*/
    "MyOrder_pay": "/order/MyOrder_pay.html",
    /*编辑收货地址*/
    "AddressEdit": "/Account/Address_Edit.html",
    /*收货地址列表*/
    "AddressList": "/Account/Address_List.html",
    /*重置密码*/
    "ResetPassword": "/Account/ResetPassword.html",
    /*发票*/
    "fapiao": "/Order/fapiao.html",
    /*惠家有软件许可及服务协议*/
    "xieyi": "/xy.html",
    /*惠家有软件许可及服务协议*/
    "ego_xieyi": "/ego_xy.html",
    GoTo: function (url, par) {
        // PageUrlConfig.SetUrl();
        if (url) {
            url += (par ? ("?" + par + "&t=" + new Date().getTime()) : "?t=" + new Date().getTime());
            window.location.href = url;
        }
        else {
            window.location.href = g_const_PageURL.Index;
        }
        return false;
    }
};
/*接口提示信息集合 1 接口返回  9-接口返回错误 8-系统返回错误 7-页面提示错误*/
var g_const_API_Message = {
    "1": "操作成功",
    "934105101": "您还没有注册哦，请注册后再登录",
    "934105102": "账户号码和密码不匹配",
    "8801": "验证码错误",
    "8802": "验证码已过期或者不存在，请重新获取验证码",
    "8803": "验证码发送太频繁，请1小时后再试",
    "8804": "验证码请求太频繁，请稍后再试",
    "8805": "验证码输入错误次数过多，请重新获取验证码",
    "8806": "当日发送验证码已达上限，请明日再试",
    "8901": "您已是注册用户，请直接登录",
    "8902": "您已是注册用户",
    "8903": "图片验证码错误",
    "8904": "请输入图片验证码",
    "7001": "亲，堵车了，请稍后重试哦~",
    "7002": "注册成功.",
    "7003": "密码修改成功.",
    "7004": "评价成功",
    "7801": "已发送短信验证码",
    "7802": "请填写验证码",
    "7901": "请填写手机号码",
    "7902": "请填写正确的手机号码",
    "7903": "请输入密码",
    "7904": "请输入6-16位字符且不能包含空格",
    "100001": "您还没有登录或者已经超时",
    "100002": "系统繁忙,同步购物车失败,请稍后重试.",
    "100003": "收藏添加成功",
    "100004": "删除收藏成功",
    "100005": "地址信息保存成功",
    "100006": "默认地址设定成功",
    "100007": "请填写收货人姓名",
    "100009": "请选择区",
    "100010": "请填写详细地址",
    "100011": "收货人姓名请输入2-10个汉字",
    "100012": "详细地址字数需控制在5-40之间哦",
    "100013": "请输入优惠码",
    "100014": "您目前还没有优惠券.",
    "100015": "您还没有选择要使用的优惠券",
    "100016": "请您输入优惠券兑换码",
    "100017": "优惠券兑换成功",
    "100018": "请您选择发票类型和发票抬头",
    "100019": "请您填写公司名称",
    "100020": "已收到您的建议",
    "100021": "没有更多的猜你喜欢了",
    "100022": "读取猜你喜欢时系统繁忙,请稍后再试",
    "100023": "请填写登录手机号",
    "100024": "请填写登录密码",
    "100025": "登录成功",
    "100026": "没有更多数据了",
    "100027": "请选择要删除的商品",
    "100028": "您已取消本次微信支付，请选择其他方式支付.",
    "100029": "亲，堵车了，请稍后哦~",//"网络连接失败，请重新尝试.",
    "100030": "请填写收货人信息",
    "100031": "请选择支付类型",
    "100032": "推荐人手机号不能为空",
    "100033": "上级设定成功",
    "100034": "密码不能为空",
    "100035": "密码设定成功",
    "100036": "对不起,您选择的商品无货,请您重新选择.",
    "100037": "活动配置有误",
    "100038": "最多保留收货地址数量:",
    "100039": "已达到限购数量，看看其他的商品吧~",
    "100040": "为了保证账户安全，请尽快去“个人中心”设置密码哦~",
    "100041": "请选择省",
    "100042": "请选择市",
    "100043": "数据加载中",
    "100044": "密码格式为6-16不包含空格的字符",
    "100045": "推荐人手机号不能是本人",
    "100046": "已有上级，不能再次添加",
    "108903": "验证码已发至您的手机，马上就能享受返现特权啦！",
    "108904": "只差一步就能享受返现特权啦！",
    "107901": "请输入手机号",
    "107902": "请输入11位有效手机号",
    "107802": "请输入验证码",
    "106001": "海外购商品需要您的身份证！",
    "106002": "已有身份证信息不能删除！",
    "106003": "请您核对身份证信息！",
    "106004": "昵称提交成功！",
    "106005": "昵称不符合格式",
    "106006": "您还没有修改昵称哦！",
    "106007": "设置个性昵称",
    "107001": "该商品不支持该地区配送，请重新选择地址",
};

var g_const_BackUrlList = [];

/*页面跳转配置*/
var g_const_PagePathList = [];

/*跳转页面集合*/
var g_const_Phone = {
    /*售后电话*/
    "sh": "400-867-8210",
}

/*验证码倒计时*/
var g_const_ValidCodeTime = 59;
/*产品购买状态*/
var g_const_buyStatus = {
    /*允许购买*/
    YES: 1,
    /*活动未开始*/
    ActNotStart: 2,
    /*活动已结束*/
    ActIsEnd: 3,
    /*活动进行中,但是不可购买*/
    No: 4,
    /*其他状态*/
    Other: 5
};
/*微信分享类型*/
var g_const_wx_share_type = {
    /*音乐*/
    music: "music",
    /*视频*/
    video: "video",
    /*链接*/
    link: "link"
};
/*微信JSAPI接口*/
var g_const_wx_jsapi = {
    /*分享到朋友圈*/
    onMenuShareTimeline: "onMenuShareTimeline",
    /*分享给朋友*/
    onMenuShareAppMessage: "onMenuShareAppMessage",
    /*分享到QQ*/
    onMenuShareQQ: "onMenuShareQQ",
    /*分享到腾讯微博*/
    onMenuShareWeibo: "onMenuShareWeibo",
    /*分享到QQ空间*/
    onMenuShareQZone: "onMenuShareQZone"
};
/*微信JSAPI全部分享方法*/
var g_const_wx_AllShare = g_const_wx_jsapi.onMenuShareAppMessage + "," + g_const_wx_jsapi.onMenuShareQQ + "," + g_const_wx_jsapi.onMenuShareQZone + "," + g_const_wx_jsapi.onMenuShareTimeline + "," + g_const_wx_jsapi.onMenuShareWeibo;
/*品牌专题内容广告位置*/
var g_const_brandLocation = {
    /*头部*/
    Header: 1,
    /*尾部*/
    Footer: 2
};
/*商品状态*/
var g_const_EventProductType = {
    /*闪购*/"Flash": "20150701001",
    /*特价*/"Event": "20150701002"
};
/*订单渠道ID*/
var g_const_ChannelID = "449747430003";
//是否分享
var g_const_shareFlag = {
    YES: "449747110002",
    NO: "449747110001"
};
//分享默认值
var g_const_Share = {
    DefaultTitle: "惠家有购物商城",
    DefaultDesc: "惠家有购物商城",
    DefaultImage: g_goods_Pic
};
//展示平台
var g_const_viewType = {
    //客户端
    APP: "4497471600100001",
    //微信商城
    WXSHOP: "4497471600100002",
    //PC版
    PCWeb: "4497471600100003"
};
/*成功码*/
var g_const_Exchange_Code_ZHY = [
    ["30", "摇一摇1,摇一摇2,摇一摇3,摇一摇4,摇一摇5,摇一摇6,摇一摇7,摇一摇8"],
    ["20", "yaoyiyao1"],
    ["10", "yaoyiyao2"]
];

/*扫描购更新时间*/
var g_const_SMG_ChangeDate = "2015-11-23 12:00:00";

var g_const_OrderConfirmRefer = ["goodsdetail", "index", "login"];

var g_const_Merchant_Group_Android = "betagroup";
var g_const_Merchant_Group_Ios = "igroup";
var g_const_Merchant_MT = "mt";
//多麦
var g_const_Merchant_duomai = "duomai";


/*短信类型*/
var g_const_SMSType = [
    ["saveaddress", "1"],
    ["phonelogin", "2"],
    ["bindmobileandmobilereg", "3"],
    ["phoneregister", "4"],
    ["passwordreset", "5"],
    ["lqfxtq", "6"],
    ["freeusesq", "7"],
    ["couponcodeexchange_jygw", "9"],
    ["couponcodeexchange_xzq", "10"],
    ["couponcodeexchange_xzqsd", "11"],
    ["couponcodeexchange_xzqjs", "12"],
    ["couponcodeexchange_anmyzw", "13"],
    ["couponcodeexchange_ahmyz", "13"],
    ["couponcodeexchange_wy", "8"],
    ["couponcodeexchange_wyt8", "8"],
    ["couponcodeexchange_wyapp", "14"],
    ["couponcodeexchange_wyt8app", "14"],
];
/*短信图片验证码开[1]关[0]*/
var g_const_SMSPic_Flag = 1;
/*引导页 商户号，金额，兑换码，唯一兑换标志（对卡券有效）*/
var g_Exchange_Guide = [
    ["jygw", "客户端\"优惠券\"中输入<br>\"100\"立获100元购物红包", "1", ""],
    ["wy", "下载app 后输入<br>\"摇啊摇\"兑换30元优惠券", "0", "/Act151118/img/guide_yyy_2.png"],
    ["wyt8", "下载app 后输入<br>\"摇啊摇\"兑换30元优惠券", "0", "/Act151118/img/guide_yyy_2.png"],
    ["wyapp", "30元优惠券仅在app使用", "0", "/Act151118/img/guide_yyy_1.png"],
    ["wyt8app", "30元优惠券仅在app使用", "0", "/Act151118/img/guide_yyy_1.png"],
    ["xzq", "客户端“优惠券”中输入<br>\"惠买惠花\"立获30元红包", "1", "/img/w_img/guide_xzq.png"],
    ["xzqsd", "客户端“优惠券”中输入<br>\"惠买惠花\"立获30元红包", "1", "/img/w_img/guide_xzq.png"],
    ["xzqjs", "客户端“优惠券”中输入<br>\"惠买惠花\"立获30元红包", "1", "/img/w_img/guide_xzq.png"],
    ["anmyzw", "客户端“优惠券”中输入<br>\"领红包\"立获30元红包", "1", "/img/w_img/guide_anmyzw.png"],
    ["ahmyz", "客户端“优惠券”中输入<br>\"领红包\"立获30元红包", "1", "/img/w_img/guide_anmyzw.png"],
    ["adks", "", "1", ""],
    ["hjysms", "下载APP 输入<br>\"大礼包\"领取组合购物红包", "1", ""],
];
/*商户活动链接域名*/
var g_merchant_Act_Host = "http://tj.ichsy.com";
//活动类型
var g_const_Act_Event_Type = {
    //秒杀
    SecKill: "4497472600010001",
    //特价
    SpecialPrice: "4497472600010002",
    //拍卖
    Auction: "4497472600010003",
    //扫码购
    SMG: "4497472600010004",
    //闪购
    FastBuy: "4497472600010005",
    //内购
    Insourced: "4497472600010006",
    //TV专场
    TV: "4497472600010007",
    //满减
    ManJian: "4497472600010008",
};
//var cdn_path = "http://win.image.ichsy.com/hjyshop";
//商品标签
var g_const_ProductLabel = {
    //生鲜
    Fresh: { name: "生鲜商品", value: "LB160108100002", picture: cdn_path + "/img/xxh_txbtn.png", spicture: cdn_path + "/img/icon_msg_fresh.png" },
    //TV商品
    TV: { name: "TV商品", value: "LB160108100003", picture: "", spicture: "" },
    //海外购商品
    OverSea: { name: "海外购商品", value: "LB160108100004", picture: cdn_path + "/img/hwg_txbtn.png", spicture: cdn_path + "/img/icon_msg_haiwaigou.png" },
    //查找
    find: function (ProductLabelValue) {
        for (var k in g_const_ProductLabel) {
            var pl = g_const_ProductLabel[k];
            if (pl.value == ProductLabelValue)
                return pl;
        }
        return null;
    },
    isOverSea: function (ProductLabelValue) {
        if (ProductLabelValue == g_const_ProductLabel.OverSea.value) {
            return true;
        }
        else {
            return false;
        }
    },
};
//操作标识
var g_const_operFlag = {
    //商品详情
    productdetail: "productdetail",
    //订单详情
    orderdetail: "orderdetail",
    //猜你喜欢
    maybelove: "maybelove",
    //支付成功
    paysuccess: "paysuccess"
};
var g_const_lotteryStatus = {
    SellIng: 10,
    SellEnd: 20,
    OpenIng: 30,
    OpenFail: 25,
    OpenSucc: 40,
};

