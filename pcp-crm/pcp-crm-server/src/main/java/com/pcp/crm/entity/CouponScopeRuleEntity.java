package com.pcp.crm.entity;

import com.pcp.api.crm.domain.CouponScopeRuleInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * 券适用范围
 * Created by Silence on 2017/10/15.
 */
@Entity(name = "CRM_TD_COUPON_RULE_SCOPE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponScopeRuleEntity extends BaseEntity<CouponScopeRuleInfo> {

    //不适用的优先级更高
    private String saleMethod, brand, shopCode, exShopCode, category1, category2;

    @Column(name = "PRODUCT", length = 4000)
    private String product;

    @Column(name = "EX_PRODUCT", length = 4000)
    private String exProduct;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "COUPON_TYPE_ID")
    CouponTypeEntity couponType;

    @Override
    protected CouponScopeRuleInfo createInfo() {
        return new CouponScopeRuleInfo();
    }
}
