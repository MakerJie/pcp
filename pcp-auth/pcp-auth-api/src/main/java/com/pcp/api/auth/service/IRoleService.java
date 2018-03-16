package com.pcp.api.auth.service;

import com.pcp.api.auth.AuthAPI;
import com.pcp.api.auth.domain.AccountInfo;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 角色服务接口
 * Created by Silence on 2017/8/7.
 */
@FeignClient(value = AuthAPI.APPID, path = "/" + AuthAPI.BEAN_ROLE_SERVICE)
public interface IRoleService extends IServiceLayer {

    /**
     * 保存角色
     * @param roleInfo
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.ROLE_SAVE)
    RoleInfo saveRole(@RequestBody RoleInfo roleInfo) throws BreezeeException;

    /**
     * 分页查询角色信息
     * @param roleInfo
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.ROLE_PAGE)
    InfoPage<RoleInfo> findRoles(@RequestBody RoleInfo roleInfo) throws BreezeeException;

    /**
     * 删除角色
     * @param id
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.DELETE, value = AuthAPI.ROLE_DELETE)
    void deleteRole(@PathVariable("id") String id) throws BreezeeException;

    /**
     * 根据id查询角色对象
     * @param id
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.GET, value = AuthAPI.ROLEId)
    RoleInfo findRoleById(@PathVariable("id") String id) throws BreezeeException;

}
