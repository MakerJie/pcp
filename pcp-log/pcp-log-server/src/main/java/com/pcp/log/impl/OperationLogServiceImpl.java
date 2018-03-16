package com.pcp.log.impl;

import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.service.IOperationLogService;
import com.pcp.common.InfoPage;
import com.pcp.common.SystemTool;
import com.pcp.common.constants.OperTypeEnum;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.exception.BreezeeException;
import com.pcp.common.util.BreezeeUtils;
import com.pcp.log.entity.OperationLogEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;

/**
 * 操作日志ServiceImpl
 * Created by Ning on 2017/9/5.
 */
@Service("operationLogService")
public class OperationLogServiceImpl implements IOperationLogService {

    @Override
    public void saveOperationLog(OperationLogInfo operationLogInfo) throws BreezeeException {
        if(operationLogInfo==null){
            return;
        }
        operationLogInfo.setReturnTime(new Date());
        operationLogInfo.setOperType(OperTypeEnum.WRITE);
        operationLogInfo.setSuccess(StringUtils.isEmpty(operationLogInfo.getErrMsg()));
        new OperationLogEntity().createWithInfo(operationLogInfo).save();
    }

    @Override
    public InfoPage<OperationLogInfo> findOperationLogs(OperationLogInfo info) throws BreezeeException {
        BreezeeUtils.checkCreateTime(info.getProperties(), "rqTime");
        return new OperationLogEntity().createWithInfo(info).page();
    }
}
