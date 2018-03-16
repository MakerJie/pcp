package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.MessageInfo;
import com.pcp.api.crm.service.IMessageService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * Created by Ning on 2017/8/7.
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_MESSAGE_SERVICE)
public class MessageServiceProxy implements IMessageService,IServiceLayer {

    @Resource(name= CrmAPI.BEAN_MESSAGE_SERVICE)
    private IMessageService messageService ;

    @Override
    public InfoPage<MessageInfo> pageMessage(@RequestBody MessageInfo messageInfo) throws BreezeeException {
        return messageService.pageMessage(messageInfo);
    }

    @Override
    public MessageInfo saveMessage(@RequestBody MessageInfo messageInfo) throws BreezeeException {
        return messageService.saveMessage(messageInfo);
    }

    @Override
    public MessageInfo findMessageById(@PathVariable("id") String id) throws BreezeeException {
        return messageService.findMessageById(id);
    }

    @Override
    public void deleteMessage(@PathVariable("id") String id) throws BreezeeException {
       messageService.deleteMessage(id);
    }
}
