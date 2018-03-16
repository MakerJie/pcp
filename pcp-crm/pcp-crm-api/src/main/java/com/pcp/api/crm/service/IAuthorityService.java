package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.AuthorityInfo;
import com.pcp.api.crm.domain.AuthorityLineInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * 会员权益
 * Created by Ning on 2017/8/5.
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_AUTHORITY_SERVICE)
public interface IAuthorityService extends IServiceLayer {

    @RequestMapping(value = "/authority/save",method = RequestMethod.POST)
    AuthorityInfo saveAdvertiseInfo(@RequestBody AuthorityInfo authorityInfo) throws BreezeeException;

    @RequestMapping(value = "/authorityLine/save",method = RequestMethod.POST)
    void saveAuthorityLine(@RequestBody AuthorityLineInfo authorityLineInfo) throws BreezeeException;

    @RequestMapping(value = "/authority/delete",method = RequestMethod.POST)
    void deleteAdvertise(@RequestBody AuthorityInfo authorityInfo) throws BreezeeException;

    @RequestMapping(value = "/authorityId/{id}",method = RequestMethod.GET)
    AuthorityInfo findAdvertise(@PathVariable("id") String id) throws BreezeeException;

    @RequestMapping(value ="/authority/page",method = RequestMethod.POST )
    InfoPage<AuthorityInfo> pageAdvertise(@RequestBody AuthorityInfo authorityInfo) throws BreezeeException;

    @RequestMapping(value ="/authorityLine/page",method = RequestMethod.POST )
    InfoPage<AuthorityLineInfo> pageAuthorityLines(@RequestBody AuthorityLineInfo authorityLineInfo) throws BreezeeException;

    @DeleteMapping(value = "/authorityLine/delete/{id}")
    void deleteAuthorityLines(@PathVariable("id") String id) throws BreezeeException;

    @GetMapping(value = "/authorityLine/find/{id}")
    AuthorityLineInfo findAuthorityLineById(@PathVariable("id") String id) throws BreezeeException;
}
