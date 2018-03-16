package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.RewardUserEntity;
import org.springframework.stereotype.Repository;

/**
 * 活动用户持久化
 * Created by Silence on 2017/11/9.
 */
@Repository("rewardUserRepository")
public interface IRewardUserRepository extends ICommonRepository<RewardUserEntity, String> {
}
