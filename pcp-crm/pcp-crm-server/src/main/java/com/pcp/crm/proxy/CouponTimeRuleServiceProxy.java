package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.CouponTimeRuleInfo;
import com.pcp.api.crm.service.ICouponScopeRuleService;
import com.pcp.api.crm.service.ICouponTimeRuleService;
import com.pcp.common.IServiceLayer;
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
@RequestMapping("/" + CrmAPI.BEAN_COUPON_TIME_RULE_SERVICE)
public class CouponTimeRuleServiceProxy implements IServiceLayer,ICouponTimeRuleService{

    @Resource(name=CrmAPI.BEAN_COUPON_TIME_RULE_SERVICE)
    private ICouponTimeRuleService target ;

    @Override
    public void deleteCouponTimeRule(@PathVariable("id") String id) throws BreezeeException {
        target.deleteCouponTimeRule(id);
    }

    @Override
    public CouponTimeRuleInfo findCouponTimeRuleById(@PathVariable("id") String id) throws BreezeeException {
        return target.findCouponTimeRuleById(id);
    }

    @Override
    public void saveCouponTimeRule(@RequestBody CouponTimeRuleInfo couponTimeRuleInfo) throws BreezeeException {
         target.saveCouponTimeRule(couponTimeRuleInfo);
    }

    @Override
    public InfoPage<CouponTimeRuleInfo> pageCouponTimeRule(@RequestBody CouponTimeRuleInfo couponTimeRuleInfo) throws BreezeeException {
        return target.pageCouponTimeRule(couponTimeRuleInfo);
    }
}
