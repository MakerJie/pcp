package com.pcp.api.auth;

/**
 * Created by LX on 2017/7/10.
 */
public interface AuthAPI {
    public final static String APPID = "auth";
    public final static String BEAN_ACCOUNT_SERVICE = "accountService";
    public final static String BEAN_ROLE_SERVICE="roleService";
    public final static String BEAN_SUGGEST_SERVICE = "suggestionService";
    public final static String BEAN_SHOPACCOUNT_SERVICE="shopAccountService";
    public final static String LOGIN="/login";
    public final static String SAVE="/save";
    public final static String ROLE_SAVE="/role/save";
    public final static String ROLEId="/roleId/{id}";
    public final static String ROLE_DELETE="/delete/{id}";
    public final static String ROLE_PAGE="/role/page";
    public final static String ACCOUNTS="/accounts";
    public final static String SUGGESTION="/suggests";
    public final static String SUGGESTION_SAVE="/suggests/save";
    public final static String SUGGESTION_ID="/suggests/{id}";
    public final static String ACCOUNTBYID="/{id}";
    public final static String DELETEACCOUNTBYID="/delete/{id}";
    public final static String ACCOUNTSBYNAME="/personInfo";
    public final static String SHOPACCOUNTSAVE="/saveShopAccount";
    public final static String DELETESHOPACCOUNT = "/shopAccount/delete";
    public final static String ROLE_ACCOUNT = "/role/account";
}
