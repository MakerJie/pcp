package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 礼券下发历史信息
 * Created by Silence on 2017/10/15.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CouponSentInfo extends BaseInfo {
    
    protected Integer quantity;

    protected String typeId,typeName;
}
