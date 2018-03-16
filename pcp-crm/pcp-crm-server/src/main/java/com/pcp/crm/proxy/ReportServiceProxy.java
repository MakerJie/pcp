package com.pcp.crm.proxy;

import com.pcp.api.crm.CrmAPI;
import com.pcp.api.crm.domain.SumReportInfo;
import com.pcp.api.crm.service.IReportService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * Created by Ning on 2017/8/8.
 */
@RestController
@RequestMapping("/" + CrmAPI.BEAN_REPORT_SERVICE)
public class ReportServiceProxy implements IReportService,IServiceLayer {

    @Override
    public InfoPage<SumReportInfo> pageSumReport(@RequestBody SumReportInfo sumReportInfo) throws BreezeeException {
        return null;
    }
}
