package com.pcp.crm.impl;

import com.pcp.api.crm.domain.CouponScopeRuleInfo;
import com.pcp.api.crm.service.ICouponScopeRuleService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.CouponScopeRuleEntity;
import org.springframework.stereotype.Service;

/**
 * @author Wang, Junjie
 * @since on 2017/10/16
 */
@Service("couponScopeRuleService")
public class CouponScopeRuleServiceImpl implements IServiceLayer,ICouponScopeRuleService{
    @Override
    public void deleteCouponScopeRule(String id) throws BreezeeException {
         new CouponScopeRuleEntity().buildId(id).buildCode(id).delete();
    }

    @Override
    public CouponScopeRuleInfo findCouponScopeRuleById(String id) throws BreezeeException {
        return new CouponScopeRuleEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public void saveCouponScopeRule(CouponScopeRuleInfo couponScopeRuleInfo) throws BreezeeException {
          couponScopeRuleInfo.setOperType(OperTypeEnum.WRITE);
          CouponScopeRuleEntity couponScopeRuleEntity=new CouponScopeRuleEntity().createWithInfo(couponScopeRuleInfo);
          couponScopeRuleEntity.save();
    }

    @Override
    public InfoPage<CouponScopeRuleInfo> pageCouponScopeRule(CouponScopeRuleInfo couponScopeRuleInfo) throws BreezeeException {
        return new CouponScopeRuleEntity().createWithInfo(couponScopeRuleInfo).page();
    }


}
