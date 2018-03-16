package com.pcp.api.pos;

/**
 * POS的一些服务定义
 * Created by Silence on 2017/7/3.
 */
public interface PosAPI {

    /**
     * 应用标识，要和spring.application.name相同
     */
    public final static String APPID = "pos";

    public final static String BEAN_CONTRACT_PASS_SERVICE = "contractPassService";
    public final static String BEAN_CASHRECONC_SERVICE = "cashReconcService";

    public final static String BEAN_RECEIVECHECK_SERVICE = "receiveCheckService";

    public final static String BEAN_RECEIVECHECKMAIN_SERVICE = "receiveCheckMainService";

    public final static String BEAN_RECEIVECHECKDETAIL_SERVICE = "receiveCheckDetailService";

    public final static String BEAN_CASHRECONCDETAIL_SERVICE = "cashReconcDetailService";

    public final static String BEAN_CASHRECONCMAIN_SERVICE = "cashReconcMainService";

    public final static String BEAN_CONTRACT_SERVICE = "contractService";

    public final static String BEAN_ORDER_SERVICE = "orderService";

    public final static String BEAN_SHOP_SERVICE = "shopService";

    public final static String BEAN_RULE_SERVICE = "ruleService";

    public final static String order = "/order/";
    public final static String orderCount = "/orderCount/";
    public final static String orderUser = "/orderUser/";
    public final static String orderPosAmount = "/orderPosAmount/";
    public final static String orderSum = "/orderSum/";
    public final static String orderSum2 = "/orderSum2/";
    public final static String orderLine = "/orderLine/";
    public final static String orderSummaryLine = "/orderSummaryLine/";
    public final static String orderSummaryDis = "/orderSummaryDis/";
    public final static String orderSummaryPay = "/orderSummaryPay/";
    public final static String orderPayment = "/orderPayment/";
    public final static String orderPromotion = "/orderPromotion/";

    public final static String orderSummary = "/orderSummary";
    public final static String payConfig = "/payConfig";
    public final static String payConfigSave = "/payConfigSave";

    public final static String orderId = "/order/{id}";

    public final static String shopList = "/shop/list";

    public final static String shopSync = "/shop/sync";

    public final static String shopId = "/shop/{id}";

    public final static String summaryOrder = "/order/summary";

    public final static String uploadOrder = "/order/upload";

    public final static String ruleList = "/rule/list";

    public final static String ruleId = "/ruleId/{id}";

    public final static String ruleSave = "/rule/save";

    public final static String ruleLineList = "/ruleLine/list";

    public final static String ruleLineSave = "/ruleLine/save";

    public final static String ruleLineId = "/ruleLineId/{id}";

    public final static String topOrderLine = "/topOrderLine";
}
