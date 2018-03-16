package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.AuthorityInfo;
import com.pcp.api.crm.domain.AuthorityLineInfo;
import com.pcp.api.crm.service.IAuthorityService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * Created by Ning on 2017/8/5.
 */

@RestController
@RequestMapping("/" + CrmAPI.BEAN_AUTHORITY_SERVICE)
public class AuthorityServiceProxy implements IAuthorityService,IServiceLayer {

    @Resource(name=CrmAPI.BEAN_AUTHORITY_SERVICE)
    private IAuthorityService authorityService;


    @Override
    public AuthorityInfo saveAdvertiseInfo(@RequestBody AuthorityInfo authorityInfo) throws BreezeeException {
        return authorityService.saveAdvertiseInfo(authorityInfo);
    }

    @Override
    public void saveAuthorityLine(@RequestBody AuthorityLineInfo authorityLineInfo) throws BreezeeException {
        authorityService.saveAuthorityLine(authorityLineInfo);
    }

    @Override
    public void deleteAdvertise(@RequestBody AuthorityInfo authorityInfo) throws BreezeeException {
        authorityService.deleteAdvertise(authorityInfo);
    }

    @Override
    public AuthorityInfo findAdvertise(@PathVariable("id") String id) throws BreezeeException {
        return authorityService.findAdvertise(id);
    }

    @Override
    public InfoPage<AuthorityInfo> pageAdvertise(@RequestBody AuthorityInfo authorityInfo) throws BreezeeException {
        return authorityService.pageAdvertise(authorityInfo);
    }

    @Override
    public InfoPage<AuthorityLineInfo> pageAuthorityLines(@RequestBody AuthorityLineInfo authorityLineInfo) throws BreezeeException {
        return authorityService.pageAuthorityLines(authorityLineInfo);
    }

    @Override
    public void deleteAuthorityLines(@PathVariable("id") String id) throws BreezeeException {
        authorityService.deleteAuthorityLines(id);
    }

    @Override
    public AuthorityLineInfo findAuthorityLineById(@PathVariable("id") String id) throws BreezeeException {
        return authorityService.findAuthorityLineById(id);
    }
}
