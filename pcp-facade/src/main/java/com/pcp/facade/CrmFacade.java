package com.pcp.facade;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.ICrmFacade;
import com.pcp.api.crm.domain.*;
import com.pcp.api.crm.service.*;
import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.service.IOperationLogService;
import com.pcp.api.pos.domain.ShopInfo;
import com.pcp.api.pos.service.IShopService;
import com.pcp.common.IResourceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.JsonResponse;
import com.pcp.common.Response;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.netflix.FeignClientException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 会员服务对外暴露的服务
 * <p>
 * Created by Silence on 2017/7/5.
 */
@RestController
public class CrmFacade implements ICrmFacade, IResourceLayer {

    @Autowired
    private IUserService userService;

    @Autowired
    private IPointStoreService pointStoreService;

    @Autowired
    private IAdvertiseService advertiseService;

    @Autowired
    private IChannelService channelService;

    @Autowired
    private IAuthorityService authorityService;

    @Autowired
    private IMessageService messageService;

    @Autowired
    private IQrcodeService qrcodeService;

    @Autowired
    private ILevelManageService levelManageService;

    @Autowired
    private IRewardService rewardService;

    @Autowired
    private ISaverTicketService saverTicketService;

    @Autowired
    private IPointStoreTypeService pointStoreTypeService;

    @Autowired
    private IUserPointHistoryService pointHistoryService;

    @Autowired
    private ICouponService couponService;

    @Autowired
    private ICouponScopeRuleService couponScopeRuleService;

    @Autowired
    private ICouponTimeRuleService couponTimeRuleService;

    @Autowired
    private IOperationLogService operationLogService;

    @Autowired
    private IShopService shopService;

    //会员信息
    @RequestMapping(value = {"/user/page"}, method = RequestMethod.POST)
    @Override
    public Response findUsers(@RequestBody UserInfo userInfo) {
        if (!StringUtils.isEmpty(userInfo.getProperties())) {
            if (!StringUtils.isEmpty(userInfo.getProperties().get("totalPoint_gt"))) {
                userInfo.getProperties().put("totalPoint_gt", Double.parseDouble(userInfo.getProperties().get("totalPoint_gt").toString()));
            }
            if (!StringUtils.isEmpty(userInfo.getProperties().get("totalPoint_le"))) {
                userInfo.getProperties().put("totalPoint_le", Double.parseDouble(userInfo.getProperties().get("totalPoint_le").toString()));
            }
        }
        InfoPage<UserInfo> infoPage = userService.findUsers(userInfo);
        return JsonResponse.build(infoPage);
    }

