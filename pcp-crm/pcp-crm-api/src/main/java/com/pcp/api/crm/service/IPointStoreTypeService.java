package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.PointStoreTypeInfo;
import com.pcp.api.crm.domain.RewardInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/8
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_POINTSTORETYPE_SERVICE)
public interface IPointStoreTypeService extends IServiceLayer{


    @PostMapping(value = CrmAPI.savepointStoreType)
    PointStoreTypeInfo savePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException;

    @GetMapping(value = CrmAPI.pointStoreTypeId)
    PointStoreTypeInfo findPointStoreTypeById(@PathVariable("id") String id ) throws BreezeeException;

    @PostMapping(value = CrmAPI.pagePointStoreType)
    InfoPage<PointStoreTypeInfo> pagePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException;


    @DeleteMapping(value = CrmAPI.deletePointStoreType)
    void deletePointStoreType(@RequestBody PointStoreTypeInfo pointStoreTypeInfo) throws BreezeeException;

}


