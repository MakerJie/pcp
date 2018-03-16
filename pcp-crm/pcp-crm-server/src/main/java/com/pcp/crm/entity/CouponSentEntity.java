package com.pcp.crm.entity;

import com.pcp.api.crm.domain.CouponSentInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * 礼券下发信息
 * Created by Silence on 2017/10/15.
 */
@Entity(name = "CRM_TF_COUPON_SENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponSentEntity extends BaseEntity<CouponSentInfo> {

    protected Integer quantity;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "TYPE_ID")
    CouponTypeEntity couponType;

    @Override
    protected CouponSentInfo createInfo() {
        return new CouponSentInfo();
    }
}
