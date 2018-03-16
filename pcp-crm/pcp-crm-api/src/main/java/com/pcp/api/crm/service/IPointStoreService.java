package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.PointStoreInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Wang, Junjie
 * @since on 2017/8/1
 */

@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_POINTSTORE_SERVICE)
public interface IPointStoreService extends IServiceLayer {

    @PostMapping(value = CrmAPI.savePointStore)
    PointStoreInfo savePointStoreInfo(@RequestBody PointStoreInfo pointStoreInfo) throws BreezeeException;

    @PostMapping(value = CrmAPI.pagePointStore)
    InfoPage<PointStoreInfo>  findPointStores(@RequestBody PointStoreInfo pointStoreInfo);

    @DeleteMapping(value ="/pointStore/delete/{id}")
    void deletePointStore(@PathVariable("id") String id);

}
