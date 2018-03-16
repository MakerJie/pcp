package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.CouponScopeRuleInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/10/16
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_COUPON_SCOPE_RULE_SERVICE)
public interface ICouponScopeRuleService extends IServiceLayer{

    @DeleteMapping(value = "/couponScopeRule/delete/{id}")
    void deleteCouponScopeRule(@PathVariable("id") String id) throws BreezeeException;

    @GetMapping(value = "/couponScopeRule/find/{id}")
    CouponScopeRuleInfo findCouponScopeRuleById(@PathVariable("id") String id) throws BreezeeException;

    @RequestMapping(value = "/couponScopeRule/save",method = RequestMethod.POST)
    void saveCouponScopeRule(@RequestBody CouponScopeRuleInfo couponScopeRuleInfo) throws BreezeeException;

    @RequestMapping(value ="/couponScopeRule/page",method = RequestMethod.POST )
    InfoPage<CouponScopeRuleInfo> pageCouponScopeRule(@RequestBody CouponScopeRuleInfo couponScopeRuleInfo) throws BreezeeException;
}
