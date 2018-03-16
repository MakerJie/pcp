package com.pcp.crm.entity;

import com.pcp.api.crm.domain.CouponTimeRuleInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;

/**
 * 券的时间范围实体
 * Created by Silence on 2017/10/15.
 */
@Entity(name = "CRM_TD_COUPON_RULE_TIME")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponTimeRuleEntity extends BaseEntity<CouponTimeRuleInfo> {

    private String weekDay,startTime,endTime;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "COUPON_TYPE_ID")
    CouponTypeEntity couponType;

    @Override
    protected CouponTimeRuleInfo createInfo() {
        return new CouponTimeRuleInfo();
    }
}
