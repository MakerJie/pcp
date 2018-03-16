package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.AuthorityEntity;
import org.springframework.stereotype.Repository;

/**
 * Created by Ning on 2017/8/5.
 */
@Repository("authorityRepository")
public interface IAuthorityRepository extends ICommonRepository<AuthorityEntity,String> {


}
