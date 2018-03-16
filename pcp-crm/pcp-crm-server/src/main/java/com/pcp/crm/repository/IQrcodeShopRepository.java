package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.QrcodeShopEntity;
import org.springframework.stereotype.Repository;

/**
 * @author Wang, Junjie
 * @since on 2017/8/22
 */
@Repository("qrcodeShopRepository")
public interface IQrcodeShopRepository extends ICommonRepository<QrcodeShopEntity,String> {
}
