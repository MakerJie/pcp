package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 规则下面的优惠券表
 * @author Wang, Junjie
 * @since on 2017/9/26
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponGrantInfo extends BaseInfo{
    protected String couponType,couponId,couponName;//券类型  优惠券id  优惠券名称
     protected  Integer  total,everyTime;//发放总数 每次发放数量
}
