package com.pcp.crm.impl;
import com.pcp.api.crm.domain.MessageInfo;
import com.pcp.api.crm.service.IMessageService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.MessageEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;

/**
 * Created by Ning on 2017/8/7.
 */
@Service("messageService")
public class MessageServiceImpl implements IMessageService,IServiceLayer {


    @Override
    public InfoPage<MessageInfo> pageMessage(MessageInfo messageInfo) throws BreezeeException {
        BreezeeUtils.checkCreateTime(messageInfo.getProperties(), "createTime");
        return new MessageEntity().createWithInfo(messageInfo).page();
    }

    @Override
    public MessageInfo saveMessage(MessageInfo messageInfo) throws BreezeeException {
        messageInfo.setOperType(OperTypeEnum.WRITE);
        if(StringUtils.isEmpty(messageInfo.getCode())){
            messageInfo.setCode(System.currentTimeMillis()+"");
        }
        if(StringUtils.isEmpty(messageInfo.getName())){
            messageInfo.setName(messageInfo.getCode());
        }
        MessageEntity me = new MessageEntity().createWithInfo(messageInfo);
        MessageInfo mi = me.save();
        return mi;
    }

    @Override
    public MessageInfo findMessageById(String id) throws BreezeeException {
        return new MessageEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public void deleteMessage(String id) throws BreezeeException {
        new MessageEntity().buildId(id).delete();
    }
}
