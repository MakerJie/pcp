package com.pcp.api.crm.domain;

import com.pcp.common.domain.BaseInfo;
import lombok.*;

/**
 * 活动用户信息
 * Created by Silence on 2017/11/9.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RewardUserInfo extends BaseInfo {

    private RewardInfo rewardInfo;
    private String userId,userCode,userCard,userMobile,userName;
}
