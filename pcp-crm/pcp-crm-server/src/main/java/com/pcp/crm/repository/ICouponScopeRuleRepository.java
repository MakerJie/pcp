package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.CouponScopeRuleEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/10/16
 */
@Repository("couponScopeRuleRepository")
public interface ICouponScopeRuleRepository extends ICommonRepository<CouponScopeRuleEntity,String> {
}
