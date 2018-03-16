package com.pcp.auth.proxy;

import com.pcp.api.auth.AuthAPI;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.api.auth.service.IRoleService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * Created by Ning on 2017/8/7.
 */
@RestController
@RequestMapping("/" + AuthAPI.BEAN_ROLE_SERVICE)
public class RoleServiceProxy implements IServiceLayer,IRoleService {

    @Resource(name = AuthAPI.BEAN_ROLE_SERVICE)
    private IRoleService roleService;

    @Override
    public RoleInfo saveRole(@RequestBody RoleInfo roleInfo) throws BreezeeException {
        return roleService.saveRole(roleInfo);
    }

    @Override
    public InfoPage<RoleInfo> findRoles(@RequestBody RoleInfo roleInfo) throws BreezeeException {
        return roleService.findRoles(roleInfo);
    }

    @Override
    public void deleteRole(@PathVariable("id") String id) throws BreezeeException {
        roleService.deleteRole(id);
    }

    @Override
    public RoleInfo findRoleById(@PathVariable("id") String id) throws BreezeeException {
        return roleService.findRoleById(id);
    }

}
