package com.pcp.crm.impl;

import com.pcp.api.crm.domain.PointStoreTypeInfo;
import com.pcp.api.crm.service.IPointStoreTypeService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.PointStoreTypeEntity;
import org.springframework.stereotype.Service;

/**
 * @author Wang, Junjie
 * @since on 2017/8/8
 */
@Service("pointStoreTypeService")
public class PointStoreTypeServiceImpl implements IServiceLayer,IPointStoreTypeService {
    @Override
    public PointStoreTypeInfo savePointStoreType(PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException {
        pointStoreTypeInfo.setOperType(OperTypeEnum.WRITE);
        PointStoreTypeEntity pse=new PointStoreTypeEntity().createWithInfo(pointStoreTypeInfo);
        return pse.save();
    }

    @Override
    public PointStoreTypeInfo findPointStoreTypeById(String id) throws BreezeeException {
        return new PointStoreTypeEntity().buildId(id).buildCode(id).findOne();
    }

    @Override
    public InfoPage<PointStoreTypeInfo> pagePointStoreType(PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException {
        return new PointStoreTypeEntity().createWithInfo(pointStoreTypeInfo).page();
    }

    @Override
    public void deletePointStoreType(PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException {
          new PointStoreTypeEntity().createWithInfo(pointStoreTypeInfo).delete();
    }
}
