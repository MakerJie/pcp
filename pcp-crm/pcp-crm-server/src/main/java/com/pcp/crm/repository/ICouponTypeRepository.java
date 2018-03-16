package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.CouponTypeEntity;
import org.springframework.stereotype.Repository;

/**
 * 优惠券类型持久化
 * Created by Silence on 2017/7/4.
 */
@Repository("couponTypeRepository")
public interface ICouponTypeRepository extends ICommonRepository<CouponTypeEntity,String> {
}
