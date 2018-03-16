package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.CouponInfo;
import com.pcp.api.crm.domain.CouponSentInfo;
import com.pcp.api.crm.domain.CouponTypeInfo;
import com.pcp.api.crm.service.ICouponService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 优惠券服务代理类
 * Created by Silence on 2017/7/4.
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_COUP_SERVICE)
public class CouponServiceProxy implements ICouponService, IProxyLayer {

    @Resource(name = CrmAPI.BEAN_COUP_SERVICE)
    private ICouponService target;

    @Override
    public void generateCoupon(@RequestParam String typeId,
                               @RequestParam Integer count) throws BreezeeException {
        target.generateCoupon(typeId, count);
    }

    @Override
    public void saveCouponType(@RequestBody CouponTypeInfo typeInfo) throws BreezeeException {
        target.saveCouponType(typeInfo);
    }

    @Override
    public CouponTypeInfo findCouponTypeById(@PathVariable("id") String id) throws BreezeeException {
        return target.findCouponTypeById(id);
    }

    @Override
    public InfoPage<CouponTypeInfo> findCouponTypes(@RequestBody CouponTypeInfo typeInfo) {
        return target.findCouponTypes(typeInfo);
    }

    @Override
    public InfoPage<CouponInfo> findCoupons(@RequestBody CouponInfo couponInfo) {
        return target.findCoupons(couponInfo);
    }

    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.couponCode)
    @Override
    public CouponInfo findCouponByCode(@PathVariable String code) {
        return target.findCouponByCode(code);
    }

    @Override
    public void deleteCoupon(@RequestBody CouponTypeInfo typeInfo) {
        target.deleteCoupon(typeInfo);
    }

    @Override
    public void deleteCouponType(@PathVariable("id") String id) {
        target.deleteCouponType(id);
    }

    @Override
    public String sendCoupon(@RequestBody CouponInfo couponInfo) throws BreezeeException {
        return target.sendCoupon(couponInfo);
    }

    @Override
    public List<CouponSentInfo> findCouponSents(@RequestBody CouponSentInfo couponSentInfo) {
        return target.findCouponSents(couponSentInfo);
    }

    @Override
    public String exChangeCoupon(@RequestBody CouponInfo couponInfo) {
        return target.exChangeCoupon(couponInfo);
    }

    @Override
    public void deleteCouponById(@PathVariable("id") String id) throws BreezeeException {
        target.deleteCouponById(id);
    }

    @Override
    public CouponInfo verifyCoupon(@PathVariable("userCode") String userCode, @PathVariable("code") String couponCode) throws BreezeeException {
        return target.verifyCoupon(userCode, couponCode);
    }

    @Override
    public CouponInfo drawCoupon(@RequestBody CouponInfo couponInfo) throws BreezeeException {
        return target.drawCoupon(couponInfo);
    }
}
