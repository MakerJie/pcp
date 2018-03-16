package com.pcp.crm.repository;

import com.pcp.api.crm.domain.PointStoreInfo;
import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.PointStoreEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/8/1
 */
@Repository("pointStoreRepository")
public interface IPointStoreRepository extends ICommonRepository<PointStoreEntity,String> {
}
