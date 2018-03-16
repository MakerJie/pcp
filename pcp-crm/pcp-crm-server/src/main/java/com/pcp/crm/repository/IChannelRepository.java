package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.ChannelEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */
@Repository("channelRepository")
public interface IChannelRepository extends ICommonRepository<ChannelEntity,String>{
}
