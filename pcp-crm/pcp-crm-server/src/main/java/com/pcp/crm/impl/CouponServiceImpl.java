package com.pcp.crm.impl;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.*;
import com.pcp.api.crm.service.ICouponService;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.InfoStatusEnum;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.DynamicSpecifications;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.*;
import com.pcp.crm.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.*;


/**
 * 礼券服务实现类
 * Created by Silence on 2017/7/4.
 */
@Service(CrmAPI.BEAN_COUP_SERVICE)
public class CouponServiceImpl implements ICouponService {

    @Autowired
    private IUserRepository userRepository;


    @Override
    public void generateCoupon(String typeId, Integer count) throws BreezeeException {
        for (int i = 0; i < count; i++) {
            new CouponEntity(typeId).save();
        }
    }

    /**
     * 仅仅保存规则
     *
     * @param typeInfo
     * @return
     */
    private CouponTypeEntity updateCouponRule(CouponTypeInfo typeInfo) {
        CouponTypeEntity couponTypeEntity = new CouponTypeEntity().buildId(typeInfo.getId()).findEntity();
        if (couponTypeEntity.getCouponScopeRuleLine() != null) {
            couponTypeEntity.getCouponScopeRuleLine().clear();
        }
        if (couponTypeEntity.getCouponTimeRuleLine() != null) {
            couponTypeEntity.getCouponTimeRuleLine().clear();
        }
        if (!StringUtils.isEmpty(typeInfo.getCouponScopeRuleLines())) {
            typeInfo.getCouponScopeRuleLines().forEach(a -> {
                if (StringUtils.isEmpty(a.getCode())) {
                    a.setCode(SystemTool.getCode());
                }
                if (StringUtils.isEmpty(a.getName())) {
                    a.setName(a.getCode());
                }
                a.setOperType(OperTypeEnum.WRITE);
                a.setId(null);
                a.getProperties().put("createUpdate", false);
                couponTypeEntity.addScopeLine(new CouponScopeRuleEntity().createWithInfo(a));
            });
        }
        if (!StringUtils.isEmpty(typeInfo.getCouponTimeRuleLines())) {
            typeInfo.getCouponTimeRuleLines().forEach(b -> {
                if (StringUtils.isEmpty(b.getCode())) {
                    b.setCode(SystemTool.getCode());
                }
                if (StringUtils.isEmpty(b.getName())) {
                    b.setName(b.getCode());
                }
                b.setOperType(OperTypeEnum.WRITE);
                b.setId(null);
                b.getProperties().put("createUpdate", false);
                couponTypeEntity.addTimeLine(new CouponTimeRuleEntity().createWithInfo(b));
            });
        }
        return couponTypeEntity;
    }

    @Override
    public void saveCouponType(CouponTypeInfo typeInfo) throws BreezeeException {
        if (StringUtils.hasText(typeInfo.getId())) {
            CouponTypeEntity typeEntity = new CouponTypeEntity().buildId(typeInfo.getId()).findEntity();
            if (typeEntity != null && typeEntity.getSentNum() != null && typeEntity.getSentNum() > 0) {
                //throw new BreezeeException("优惠券存在下发明细券，不可更改");
            }
        }
        typeInfo.setOperType(OperTypeEnum.WRITE);
        if (StringUtils.isEmpty(typeInfo.getCode())) {
            typeInfo.setCode(SystemTool.getCode());
        }
        if (typeInfo.getProperties().get("_saveRule") != null) {
            updateCouponRule(typeInfo).save();
        } else {
            new CouponTypeEntity().createWithInfo(typeInfo).save();
        }
    }

    @Override
    public CouponTypeInfo findCouponTypeById(String id) throws BreezeeException {
        return new CouponTypeEntity().buildId(id).buildCode(id).findOne();
    }

    @SuppressWarnings("unchecked")
    @Override
    public InfoPage<CouponTypeInfo> findCouponTypes(CouponTypeInfo typeInfo) {
        BreezeeUtils.checkCreateTime(typeInfo.getProperties(), "createTime");
        typeInfo.setOperType(OperTypeEnum.READ);
        return new CouponTypeEntity().createWithInfo(typeInfo).page();
    }

