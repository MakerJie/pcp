package com.pcp.crm.impl;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.CouponTimeRuleInfo;
import com.pcp.api.crm.service.ICouponTimeRuleService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.CouponTimeRuleEntity;
import org.springframework.stereotype.Service;

/**
 * @author Wang, Junjie
 * @since on 2017/10/16
 */
@Service(value = CrmAPI.BEAN_COUPON_TIME_RULE_SERVICE)
public class CouponTimeRuleServiceImpl implements IServiceLayer,ICouponTimeRuleService{
    @Override
    public void deleteCouponTimeRule(String id) throws BreezeeException {
       new CouponTimeRuleEntity().buildId(id).buildCode(id).delete();
    }

    @Override
    public CouponTimeRuleInfo findCouponTimeRuleById(String id) throws BreezeeException {
        return new CouponTimeRuleEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public void saveCouponTimeRule(CouponTimeRuleInfo couponTimeRuleInfo) throws BreezeeException {
        couponTimeRuleInfo.setOperType(OperTypeEnum.WRITE);
        CouponTimeRuleEntity couponTimeRuleEntity=new CouponTimeRuleEntity().createWithInfo(couponTimeRuleInfo);
        couponTimeRuleEntity.save();
    }

    @Override
    public InfoPage<CouponTimeRuleInfo> pageCouponTimeRule(CouponTimeRuleInfo couponTimeRuleInfo) throws BreezeeException {
        return new CouponTimeRuleEntity().createWithInfo(couponTimeRuleInfo).page();
    }
}
