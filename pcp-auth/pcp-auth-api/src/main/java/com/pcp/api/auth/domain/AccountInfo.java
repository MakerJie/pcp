package com.pcp.api.auth.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pcp.common.domain.BaseInfo;
import lombok.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * 账号对象
 * 系统的登录用户
 * 1. 具备组织
 * 2. 具备角色
 * Created by LX on 2017/7/8.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AccountInfo extends BaseInfo {

    protected String password, mobile, email, confirmPassword, shopNames, shopCity, roleNames;
    protected Integer delFlag = 0;
    protected List<ShopAccountInfo> shopAccountInfos = new ArrayList<>();
    protected List<String> shopCodes;
    protected List<String> shopNameList;
    //界面保存时候的传值
    protected List<String> roleIds;
    //账号所具备的功能权限
    protected List<String> permits;
    //角色串
    protected String roleStr;

    public List<String> getShopCodes() {
        List<String> l = new ArrayList<>();
        if (shopAccountInfos != null) {
            shopAccountInfos.forEach(a -> {
                l.add(a.getShopCode());
            });
        }
        return l;
    }

    public List<String> getShopNameList() {
        List<String> l = new ArrayList<>();
        if (shopAccountInfos != null) {
            shopAccountInfos.forEach(a -> {
                l.add(a.getShopCode()+(a.getShopName()==null?"":a.getShopName()));
            });
        }
        return l;
    }
}