    @SuppressWarnings("unchecked")
    @Override
    public InfoPage<CouponInfo> findCoupons(CouponInfo couponInfo) {
        couponInfo.getProperties().put("delFlag_not_equal", 1);
        if (couponInfo.getProperties().get("_ignoreDel") != null) {
            couponInfo.getProperties().remove("delFlag_not_equal");
        }
        couponInfo.setOperType(OperTypeEnum.READ);
        if (couponInfo.getProperties().get("status") != null) {
            if (CouponStatusEnum.CREATED.getValue().toString().equals(couponInfo.getProperties().get("status").toString())) {
                couponInfo.getProperties().put("expireDate_gt", new Date());
                couponInfo.getProperties().put("activeDate_le", new Date());
            } else if (CouponStatusEnum.EXPIRE.getValue().toString().equals(couponInfo.getProperties().get("status").toString())) {
                couponInfo.getProperties().put("expireDate_le", new Date());
                couponInfo.getProperties().put("status_not_equal", CouponStatusEnum.USED.getValue());
            }
        }
        return new CouponEntity().createWithInfo(couponInfo).page();
    }

    @Override
    public CouponInfo findCouponByCode(String code) {
        CouponEntity ce = new CouponEntity();
        ce.setCode(code);
        ce.setId(code);
        return ce.findOne();
    }

    @Override
    public void deleteCoupon(CouponTypeInfo typeInfo) {
        if (typeInfo.getCouponInfos() != null) {
            typeInfo.getCouponInfos().forEach(a -> {
                new CouponEntity().createWithInfo(a).delete();
            });
        }
    }

    @Override
    public void deleteCouponType(String id) {
        CouponTypeEntity cte = new CouponTypeEntity().buildId(id).buildCode(id).findEntity();
        cte.setStatus(InfoStatusEnum.DISABLE.getValue());
        cte.save();
    }

    @Override
    public String sendCoupon(CouponInfo couponInfo) throws BreezeeException {
        String userId = couponInfo.getUserId();
        StringBuilder sb = new StringBuilder();
        String remark = "会员筛选";
        if (couponInfo.getProperties().get("_condition") != null) {
            UserEntity ue = new UserEntity();
            List<UserEntity> l = ue.myRepository().findAll(DynamicSpecifications.createSpecification(couponInfo.getProperties()));
            l.forEach(a -> {
                sb.append(a.getCode()).append(",");
            });
            userId = sb.toString();
            remark = "会员筛选，条件：" + couponInfo.getProperties();
        }
        if (StringUtils.isEmpty(userId)) {
            throw new BreezeeException("未选择下发的会员对象");
        }
        String typeId = couponInfo.getCouponType().getId();
        if (StringUtils.isEmpty(typeId)) {
            throw new BreezeeException("未选择下发的优惠券类型");
        }

        CouponInfo coupon;
        CouponTypeEntity typeEntity;
        CouponEntity couponEntity;
        UserEntity userEntity;
        String[] ss = null;
        for (String s1 : typeId.split(",")) {
            if (StringUtils.isEmpty(s1)) {
                continue;
            }
            ss = userId.split(",");
            int i = 0;
            typeEntity = new CouponTypeEntity().buildId(s1).findEntity();
            if (typeEntity == null) {
                throw new BreezeeException("券标识" + s1 + "已不存在");
            }
            if (!Objects.equals(typeEntity.getStatus(), InfoStatusEnum.ENABLE.getValue())) {
                throw new BreezeeException(typeEntity.getName() + "状态异常，不可下发");
            }
            CouponSentInfo sentInfo = new CouponSentInfo();
            sentInfo.setCreator(couponInfo.getCreator());
            sentInfo.setName(typeEntity.getName());
            sentInfo.setUpdator(couponInfo.getCreator());
            sentInfo.setOperType(OperTypeEnum.WRITE);
            sentInfo.setCode(SystemTool.getCode());
            CouponSentEntity sentEntity = new CouponSentEntity().createWithInfo(sentInfo);
            sentEntity.setCouponType(typeEntity);
            sentEntity.setRemark(remark);
            sentEntity.setQuantity(ss.length);
            sentEntity.save();
            long n = 0;
            for (String s : ss) {
                s = s.trim();
                if (StringUtils.isEmpty(s)) {
                    continue;
                }
                coupon = new CouponInfo();
                coupon.setName(typeEntity.getName());
                coupon.setRule(typeEntity.getRule());
                if (typeEntity.getCouponType().equals(CouponTypeEnum.A.getValue().toString())) {
                    coupon.setAmount(Double.parseDouble(coupon.getRule()));
                }
                typeEntity.checkLimit(coupon);
                coupon.setCode(SystemTool.getCode());
                coupon.setOperType(OperTypeEnum.WRITE);
                coupon.setCreator(couponInfo.getCreator());
                coupon.setUpdator(coupon.getCreator());
                coupon.setFetchMethod("sent");
                coupon.setFetchDate(new Date());
                couponEntity = new CouponEntity().createWithInfo(coupon);
                userEntity = new UserEntity();
                userEntity.setCardNo(s);
                userEntity.setId(s);
                userEntity.setMobile(s);
                couponEntity.setUser(userEntity.findEntity());
                couponEntity.setCouponType(typeEntity);
                couponEntity.setCouponSent(sentEntity);
                couponEntity.save();
                coupon.setUserOpenId(couponEntity.getUser().getOpenid());
                coupon.setUserName(couponEntity.getUser().getRealName());
                n++;
                i++;
            }
            if (n > 0) {
                if (typeEntity.getSentNum() == null) {
                    typeEntity.setSentNum(0L);
                }
                typeEntity.setSentNum(typeEntity.getSentNum() + n);
                typeEntity.save();
            }
        }
        return null;
    }

