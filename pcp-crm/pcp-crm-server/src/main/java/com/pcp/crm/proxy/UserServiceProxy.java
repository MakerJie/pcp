package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.*;
import com.pcp.api.crm.service.IUserService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 会员服务代理类
 * Created by Silence on 2017/6/30.
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_USER_SERVICE)
public class UserServiceProxy implements IUserService, IProxyLayer {

    @Resource(name = CrmAPI.BEAN_USER_SERVICE)
    private IUserService target;

    @Override
    public UserInfo saveUser(@RequestBody UserInfo userInfo) throws BreezeeException {
        return target.saveUser(userInfo);
    }

    @Override
    public InfoPage<UserInfo> findUsers(@RequestBody UserInfo userInfo) {
        return target.findUsers(userInfo);
    }

    @Override
    public List<UserInfo> findUsersList(@RequestBody UserInfo userInfo) {
        return target.findUsersList(userInfo);
    }

    @Override
    public UserInfo findUserById(@PathVariable("id") String id) throws BreezeeException {
        return target.findUserById(id);
    }


    @Override
    public UserInfo findByMobile(@PathVariable("mobile") String mobile) {
        return target.findByMobile(mobile);
    }

    @Override
    public UserInfo checkLogin(@RequestBody UserInfo userInfo) {
        return target.checkLogin(userInfo);
    }

    @Override
    public void userPoint(@RequestBody UserPointHistoryInfo pointHistoryInfo) throws BreezeeException {
        target.userPoint(pointHistoryInfo);
    }

}
