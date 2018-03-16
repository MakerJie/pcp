package com.pcp.auth.impl;

import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.api.auth.service.IRoleService;
import com.pcp.auth.entity.RoleEntity;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import org.springframework.stereotype.Service;

/**
 * 角色服务实现类
 * Created by Ning on 2017/8/8.
 */
@Service("roleService")
public class RoleServiceImpl implements IServiceLayer,IRoleService {

    @Override
    public RoleInfo saveRole(RoleInfo roleInfo) throws BreezeeException {
        roleInfo.setOperType(OperTypeEnum.WRITE);
        RoleEntity re=new RoleEntity().createWithInfo(roleInfo);
        return re.save();
    }

    @SuppressWarnings("unchecked")
    @Override
    public InfoPage<RoleInfo> findRoles(RoleInfo roleInfo) throws BreezeeException {
        return new RoleEntity().createWithInfo(roleInfo).page();
    }

    @Override
    public void deleteRole(String id) throws BreezeeException {
        new RoleEntity().buildId(id).delete();
    }

    @Override
    public RoleInfo findRoleById(String id) throws BreezeeException {
        return new RoleEntity().buildId(id).buildCode(id).findOne();
    }


}