    @Override
    public List<CouponSentInfo> findCouponSents(CouponSentInfo couponSentInfo) {
        return new CouponSentEntity().createWithInfo(couponSentInfo).list();
    }

    @Override
    public String exChangeCoupon(CouponInfo couponInfo) throws BreezeeException {
        //check point
        UserEntity ue = userRepository.findByCardNo(couponInfo.getUserId());
        if (ue.getTotalPoint() == null || ue.getTotalPoint() < couponInfo.getPointAmount()) {
            throw new BreezeeException("您的积分不足");
        }
        ue.setTotalPoint(ue.getTotalPoint() - couponInfo.getPointAmount());
        ue.save();
        CouponTypeEntity typeEntity = new CouponTypeEntity().buildId(couponInfo.getCouponType().getId()).findEntity();
        //更新积分变动信息
        UserPointHistoryInfo historyInfo = new UserPointHistoryInfo();
        historyInfo.setCode(SystemTool.getCode());
        historyInfo.setName(typeEntity.getName());
        historyInfo.setHappenTime(new Date());
        historyInfo.setAmount(0 - couponInfo.getPointAmount());
        historyInfo.setTotalAmount(ue.getTotalPoint());
        historyInfo.setRemark("礼券兑换");
        historyInfo.setPointType("5");//消耗积分
        historyInfo.setOperType(OperTypeEnum.WRITE);
        UserPointHistoryEntity he = new UserPointHistoryEntity().createWithInfo(historyInfo);
        he.setUser(ue);
        historyInfo.setUserOpenId(ue.getOpenid());
        historyInfo.setAliCard(ue.getAliCard());
        historyInfo.setUserName(ue.getRealName());

        //积分扣减
        subtract(he);
        he.save();

        CouponInfo coupon = new CouponInfo();
        coupon.setName(typeEntity.getName());
        coupon.setRule(typeEntity.getRule());
        if (typeEntity.getCouponType().equals(CouponTypeEnum.A.getValue().toString())) {
            coupon.setAmount(Double.parseDouble(coupon.getRule()));
        }
        typeEntity.checkLimit(coupon);
        coupon.setCode(SystemTool.getCode());
        coupon.setOperType(OperTypeEnum.WRITE);
        coupon.setCreator(couponInfo.getCreator());
        coupon.setUpdator(coupon.getCreator());
        coupon.setFetchMethod("point");
        coupon.setFetchDate(new Date());
        CouponEntity couponEntity = new CouponEntity().createWithInfo(coupon);
        couponEntity.setCouponType(typeEntity);
        couponEntity.setUser(ue);
        couponEntity.save();
        if (typeEntity.getSentNum() == null) {
            typeEntity.setSentNum(0L);
        }
        typeEntity.setSentNum(typeEntity.getSentNum() + 1);
        typeEntity.save();

        coupon.setUserOpenId(ue.getOpenid());
        coupon.setUserName(ue.getRealName());
        PointStoreEntity pointStoreEntity = new PointStoreEntity().buildId(couponInfo.getProductId()).findEntity();
        if (pointStoreEntity.getStockNum() != null && pointStoreEntity.getStockNum() > 0) {
            //如果给了库存数，才会计算库存
            if (pointStoreEntity.getStockRemain() == null) {
                pointStoreEntity.setStockRemain(pointStoreEntity.getStockNum());
            }
            pointStoreEntity.setStockRemain(pointStoreEntity.getStockRemain() - 1);
        }
        pointStoreEntity.save();
        return null;
    }

