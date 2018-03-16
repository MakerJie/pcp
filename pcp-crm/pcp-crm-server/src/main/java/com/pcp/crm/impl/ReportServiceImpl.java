package com.pcp.crm.impl;

import com.pcp.api.crm.domain.SumReportInfo;
import com.pcp.api.crm.service.IReportService;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.exception.BreezeeException;
import com.pcp.crm.entity.SumReportEntity;
import org.springframework.stereotype.Service;

/**
 * Created by Ning on 2017/8/8.
 */
@Service("reportService")
public class ReportServiceImpl implements IReportService,IServiceLayer {

    @Override
    public InfoPage<SumReportInfo> pageSumReport(SumReportInfo sumReportInfo) throws BreezeeException {
        SumReportEntity sre = new  SumReportEntity();
        return sre.createWithInfo(sumReportInfo).page();
    }
}
