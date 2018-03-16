package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.PointStoreInfo;
import com.pcp.api.crm.service.IPointStoreService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/8/1
 */

@RestController
@RequestMapping("/" + CrmAPI.BEAN_POINTSTORE_SERVICE)
public class PointStoreServiceProxy implements IPointStoreService,IProxyLayer {

    @Resource(name = CrmAPI.BEAN_POINTSTORE_SERVICE)
    private IPointStoreService target;

    @Override
    public PointStoreInfo savePointStoreInfo(@RequestBody PointStoreInfo pointStoreInfo) throws BreezeeException {
        return target.savePointStoreInfo(pointStoreInfo);
    }

    @Override
    public InfoPage<PointStoreInfo> findPointStores(@RequestBody PointStoreInfo pointStoreInfo) {
        return target.findPointStores(pointStoreInfo);
    }


    @Override
    public void deletePointStore(@PathVariable("id") String id) {
        target.deletePointStore(id);
    }
}
