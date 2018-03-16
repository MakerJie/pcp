package com.pcp.api.crm;

/**
 * Crm 服务的api地址定义
 * Created by Silence on 2017/6/29.
 */
public interface CrmAPI {

    /**
     * 应用标识，要和spring.application.name相同
     */
    public final static String APPID = "crm";

    public final static String saveUser="/";

    public final static String pageUser="/page";

    public final static String listUserLine="/userLine/userLineList";

    public final static String addPoint="/point/";

    public final static String pagePoint="/point/page";

    public final static String pagePointById="/point/pageById/{id}";

    public final static String listPointByUserId="/point/{userId}";

    public final static String userId = "/{id}";

    public final static String BEAN_USER_POINT_HISTORY_SERVICE = "userPointHistoryService";

    public final static String BEAN_USER_SERVICE = "userService";

    public final static String BEAN_POINTSTORE_SERVICE = "pointStoreService";

    public final static String savePointStore="/pointStore/save";

    public final static String PointStoreId="/pointStoreId/{id}";

    public final static String pagePointStore="/pointStore/page";

    /*广告位管理*/
    public final static String BEAN_ADVERTISE_SERVICE = "advertiseService";

    public final static String saveAdvertise="/advertise/save";

    public final static String advertiseId="/advertise/{id}";

    public final static String pageAdvertise="/advertise/page";

    public final static String deleteAdvertise="/advertise/delete";
    /*渠道*/
    public final static String BEAN_CHANNEL_SERVICE = "channelsService";

    public final static String saveChannel="/channel/save";

    public final static String channelId="/channel/{id}";

    public final static String pageChannels="/channel/page";

    public final static String deleteChannel="/channel/delete/{id}";

    //会员权益
    public final static String BEAN_AUTHORITY_SERVICE = "authorityService";

    public final static String saveAuthority="/authority/save";

    public final static String pageAuthority="/authority/page";

    public final static String authorityId="/authorityId/{id}";

    //会员留言
    public final static String BEAN_MESSAGE_SERVICE = "messageService";

    //金额报表
    public final static String BEAN_REPORT_SERVICE = "reportService";

    /*二维码*/
    public final static String BEAN_QRCODE_SERVICE = "qrcodeService";

    public final static String saveQrcode="/qrcode/save";

    public final static String qrcodeId="/qrcode/{id}";

    public final static String pageQrcodes="/qrcode/page";

    public final static String deleteQrcode="/qrcode/delete";

    /*会员等级管理*/
    public final static String BEAN_LEVELMANAGE_SERVICE = "levelManageService";

    public final static String saveLevelManage="/levelManage/save";

    public final static String levelManageId="/levelManage/{id}";

    public final static String pageLevelManage="/levelManage/page";

    public final static String deleteLevelManage="/levelManage/delete";

    /*奖励管理*/
    public final static String BEAN_REWARD_SERVICE = "rewardService";

    public final static String saveReward="/reward/save";

    public final static String rewardId="/reward/{id}";

    public final static String pageReward="/reward/page";

    public final static String deleteReward="/reward/delete";

    /*积分商城类型维护*/
    public final static String BEAN_POINTSTORETYPE_SERVICE = "pointStoreTypeService";

    public final static String savepointStoreType="/pointStoreType/save";

    public final static String pointStoreTypeId="/pointStoreType/{id}";

    public final static String pagePointStoreType="/pointStoreType/page";

    public final static String deletePointStoreType="/pointStoreType/delete";

    //会员地址管理
    public final static String pageAddress="/address/page";


    /*优惠券管理*/
    public final static String BEAN_SAVERTICKET_SERVICE = "saverTicketService";

    public final static String saveSaverTicket="/saverTicket/save";

    public final static String saverTicketId="/saverTicket/{id}";

    public final static String saverTicketCode="/saverTicketCode/{code}";

    public final static String pageSaverTicket="/saverTicket/page";

    public final static String deleteSaverTicket="/saverTicket/delete/{id}";

    //二维码门店关系
    public final static String saveQrcodeShop="/qrcodeShop/save";

    public final static String deleteQrcodeShop="/qrcodeShop/delete";

    //二维码渠道关系
    public final static String saveQrcodeChannel="/qrcodeChannel/save";

    public final static String scanQrcode = "/scan/qrcode";

    //等级变动
    public final static String BEAN_GRADECHANGE_SERVICE = "gradeChangeService";

    // 短信管理
    public final static String BEAN_SMS_SERVICE = "smsService";

    public final static String saveSms="/sms/save";

    public final static String smsId="/sms/{id}";

    public final static String pageSms="/sms/page";

    public final static String deleteSms="/sms/delete/{id}";

    public final static String BEAN_COUP_SERVICE = "couponService";

    public final static String saveCouponType = "/coupon/couponType";

    public final static String genCoupon = "/coupon/generate";

    public final static String listCouponType = "/coupon/typeList";

    public final static String couponId = "/pms/couponId/{id}";

    public final static String couponInfoId = "/couponInfo/{id}";

    public final static String pageCoupon = "/coupon/page";

    public final static String couponCode = "/coupon/{code}";

    public final static String delCoupon = "/coupon/delete";
    public final static String delCouponType = "/coupon/type/delete/{id}";

    public final static String sendCoupon = "/coupon/send";

    public final static String sendCouponHistory = "/coupon/send/history";

    public final static String checkLogin = "/userLogin";

    public final static String couponExchange = "/coupon/exchange";

    public final static String pointHistory = "/userPointHistory";

    public final static String verifyCoupon = "/coupon/{userCode}/{code}";

    public final static String rewardUser = "/rewards/user";

    public final static String drawCoupon = "/couponDraw";

    public final static String aliUser = "/ali/card";

    //优惠券下的两个子表
    public final static String BEAN_COUPON_SCOPE_RULE_SERVICE = "couponScopeRuleService";
    public final static String BEAN_COUPON_TIME_RULE_SERVICE = "couponTimeRuleService";
}
