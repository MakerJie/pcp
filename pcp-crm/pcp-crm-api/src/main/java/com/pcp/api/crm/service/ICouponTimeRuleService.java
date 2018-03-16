package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.CouponScopeRuleInfo;
import com.pcp.api.crm.domain.CouponTimeRuleInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/10/16
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_COUPON_TIME_RULE_SERVICE)
public interface ICouponTimeRuleService extends IServiceLayer{

    @DeleteMapping(value = "/couponTimeRule/delete/{id}")
    void deleteCouponTimeRule(@PathVariable("id") String id) throws BreezeeException;

    @GetMapping(value = "/couponTimeRule/find/{id}")
    CouponTimeRuleInfo findCouponTimeRuleById(@PathVariable("id") String id) throws BreezeeException;

    @RequestMapping(value = "/couponTimeRule/save",method = RequestMethod.POST)
    void saveCouponTimeRule(@RequestBody CouponTimeRuleInfo couponTimeRuleInfo) throws BreezeeException;

    @RequestMapping(value ="/couponTimeRule/page",method = RequestMethod.POST )
    InfoPage<CouponTimeRuleInfo> pageCouponTimeRule(@RequestBody CouponTimeRuleInfo couponTimeRuleInfo) throws BreezeeException;
}
