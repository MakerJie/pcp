package com.pcp.api.auth.service;

import com.pcp.api.auth.AuthAPI;
import com.pcp.api.auth.domain.AccountInfo;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.api.auth.domain.ShopAccountInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * 账号服务的接口
 * 1. 密码验证，获取账号的角色，组织
 * 2. 账号查询，修改
 * Created by LX on 2017/7/8.
 */
@FeignClient(value = AuthAPI.APPID, path = "/" + AuthAPI.BEAN_ACCOUNT_SERVICE)
public interface IAccountService extends IServiceLayer {

    /**
     * 密码校验
     * @param accountInfo 参数
     * @throws BreezeeException 异常信息
     */
    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.LOGIN)
    AccountInfo checkPassword(@RequestBody AccountInfo accountInfo) throws BreezeeException;

    /**
     * 根据账号标示获取账号信息
     * @param id 账号标识
     * @return 指定的账号
     */
    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.ACCOUNTBYID)
    AccountInfo findAccountById(@PathVariable("id") String id) throws BreezeeException;

    /**
     * 根据账号标示删除账号信息
     * @param id 账号标识
     * @return 指定的账号
     */
    @RequestMapping(method = RequestMethod.DELETE, value = AuthAPI.DELETEACCOUNTBYID)
    AccountInfo deleteAccountById(@PathVariable("id") String id) throws BreezeeException;

    /**
     * 获取账号列表（分页）
     * @param info 查询条件
     * @return 分页结果
     */
    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.ACCOUNTS)
    InfoPage<AccountInfo> findAccounts(@RequestBody AccountInfo info) throws BreezeeException;

    /**
     * 查询账号表（不分页）
     * @param info
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.POST)
    List<AccountInfo> findAccountList(@RequestBody AccountInfo info) throws BreezeeException;

    /**
     * 账号新建
     * @param accountInfo
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.SAVE)
    AccountInfo saveAccount(@RequestBody AccountInfo accountInfo) throws BreezeeException;

    /**
     * 保存账号关联门店
     * @param shopAccountInfo
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.POST, value = AuthAPI.SHOPACCOUNTSAVE)
    ShopAccountInfo saveShopAccount(@RequestBody ShopAccountInfo shopAccountInfo) throws BreezeeException;

    /**
     * 删除账号关联门店
     * @param shopAccountInfo
     * @throws BreezeeException
     */
    @DeleteMapping(value = AuthAPI.DELETESHOPACCOUNT)
    void deleteShopAccount(@RequestBody ShopAccountInfo shopAccountInfo) throws BreezeeException;

    /**
     * 保存账号角色
     * @param accountInfo
     * @throws BreezeeException
     */
    @PostMapping(AuthAPI.ROLE_ACCOUNT)
    void saveAccountRole(AccountInfo accountInfo) throws BreezeeException;

    @RequestMapping(method = RequestMethod.POST, value = "/roleAccount/page")
    InfoPage<AccountInfo> findRoleAccounts(@RequestBody RoleInfo roleInfo) throws BreezeeException;


}



