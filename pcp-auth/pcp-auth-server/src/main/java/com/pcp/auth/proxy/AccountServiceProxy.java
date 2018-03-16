package com.pcp.auth.proxy;

import com.pcp.api.auth.AuthAPI;
import com.pcp.api.auth.domain.AccountInfo;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.api.auth.domain.ShopAccountInfo;
import com.pcp.api.auth.service.IAccountService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/7/10
 */
@RestController
@RequestMapping("/" + AuthAPI.BEAN_ACCOUNT_SERVICE)
public class AccountServiceProxy implements IAccountService, IProxyLayer {

    @Resource(name = AuthAPI.BEAN_ACCOUNT_SERVICE)
    private IAccountService accountService;

    @Override
    public AccountInfo checkPassword(@RequestBody AccountInfo accountInfo) throws BreezeeException {
        return accountService.checkPassword(accountInfo);
    }

    @Override
    public AccountInfo findAccountById(@PathVariable("id") String id) throws BreezeeException {
        return accountService.findAccountById(id);
    }

    @Override
    public InfoPage<AccountInfo> findAccounts(@RequestBody AccountInfo info) {
        return accountService.findAccounts(info);
    }

    @Override
    public List<AccountInfo> findAccountList(@RequestBody AccountInfo info) throws BreezeeException {
        return accountService.findAccountList(info);
    }

    @Override
    public AccountInfo saveAccount(@RequestBody AccountInfo accountInfo) throws BreezeeException {
        return accountService.saveAccount(accountInfo);
    }

    @Override
    public AccountInfo deleteAccountById(@PathVariable("id") String id) throws BreezeeException {
        return accountService.deleteAccountById(id);
    }

    @Override
    public ShopAccountInfo saveShopAccount(@RequestBody ShopAccountInfo shopAccountInfo) throws BreezeeException {
        return accountService.saveShopAccount(shopAccountInfo);
    }

    @Override
    public void deleteShopAccount(@RequestBody ShopAccountInfo shopAccountInfo) throws BreezeeException {
        accountService.deleteShopAccount(shopAccountInfo);
    }

    @Override
    public void saveAccountRole(@RequestBody AccountInfo accountInfo) throws BreezeeException {
        accountService.saveAccountRole(accountInfo);
    }

    @Override
    public InfoPage<AccountInfo> findRoleAccounts(@RequestBody RoleInfo roleInfo) throws BreezeeException {
        return accountService.findRoleAccounts(roleInfo);
    }
}
