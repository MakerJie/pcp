package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.AdvertiseInfo;
import com.pcp.api.crm.domain.ChannelInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */

@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_CHANNEL_SERVICE)
public interface IChannelService extends IServiceLayer {

    @PostMapping(value = CrmAPI.saveChannel)
    ChannelInfo saveChannel(@RequestBody ChannelInfo channelInfo) throws BreezeeException;

    @GetMapping(value = CrmAPI.channelId)
    ChannelInfo findChannelById(@PathVariable("id") String id ) throws BreezeeException;

    @PostMapping(value = CrmAPI.pageChannels)
    InfoPage<ChannelInfo> pageChannel(@RequestBody ChannelInfo channelInfo) throws BreezeeException;


    @DeleteMapping(value = CrmAPI.deleteChannel)
    void deleteChannel(@PathVariable("id") String id) throws BreezeeException;
}
