package com.pcp.facade;

import com.pcp.api.auth.AuthAPI;
import com.pcp.api.auth.IAuthFacade;
import com.pcp.api.auth.domain.AccountInfo;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.api.auth.domain.ShopAccountInfo;
import com.pcp.api.auth.domain.SuggestionInfo;
import com.pcp.api.auth.service.IAccountService;
import com.pcp.api.auth.service.IRoleService;
import com.pcp.api.auth.service.ISuggestionService;
import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.service.IOperationLogService;
import com.pcp.api.pos.domain.ShopInfo;
import com.pcp.api.pos.service.IShopService;
import com.pcp.common.IResourceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.JsonResponse;
import com.pcp.common.Response;
import com.pcp.common.exception.BreezeeException;
import com.pcp.netflix.FeignClientException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * 认证资源实现
 * <p>
 * Created by LX on 2017/7/8.
 */
@RestController
public class AuthFacade implements IAuthFacade, IResourceLayer {

    @Autowired
    private IAccountService accountService;

    @Autowired
    private IShopService shopService;

    @Autowired
    private IRoleService roleService;

    @Autowired
    private IOperationLogService operationLogService;

    @Autowired
    private ISuggestionService suggestionService;

    @RequestMapping(value = {"/auth/checkLogin"}, method = RequestMethod.POST)
    @Override
    public Response accountLogin(@RequestBody AccountInfo accountInfo) {
        try {
            accountInfo = accountService.checkPassword(accountInfo);
            return JsonResponse.buildSingle(accountInfo);
        } catch (RuntimeException e) {
            return JsonResponse.error(FeignClientException.populateMsg(e));
        }
    }

    @RequestMapping(value = {"/auth/accounts"}, method = RequestMethod.POST)
    @Override
    public Response findAccounts(@RequestBody AccountInfo accountInfo) {
        InfoPage<AccountInfo> page = accountService.findAccounts(accountInfo);
        page.getContent().forEach(this::checkShop);
        return JsonResponse.build(page);
    }

    private void checkShop(AccountInfo a) {
        if (a.getShopAccountInfos() != null) {
            StringBuilder sb = new StringBuilder();
            a.getShopAccountInfos().forEach(b -> {
                try {
                    ShopInfo si = shopService.findShopById(b.getShopCode());
                    if (si != null) {
                        sb.append(si.getName()).append(",");
                    }
                } catch (Exception ignored) {
                }
            });
            a.setShopNames(sb.toString());
        }
    }

    @RequestMapping(value = {"/auth/save"}, method = RequestMethod.POST)
    @Override
    public Response saveAccount(@RequestBody AccountInfo accountInfo) {
        OperationLogInfo operationLogInfo = null;
        AccountInfo old = null;
        if (!StringUtils.isEmpty(accountInfo.getId())) {
            old = accountService.findAccountById(accountInfo.getId());
        }
        try {
            if (accountInfo.getProperties().get("_password") != null && accountInfo.getProperties().get("_password").toString().equals("true")) {
                if (old != null && old.getPassword() != null && !old.getPassword().equals(accountInfo.getPassword())) {
                    operationLogInfo = new OperationLogInfo()
                            .buildOperationLog(accountInfo, old, "auth", null);
                    operationLogInfo.setErrMsg("原始密码错误");
                    return JsonResponse.error("原始密码错误");
                }
                if (old != null) {
                    old.setPassword(accountInfo.getConfirmPassword());
                    accountService.saveAccount(old);
                    operationLogInfo = new OperationLogInfo()
                            .buildOperationLog(accountInfo, old, "auth", null);
                }
                return JsonResponse.ok();
            }
            AccountInfo ai = accountService.saveAccount(accountInfo);
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(accountInfo, old == null ? new AccountInfo() : old, "auth", null);
            return JsonResponse.buildSingle(ai);
        } catch (RuntimeException e) {
            e.printStackTrace();
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(accountInfo, old == null ? new AccountInfo() : old, "auth", null);
            operationLogInfo.setErrMsg(e.getMessage());
            return JsonResponse.error(e.getMessage());
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
    }

    @RequestMapping(value = {"/auth/account/{id}"}, method = RequestMethod.GET)
    @Override
    public Response findAccountById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(accountService.findAccountById(id));
    }

