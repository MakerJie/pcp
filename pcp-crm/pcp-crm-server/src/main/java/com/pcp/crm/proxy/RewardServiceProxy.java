package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.RewardInfo;
import com.pcp.api.crm.domain.RewardUserInfo;
import com.pcp.api.crm.service.ILevelManageService;
import com.pcp.api.crm.service.IRewardService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_REWARD_SERVICE)
public class RewardServiceProxy implements IServiceLayer,IRewardService{

    @Resource(name=CrmAPI.BEAN_REWARD_SERVICE)
    private IRewardService rewardService ;

    @Override
    public RewardInfo saveReward(@RequestBody RewardInfo rewardInfo) throws BreezeeException {
        return rewardService.saveReward(rewardInfo);
    }

    @Override
    public RewardInfo findRewardById(@PathVariable("id") String id) throws BreezeeException {
        return rewardService.findRewardById(id);
    }

    @Override
    public InfoPage<RewardInfo> pageReward(@RequestBody RewardInfo rewardInfo) throws BreezeeException {
        return rewardService.pageReward(rewardInfo);
    }

    @Override
    public void deleteReward(@RequestBody RewardInfo rewardInfo) throws BreezeeException {
          rewardService.deleteReward(rewardInfo);
    }

    @Override
    public InfoPage<RewardUserInfo> findRewardUser(@RequestBody RewardUserInfo rewardUserInfo) {
        return rewardService.findRewardUser(rewardUserInfo);
    }
}
