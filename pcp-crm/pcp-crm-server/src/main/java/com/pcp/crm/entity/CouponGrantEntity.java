package com.pcp.crm.entity;

import com.pcp.api.crm.domain.CouponGrantInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * @author Wang, Junjie
 * @since on 2017/9/26
 */
@Entity(name = "CRM_TF_COUPON_GRANT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponGrantEntity extends BaseEntity<CouponGrantInfo> {
    protected String couponType,couponId,couponName;//券类型  优惠券id  优惠券名称
    protected  Integer  total,everyTime;//发放总数 每次发放数量
    @Override
    protected CouponGrantInfo createInfo() {
        return new CouponGrantInfo();
    }


}
