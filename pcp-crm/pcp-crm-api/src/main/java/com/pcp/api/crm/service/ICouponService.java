package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.CouponInfo;
import com.pcp.api.crm.domain.CouponSentInfo;
import com.pcp.api.crm.domain.CouponTypeInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 礼券服务接口
 * Created by Silence on 2017/7/4.
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_COUP_SERVICE)
public interface ICouponService extends IServiceLayer {

    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.genCoupon)
    void generateCoupon(@RequestParam("typeId") String typeId,
                        @RequestParam("count") Integer count) throws BreezeeException;

    @RequestMapping(method = RequestMethod.PUT, value = CrmAPI.saveCouponType)
    void saveCouponType(CouponTypeInfo typeInfo) throws BreezeeException;

    @RequestMapping(method = RequestMethod.GET, value = "/findCouponType/{id}")
    CouponTypeInfo findCouponTypeById(@PathVariable("id") String id) throws BreezeeException;

    @RequestMapping(method = RequestMethod.POST, value = CrmAPI.listCouponType)
    InfoPage<CouponTypeInfo> findCouponTypes(@RequestBody CouponTypeInfo typeInfo);

    @RequestMapping(method = RequestMethod.POST, value = CrmAPI.pageCoupon)
    InfoPage<CouponInfo> findCoupons(CouponInfo couponInfo);

    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.couponCode)
    CouponInfo findCouponByCode(@PathVariable("code") String code);

    @RequestMapping(method = RequestMethod.DELETE, value = CrmAPI.delCoupon)
    void deleteCoupon(CouponTypeInfo typeInfo);

    @RequestMapping(method = RequestMethod.DELETE, value = CrmAPI.delCouponType)
    void deleteCouponType(@PathVariable("id") String id);

    @PostMapping(CrmAPI.sendCoupon)
    String sendCoupon(CouponInfo couponInfo) throws BreezeeException;

    @PostMapping(CrmAPI.sendCouponHistory)
    List<CouponSentInfo> findCouponSents(CouponSentInfo couponSentInfo);

    @PostMapping(CrmAPI.couponExchange)
    String exChangeCoupon(CouponInfo couponInfo) throws BreezeeException;

    @DeleteMapping (value ="/coupon/delete/{id}")
    void deleteCouponById(@PathVariable("id") String id) throws BreezeeException;

    @GetMapping(CrmAPI.verifyCoupon)
    CouponInfo verifyCoupon(@PathVariable("userCode") String userCode,
                      @PathVariable("code") String couponCode) throws BreezeeException;

    @PostMapping(CrmAPI.drawCoupon)
    CouponInfo drawCoupon(CouponInfo couponInfo) throws BreezeeException;
}
