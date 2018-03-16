package com.pcp.pos.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.pos.entity.ShopEntity;
import org.springframework.stereotype.Repository;

/**
 * 门店的持久化服务
 * Created by Silence on 2017/7/5.
 */
@Repository("shopRepository")
public interface IShopRepository extends ICommonRepository<ShopEntity,String> {
    ShopEntity findByDn(String dn);
}
