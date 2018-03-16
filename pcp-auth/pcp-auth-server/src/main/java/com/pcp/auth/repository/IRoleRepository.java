package com.pcp.auth.repository;

import com.pcp.auth.entity.RoleEntity;
import com.pcp.common.data.ICommonRepository;
import org.springframework.stereotype.Repository;

/**
 * 角色持久化服务
 * Created by Silence on 2017/8/7.
 */
@Repository("roleRepository")
public interface IRoleRepository extends ICommonRepository<RoleEntity, String> {
}
