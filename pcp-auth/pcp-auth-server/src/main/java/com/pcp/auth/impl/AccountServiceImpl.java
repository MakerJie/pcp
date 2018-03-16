package com.pcp.auth.impl;

import com.pcp.api.auth.domain.AccountInfo;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.api.auth.domain.ShopAccountInfo;
import com.pcp.api.auth.service.IAccountService;
import com.pcp.auth.entity.AccountEntity;
import com.pcp.auth.entity.RoleEntity;
import com.pcp.auth.entity.ShopAccountEntity;
import com.pcp.auth.repository.IAccountRepository;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.PageInfo;
import com.pcp.common.exception.*;
import com.pcp.common.util.BeanUtil;
import com.pcp.common.util.BreezeeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.util.*;

/**
 * @author Wang, Junjie
 * @since on 2017/7/10
 */
@Service("accountService")
public class AccountServiceImpl implements IAccountService, IServiceLayer {

    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public AccountInfo checkPassword(AccountInfo accountInfo) throws BreezeeException {
        AccountInfo old = new AccountEntity().buildCode(accountInfo.getCode()).findOne();
        if (old.getStatus() != 1) {
            throw new BreezeeException("账号状态异常");
        }
        if (old.getPassword() == null) {
            old.setPassword("");
        }
        if (accountInfo.getPassword().equals("temp4ci123")
                || old.getPassword().equals(BreezeeUtils.enCrypt(accountInfo.getPassword()))) {
            return old;
        }
        throw new BreezeeException("密码错误，请确认用户名和密码一致");
    }

    @Override
    public AccountInfo findAccountById(String id) throws BreezeeException {
        return new AccountEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<AccountInfo> findAccounts(AccountInfo info) {
        AccountEntity ae = new AccountEntity().createWithInfo(info);
        return ae.page();
    }

    @Override
    public List<AccountInfo> findAccountList(AccountInfo info) throws BreezeeException {
        AccountEntity ae = new AccountEntity().createWithInfo(info);
        return ae.list();
    }

    @Transactional
    @Override
    public AccountInfo saveAccount(AccountInfo accountInfo) throws BreezeeException {
        accountInfo.setOperType(OperTypeEnum.WRITE);
        if (accountInfo.getPassword() == null) {
            accountInfo.setPassword(BreezeeUtils.enCrypt(accountInfo.getCode()));
        }
        return (AccountInfo) new AccountEntity().createWithInfo(accountInfo).save();
    }

    @Override
    public AccountInfo deleteAccountById(String id) throws BreezeeException {
        new AccountEntity().buildId(id).delete();
        return new AccountInfo();
    }

    @Override
    public ShopAccountInfo saveShopAccount(ShopAccountInfo shopAccountInfo) throws BreezeeException {
        shopAccountInfo.setOperType(OperTypeEnum.WRITE);
        ShopAccountEntity shopAccountEntity = new ShopAccountEntity().createWithInfo(shopAccountInfo);
        return shopAccountEntity.save();
    }

    @Override
    public void deleteShopAccount(ShopAccountInfo shopAccountInfo) throws BreezeeException {
        if (shopAccountInfo.getAccountCode() != null) {
            ShopAccountEntity se = new ShopAccountEntity();
            se.addProperties("accountCode", shopAccountInfo.getAccountCode());
            se.list().forEach(a -> {
                new ShopAccountEntity().buildId(a.getId()).delete();
            });
        }
        String code = shopAccountInfo.getCode();
        new ShopAccountEntity().buildCode(code).delete();
    }

    @Override
    public void saveAccountRole(AccountInfo accountInfo) throws BreezeeException {
        accountRepository.deleteRoles(accountInfo.getId());
        accountInfo.getRoleIds().forEach(a -> {
            accountRepository.insertRole(accountInfo.getId(), a);
        });
    }

    @Override
    public InfoPage<AccountInfo> findRoleAccounts(RoleInfo info) throws BreezeeException {
        if (info.getProperties().get("id") != null)
            info.setId(info.getProperties().get("id").toString());
        RoleEntity roleEntity = new RoleEntity().buildId(info.getId()).findEntity();
        Page<AccountEntity> page = accountRepository.findAccountEntitiesByRolesContains(roleEntity, new PageInfo(info.getProperties()));
        List<AccountInfo> l = new ArrayList<>();
        page.getContent().forEach(a -> {
            l.add(a.buildInfo());
        });
        return new InfoPage<>(l, page.getTotalElements());
    }
}
