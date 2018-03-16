package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 会员等级管理
 *
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LevelManageInfo extends BaseInfo {
    //name 会员等级中文
    protected Integer cent, quota, fluctuate, cardLevel;//积分兑换比例：元：分    额度最小值 升降级
    protected double discount, safeguard;
    protected String image;
}//保级值

