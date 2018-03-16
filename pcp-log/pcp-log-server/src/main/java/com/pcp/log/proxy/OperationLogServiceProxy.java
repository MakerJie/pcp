package com.pcp.log.proxy;

import com.pcp.api.log.LogAPI;
import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.api.log.service.IOperationLogService;
import com.pcp.common.IProxyLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.exception.BreezeeException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * 操作日志代理
 * Created by Ning on 2017/9/5.
 */
@RestController
@RequestMapping("/" + LogAPI.BEAN_OPERATIONLOG_SERVICE)
public class OperationLogServiceProxy implements IOperationLogService, IProxyLayer {

    @Resource(name = LogAPI.BEAN_OPERATIONLOG_SERVICE)
    private IOperationLogService operationalService;

    @Override
    public void saveOperationLog(@RequestBody OperationLogInfo info) throws BreezeeException {
        new Thread(() -> operationalService.saveOperationLog(info)).start();
    }

    @Override
    public InfoPage<OperationLogInfo> findOperationLogs(@RequestBody OperationLogInfo info) throws BreezeeException {
        return operationalService.findOperationLogs(info);
    }
}
