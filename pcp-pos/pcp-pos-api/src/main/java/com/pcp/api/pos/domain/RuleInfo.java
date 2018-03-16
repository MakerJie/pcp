package com.pcp.api.pos.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 规则定义
 * Created by Silence on 2017/7/9.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RuleInfo extends BaseInfo {

    protected Integer type,category;

    protected Double limitAmount;

    protected Date startDate,endDate;

    protected String corpId,corpName,disCode,disName,frequency, payCode;

    protected Boolean needInvoice;

    protected List<RuleLineInfo> ruleLines = new ArrayList<>();
}
