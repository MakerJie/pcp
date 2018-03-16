package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.MessageInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Ning on 2017/8/7.
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_MESSAGE_SERVICE)
public interface IMessageService extends IServiceLayer {

    @RequestMapping(value ="/message/page",method = RequestMethod.POST )
    InfoPage<MessageInfo> pageMessage(@RequestBody MessageInfo messageInfo) throws BreezeeException;

    @RequestMapping(value ="/message/save",method = RequestMethod.POST )
    MessageInfo saveMessage(@RequestBody MessageInfo messageInfo) throws BreezeeException;

    @GetMapping(value = "/messageId/{id}")
    MessageInfo findMessageById(@PathVariable("id") String id) throws  BreezeeException;

    @DeleteMapping(value = "/deleteMessage/{id}")
    void   deleteMessage(@PathVariable("id") String id) throws  BreezeeException;
}
