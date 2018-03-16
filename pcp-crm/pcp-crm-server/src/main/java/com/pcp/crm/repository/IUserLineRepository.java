package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.ConsumeEntity;
import org.springframework.stereotype.Repository;

/**
 * Created by LX on 2017/8/2.
 */
@Repository("userLineRepository")
public interface IUserLineRepository extends ICommonRepository<ConsumeEntity,String> {
}
