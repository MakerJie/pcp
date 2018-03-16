package com.pcp.auth.repository;

import com.pcp.auth.entity.AccountEntity;
import com.pcp.auth.entity.RoleEntity;
import com.pcp.common.data.ICommonRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 账号的持久化服务
 *
 * @author Wang, Junjie
 */
@Repository("accountRepository")
public interface IAccountRepository extends ICommonRepository<AccountEntity, String> {

    @Modifying
    @Query(value = "delete from auth_tf_role_acn where acn_id = :id", nativeQuery = true)
    void deleteRoles(@Param("id") String id);

    @Modifying
    @Query(value = "insert into auth_tf_role_acn (acn_id,role_id) values (:id ,:roleId)", nativeQuery = true)
    void insertRole(@Param(("id")) String id, @Param("roleId") String roleId);

    Page<AccountEntity> findAccountEntitiesByRolesContains(RoleEntity roleEntity, Pageable pageable);
}
