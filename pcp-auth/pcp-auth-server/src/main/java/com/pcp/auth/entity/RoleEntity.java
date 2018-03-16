package com.pcp.auth.entity;

import com.pcp.api.auth.domain.RoleInfo;
import com.pcp.common.data.BaseEntity;
import lombok.*;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.util.Set;

/**
 * 角色实体
 * Created by Silence on 2017/8/7.
 */
@Entity(name = "AUTH_TF_ROLE")
@Table(indexes = {
        @Index(name = "auth_idx_code_role", columnList = "code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RoleEntity extends BaseEntity<RoleInfo> {

    @Column(name = "permit_str",length = 4000)
    private String permits;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<AccountEntity> accounts;

    @Override
    protected RoleInfo createInfo() {
        return new RoleInfo();
    }
}
