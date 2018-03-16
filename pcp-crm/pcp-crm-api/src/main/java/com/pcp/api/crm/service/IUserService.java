package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.*;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 客户服务
 * Created by Silence on 2017/6/28.
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_USER_SERVICE)
public interface IUserService extends IServiceLayer {

    @RequestMapping(method = RequestMethod.POST, value = CrmAPI.saveUser)
    UserInfo saveUser(@RequestBody UserInfo userInfo) throws BreezeeException;

    @RequestMapping(method = RequestMethod.POST, value = CrmAPI.pageUser)
    InfoPage<UserInfo> findUsers(@RequestBody UserInfo userInfo);

    @RequestMapping(method = RequestMethod.POST, value = "/user/query/list")
    List<UserInfo> findUsersList(@RequestBody UserInfo userInfo);


    @RequestMapping(method = RequestMethod.GET, value = CrmAPI.userId)
    UserInfo findUserById(@PathVariable("id") String id) throws BreezeeException;

    @GetMapping(value = "/findByMobile/{mobile}")
    UserInfo findByMobile(@PathVariable("mobile") String mobile);

    @PostMapping(value = CrmAPI.checkLogin)
    UserInfo checkLogin(@RequestBody UserInfo userInfo);

    @PostMapping(value = CrmAPI.pointHistory)
    void userPoint(@RequestBody UserPointHistoryInfo pointHistoryInfo) throws BreezeeException;

}
