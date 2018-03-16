package com.pcp.crm.impl;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.PointStoreInfo;
import com.pcp.api.crm.service.IPointStoreService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.crm.entity.PointStoreEntity;
import com.pcp.crm.repository.IPointStoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/8/1
 */

@Service(value = CrmAPI.BEAN_POINTSTORE_SERVICE)
public class PointStoreServiceImpl implements IPointStoreService,IServiceLayer{

    @Override
    public PointStoreInfo savePointStoreInfo(PointStoreInfo pointStoreInfo) throws BreezeeException {
        pointStoreInfo.setOperType(OperTypeEnum.WRITE);
        if(StringUtils.isEmpty(pointStoreInfo.getCode())){
            pointStoreInfo.setCode(SystemTool.getCode());
        }
        if(StringUtils.isEmpty(pointStoreInfo.getName())){
            pointStoreInfo.setName(pointStoreInfo.getCode());
        }
        PointStoreEntity ps=new PointStoreEntity().createWithInfo(pointStoreInfo);
        return ps.save();
    }

    @Override
    public InfoPage<PointStoreInfo> findPointStores(PointStoreInfo pointStoreInfo) {
        BreezeeUtils.checkCreateTime(pointStoreInfo.getProperties(),"createTime");
        return new PointStoreEntity().createWithInfo(pointStoreInfo).page();
    }

    @Override
    public void deletePointStore(String id) {
        new PointStoreEntity().buildId(id).delete();
    }
}
