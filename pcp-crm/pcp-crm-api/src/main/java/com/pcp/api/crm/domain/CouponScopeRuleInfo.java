package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 礼券范围规则
 * Created by Silence on 2017/10/15.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponScopeRuleInfo extends BaseInfo {

    //不适用的优先级更高
    protected String saleMethod, brand, shopCode, exShopCode, category1, category2, product, exProduct;
}
