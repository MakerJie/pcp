package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * @author Wang, Junjie
 * @since on 2017/10/17
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RewardLineInfo extends BaseInfo {
    protected String  cardLevel,couponCodeStr;
    protected Integer integral;
}
