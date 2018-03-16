package com.pcp.auth.entity;

import com.pcp.api.auth.domain.AccountInfo;
import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.data.BaseEntity;
import lombok.*;

import javax.persistence.*;
import java.util.*;

/**
 * 系统帐号信息
 * Created by LX on 2017/7/10.
 */
@Entity(name = "AUTH_TF_ACCOUNT")
@Table(indexes = {
        @Index(name = "auth_idx_code_account", columnList = "code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AccountEntity extends BaseEntity<AccountInfo> {

    String password, mobile, email;

    private Integer delFlag = 0;

    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(name = "AUTH_TF_ROLE_ACN", joinColumns = @JoinColumn(name = "ACN_ID", referencedColumnName = "PK_ID"),
            inverseJoinColumns = @JoinColumn(name = "ROLE_ID", referencedColumnName = "PK_ID"))
    @OrderBy(value = "permits asc ")
    private Set<RoleEntity> roles;

    @Override
    protected AccountInfo createInfo() {
        return new AccountInfo();
    }

    @Override
    public AccountInfo buildInfo(AccountInfo accountInfo) {
        super.buildInfo(accountInfo);
        if (accountInfo.getOperType() == OperTypeEnum.READ) {
            ShopAccountEntity se = new ShopAccountEntity();
            se.addProperties("accountCode", this.getCode());
            accountInfo.setShopAccountInfos(se.list());
            List<String> permits = new ArrayList<>();
            StringBuilder sb = new StringBuilder();
            this.getRoles().forEach(a -> {
                sb.append(a.getCode()).append(",");
                if (a.getPermits() != null) {
                    Collections.addAll(permits, a.getPermits().split(","));
                }
            });
            accountInfo.setRoleStr(sb.toString());
            accountInfo.setPermits(permits);
        }
        return accountInfo;
    }
}
