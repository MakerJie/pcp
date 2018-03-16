package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.PointStoreTypeEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/8
 */
@Repository("pointStoreTypeRepository")
public interface IPointStoreTypeRepository extends ICommonRepository<PointStoreTypeEntity,String> {
}
