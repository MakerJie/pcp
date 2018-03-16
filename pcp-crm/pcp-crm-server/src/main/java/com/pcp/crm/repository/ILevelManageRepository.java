package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.LevelManageEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/7
 */
@Repository("levelManageRepository")
public interface ILevelManageRepository extends ICommonRepository<LevelManageEntity,String> {
}
