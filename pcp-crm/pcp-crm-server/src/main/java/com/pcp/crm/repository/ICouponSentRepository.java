package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.CouponSentEntity;
import org.springframework.stereotype.Repository;

/**
 * 礼券下发持久化
 * Created by Silence on 2017/10/15.
 */
@Repository("couponSentRepository")
public interface ICouponSentRepository extends ICommonRepository<CouponSentEntity, String> {
}
