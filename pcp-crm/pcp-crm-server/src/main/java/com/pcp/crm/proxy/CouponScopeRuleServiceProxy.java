package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.CouponScopeRuleInfo;
import com.pcp.api.crm.service.IChannelService;
import com.pcp.api.crm.service.ICouponScopeRuleService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author Wang, Junjie
 * @since on 2017/10/16
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_COUPON_SCOPE_RULE_SERVICE)
public class CouponScopeRuleServiceProxy implements IProxyLayer,ICouponScopeRuleService {


    @Resource(name=CrmAPI.BEAN_COUPON_SCOPE_RULE_SERVICE)
    private ICouponScopeRuleService target ;

    @Override
    public void deleteCouponScopeRule(@PathVariable("id") String id) throws BreezeeException {
        target.deleteCouponScopeRule(id);
    }

    @Override
    public CouponScopeRuleInfo findCouponScopeRuleById(@PathVariable("id") String id) throws BreezeeException {
        return target.findCouponScopeRuleById(id);
    }

    @Override
    public void saveCouponScopeRule(@RequestBody CouponScopeRuleInfo couponScopeRuleInfo) throws BreezeeException {
            target.saveCouponScopeRule(couponScopeRuleInfo);
    }

    @Override
    public InfoPage<CouponScopeRuleInfo> pageCouponScopeRule(@RequestBody CouponScopeRuleInfo couponScopeRuleInfo) throws BreezeeException {
        return target.pageCouponScopeRule(couponScopeRuleInfo);
    }


}