    private void subtract(UserPointHistoryEntity userPointHistoryEntity) {
        Map<String, Object> m = new HashMap<>();
        m.put("user_id_obj_ae", userPointHistoryEntity.getUser().getId());
        m.put("remainAmount_le_null", 0);
        m.put("status", 1);
        Sort sort = new Sort(Sort.Direction.ASC, "happenTime", "amount");
        //找到这个客户的积分流水，然后按照发生时间排序
        List<UserPointHistoryEntity> l = userPointHistoryEntity.myRepository().findAll(DynamicSpecifications.createSpecification(m), sort);
        userPointHistoryEntity.setRemainAmount(userPointHistoryEntity.getAmount());
        for (UserPointHistoryEntity a : l) {
            if(userPointHistoryEntity.getRemainAmount()==0){
                break;
            }
            if (a.getRemainAmount() == null) {
                a.setRemainAmount(a.getAmount());
            }
            if (a.getRemainAmount() >= userPointHistoryEntity.getAmount()) {
                a.setRemainAmount(a.getRemainAmount() - userPointHistoryEntity.getAmount());
                userPointHistoryEntity.setRemainAmount(0);
            } else if (a.getRemainAmount() < userPointHistoryEntity.getAmount()) {
                a.setRemainAmount(0);
                userPointHistoryEntity.setRemainAmount(userPointHistoryEntity.getAmount() - a.getRemainAmount());
            }
            a.save();
        }
    }

    @Override
    public void deleteCouponById(String id) throws BreezeeException {
        new CouponEntity().buildId(id).delete();
    }

    @Override
    public CouponInfo verifyCoupon(String userCode, String couponCode) throws BreezeeException {
        CouponEntity ce = new CouponEntity().buildCode(couponCode).findEntity();
        if (ce == null) {
            throw new BreezeeException("不存在此券");
        }
        CouponInfo couponInfo = ce.buildInfo();
        if (!Objects.equals(couponInfo.getStatus(), CouponStatusEnum.CREATED.getValue())) {
            throw new BreezeeException("券状态异常：" + CouponStatusEnum.checkStatus(ce.getStatus()));
        }
        UserEntity ue = new UserEntity();
        ue.buildId(userCode).buildCode(userCode);
        ue.setMobile(userCode);
        ue.setCardNo(userCode);
        UserEntity o = ue.findEntity();
        if (o == null || !Objects.equals(o.getStatus(), InfoStatusEnum.ENABLE.getValue())) {
            throw new BreezeeException("会员状态异常");
        }
        if (Objects.equals(o.getCardLevel(), LevelEnum.STAFF.getValue())) {
            throw new BreezeeException("员工卡不可使用券消费");
        }
        ce.setStatus(CouponStatusEnum.USED.getValue());
        ce.setVerifyDate(new Date());
        ce.setVerifyAccount(o.getCardNo());
        ce.save();
        CouponTypeEntity typeEntity = ce.getCouponType();
        if (typeEntity.getVerifyNum() == null) {
            typeEntity.setVerifyNum(0L);
        }
        typeEntity.setVerifyNum(typeEntity.getVerifyNum() + 1);
        typeEntity.save();
        return ce.buildInfo();
    }

    @Override
    public CouponInfo drawCoupon(CouponInfo couponInfo) throws BreezeeException {
        CouponEntity ce = (CouponEntity) new CouponEntity().createWithInfo(couponInfo).findEntity();
        if (Objects.equals(couponInfo.getStatus(), CouponStatusEnum.CREATED.getValue())) {
            ce.setTransferUser(ce.getUser().getCardNo());
            UserEntity ue = new UserEntity().buildId(couponInfo.getUserId()).buildCode(couponInfo.getUserId()).findEntity();
            ce.setUser(ue);
        }
        ce.setStatus(couponInfo.getStatus());
        ce.setDrawDate(new Date());
        ce.save();
        return ce.buildInfo();
    }
}
