package com.pcp.api.crm.service;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.SumReportInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by Ning on 2017/8/8.
 */
@FeignClient(value = CrmAPI.APPID, path = "/" + CrmAPI.BEAN_REPORT_SERVICE)
public interface IReportService extends IServiceLayer {

    @RequestMapping(value ="/sumReport/page",method = RequestMethod.POST )
    InfoPage<SumReportInfo> pageSumReport(@RequestBody SumReportInfo sumReportInfo) throws BreezeeException;


}
