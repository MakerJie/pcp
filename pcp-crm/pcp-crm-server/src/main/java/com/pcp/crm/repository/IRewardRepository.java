package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.RewardEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@Repository("rewardRepository")
public interface IRewardRepository extends ICommonRepository<RewardEntity,String>{
}
