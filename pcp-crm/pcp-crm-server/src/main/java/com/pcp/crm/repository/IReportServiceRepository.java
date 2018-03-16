package com.pcp.crm.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.crm.entity.SumReportEntity;
import org.springframework.stereotype.Repository;

/**
 * Created by Ning on 2017/8/8.
 */
@Repository("reportService")
public interface IReportServiceRepository extends ICommonRepository<SumReportEntity,String> {


}
