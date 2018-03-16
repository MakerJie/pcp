package com.pcp.api.auth;

import com.pcp.api.auth.domain.AccountInfo;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.api.auth.domain.SuggestionInfo;
import com.pcp.common.IFacadeLayer;
import com.pcp.common.Response;

/**
 * 认证服务对外暴露的接口
 * Created by LX on 2017/7/8.
 */
public interface IAuthFacade extends IFacadeLayer {

    /**
     * 账号登录
     *
     * @param accountInfo
     * @return
     */
    Response accountLogin(AccountInfo accountInfo);

    /**
     * 账号列表
     *
     * @param accountInfo
     * @return
     */
    Response findAccounts(AccountInfo accountInfo);


    /**
     * 账号新建
     *
     * @param accountInfo
     * @return
     */
    Response saveAccount(AccountInfo accountInfo);

    /**
     * 根据账号ID查找账号信息
     * @param id
     * @return
     */
    Response findAccountById(String id);


    /**
     * 删除账号信息
     * @param accountInfo
     * @return
     */
    Response deleteAccountById(AccountInfo accountInfo);

    Response saveShopAccount(AccountInfo accountInfo);

    Response findRoles(RoleInfo roleInfo);

    Response saveRole(RoleInfo roleInfo);

    Response deleteRole(RoleInfo roleInfo);

    Response findRoleById(String id);

    Response saveRoleAccount(AccountInfo accountInfo);

    Response pageRoleAccount(RoleInfo roleInfo);

    Response saveSuggest(SuggestionInfo suggestionInfo);

    Response findSuggestById(String id);

    Response findSuggests(SuggestionInfo suggestionInfo);
}
