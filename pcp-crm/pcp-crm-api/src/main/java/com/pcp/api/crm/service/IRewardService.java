package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.LevelManageInfo;
import com.pcp.api.crm.domain.RewardInfo;
import com.pcp.api.crm.domain.RewardUserInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@FeignClient(value = CrmAPI.APPID,path = "/" + CrmAPI.BEAN_REWARD_SERVICE)
public interface IRewardService extends IServiceLayer{

    @PostMapping(value = CrmAPI.saveReward)
    RewardInfo saveReward(@RequestBody RewardInfo rewardInfo) throws BreezeeException;

    @GetMapping(value = CrmAPI.rewardId)
    RewardInfo findRewardById(@PathVariable("id") String id ) throws BreezeeException;

    @PostMapping(value = CrmAPI.pageReward)
    InfoPage<RewardInfo> pageReward(@RequestBody RewardInfo rewardInfo) throws BreezeeException;


    @DeleteMapping(value = CrmAPI.deleteReward)
    void deleteReward(@RequestBody RewardInfo rewardInfo) throws BreezeeException;

    @PostMapping(value = CrmAPI.rewardUser)
    InfoPage<RewardUserInfo> findRewardUser(RewardUserInfo rewardUserInfo);
}
