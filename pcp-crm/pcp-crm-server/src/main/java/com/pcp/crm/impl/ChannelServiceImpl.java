package com.pcp.crm.impl;

import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.api.crm.service.IChannelService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.ChannelEntity;
import org.springframework.stereotype.Service;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */
@Service("channelsService")
public class ChannelServiceImpl implements IChannelService,IServiceLayer{
    @Override
    public ChannelInfo saveChannel(ChannelInfo channelInfo) throws BreezeeException {
        channelInfo.setOperType(OperTypeEnum.WRITE);
        ChannelEntity ce=new ChannelEntity().createWithInfo(channelInfo);
        return ce.save();
    }

    @Override
    public ChannelInfo findChannelById(String id) throws BreezeeException {
        return new ChannelEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<ChannelInfo> pageChannel(ChannelInfo channelInfo) throws BreezeeException {
        return new ChannelEntity().createWithInfo(channelInfo).page();
    }

    @Override
    public void deleteChannel(String id) throws BreezeeException {
          new ChannelEntity().buildId(id).buildCode(id).delete();
    }
}
