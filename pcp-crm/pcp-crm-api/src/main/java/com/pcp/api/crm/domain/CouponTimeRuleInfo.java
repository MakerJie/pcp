package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 礼券时间规则
 * Created by Silence on 2017/10/15.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CouponTimeRuleInfo extends BaseInfo {

    protected String weekDay,startTime,endTime;
}
