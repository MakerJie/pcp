package com.pcp.api.crm;

import com.pcp.api.crm.domain.*;
import com.pcp.common.IFacadeLayer;
import com.pcp.common.Response;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;

/**
 * CRM服务对外暴露的服务
 *
 * Created by Silence on 2017/7/5.
 */
public interface ICrmFacade extends IFacadeLayer {

    //会员信息
    Response findUsers(UserInfo userInfo);

    Response findUserById(String id);

    Response deleteUserById(UserInfo userInfo);

    Response saveUser(UserInfo userInfo);

    Response updateCardLevel(UserInfo userInfo);

    //会员积分
    Response findPointHistory(UserPointHistoryInfo userPointHistoryInfo);
    Response savePointHistory(UserPointHistoryInfo userPointHistoryInfo);
    Response findPointHistoryById(String  id);

    //积分商城

    Response savePointStoreInfo(PointStoreInfo pointStoreInfo);

    Response findPointStores(PointStoreInfo pointStoreInfo);

    Response findPointStoreById(String id);

    Response deletePointStore(String id);

    //广告管理
    Response saveAdvertiseInfo(AdvertiseInfo advertiseInfo);
    Response findAdvertiseById(String id);
    Response pageAdvertise(AdvertiseInfo advertiseInfo);
    Response deleteAdvertise(String id);

    //渠道
    Response saveChannel(ChannelInfo channelInfo);
    Response findChannelById(String id);
    Response pageChannel(ChannelInfo channelInfo);
    Response deleteChannel(String id);

    //会员权益
    Response saveAuthorityInfo(AuthorityInfo authorityInfo);
    Response pageAuthority(AuthorityInfo authorityInfo);
    Response deleteAuthority(String id);
    Response findAuthorityById(String id);
    Response saveAuthorityLine(AuthorityLineInfo authorityLineInfo);
    Response deleteAuthorityLines(String id);
    Response findAuthorityLineById(String id);
    Response pageAuthorityLine(AuthorityLineInfo authorityLineInfo);

    //二维码
    Response saveQrcode(QrcodeInfo qrcodeInfo);
    Response findQrcodeById(String id);
    Response pageQrcode(QrcodeInfo qrcodeInfo);
    Response deleteQrcode(String id);

    // 会员等级管理
    Response saveLevelManage(LevelManageInfo levelManageInfo);
    Response findLevelManageById(String id);
    Response pageLevelManage(LevelManageInfo levelManageInfo);
    Response deleteLevelManage(String id);

    // 奖励管理
    Response saveReward(RewardInfo rewardInfo);
    Response findRewardById(String id);
    Response pageReward(RewardInfo rewardInfo);
    Response deleteReward(String id);

    //会员留言管理
    Response pageMessage(MessageInfo messageInfo);
    Response saveMessage(MessageInfo messageInfo);
    Response findMessageById(String id);
    Response deleteMessage(String id);

    //积分商城类型维护
    Response pagePointStoreType(PointStoreTypeInfo pointStoreTypeInfo);
    Response findPointStoreTypeById(String id);
    Response savePointStoreType(PointStoreTypeInfo pointStoreTypeInfo);

    // 优惠券
    Response pageSaverTicket(SaverTicketInfo saverTicketInfo);
    Response findSaverTicketById(String id);
    Response saveSaverTicket(SaverTicketInfo saverTicketInfo);
    Response deleteSaverTicket(String id);

    //二维码门店关系
    Response saveQrcodeShop(QrcodeInfo qrcodeInfo);

    // 二维码渠道关系
    Response saveQrcodeChannel(QrcodeInfo qrcodeInfo);
    Response pageQrcodeChannel(ChannelInfo channelInfo);


    Response findByMobile(String mobile);



    Response findCoupons(CouponInfo couponInfo);
    Response findCouponByCode(String code);
    Response findCouponById( String id);
    Response findCouponTypes(CouponTypeInfo typeInfo);
    Response saveCouponType(CouponTypeInfo typeInfo);
    Response generateCoupons(String typeId, Integer count);
    Response deleteCoupon(CouponTypeInfo typeInfo);
    Response deleteCouponType(String id);
    Response findCouponInfoById(String id);

    Response sendCoupon(CouponInfo couponInfo);
    Response findCouponSents(CouponSentInfo couponSentInfo);

    //优惠券子表
   Response pageCouponScopeRule(CouponScopeRuleInfo couponScopeRuleInfo);
   Response pageCouponTimeRule(CouponTimeRuleInfo couponTimeRuleInfo);

   Response userLogin(UserInfo userInfo);

   Response exChangeCoupon(CouponInfo couponInfo);

   Response employeeCard(UserInfo userInfo);

   Response couponVerify(String userCode, String couponCode);

   //优惠券明细作废
   Response deleteCouponById(String id);

    Response mobileCovert(UserInfo userInfo);

    Response scanQrcode(QrcodeInfo qrcodeInfo);

    Response findRewardUser(RewardUserInfo rewardUserInfo);

    Response drawCoupon(CouponInfo couponInfo);

}
