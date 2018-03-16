package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.AdvertiseEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */
@Repository("advertiseRepository")
public interface IAdvertiseRepository extends ICommonRepository<AdvertiseEntity,String> {
}
