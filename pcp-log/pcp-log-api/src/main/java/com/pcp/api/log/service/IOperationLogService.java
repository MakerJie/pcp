package com.pcp.api.log.service;

import com.pcp.api.log.LogAPI;
import com.pcp.api.log.api.OperationLogInfo;
import com.pcp.common.IServiceLayer;
import com.pcp.common.InfoPage;
import com.pcp.common.domain.BaseInfo;
import com.pcp.common.exception.BreezeeException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 操作日志
 * Created by Ning on 2017/9/5.
 */
@FeignClient(value = LogAPI.APPID, path = "/" + LogAPI.BEAN_OPERATIONLOG_SERVICE)
public interface IOperationLogService extends IServiceLayer {

    /**
     * 操作日志保存
     * @param info
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/operational/save")
    void saveOperationLog(@RequestBody OperationLogInfo info) throws BreezeeException;

    /**
     * 操作日志查询
     * @param info
     * @return
     * @throws BreezeeException
     */
    @RequestMapping(method = RequestMethod.POST, value = "/log/findOperation")
    InfoPage<OperationLogInfo> findOperationLogs(@RequestBody OperationLogInfo info) throws BreezeeException;

}