    @RequestMapping(value = {"/user/{id}"}, method = {RequestMethod.GET})
    @Override
    public Response findUserById(@PathVariable("id") String id) {
        UserInfo ui;
        try {
            ui = userService.findUserById(id);
        } catch (Exception e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
        try {
            ShopInfo shopInfo = shopService.findShopById(ui.getLastShop());
            ui.setLastShopName(shopInfo.getName());
        } catch (Exception e) {
            ui.setLastShopName(ui.getLastShop());
        }
        try {
            ShopInfo shopInfo = shopService.findShopById(ui.getFirstShop());
            ui.setFirstShopName(shopInfo.getName());
        } catch (Exception e) {
            ui.setFirstShopName(ui.getLastShop());
        }
        return JsonResponse.buildSingle(ui);
    }

    @Override
    @DeleteMapping(value = "/user/delete/")
    public Response deleteUserById(@RequestBody UserInfo userInfo) {
        UserInfo u = userService.findUserById(userInfo.getId());
        u.setStatus(userInfo.getStatus());
        GradeChangeInfo gradeChangeInfo = new GradeChangeInfo();
        gradeChangeInfo.setBeforeLevel(u.getCardLevel());
        gradeChangeInfo.setAfterLevel(u.getCardLevel());
        if (u.getStatus() == 1) {
            gradeChangeInfo.setName(GradeChangeEnum.E.getValue() + "");
        } else {
            gradeChangeInfo.setName(GradeChangeEnum.D.getValue() + "");
        }
        gradeChangeInfo.setCreator(userInfo.getCreator());
        gradeChangeInfo.setUpdator(userInfo.getCreator());
        gradeChangeInfo.setRemark("业务需要");
        u.setChangeInfo(gradeChangeInfo);
        return JsonResponse.buildSingle(userService.saveUser(u));
    }

    @RequestMapping(value = {"/user/register", "/user/save"}, method = RequestMethod.POST)
    @Override
    public Response saveUser(@RequestBody UserInfo userInfo) {
        try {
            userService.saveUser(userInfo);
        } catch (RuntimeException e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
        return JsonResponse.ok();
    }

    @Override
    @PostMapping(value = "/user/updateCardLevel")
    public Response updateCardLevel(@RequestBody UserInfo userInfo) {
        UserInfo ui = userService.findUserById(userInfo.getId());
        int oldLevel = ui.getCardLevel();
        if (oldLevel == userInfo.getCardLevel()) {
            return JsonResponse.ok();
        }
        ui.setCardLevel(userInfo.getCardLevel());
        ui.setLevelReason(userInfo.getLevelReason());
        GradeChangeInfo gradeChangeInfo = new GradeChangeInfo();
        gradeChangeInfo.setBeforeLevel(oldLevel);
        gradeChangeInfo.setAfterLevel(ui.getCardLevel());
        if (ui.getCardLevel() > oldLevel) {
            gradeChangeInfo.setName(GradeChangeEnum.C.getValue() + "");
        } else {
            gradeChangeInfo.setName(GradeChangeEnum.D.getValue() + "");
        }
        gradeChangeInfo.setCreator(userInfo.getCreator());
        gradeChangeInfo.setUpdator(userInfo.getCreator());
        gradeChangeInfo.setRemark(userInfo.getLevelReason());
        ui.setChangeInfo(gradeChangeInfo);
        if (oldLevel == LevelEnum.STAFF.getValue()) {
            ui.setSalePoint(0);
            ui.setTotalPoint(0);
            ui.setKeepPoint(0);
            ui.getProperties().put("clearPoint", 1);
        }
        userService.saveUser(ui);
        return JsonResponse.ok();
    }

    //会员积分
    @Override
    @RequestMapping(method = RequestMethod.POST, value = "/pointHistory/page")
    public Response findPointHistory(@RequestBody UserPointHistoryInfo userPointHistoryInfo) {
        return JsonResponse.build(pointHistoryService.findPointHistory(userPointHistoryInfo));
    }

    @Override
    @RequestMapping(method = RequestMethod.PUT, value = "/pointHistory/save")
    public Response savePointHistory(@RequestBody UserPointHistoryInfo userPointHistoryInfo) {
        try {
            pointHistoryService.savePointHistory(userPointHistoryInfo);
        } catch (Exception e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(method = RequestMethod.GET, value = "/pointHistory/{id}")
    public Response findPointHistoryById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(pointHistoryService.findPointHistoryById(id));
    }

    @Override
    @GetMapping(value = "/findByMobile/{mobile}")
    public Response findByMobile(@PathVariable("mobile") String mobile) {
        UserInfo userInfo = userService.findByMobile(mobile);
        if (userInfo != null) {
            return JsonResponse.buildSingle(userInfo);
        }
        return JsonResponse.error("手机号不存在");
    }

    //积分商城
    @Override
    @PostMapping(value = CrmAPI.savePointStore)
    public Response savePointStoreInfo(@RequestBody PointStoreInfo pointStoreInfo) {
        try {
            pointStoreService.savePointStoreInfo(pointStoreInfo);
        } catch (RuntimeException e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @PostMapping(value = CrmAPI.pagePointStore)
    public Response findPointStores(@RequestBody PointStoreInfo pointStoreInfo) {
        InfoPage<PointStoreInfo> infoPage = pointStoreService.findPointStores(pointStoreInfo);
        if (!StringUtils.isEmpty(infoPage.getContent())) {
            infoPage.getContent().forEach(a -> {
                if (!StringUtils.isEmpty(a.getVoucher())) {
                    CouponTypeInfo ct = couponService.findCouponTypeById(a.getVoucher());
                    if (!StringUtils.isEmpty(ct)) {
                        a.setVoucherName(ct.getName());
                        a.setImage(ct.getSmallImage());
                    }
                }
            });
        }
        return JsonResponse.build(infoPage);
    }

    @Override
    @GetMapping(value = CrmAPI.PointStoreId)
    public Response findPointStoreById(@PathVariable("id") String id) {
        PointStoreInfo pointStoreInfo = new PointStoreInfo();
        pointStoreInfo.setId(id);
        InfoPage<PointStoreInfo> pg = pointStoreService.findPointStores(pointStoreInfo);
        if (pg != null && pg.getContent().size() > 0) {
            pointStoreInfo = pg.getContent().get(0);
            CouponTypeInfo ct = couponService.findCouponTypeById(pointStoreInfo.getVoucher());
            if (!StringUtils.isEmpty(ct)) {
                pointStoreInfo.setVoucherName(ct.getName());
                pointStoreInfo.setImage(ct.getSmallImage());
                pointStoreInfo.setLargeImage(ct.getLargeImage());
                pointStoreInfo.setTypeId(ct.getId());
                pointStoreInfo.setDescription(ct.getDescription());
                pointStoreInfo.setSpecification(ct.getSpecification());
            }
            return JsonResponse.buildSingle(pointStoreInfo);
        }
        return JsonResponse.ok();
    }

    @Override
    @DeleteMapping(value = "/pointStore/delete/{id}")
    public Response deletePointStore(@PathVariable("id") String id) {
        try {
            pointStoreService.deletePointStore(id);
        } catch (Exception e) {
            e.printStackTrace();
            return JsonResponse.error("操作失败");
        }
        return JsonResponse.ok();
    }

    @Override
    @PostMapping(value = CrmAPI.saveAdvertise)
    public Response saveAdvertiseInfo(@RequestBody AdvertiseInfo advertiseInfo) {
        try {
            if ("top".equals(advertiseInfo.getProperties().get("sign"))) {
                AdvertiseInfo ai1 = advertiseService.findAdvertiseById(advertiseInfo.getId());
                ai1.setStatus(2);
                advertiseService.saveAdvertiseInfo(ai1);
            } else if ("under".equals(advertiseInfo.getProperties().get("sign"))) {
                AdvertiseInfo ai1 = advertiseService.findAdvertiseById(advertiseInfo.getId());
                ai1.setStatus(3);
                advertiseService.saveAdvertiseInfo(ai1);
            } else {
                advertiseService.saveAdvertiseInfo(advertiseInfo);
            }
        } catch (RuntimeException e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @GetMapping(value = CrmAPI.advertiseId)
    public Response findAdvertiseById(@PathVariable("id") String id) {
        AdvertiseInfo advertiseInfo = advertiseService.findAdvertiseById(id);
        return JsonResponse.buildSingle(advertiseInfo);
    }

    @Override
    @PostMapping(value = CrmAPI.pageAdvertise)
    public Response pageAdvertise(@RequestBody AdvertiseInfo advertiseInfo) {
        return JsonResponse.build(advertiseService.pageAdvertise(advertiseInfo));
    }

    @Override
    @DeleteMapping(value = "/advertise/delete/{id}")
    public Response deleteAdvertise(@PathVariable("id") String id) {
        try {
            AdvertiseInfo advertiseInfo = new AdvertiseInfo();
            advertiseInfo.setId(id);
            advertiseService.deleteAdvertise(advertiseInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }


    //渠道
    @Override
    @PostMapping(value = CrmAPI.saveChannel)
    public Response saveChannel(@RequestBody ChannelInfo channelInfo) {
        try {
            channelInfo.setCode(UUID.randomUUID().toString());
            channelService.saveChannel(channelInfo);
        } catch (RuntimeException e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @GetMapping(value = CrmAPI.channelId)
    public Response findChannelById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(channelService.findChannelById(id));
    }

    @Override
    @PostMapping(value = CrmAPI.pageChannels)
    public Response pageChannel(@RequestBody ChannelInfo channelInfo) {
        return JsonResponse.build(channelService.pageChannel(channelInfo));
    }

    @Override
    @DeleteMapping(value = CrmAPI.deleteChannel)
    public Response deleteChannel(@PathVariable("id") String id) {
        try {
            channelService.deleteChannel(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    //二维码
    @Override
    @PostMapping(value = CrmAPI.saveQrcode)
    public Response saveQrcode(@RequestBody QrcodeInfo qrcodeInfo) {
        try {
            qrcodeService.saveQrcode(qrcodeInfo);
        } catch (RuntimeException e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @GetMapping(value = CrmAPI.qrcodeId)
    public Response findQrcodeById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(qrcodeService.findQrcodeById(id));
    }

    @Override
    @PostMapping(value = CrmAPI.pageQrcodes)
    public Response pageQrcode(@RequestBody QrcodeInfo qrcodeInfo) {
        InfoPage<QrcodeInfo> page = qrcodeService.pageQrcode(qrcodeInfo);
        if (!StringUtils.isEmpty(page.getContent())) {
            page.getContent().forEach(a -> {
                if (StringUtils.hasText(a.getShopCode())) {
                    ShopInfo shopInfo = shopService.findShopById(a.getShopCode());
                    a.setShopName(shopInfo.getName());
                }
            });
        }
        return JsonResponse.build(page);
    }

    @Override
    @DeleteMapping(value = CrmAPI.qrcodeId)
    public Response deleteQrcode(@PathVariable String id) {
        QrcodeInfo qrcodeInfo = new QrcodeInfo();
        qrcodeInfo.setId(id);
        qrcodeService.deleteQrcode(qrcodeInfo);
        return JsonResponse.ok();
    }

    //会员等级
    @Override
    @PostMapping(value = CrmAPI.saveLevelManage)
    public Response saveLevelManage(@RequestBody LevelManageInfo levelManageInfo) {
        try {
            levelManageService.saveLevelManage(levelManageInfo);
        } catch (RuntimeException e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @GetMapping(value = CrmAPI.levelManageId)
    public Response findLevelManageById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(levelManageService.findLevelManageById(id));
    }

    @Override
    @PostMapping(value = CrmAPI.pageLevelManage)
    public Response pageLevelManage(@RequestBody LevelManageInfo levelManageInfo) {
        return JsonResponse.build(levelManageService.pageLevelManage(levelManageInfo));
    }

    @Override
    @DeleteMapping(value = CrmAPI.levelManageId)
    public Response deleteLevelManage(@PathVariable("id") String id) {
        LevelManageInfo levelManageInfo = new LevelManageInfo();
        levelManageInfo.setId(id);
        levelManageService.deleteLevelManage(levelManageInfo);
        return JsonResponse.ok();
    }


    // 奖励管理
    @Override
    @PostMapping(value = CrmAPI.saveReward)
    public Response saveReward(@RequestBody RewardInfo rewardInfo) {
        try {
            Map<String, Object> rule = rewardInfo.getRule();
            if (rule != null) {
                rewardInfo.setContent(BreezeeUtils.objectMapper.writeValueAsString(rule));
            }
            rewardService.saveReward(rewardInfo);
        } catch (Exception e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @GetMapping(value = CrmAPI.rewardId)
    public Response findRewardById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(rewardService.findRewardById(id));
    }

    @Override
    @PostMapping(value = CrmAPI.pageReward)
    public Response pageReward(@RequestBody RewardInfo rewardInfo) {
        return JsonResponse.build(rewardService.pageReward(rewardInfo));
    }

    @Override
    @DeleteMapping(value = "/reward/delete/{id}")
    public Response deleteReward(@PathVariable("id") String id) {
        RewardInfo rewardInfo = rewardService.findRewardById(id);
        rewardService.deleteReward(rewardInfo);
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = "/authority/save", method = RequestMethod.POST)
    public Response saveAuthorityInfo(@RequestBody AuthorityInfo authorityInfo) {
        try {
            Map<String, Object> rule = authorityInfo.getRule();
            if (rule != null) {
                authorityInfo.setContent(BreezeeUtils.objectMapper.writeValueAsString(rule));
            }
            authorityService.saveAdvertiseInfo(authorityInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = "/authority/page", method = RequestMethod.POST)
    public Response pageAuthority(@RequestBody AuthorityInfo authorityInfo) {
        return JsonResponse.build(authorityService.pageAdvertise(authorityInfo));
    }

    @Override
    @RequestMapping(value = "/authorityId/{id}", method = RequestMethod.DELETE)
    public Response deleteAuthority(@PathVariable("id") String id) {
        AuthorityInfo authorityInfo = new AuthorityInfo();
        authorityInfo.setId(id);
        authorityService.deleteAdvertise(authorityInfo);
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = "/authorityId/{id}", method = RequestMethod.GET)
    public Response findAuthorityById(@PathVariable("id") String id) {
        AuthorityInfo a = authorityService.findAdvertise(id);
        return JsonResponse.buildSingle(a);
    }

    @Override
    @RequestMapping(value = "/authorityLine/save", method = RequestMethod.POST)
    public Response saveAuthorityLine(@RequestBody AuthorityLineInfo authorityLineInfo) {
        try {
            authorityService.saveAuthorityLine(authorityLineInfo);
        } catch (Exception e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @DeleteMapping(value = "/authorityLine/delete/{id}")
    public Response deleteAuthorityLines(@PathVariable("id") String id) {
        try {
            authorityService.deleteAuthorityLines(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    @Override
    @GetMapping(value = "/authorityLine/find/{id}")
    public Response findAuthorityLineById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(authorityService.findAuthorityLineById(id));
    }

    @Override
    @RequestMapping(value = "/authorityLine/page", method = RequestMethod.POST)
    public Response pageAuthorityLine(@RequestBody AuthorityLineInfo authorityLineInfo) {
        return JsonResponse.build(authorityService.pageAuthorityLines(authorityLineInfo));
    }

    @Override
    @RequestMapping(value = "/message/page", method = RequestMethod.POST)
    public Response pageMessage(@RequestBody MessageInfo messageInfo) {
        return JsonResponse.build(messageService.pageMessage(messageInfo));
    }

    @Override
    @RequestMapping(value = "/message/save", method = RequestMethod.POST)
    public Response saveMessage(@RequestBody MessageInfo messageInfo) {
        try {
            if (!StringUtils.isEmpty(messageInfo.getId())) {
                MessageInfo mi = messageService.findMessageById(messageInfo.getId());
                if (!StringUtils.isEmpty(messageInfo.getResult())) {
                    mi.setResult(messageInfo.getResult());
                    mi.setStatus(2);
                }
                if (!StringUtils.isEmpty(messageInfo.getDegree())) {
                    mi.setDegree(messageInfo.getDegree());
                }
                if (!StringUtils.isEmpty(messageInfo.getDegreeRemark())) {
                    mi.setDegreeRemark(messageInfo.getDegreeRemark());
                }
                messageService.saveMessage(mi);
            } else {
                messageService.saveMessage(messageInfo);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = "/messageId/{id}", method = RequestMethod.GET)
    public Response findMessageById(@PathVariable("id") String id) {
        MessageInfo a = messageService.findMessageById(id);
        if (!StringUtils.isEmpty(a)) {
            UserInfo userInfo = new UserInfo();
            userInfo.getProperties().put("name", a.getUserName());
            InfoPage<UserInfo> page = userService.findUsers(userInfo);
            if (page.getContent().size() > 0) {
                UserInfo ui = page.getContent().get(0);
                a.setCardNo(ui.getCode());
                if (!StringUtils.isEmpty(ui.getEmail())) {
                    a.setEmail(ui.getEmail());
                }
            }
            return JsonResponse.buildSingle(a);
        }
        return JsonResponse.error("未查到相关信息");
    }

    @Override
    @DeleteMapping(value = "/deleteMessage/{id}")
    public Response deleteMessage(@PathVariable("id") String id) {
        try {
            messageService.deleteMessage(id);
        } catch (Exception e) {
            e.printStackTrace();
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }


    //积分商城类型管理
    @Override
    @PostMapping(value = CrmAPI.pagePointStoreType)
    public Response pagePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) {
        return JsonResponse.build(pointStoreTypeService.pagePointStoreType(pointStoreTypeInfo));
    }

    @Override
    @GetMapping(value = CrmAPI.pointStoreTypeId)
    public Response findPointStoreTypeById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(pointStoreTypeService.findPointStoreTypeById(id));
    }

    @Override
    @PostMapping(value = CrmAPI.savepointStoreType)
    public Response savePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) {
        try {
            pointStoreTypeInfo.setCode(UUID.randomUUID().toString());
            pointStoreTypeService.savePointStoreType(pointStoreTypeInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    //优惠券管理

    @Override
    @PostMapping(value = CrmAPI.pageSaverTicket)
    public Response pageSaverTicket(@RequestBody SaverTicketInfo saverTicketInfo) {
        return JsonResponse.build(saverTicketService.pageSaverTicket(saverTicketInfo));
    }

    @Override
    @GetMapping(value = CrmAPI.saverTicketId)
    public Response findSaverTicketById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(saverTicketService.findSaverTicketById(id));
    }

    @Override
    @PostMapping(value = CrmAPI.saveSaverTicket)
    public Response saveSaverTicket(@RequestBody SaverTicketInfo saverTicketInfo) {
        try {
            saverTicketService.saveSaverTicket(saverTicketInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    @Override
    @DeleteMapping(value = CrmAPI.deleteSaverTicket)
    public Response deleteSaverTicket(@PathVariable("id") String id) {
        try {
            saverTicketService.deleteSaverTicket(id);
        } catch (BreezeeException e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    @Override
    @PostMapping(value = CrmAPI.saveQrcodeShop)
    public Response saveQrcodeShop(@RequestBody QrcodeInfo qrcodeInfo) {
        QrcodeShopInfo qrcodeShopInfo = new QrcodeShopInfo();
        qrcodeShopInfo.setQrcodeCode(qrcodeInfo.getCode());
        qrcodeService.deleteQrcodeShop(qrcodeShopInfo);
        return JsonResponse.ok();
    }

    // 渠道二维码关系
    @Override
    @PostMapping(CrmAPI.saveQrcodeChannel)
    public Response saveQrcodeChannel(@RequestBody QrcodeInfo qrcodeInfo) {
        qrcodeService.saveQrcodeChannel(qrcodeInfo);
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(method = RequestMethod.POST, value = "/ChannelQrcode/page")
    public Response pageQrcodeChannel(@RequestBody ChannelInfo channelInfo) {
        return JsonResponse.build(qrcodeService.findChannelQrcodes(channelInfo));
    }


    @RequestMapping(method = RequestMethod.POST, value = CrmAPI.pageCoupon)
    @Override
    public Response findCoupons(@RequestBody CouponInfo couponInfo) {
        return JsonResponse.build(couponService.findCoupons(couponInfo));
    }

    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.couponId)
    @Override
    public Response findCouponById(@PathVariable("id") String id) {
        CouponTypeInfo cti = new CouponTypeInfo();
        cti.setId(id);
        InfoPage<CouponTypeInfo> list = couponService.findCouponTypes(cti);
        if (list.getContent().size() != 0) {
            return JsonResponse.buildSingle(list.getContent().get(0));
        }
        return JsonResponse.ok();
    }

    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.couponCode)
    @Override
    public Response findCouponByCode(@PathVariable("code") String code) {
        CouponInfo couponInfo = null;
        try {
            couponInfo = couponService.findCouponByCode(code);
        } catch (Exception e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
        if (couponInfo.getCouponType().getDescription() != null) {
            couponInfo.getCouponType().setDescription(couponInfo.getCouponType().getDescription().replaceAll("\n", "<br/>"));
        }
        if (couponInfo.getCouponType().getSpecification() != null) {
            couponInfo.getCouponType().setSpecification(couponInfo.getCouponType().getSpecification().replaceAll("\n", "<br/>"));
        }
        return JsonResponse.buildSingle(couponInfo);
    }

    @RequestMapping(method = RequestMethod.POST, value = CrmAPI.listCouponType)
    @Override
    public Response findCouponTypes(@RequestBody CouponTypeInfo typeInfo) {
        System.out.println(typeInfo.getProperties());
        System.out.println("==============");
        return JsonResponse.build(couponService.findCouponTypes(typeInfo));
    }

    @RequestMapping(method = RequestMethod.PUT, value = CrmAPI.saveCouponType)
    @Override
    public Response saveCouponType(@RequestBody CouponTypeInfo typeInfo) {
        try {
            couponService.saveCouponType(typeInfo);
        } catch (Exception e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
        return JsonResponse.ok();
    }

    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.genCoupon)
    @Override
    public Response generateCoupons(@RequestParam("typeId") String typeId,
                                    @RequestParam("count") Integer count) {
        try {
            couponService.generateCoupon(typeId, count);
        } catch (BreezeeException e) {
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @RequestMapping(method = RequestMethod.DELETE, value = CrmAPI.delCoupon)
    @Override
    public Response deleteCoupon(@RequestBody CouponTypeInfo typeInfo) {
        typeInfo.getProperties().put("del", "del");
        CouponTypeInfo old = null;
        OperationLogInfo operationLogInfo = null;
        try {
            old = couponService.findCouponTypeById(typeInfo.getId());
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(typeInfo, old == null ? new CouponTypeInfo() : old, "oms", null);
            couponService.deleteCoupon(typeInfo);
        } catch (Exception e) {
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(typeInfo, old == null ? new CouponTypeInfo() : old, "oms", null);
            operationLogInfo.setErrMsg(e.getMessage());
            return JsonResponse.error(e.getMessage());
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }

    @RequestMapping(method = RequestMethod.DELETE, value = CrmAPI.delCouponType)
    @Override
    public Response deleteCouponType(@PathVariable("id") String id) {
        CouponTypeInfo typeInfo = new CouponTypeInfo();
        typeInfo.setId(id);
        typeInfo.getProperties().put("del", "del");
        CouponTypeInfo old = null;
        OperationLogInfo operationLogInfo = null;
        try {
            old = couponService.findCouponTypeById(typeInfo.getId());
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(typeInfo, old == null ? new CouponTypeInfo() : old, "oms", null);
            couponService.deleteCouponType(typeInfo.getId());
        } catch (Exception e) {
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(typeInfo, old == null ? new CouponTypeInfo() : old, "oms", null);
            operationLogInfo.setErrMsg(e.getMessage());
            return JsonResponse.error(e.getMessage());
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }

    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.couponInfoId)
    @Override
    public Response findCouponInfoById(@PathVariable("id") String id) {
        CouponInfo couponInfo;
        try {
            couponInfo = couponService.findCouponByCode(id);
        } catch (Exception e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
        return JsonResponse.buildSingle(couponInfo);
    }

    @PostMapping(CrmAPI.sendCoupon)
    @Override
    public Response sendCoupon(@RequestBody CouponInfo couponInfo) {
        try {
            couponService.sendCoupon(couponInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
        return JsonResponse.ok();
    }

    @PostMapping(CrmAPI.sendCouponHistory)
    @Override
    public Response findCouponSents(@RequestBody CouponSentInfo couponSentInfo) {
        try {
            return JsonResponse.build(couponService.findCouponSents(couponSentInfo));
        } catch (Exception e) {
            e.printStackTrace();
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
    }

    @Override
    @RequestMapping(value = "/couponScopeRule/page", method = RequestMethod.POST)
    public Response pageCouponScopeRule(@RequestBody CouponScopeRuleInfo couponScopeRuleInfo) {
        return JsonResponse.build(couponScopeRuleService.pageCouponScopeRule(couponScopeRuleInfo));
    }

    @Override
    @RequestMapping(value = "/couponTimeRule/page", method = RequestMethod.POST)
    public Response pageCouponTimeRule(@RequestBody CouponTimeRuleInfo couponTimeRuleInfo) {
        return JsonResponse.build(couponTimeRuleService.pageCouponTimeRule(couponTimeRuleInfo));
    }

    @PostMapping("/userLogin")
    @Override
    public Response userLogin(@RequestBody UserInfo userInfo) {
        UserInfo ui = userService.checkLogin(userInfo);
        if (ui.getId() == null) {
            return JsonResponse.error(ui.getRemark());
        }
        return JsonResponse.buildSingle(ui);
    }

    @PostMapping(CrmAPI.couponExchange)
    @Override
    public Response exChangeCoupon(@RequestBody CouponInfo couponInfo) {
        try {
            couponService.exChangeCoupon(couponInfo);
        } catch (Exception e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
        return JsonResponse.ok();
    }

    @PostMapping("/user/employeeCard")
    @Override
    public Response employeeCard(@RequestBody UserInfo userInfo) {
        String[] mobiles = userInfo.getMobile().split(",");
        String[] flag = userInfo.getRemark().split(",");
        int i = 0;
        UserInfo eu;
        for (String mobile : mobiles) {
            UserInfo ui = userService.findByMobile(mobile);
            if (ui != null) {
                if ("Y".equals(flag[i])) {
                    ui.setCardLevel(LevelEnum.STAFF.getValue());
                } else {
                    ui.setSalePoint(0);
                    ui.setTotalPoint(0);
                    ui.setKeepPoint(0);
                    ui.getProperties().put("clearPoint", 1);
                    ui.setCardLevel(LevelEnum.BLUE.getValue());
                }
                userService.saveUser(ui);
            } else {
                if ("Y".equals(flag[i])) {
                    //记录到一个员工卡的虚拟信息
                    eu = new UserInfo();
                    eu.setName("Staff");
                    eu.setMobile(mobile);
                    eu.setCardLevel(LevelEnum.STAFF.getValue());
                    eu.setStatus(9);
                    userService.saveUser(eu);
                }
            }
            i++;
        }
        return JsonResponse.ok();
    }

    @GetMapping(CrmAPI.verifyCoupon)
    @Override
    public Response couponVerify(@PathVariable("userCode") String userCode,
                                 @PathVariable("code") String couponCode) {
        try {
            CouponInfo couponInfo = couponService.verifyCoupon(userCode, couponCode);
            return JsonResponse.buildSingle(couponInfo);
        } catch (Exception e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
    }

    @Override
    @DeleteMapping("/coupon/delete/{id}")
    public Response deleteCouponById(@PathVariable("id") String id) {
        couponService.deleteCouponById(id);
        return JsonResponse.ok();
    }


    @PostMapping("/user/mobileCovert")
    @Override
    public Response mobileCovert(@RequestBody UserInfo userInfo) {
        String mobile = userInfo.getMobile();
        List<UserInfo> l = new ArrayList<>();
        if (StringUtils.hasText(mobile)) {
            String[] mm = mobile.split(",");
            UserInfo ui;
            for (String s : mm) {
                ui = userService.findByMobile(s);
                if (ui == null) {
                    ui = new UserInfo();
                    ui.setMobile(s);
                    ui.setName("手机号未注册");
                    ui.setCardNo("未注册");
                    ui.setCardLevel(0);
                }
                l.add(ui);
            }
        }
        return JsonResponse.build(l);
    }

    @PostMapping("/scan/qrcode")
    @Override
    public Response scanQrcode(@RequestBody QrcodeInfo qrcodeInfo) {
        try {
            qrcodeService.scanQrcode(qrcodeInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonResponse.ok();
    }

    @PostMapping(value = CrmAPI.rewardUser)
    @Override
    public Response findRewardUser(RewardUserInfo rewardUserInfo) {
        return JsonResponse.build(rewardService.findRewardUser(rewardUserInfo));
    }

    @PostMapping(CrmAPI.drawCoupon)
    @Override
    public Response drawCoupon(@RequestBody CouponInfo couponInfo) {
        try {
            System.out.println(couponInfo.getStatus() + "..............");
            return JsonResponse.buildSingle(couponService.drawCoupon(couponInfo));
        } catch (Exception e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
    }
}

