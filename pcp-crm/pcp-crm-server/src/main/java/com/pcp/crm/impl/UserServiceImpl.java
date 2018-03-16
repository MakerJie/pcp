package com.pcp.crm.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.*;
import com.pcp.api.crm.service.ILevelManageService;
import com.pcp.api.crm.service.IUserService;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.InfoStatusEnum;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.DynamicSpecifications;
import com.pcp.common.exception.*;
import com.pcp.common.util.BreezeeCall;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.common.util.ContextUtil;
import com.pcp.common.util.EmojiFilterUtils;
import com.pcp.crm.entity.*;
import com.pcp.crm.repository.IUserPointHistoryRepository;
import com.pcp.crm.repository.IUserRepository;
import org.springframework.jdbc.support.incrementer.DataFieldMaxValueIncrementer;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 会员服务实现类
 * Created by Silence on 2017/6/29.
 */
@Service(value = CrmAPI.BEAN_USER_SERVICE)
public class UserServiceImpl implements IUserService {

    @Resource
    private IUserRepository userRepository;

    @Resource
    private DataFieldMaxValueIncrementer userSequence;

    @Resource
    private ILevelManageService levelManageService;


    @Override
    public UserInfo saveUser(UserInfo userInfo) throws BreezeeException {
        if ("updatePassword".equals(userInfo.getProperties().get("sign"))) {
            UserEntity u2 = userRepository.findByMobile(userInfo.getMobile());
            if (u2 != null) {
                u2.setPassword(userInfo.getPassword());
                u2.save();
            }
            return userInfo;
        }
        if (StringUtils.isEmpty(userInfo.getCode())) {
            if (StringUtils.hasText(userInfo.getMobile())) {
                UserEntity u = userRepository.findByMobile(userInfo.getMobile());
                if (u != null) {
                    if (!Objects.equals(u.getCardLevel(), LevelEnum.STAFF.getValue())) {
                        throw new BreezeeException("手机号已被注册");
                    } else {
                        //如果是员工卡，则继续注册下去
                        userInfo.setCode(u.getCode());
                        userInfo.setId(u.getId());
                        userInfo.setCardLevel(LevelEnum.STAFF.getValue());
                    }
                }
            }
            if (StringUtils.isEmpty(userInfo.getCode())) {
                //********************************************************************
                //### 切记，这里会有空。记得要对userSequence的表中要insert into 一条数据
                //*********************************************************************
                userInfo.setCode((userSequence.nextLongValue() + 10000000) + "");
            }
        }
        if ("updateMobile".equals(userInfo.getProperties().get("signMobile"))) {
            UserInfo mobileInfo = new UserEntity().buildId(userInfo.getId()).findOne();
            if (!StringUtils.isEmpty(mobileInfo)) {
                mobileInfo.setMobile(userInfo.getMobile());
                new UserEntity().createWithInfo(mobileInfo).save();
            }
            return userInfo;
        }
        //TODO: 把code当成卡号，合适吗？？？
        if (StringUtils.isEmpty(userInfo.getCardNo())) {
            userInfo.setCardNo(userInfo.getCode());
        }
        if (StringUtils.hasText(userInfo.getName())) {
            userInfo.setName(EmojiFilterUtils.filterEmoji(userInfo.getName()));
            userInfo.setName(EmojiFilterUtils.filterEmojiAgain(userInfo.getName()));
        }
        if (StringUtils.isEmpty(userInfo.getName())) {
            userInfo.setName(userInfo.getRealName());
        }
        if (StringUtils.isEmpty(userInfo.getRealName())) {
            userInfo.setRealName(userInfo.getName());
        }
        if (StringUtils.isEmpty(userInfo.getLevelUpDate())) {
            userInfo.setLevelUpDate(new Date());
        }
        if (userInfo.getSource() != null && "3".equals(userInfo.getSource().toString())) {
            userInfo.setCrmChannel("wifi");
        }
        UserEntity old = new UserEntity().buildCode(userInfo.getCode()).findEntity();
        if (old != null) {
            if (userInfo.getProperties().get("clearPoint") == null) {
                userInfo.setTotalPoint(old.getTotalPoint());
                userInfo.setSalePoint(old.getSalePoint());
                userInfo.setKeepPoint(old.getKeepPoint());
            }
            userInfo.setLevelUpDate(old.getLevelUpDate());
            userInfo.setLastHrights(old.getLastHrights());
            userInfo.setFirstShop(old.getFirstShop());
            userInfo.setLastShop(old.getLastShop());
            userInfo.setLastDealTime(old.getLastDealTime());
            userInfo.setFirstDealTime(old.getFirstDealTime());
            userInfo.setOrderCount(old.getOrderCount());
            userInfo.setLastBirthRights(old.getLastBirthRights());
            if (StringUtils.hasText(old.getAliId())) {
                userInfo.setAliId(old.getAliId());
            }
            if (StringUtils.hasText(old.getOpenid())) {
                userInfo.setOpenid(old.getOpenid());
            }
            userInfo.setLevelReason(old.getLevelReason());
            userInfo.setReferee(old.getReferee());
            userInfo.setHeadImg2(old.getHeadImg2());
            userInfo.setHeadImg3(old.getHeadImg3());
            if (StringUtils.hasText(old.getConstellation())) {
                userInfo.setConstellation(old.getConstellation());
            }
            userInfo.setFullInfo(old.getFullInfo());
        }
        if (Objects.equals(userInfo.getStatus(), InfoStatusEnum.ENABLE.getValue())
                && !Objects.equals(userInfo.getCardLevel(), LevelEnum.BLACK.getValue())
                && StringUtils.isEmpty(userInfo.getBirthday())) {
            throw new BreezeeException("会员生日不可为空");
        }
        if (StringUtils.isEmpty(userInfo.getCrmChannel())) {
            throw new BreezeeException("注册渠道不可为空");
        }
        if(StringUtils.isEmpty(userInfo.getId())){
            userInfo.setId(SystemTool.getCode());
        }
        userInfo.setOperType(OperTypeEnum.WRITE);
        UserEntity ue = new UserEntity().createWithInfo(userInfo);
        if (StringUtils.isEmpty(ue.getPassword())) {
            if (ue.getMobile() != null && ue.getMobile().length() > 10) {
                ue.setPassword(ue.getMobile().substring(5));
            } else {
                ue.setPassword(ue.getCardNo());
            }
        }
        UserInfo nu = ue.save();
        UserEntity ne = new UserEntity().buildId(ue.getId()).findEntity();
        AuthorityEntity ae = new AuthorityEntity();
        ae.addProperties("beginTime_le_null", new Date());
        ae.addProperties("endTime_gt_null", new Date());
        if (userInfo.getDataStatus() == 1) { //在会员新增的时候，我们获取新会员奖励的权益
            ae.addProperties("type", UserRightsEnum.A.getValue() + "");
            ae.addProperties("beginTime_le_null", new Date());
            ae.addProperties("endTime_gt_null", new Date());
            List<AuthorityInfo> ael = ae.list();
            ael.forEach(a -> {
                a.getRule().put("cardLevel", "1,2,3,4");
                rightPoint(a, ne, null);//送积分
                rightCoupon(a, ne);//送券
            });
            if (ael.size() > 0) {
                ne.save();
            }
            //如果是扫码入会的会员，开始享受入会活动的奖励
            if (StringUtils.hasText(userInfo.getQrCode())) {
                String[] qr = userInfo.getQrCode().split("\\|");
                QrcodeEntity qrcode = new QrcodeEntity().buildId(qr[0]).buildCode(qr[0]).findEntity();
                if (Objects.equals(qrcode.getStatus(), InfoStatusEnum.ENABLE.getValue())) {
                    RewardEntity re = new RewardEntity();
                    re.addProperties("type", "1");
                    re.addProperties("status", InfoStatusEnum.ENABLE.getValue());
                    re.addProperties("qrcode_code_obj_ae", qr[0]);
                    re.addProperties("beginTime_le_null", new Date());
                    re.addProperties("endTime_gt_null", new Date());
                    List<RewardInfo> rel = re.list();
                    int uc = ne.getCardLevel();
                    rel.forEach(a -> {
                        //入会活动里面的积分和券奖励
                        int i = activitiPoint(a, ne, null);
                        i += activitiCoupon(a, ne);
                        if (i > 0) {
                            this.rewardUser(a.getId(), ne);
                        }
                        Object toC = a.getRule().get("toCard");
                        if (!StringUtils.isEmpty(toC)) {
                            Integer toCC = Integer.parseInt(toC.toString());
                            if (toCC > uc) {
                                ne.setCardLevel(toCC);
                            }
                        }
                    });
                    ne.setCrmChannel("promotion");
                    ne.save();
                }
            }
        } else {
            if (userInfo.getProperties().get("update") != null) { //完善个人信息奖励
                ae.addProperties("type", UserRightsEnum.B.getValue() + "");

                String s1 = "", s2 = "", s3 = "", s4 = "";
                if (StringUtils.hasText(userInfo.getWantArea())) {
                    s1 = "1";
                }
                if (StringUtils.hasText(userInfo.getPreference())) {
                    s2 = "2";
                }
                if (!StringUtils.isEmpty(userInfo.getTasting())) {
                    s3 = "3";
                }
                if (StringUtils.hasText(userInfo.getUserTag())) {
                    s4 = "4";
                }
                String finalTmp = s1 + s2 + s3 + s4;
                ae.list().forEach(a -> {
                    //判断会员完善信息情况
                    Object o = a.getRule().get("rule");
                    if (o != null && old != null) {
                        String oo = o.toString().replaceAll(",", "").replaceAll(" ", "");
                        if (old.getFullInfo() == null && finalTmp.contains(oo)) {
                            rightPoint(a, ne, null);//送积分
                            rightCoupon(a, ne);//送券
                            ne.setFullInfo(true);
                            old.setFullInfo(true);
                        }
                    }
                });
                if (ae.list().size() > 0) {
                    ne.save();
                }
            }
        }
        if (userInfo.getChangeInfo() != null) { //会员等级变更
            GradeChangeInfo changeInfo = userInfo.getChangeInfo();
            if (StringUtils.isEmpty(changeInfo.getCode())) {
                changeInfo.setCode(SystemTool.getCode());
            }
            changeInfo.setOperType(OperTypeEnum.WRITE);
            GradeChangeEntity ge = new GradeChangeEntity().createWithInfo(changeInfo);
            ge.setUser(ne);
            try {
                ge.save();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return nu;
    }


    public void rewardUser(String id, UserEntity ne) {
        RewardEntity ren = new RewardEntity().buildId(id).findEntity();
        if (ren.getCount() == null) {
            ren.setCount(0L);
        }
        ren.setCount(ren.getCount() + 1);
        ren.save();

        RewardUserInfo rewardUserInfo = new RewardUserInfo();
        rewardUserInfo.setCode(SystemTool.getCode());
        rewardUserInfo.setName(ren.getName());
        rewardUserInfo.setOperType(OperTypeEnum.WRITE);
        RewardUserEntity rue = new RewardUserEntity().createWithInfo(rewardUserInfo);
        rue.setReward(ren);
        rue.setUser(ne);
        rue.save();
    }

    public int rightPoint(AuthorityInfo a, UserEntity ue, Integer amount) {
        return rightPoint(a, ue, amount, null);
    }

    /**
     * 获取积分
     *
     * @param a
     * @param ue
     * @param amount
     * @param saleHistoryPoint 关联的消费积分
     * @return
     */
    public int rightPoint(AuthorityInfo a, UserEntity ue, Integer amount, UserPointHistoryInfo saleHistoryPoint) {
        if (ue.getCardLevel() == null) {
            ue.setCardLevel(1);
        }
        if (a.getRule() == null || a.getRule().get("cardLevel") == null ||
                (a.getRule().get("cardLevel") != null && !a.getRule().get("cardLevel").toString().contains(ue.getCardLevel().toString()))) {
            return 0;
        }
        int ret = 0;
        if (amount != null || !StringUtils.isEmpty(a.getRule().get("pointValue"))) { //送积分
            UserPointHistoryInfo pointHistoryInfo = new UserPointHistoryInfo();
            if (amount == null) {
                try {
                    pointHistoryInfo.setAmount(Integer.parseInt(a.getRule().get("pointValue").toString()));
                } catch (NumberFormatException e) {
                    return ret;
                }
            } else {
                pointHistoryInfo.setAmount(amount);
            }
            pointHistoryInfo.setPointType("4");
            if (saleHistoryPoint != null) {
                pointHistoryInfo.setHappenTime(saleHistoryPoint.getHappenTime());
            } else {
                pointHistoryInfo.setHappenTime(new Date());
            }
            pointHistoryInfo.setName(a.getName());
            pointHistoryInfo.setRemark(a.getName());
            if (pointHistoryInfo.getAmount() > 0) {
                ret = 1;
                if (saleHistoryPoint != null) {
                    saleHistoryPoint.addRightsPoint(pointHistoryInfo.getAmount());
                    pointHistoryInfo.setRelHis(saleHistoryPoint.getId());
                }
                userPoint(pointHistoryInfo, ue);
            }
        }
        return ret;
    }

    public int rightCoupon(AuthorityInfo a, UserEntity ue) {
        if (a.getRule().get("cardLevel") == null ||
                (a.getRule().get("cardLevel") != null && !a.getRule().get("cardLevel").toString().contains(ue.getCardLevel().toString()))) {
            return 0;
        }
        int ret = 0;
        Object coupons = a.getRule().get("coupons");
        CouponEntity ce = new CouponEntity();
        if (!StringUtils.isEmpty(coupons)) {
            //先不管总数量吧
            String[] ss = coupons.toString().split(";"), sss;
            int num, total;
            for (String s : ss) {
                sss = s.split(",");
                num = Integer.parseInt(sss[1]);
                if (num < 1) {
                    continue;
                }
                total = Integer.parseInt(sss[2]);
                if (total > 0) {
                    ce.addProperties("rightId", a.getCode());
                    Long cl = ce.count();
                    if ((cl + num) > total) {
                        continue;
                    }
                }
                CouponTypeEntity typeEntity = new CouponTypeEntity().buildId(sss[0]).findEntity();
                for (int i = 0; i < num; i++) {
                    CouponInfo coupon = new CouponInfo();
                    coupon.setRightId(a.getCode());
                    coupon.setRemark(a.getName());
                    coupon.setName(typeEntity.getName());
                    coupon.setRule(typeEntity.getRule());
                    if (typeEntity.getCouponType().equals(CouponTypeEnum.A.getValue().toString())) {
                        if (StringUtils.hasText(coupon.getRule())) {
                            if (!coupon.getRule().matches("[0-9]+")) {
                                continue;
                            }
                            coupon.setAmount(Double.parseDouble(coupon.getRule()));
                        }
                    }
                    typeEntity.checkLimit(coupon);
                    coupon.setCode(SystemTool.getCode());
                    coupon.setOperType(OperTypeEnum.WRITE);
                    coupon.setCreator("system");
                    coupon.setUpdator(coupon.getCreator());
                    coupon.setFetchMethod("rights");
                    coupon.setFetchDate(new Date());
                    CouponEntity couponEntity = new CouponEntity().createWithInfo(coupon);
                    couponEntity.setUser(ue);
                    couponEntity.setCouponType(typeEntity);
                    couponEntity.save();
                    coupon.setUserOpenId(ue.getOpenid());
                    coupon.setUserName(ue.getRealName());
                }
                if (typeEntity.getSentNum() == null) {
                    typeEntity.setSentNum(0L);
                }
                typeEntity.setSentNum(typeEntity.getSentNum() + num);
                typeEntity.save();
                ret = 1;
            }
        }
        return ret;
    }

    @Override
    public InfoPage<UserInfo> findUsers(UserInfo userInfo) {
        if (!StringUtils.isEmpty(userInfo.getProperties().get("_joinYear"))) {
            LocalDateTime d = LocalDateTime.now();
            d = d.plusYears(0 - Integer.parseInt(userInfo.getProperties().get("_joinYear").toString()));
            userInfo.getProperties().put("createTime_le", BreezeeUtils.localDateTime2Date(d));
        }
        BreezeeUtils.checkCreateTime(userInfo.getProperties(), "createTime");
        UserEntity ue = new UserEntity().createWithInfo(userInfo);
        return ue.page();
    }

    @Override
    public List<UserInfo> findUsersList(UserInfo userInfo) {
        if (!StringUtils.isEmpty(userInfo.getProperties().get("_joinYear"))) {
            LocalDateTime d = LocalDateTime.now();
            d = d.plusYears(0 - Integer.parseInt(userInfo.getProperties().get("_joinYear").toString()));
            userInfo.getProperties().put("createTime_le", BreezeeUtils.localDateTime2Date(d));
        }
        BreezeeUtils.checkCreateTime(userInfo.getProperties(), "createTime");
        UserEntity ue = new UserEntity().createWithInfo(userInfo);
        return ue.list();
    }

    @Override
    public UserInfo findUserById(String id) throws BreezeeException {
        UserEntity ue = new UserEntity();
        ue.buildId(id).buildCode(id);
        ue.setMobile(id);
        ue.setCardNo(id);
        try {
            return ue.findOne((BreezeeCall<UserEntity, UserInfo>) (o, o2) -> {
                //加载其升降级记录
                if (o.getUpRecord() != null) {
                    o2.setUpRecordInfos(new ArrayList<>());
                    o.getUpRecord().forEach(a -> {
                        o2.getUpRecordInfos().add(a.buildInfo());
                    });
                }
                CouponInfo couponInfo = new CouponInfo();
                couponInfo.getProperties().put("user_id_obj_ae", o2.getId());
                couponInfo.getProperties().put("delFlag_not_equal", 1);
                couponInfo.getProperties().put("expireDate_gt", new Date());
                couponInfo.getProperties().put("activeDate_le", new Date());
                couponInfo.getProperties().put("status", CouponStatusEnum.CREATED.getValue());
                new CouponEntity().createWithInfo(couponInfo).list().forEach(a -> {
                    o2.getCoupons().add(((CouponInfo) a).copy());
                });
            });
        } catch (BreezeeException e) {
            throw new BreezeeException(e.getMessage());
        }
    }

    @Override
    public UserInfo findByMobile(String mobile) {
        UserEntity userEntity = userRepository.findByMobile(mobile);
        return userEntity == null ? null : userEntity.buildInfo();
    }

    @Override
    public UserInfo checkLogin(UserInfo userInfo) {
        UserEntity userEntity = userRepository.findByMobile(userInfo.getMobile());
        if (userEntity == null) {
            userInfo.setRemark("用户尚未注册，请注册");
            return userInfo;
        }
        if (userInfo.getProperties().get("checkSms") != null) {

        } else {
            if (!userInfo.getPassword().equals(userEntity.getPassword())) {
                userInfo.setRemark("用户密码错误");
                return userInfo;
            }
        }
        boolean update = false;
        if (userInfo.getOpenid() != null && !userInfo.getOpenid().equals(userEntity.getOpenid())) {
            userEntity.setOpenid(userInfo.getOpenid());
            update = true;
        }
        if (userInfo.getAliId() != null && !userInfo.getAliId().equals(userEntity.getAliId())) {
            userEntity.setAliId(userInfo.getAliId());
            update = true;
        }
        if (userInfo.getHeadImg1() != null && !userInfo.getHeadImg1().equals(userEntity.getHeadImg1())) {
            userEntity.setHeadImg1(userInfo.getHeadImg1());
            update = true;
        }
        if (userInfo.getHeadImg2() != null && !userInfo.getHeadImg2().equals(userEntity.getHeadImg2())) {
            userEntity.setHeadImg2(userInfo.getHeadImg2());
            update = true;
        }
        if (update) {
            userEntity.save();
        }
        return userEntity.buildInfo();
    }

    public void userPoint(UserPointHistoryInfo pointHistoryInfo, UserEntity ue) {
        if (ue == null) {
            return;
        }
        pointHistoryInfo.setUserOpenId(ue.getOpenid());
        pointHistoryInfo.setAliCard(ue.getAliCard());
        pointHistoryInfo.setOperType(OperTypeEnum.WRITE);
        pointHistoryInfo.setUserName(ue.getRealName());
        if (StringUtils.isEmpty(pointHistoryInfo.getCode())) {
            pointHistoryInfo.setCode(SystemTool.getCode());
        }
        if (StringUtils.isEmpty(pointHistoryInfo.getId())) {
            pointHistoryInfo.setId(SystemTool.uuid().replaceAll("-", ""));
        }
        if (ue.getTotalPoint() == null) {
            ue.setTotalPoint(0);
        }
        ue.setTotalPoint(ue.getTotalPoint() + pointHistoryInfo.getAmount());
        if ("2".equals(pointHistoryInfo.getPointType())) {
            if (ue.getLastDealTime() == null || ue.getLastDealTime().before(pointHistoryInfo.getHappenTime())) {
                ue.setLastDealTime(pointHistoryInfo.getHappenTime());
                ue.setLastShop(pointHistoryInfo.getShopCode());
            }
            if (ue.getSalePoint() == null) {
                ue.setSalePoint(0);
            }
            ue.setSalePoint(ue.getSalePoint() + pointHistoryInfo.getAmount());
            if (ue.getKeepPoint() == null) {
                ue.setKeepPoint(0);
            }
            ue.setKeepPoint(ue.getKeepPoint() + pointHistoryInfo.getAmount());
            AuthorityEntity ae = new AuthorityEntity();
            ae.addProperties("beginTime_le_null", new Date());
            ae.addProperties("endTime_gt_null", new Date());
            if (ue.getOrderCount() == null || ue.getOrderCount() == 0) {
                ue.setOrderCount(0);
                //首次消费权益
                ae.addProperties("type", UserRightsEnum.E.getValue() + "");
                ae.list().forEach(a -> {
                    Object o = a.getRule().get("rule");
                    if (o != null) {
                        if ("1".equals(o)) {
                            rightPoint(a, ue, pointHistoryInfo.getPayAmount().multiply(new BigDecimal(a.getRule().get("pointValue").toString())).intValue(), pointHistoryInfo);
                        } else if ("2".equals(o)) {
                            rightPoint(a, ue, null, pointHistoryInfo);
                        }
                        rightCoupon(a, ue);
                    }
                });
                ue.setFirstDealTime(ue.getLastDealTime());
                ue.setFirstShop(pointHistoryInfo.getShopCode());
            }
            ue.setOrderCount(ue.getOrderCount() + 1);

            //获取生日月奖励的积分
            LocalDate ldn = BreezeeUtils.date2LocalDate(pointHistoryInfo.getHappenTime());
            LocalDate bdn = BreezeeUtils.date2LocalDate(ue.getBirthday());
            int birth = 0;
            if (ldn.getMonthValue() == bdn.getMonthValue()) {
                ae.addProperties("type", UserRightsEnum.F.getValue() + "");
                List<AuthorityInfo> bl = ae.list();
                for (AuthorityInfo a : bl) {
                    birth += rightPoint(a, ue, pointHistoryInfo.getAmount(), pointHistoryInfo);
                    rightCoupon(a, ue);
                }
            }

            //如果有生日月奖励的积分，则取消周消费奖励
            if (birth == 0) {
                //获取周消费奖励
                ae.addProperties("type", UserRightsEnum.G.getValue() + "");
                ae.list().forEach(a -> {
                    LocalDate td = BreezeeUtils.date2LocalDate(pointHistoryInfo.getHappenTime());
                    if (a.getRule().get("rule") != null
                            && a.getRule().get("rule").toString().indexOf(String.valueOf(td.getDayOfWeek().getValue())) > -1) {
                        rightPoint(a, ue, pointHistoryInfo.getAmount(), pointHistoryInfo);
                        rightCoupon(a, ue);
                    }
                });
            }
            //获取最后一次给这个客户发送常客优惠奖励的权益的时间
            if (ue.getLastHrights() == null) {
                ue.setLastHrights(pointHistoryInfo.getHappenTime());
            } else {
                //判断当前时间是否在常规优惠奖励内
                LocalDate hr = BreezeeUtils.date2LocalDate(ue.getLastHrights());
                LocalDate hap = BreezeeUtils.date2LocalDate(pointHistoryInfo.getHappenTime());
                int periodMonth = hr.until(hap).getMonths();
                ae.addProperties("type", UserRightsEnum.H.getValue() + "");
                ae.list().forEach(a -> {
                    if (a.getRule().get("rule") != null) {
                        String[] ss = a.getRule().get("rule").toString().split("/");
                        //判断当前时间和最后一次享受常客优惠奖励的权益时间的月份差值
                        if (periodMonth >= Integer.parseInt(ss[0])) {
                            //查询此人的消费积分
                            UserPointHistoryEntity uhe = new UserPointHistoryEntity();
                            uhe.addProperties("user_id_obj_ae", ue.getId());
                            uhe.addProperties("happenTime_gt", ue.getLastHrights());
                            uhe.addProperties("pointType", "2");
                            Long c = uhe.count();
                            if (c != null && c >= Long.parseLong(ss[1])) { //符合每？月消费？次的规则
                                ue.setLastHrights(pointHistoryInfo.getHappenTime());
                                rightPoint(a, ue, null, pointHistoryInfo);
                                rightCoupon(a, ue);
                            }
                        }
                    }
                });
            }
            checkActivity(pointHistoryInfo, ue);
        }
        if (ue.getCardLevel() < 3) { //铂金卡以下才参与升级
            //判断等级信息
            LevelManageInfo levelManageInfo = levelManageService.findByLevel(ue.getCardLevel());
            if (levelManageInfo.getFluctuate() != null && levelManageInfo.getFluctuate() == 1) {
                LevelManageInfo maxLevel = levelManageService.findByLevel(3);
                //判断下个等级的升级积分
                LevelManageInfo levelManageInfoN = levelManageService.findByLevel(ue.getCardLevel() + 1);
                if (ue.getSalePoint() != null && ue.getSalePoint() > levelManageInfoN.getQuota()) {
                    if (ue.getSalePoint() >= maxLevel.getQuota()) {
                        levelManageInfoN = maxLevel;
                    }
                    Integer ol = ue.getCardLevel();
                    ue.setCardLevel(levelManageInfoN.getCardLevel());
                    ue.setKeepPoint(0);
                    ue.setLevelUpDate(new Date());
                    //根据权益，设置会员的升级权益
                    AuthorityEntity ae = new AuthorityEntity();
                    ae.addProperties("type", UserRightsEnum.D.getValue() + "");
                    ae.addProperties("beginTime_le_null", new Date());
                    ae.addProperties("endTime_gt_null", new Date());
                    ae.list().forEach(a -> {
                        Object o = a.getRule().get("rule");
                        if (o != null && o.toString().equals(ol + ue.getCardLevel().toString())) {
                            a.getRule().put("cardLevel", "1,2,3,4,5,6");
                            rightPoint(a, ue, null, pointHistoryInfo);
                            rightCoupon(a, ue);
                        }
                    });

                    //升级记录
                    GradeChangeInfo gradeChangeInfo = new GradeChangeInfo();
                    gradeChangeInfo.setBeforeLevel(ol);
                    gradeChangeInfo.setAfterLevel(ue.getCardLevel());
                    gradeChangeInfo.setName(GradeChangeEnum.A.getValue() + "");
                    gradeChangeInfo.setCreator("system");
                    gradeChangeInfo.setUpdator("system");
                    gradeChangeInfo.setRemark("当前消费积分" + ue.getSalePoint() + "达到升级标准" + levelManageInfoN.getQuota());
                    if (StringUtils.isEmpty(gradeChangeInfo.getCode())) {
                        gradeChangeInfo.setCode(SystemTool.getCode());
                    }
                    gradeChangeInfo.setOperType(OperTypeEnum.WRITE);
                    gradeChangeInfo.setUserMobile(ue.getMobile());
                    gradeChangeInfo.setUserOpenId(ue.getOpenid());
                    gradeChangeInfo.setUserName(ue.getRealName());
                    GradeChangeEntity ge = new GradeChangeEntity().createWithInfo(gradeChangeInfo);
                    ge.setUser(ue);
                    ge.save();
                }
            }
        }
        UserPointHistoryEntity he = new UserPointHistoryEntity().createWithInfo(pointHistoryInfo);
        he.setUser(ue.findEntity());
        he.setTotalAmount(ue.getTotalPoint());
        pointHistoryInfo.setTotalAmount(he.getTotalAmount());
        he.save();
    }

    /**
     * 根据消费活动设置，分发券和积分
     *
     * @param pointHistoryInfo
     */
    private void checkActivity(UserPointHistoryInfo pointHistoryInfo, UserEntity ue) {
        RewardEntity re = new RewardEntity();
        re.addProperties("status", InfoStatusEnum.ENABLE.getValue());
        re.addProperties("type", "3");
        re.addProperties("beginTime_le_null", pointHistoryInfo.getHappenTime());
        re.addProperties("endTime_gt_null", pointHistoryInfo.getHappenTime());
        re.list().forEach(a -> {
            boolean flag = a.checkRule(pointHistoryInfo, ue.buildInfo());
            if (flag) {
                //销售活动里面的积分和券奖励
                int i = activitiPoint(a, ue, pointHistoryInfo);
                i += activitiCoupon(a, ue);
                if (i > 0) {
                    this.rewardUser(a.getId(), ue);
                }
            }
        });
    }

    public int activitiPoint(RewardInfo a, UserEntity ue, UserPointHistoryInfo saleHistoryPoint) {
        if (ue.getCardLevel() == null) {
            ue.setCardLevel(1);
        }
        int ret = 0;
        if (!StringUtils.isEmpty(a.getRule().get("pointValue"))) { //送积分
            UserPointHistoryInfo pointHistoryInfo = new UserPointHistoryInfo();
            pointHistoryInfo.setPointType("3");
            pointHistoryInfo.setAmount(Integer.parseInt(a.getRule().get("pointValue").toString()));
            if (saleHistoryPoint != null) {
                pointHistoryInfo.setHappenTime(saleHistoryPoint.getHappenTime());
            } else {
                pointHistoryInfo.setHappenTime(new Date());
            }
            pointHistoryInfo.setName(a.getName());
            pointHistoryInfo.setRemark(a.getName());
            userPoint(pointHistoryInfo, ue);
            ret = 1;
            if (saleHistoryPoint != null) {
                saleHistoryPoint.addActiviPoint(pointHistoryInfo.getAmount());
                pointHistoryInfo.setRelHis(saleHistoryPoint.getId());
            }
        }
        return ret;
    }

    public int activitiCoupon(RewardInfo a, UserEntity ue) {
        int ret = 0;
        Object coupons = a.getRule().get("coupons");
        CouponEntity ce = new CouponEntity();
        if (!StringUtils.isEmpty(coupons)) {
            //先不管总数量吧
            String[] ss = coupons.toString().split(";"), sss;
            int num, total;
            for (String s : ss) {
                sss = s.split(",");
                num = Integer.parseInt(sss[1]);
                if (num < 1) {
                    continue;
                }
                total = Integer.parseInt(sss[2]);
                if (total > 0) {
                    ce.addProperties("activeId", a.getCode());
                    Long cl = ce.count();
                    if ((cl + num) > total) {
                        continue;
                    }
                }
                CouponTypeEntity typeEntity = new CouponTypeEntity().buildId(sss[0]).findEntity();
                for (int i = 0; i < num; i++) {
                    CouponInfo coupon = new CouponInfo();
                    coupon.setActiveId(a.getCode());
                    coupon.setRemark(a.getName());
                    coupon.setName(typeEntity.getName());
                    coupon.setRule(typeEntity.getRule());
                    if (typeEntity.getCouponType().equals(CouponTypeEnum.A.getValue().toString())) {
                        if (StringUtils.hasText(coupon.getRule())) {
                            if (!coupon.getRule().matches("[0-9]+")) {
                                continue;
                            }
                            coupon.setAmount(Double.parseDouble(coupon.getRule()));
                        }
                    }
                    typeEntity.checkLimit(coupon);
                    coupon.setCode(SystemTool.getCode());
                    coupon.setOperType(OperTypeEnum.WRITE);
                    coupon.setCreator("system");
                    coupon.setUpdator(coupon.getCreator());
                    coupon.setFetchMethod("activity");
                    coupon.setFetchDate(new Date());
                    CouponEntity couponEntity = new CouponEntity().createWithInfo(coupon);
                    couponEntity.setUser(ue);
                    couponEntity.setCouponType(typeEntity);
                    couponEntity.save();
                    coupon.setUserOpenId(ue.getOpenid());
                    coupon.setUserName(ue.getRealName());
                }
                if (typeEntity.getSentNum() == null) {
                    typeEntity.setSentNum(0L);
                }
                typeEntity.setSentNum(typeEntity.getSentNum() + num);
                typeEntity.save();
                ret = 1;
            }
        }
        return ret;
    }

    @Override
    public void userPoint(UserPointHistoryInfo pointHistoryInfo) throws BreezeeException {
        UserEntity qe = new UserEntity();
        qe.setId(pointHistoryInfo.getUserId());
        qe.setCardNo(pointHistoryInfo.getUserId());
        qe.setMobile(pointHistoryInfo.getUserId());
        UserEntity ue = qe.findEntity();
        try {
            userPoint(pointHistoryInfo, ue);
            ue.save();
        } catch (Exception e) {
            e.printStackTrace();
            throw new BreezeeException(e.getMessage());
        }
    }

    public void checkUserpoint() {
        IUserPointHistoryRepository userPointHistoryRepository = ContextUtil.getBean("userPointHistoryRepository", IUserPointHistoryRepository.class);
        Map<String, Object> m = new HashMap<>();
        try {
            m.put("happenTime_gt", BreezeeUtils.DATE_FORMAT_LONG.parse("2017-11-21 00:10:00"));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        List<UserPointHistoryEntity> l = userPointHistoryRepository.findAll(DynamicSpecifications.createSpecification(m));
        System.out.println("total amount:" + l.size());
        l.forEach(a -> {
            UserEntity ue = a.getUser();
            System.out.println(a.getHappenTime() + "...." + a.getAmount() + "---" + ue.getCardNo() + "---" + ue.getTotalPoint());
            if (ue.getTotalPoint() == null) {
                ue.setTotalPoint(0);
            }
            ue.setTotalPoint(ue.getTotalPoint() + a.getAmount());
            if (a.getPointType().equals("2")) {
                if (ue.getSalePoint() == null) {
                    ue.setSalePoint(0);
                }
                ue.setSalePoint(ue.getSalePoint() + a.getAmount());
                if (ue.getKeepPoint() == null) {
                    ue.setKeepPoint(0);
                }
                ue.setKeepPoint(ue.getKeepPoint() + a.getAmount());
            }
            ue.save();
        });
    }
}
