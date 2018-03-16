package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.AuthorityLineEntity;
import org.springframework.stereotype.Repository;

/**
 * Created by Ning on 2017/9/22.
 */
@Repository("authorityLineRepository")
public interface IAuthorityLineRepository extends ICommonRepository<AuthorityLineEntity,String> {

}
