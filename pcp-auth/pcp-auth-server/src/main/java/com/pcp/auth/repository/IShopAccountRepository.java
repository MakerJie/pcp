package com.pcp.auth.repository;

import com.pcp.auth.entity.ShopAccountEntity;
import com.pcp.common.data.ICommonRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/7/30
 */
@Repository("shopAccountRepository")
public interface IShopAccountRepository extends ICommonRepository<ShopAccountEntity,String> {
    List<ShopAccountEntity> findByAccountCode(String accountCode);
}
