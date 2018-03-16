package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.api.crm.service.IAdvertiseService;
import com.pcp.api.crm.service.IChannelService;
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
 * @since on 2017/8/4
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_CHANNEL_SERVICE)
public class ChannelServiceProxy implements IChannelService,IServiceLayer{

    @Resource(name=CrmAPI.BEAN_CHANNEL_SERVICE)
    private IChannelService channelService ;

    @Override
    public ChannelInfo saveChannel(@RequestBody ChannelInfo channelInfo) throws BreezeeException {
        return channelService.saveChannel(channelInfo);
    }

    @Override
    public ChannelInfo findChannelById(@PathVariable("id") String id) throws BreezeeException {
        return channelService.findChannelById(id);
    }

    @Override
    public InfoPage<ChannelInfo> pageChannel(@RequestBody ChannelInfo channelInfo) throws BreezeeException {
        return channelService.pageChannel(channelInfo);
    }

    @Override
    public void deleteChannel(@PathVariable("id") String id) throws BreezeeException {
        channelService.deleteChannel(id);
    }
}
