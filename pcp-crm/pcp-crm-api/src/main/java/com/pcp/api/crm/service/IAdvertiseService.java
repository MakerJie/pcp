package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.AdvertiseInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author Wang, Junjie
 * @since on 2017/8/4
 */

@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_ADVERTISE_SERVICE)
public interface IAdvertiseService extends IServiceLayer {

    @PostMapping(value = CrmAPI.saveAdvertise)
    AdvertiseInfo  saveAdvertiseInfo(@RequestBody  AdvertiseInfo advertiseInfo) throws BreezeeException;

    @GetMapping(value = CrmAPI.advertiseId)
    AdvertiseInfo findAdvertiseById(@PathVariable("id") String id ) throws BreezeeException;

    @PostMapping(value = CrmAPI.pageAdvertise)
    InfoPage<AdvertiseInfo> pageAdvertise(@RequestBody AdvertiseInfo advertiseInfo) throws BreezeeException;


    @DeleteMapping(value = CrmAPI.deleteAdvertise)
    void deleteAdvertise(@RequestBody AdvertiseInfo advertiseInfo) throws BreezeeException;

}
