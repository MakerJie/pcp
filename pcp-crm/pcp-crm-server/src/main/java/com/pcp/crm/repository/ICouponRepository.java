package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.CouponEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 优惠券持久化
 * Created by Silence on 2017/7/4.
 */
@Repository("couponRepository")
public interface ICouponRepository extends ICommonRepository<CouponEntity,String> {
    List<CouponEntity> findByStatus(Integer status);
}
