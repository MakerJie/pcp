package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 *规则
 * Created by Ning on 2017/9/19.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthorityLineInfo extends BaseInfo{

    protected String cardLevel,couponCodeStr;
    protected Integer integral;
}
