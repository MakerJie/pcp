package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.PointStoreTypeInfo;
import com.pcp.api.crm.service.IPointStoreTypeService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author Wang, Junjie
 * @since on 2017/8/8
 */

@RestController
@RequestMapping("/" + CrmAPI.BEAN_POINTSTORETYPE_SERVICE)
public class PointStoreTypeServiceProxy implements IServiceLayer,IPointStoreTypeService{

    @Resource(name = CrmAPI.BEAN_POINTSTORETYPE_SERVICE)
    private IPointStoreTypeService target;

    @Override
    public PointStoreTypeInfo savePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException {
        return target.savePointStoreType(pointStoreTypeInfo);
    }

    @Override
    public PointStoreTypeInfo findPointStoreTypeById(@PathVariable("id") String id) throws BreezeeException {
        return target.findPointStoreTypeById(id);
    }

    @Override
    public InfoPage<PointStoreTypeInfo> pagePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException {
        return target.pagePointStoreType(pointStoreTypeInfo);
    }

    @Override
    public void deletePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException {
           target.deletePointStoreType(pointStoreTypeInfo);
    }
}
