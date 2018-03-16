package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.CouponGrantEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/9/26
 */
@Repository("couponGrantRepository")
public interface ICouponGrantRepository extends ICommonRepository<CouponGrantEntity,String> {
}
