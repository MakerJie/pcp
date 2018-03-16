package com.pcp.log.repository;

import com.pcp.common.data.ICommonRepository;
import com.pcp.log.entity.OperationLogEntity;
import org.springframework.stereotype.Repository;

/**
 * 操作日志
 * Created by Ning on 2017/9/5.
 */
@Repository("operationLogRepository")
public interface IOperationLogRepository extends ICommonRepository<OperationLogEntity, String> {


}