    @RequestMapping(value = {"/auth/delete/id"}, method = RequestMethod.POST)
    @Override
    public Response deleteAccountById(@RequestBody AccountInfo accountInfo) {
        accountInfo.getProperties().put("del", "del");
        AccountInfo old = accountService.findAccountById(accountInfo.getId());
        OperationLogInfo operationLogInfo = new OperationLogInfo()
                .buildOperationLog(accountInfo, old == null ? new AccountInfo() : old, "auth", null);
        try {
            accountService.deleteAccountById(accountInfo.getId());
        } catch (BreezeeException e) {
            operationLogInfo.setErrMsg(e.getMessage());
            e.printStackTrace();
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.buildSingle(accountService.deleteAccountById(accountInfo.getId()));
    }

    @Override
    @RequestMapping(value = {"/saveShopAccount"}, method = RequestMethod.POST)
    public Response saveShopAccount(@RequestBody AccountInfo accountInfo) {
        OperationLogInfo operationLogInfo = null;
        AccountInfo old = null;
        try {
            old = accountService.findAccountById(accountInfo.getId());
            ShopAccountInfo shopAccountInfo = new ShopAccountInfo();
            shopAccountInfo.setAccountCode(accountInfo.getCode());
            accountService.deleteShopAccount(shopAccountInfo);
            accountInfo.getShopAccountInfos().forEach(a -> {
                accountService.saveShopAccount(a);
            });
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(accountInfo, old == null ? new AccountInfo() : old, "auth", null);
        } catch (Exception e) {
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(accountInfo, old == null ? new AccountInfo() : old, "auth", null);
            operationLogInfo.setErrMsg(e.getMessage());
            e.printStackTrace();
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = {"/role/page"}, method = RequestMethod.POST)
    public Response findRoles(@RequestBody RoleInfo roleInfo) {
        InfoPage<RoleInfo> info = roleService.findRoles(roleInfo);
        return JsonResponse.build(info);
    }

    @Override
    @RequestMapping(value = {"/role/save"}, method = RequestMethod.POST)
    public Response saveRole(@RequestBody RoleInfo roleInfo) {
        RoleInfo old = null;
        if (!StringUtils.isEmpty(roleInfo.getId())) {
            old = roleService.findRoleById(roleInfo.getId());
        }
        OperationLogInfo operationLogInfo = null;
        try {
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(roleInfo, old == null ? new RoleInfo() : old, "auth", null);
            roleService.saveRole(roleInfo);
        } catch (Exception e) {
            operationLogInfo = new OperationLogInfo()
                    .buildOperationLog(roleInfo, old == null ? new RoleInfo() : old, "auth", null);
            operationLogInfo.setErrMsg(e.getMessage());
            e.printStackTrace();
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = {"/delete/roleId"}, method = RequestMethod.POST)
    public Response deleteRole(@RequestBody RoleInfo roleInfo) {
        roleInfo.getProperties().put("del", "del");
        RoleInfo old = roleService.findRoleById(roleInfo.getId());
        OperationLogInfo operationLogInfo = new OperationLogInfo()
                .buildOperationLog(roleInfo, old == null ? new RoleInfo() : old, "auth", null);
        try {
            roleService.deleteRole(roleInfo.getId());
        } catch (Exception e) {
            operationLogInfo.setErrMsg(e.getMessage());
            e.printStackTrace();
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = {"/roleId/{id}"}, method = RequestMethod.GET)
    public Response findRoleById(@PathVariable("id") String id) {
        RoleInfo roleInfo = new RoleInfo();
        roleInfo.setId(id);
        InfoPage<RoleInfo> ipri = roleService.findRoles(roleInfo);
        if (ipri != null) {
            return JsonResponse.buildSingle(ipri.getContent().get(0));
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = {"/save/RoleAccount"}, method = RequestMethod.POST)
    public Response saveRoleAccount(@RequestBody AccountInfo accountInfo) {
        AccountInfo old = accountService.findAccountById(accountInfo.getId());
        OperationLogInfo operationLogInfo = new OperationLogInfo()
                .buildOperationLog(accountInfo, old == null ? new AccountInfo() : old, "auth", null);
        try {
            accountService.saveAccountRole(accountInfo);
        } catch (BreezeeException e) {
            operationLogInfo.setErrMsg(e.getMessage());
            e.printStackTrace();
        } finally {
            operationLogService.saveOperationLog(operationLogInfo);
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = {"/roleAccount/page"}, method = RequestMethod.POST)
    public Response pageRoleAccount(@RequestBody RoleInfo roleInfo) {
        return JsonResponse.build(accountService.findRoleAccounts(roleInfo));
    }

    @Override
    @RequestMapping(value = {AuthAPI.SUGGESTION_SAVE}, method = RequestMethod.PUT)
    public Response saveSuggest(@RequestBody SuggestionInfo suggestionInfo) {
        try {
            suggestionService.saveSuggest(suggestionInfo);
        } catch (Exception e) {
            e.printStackTrace();
            return JsonResponse.error(e.getMessage());
        }
        return JsonResponse.ok();
    }

    @Override
    @RequestMapping(value = {AuthAPI.SUGGESTION_ID}, method = RequestMethod.GET)
    public Response findSuggestById(@PathVariable("id") String id) {
        return JsonResponse.buildSingle(suggestionService.findSuggestById(id));
    }

    @Override
    @RequestMapping(value = {AuthAPI.SUGGESTION}, method = RequestMethod.POST)
    public Response findSuggests(@RequestBody SuggestionInfo suggestionInfo) {
        return JsonResponse.build(suggestionService.findSuggests(suggestionInfo));
    }

}
