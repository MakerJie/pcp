package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.AdvertiseInfo;
import com.pcp.api.crm.service.IAdvertiseService;
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
 * @since on 2017/8/4
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_ADVERTISE_SERVICE)
public class AdvertiseServiceProxy implements IAdvertiseService,IServiceLayer{

    @Resource(name=CrmAPI.BEAN_ADVERTISE_SERVICE)
    private IAdvertiseService advertiseService;


    @Override
    public AdvertiseInfo saveAdvertiseInfo(@RequestBody AdvertiseInfo advertiseInfo) throws BreezeeException {
        return advertiseService.saveAdvertiseInfo(advertiseInfo);
    }

    @Override
    public AdvertiseInfo findAdvertiseById(@PathVariable("id") String id) throws BreezeeException {
        return advertiseService.findAdvertiseById(id);
    }

    @Override
    public InfoPage<AdvertiseInfo> pageAdvertise(@RequestBody AdvertiseInfo advertiseInfo) throws BreezeeException {
        return advertiseService.pageAdvertise(advertiseInfo);
    }

    @Override
    public void deleteAdvertise(@RequestBody AdvertiseInfo advertiseInfo) throws BreezeeException {
        advertiseService.deleteAdvertise(advertiseInfo);
    }
}
