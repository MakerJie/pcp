package com.pcp.crm.impl;

import com.pcp.api.crm.domain.RewardInfo;
import com.pcp.api.crm.domain.RewardUserInfo;
import com.pcp.api.crm.service.IRewardService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.QrcodeEntity;
import com.pcp.crm.entity.RewardEntity;
import com.pcp.crm.entity.RewardLineEntity;
import com.pcp.crm.entity.RewardUserEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@Service("rewardService")
public class RewardServiceImpl implements IServiceLayer, IRewardService {
    @Override
    public RewardInfo saveReward(RewardInfo rewardInfo) throws BreezeeException {
        if (StringUtils.isEmpty(rewardInfo.getCode())) {
            rewardInfo.setCode(SystemTool.getCode());
        }
        if (StringUtils.isEmpty(rewardInfo.getName())) {
            rewardInfo.setName(SystemTool.getCode());
        }
        rewardInfo.setOperType(OperTypeEnum.WRITE);
        RewardEntity re = new RewardEntity().createWithInfo(rewardInfo);
        if (StringUtils.hasText(rewardInfo.getQrcodeId())) {
            re.setQrcode(new QrcodeEntity().buildId(rewardInfo.getQrcodeId()).findEntity());
        }
        return re.save();
    }

    @Override
    public RewardInfo findRewardById(String id) throws BreezeeException {
        return new RewardEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<RewardInfo> pageReward(RewardInfo rewardInfo) throws BreezeeException {
        return new RewardEntity().createWithInfo(rewardInfo).page();
    }

    @Override
    public void deleteReward(RewardInfo rewardInfo) throws BreezeeException {
        new RewardEntity().createWithInfo(rewardInfo).delete();
    }

    @Override
    public InfoPage<RewardUserInfo> findRewardUser(RewardUserInfo rewardUserInfo) {
        return new RewardUserEntity().createWithInfo(rewardUserInfo).page();
    }
}
