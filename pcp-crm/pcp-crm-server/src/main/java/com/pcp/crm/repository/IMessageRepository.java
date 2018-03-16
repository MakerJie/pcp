package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.MessageEntity;
import org.springframework.stereotype.Repository;

/**
 * Created by Ning on 2017/8/7.
 */
@Repository("messageRepository")
public interface IMessageRepository extends ICommonRepository<MessageEntity,String> {

}
