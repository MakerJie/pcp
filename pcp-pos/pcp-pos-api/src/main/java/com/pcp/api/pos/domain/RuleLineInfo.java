package com.pcp.api.pos.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.math.BigDecimal;

/**
 * 规则明细
 * Created by Silence on 2017/7/9.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RuleLineInfo extends BaseInfo {

    /**
     * 规则的内容
     * 1. 时间
     * 2.
     */
    protected String ruleContent, type, ruleId, ruleName,weekDay,brand,shopCode;

    protected BigDecimal value, value1;
}
