package com.pcp.crm.entity;

import com.pcp.api.crm.domain.RewardUserInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;

/**
 * 活动用户日志信息
 * Created by Silence on 2017/11/9.
 */
@Entity(name = "CRM_TF_REWARD_USER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RewardUserEntity extends BaseEntity<RewardUserInfo> {

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "REWARD_ID")
    private RewardEntity reward;

    @ManyToOne(cascade = {CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private UserEntity user;

    @Override
    protected RewardUserInfo createInfo() {
        return new RewardUserInfo();
    }

    @Override
    public RewardUserInfo buildInfo(RewardUserInfo rewardUserInfo) {
        super.buildInfo(rewardUserInfo);
        if(this.getUser()!=null){
            rewardUserInfo.setUserCard(this.user.getCardNo());
            rewardUserInfo.setUserMobile(this.user.getMobile());
            rewardUserInfo.setUserName(this.user.getRealName());
        }
        return rewardUserInfo;
    }
}
